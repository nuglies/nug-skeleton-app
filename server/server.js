#!/usr/bin/env node

'use strict'

const express = require('express')
const morgan = require('morgan')
const _ = require('underscore')
const fs = require('fs')
const bodyParser = require('body-parser')
const session = require('express-session')
const pmongo = require('promised-mongo')
const moment = require('moment')
const Q = require('q')
const argv = require('minimist')(process.argv.slice(2))
const path = require('path')
const http = require('http')
const restClient = require('request-promise')
const cookieParser = require('cookie-parser');

module.exports = (() => {

    const rememberMeCookieName = 'nugliRememberMe'

    let port = process.env.PORT || 5000

    let defaultMongoDBURI = 'mongodb://localhost/nugli'
    let mongoDBURI = process.env.MONGODB_URI || defaultMongoDBURI

    let app = express()
    app.use(express.static(path.join(__dirname, '../client')));

    app.use(session({
        secret: 'uuddd77788998sdfsdfh----',
        saveUninitialized: true,
        resave: false
    }));
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    let db = pmongo(mongoDBURI)

    let authFilter = (req, res, next) => {
        console.log('authFilter, cookies', req.cookies)
        console.log('req path', req.path);

        if (req.cookies[rememberMeCookieName]) {
            console.log('allowing by rememberme', req.cookies[rememberMeCookieName]);
            db.collection('users').findOne({
                    user_id: req.cookies[rememberMeCookieName]
                })
                .then((user) => {
                    console.log('looked up user', user)
                    req.session.loggedInUser = user
                    req.session.isLoggedIn = true;
                    next()
                })
                .catch((err) => {
                    console.log('error on remember me', err)
                    res.status(500).json({
                        error: err
                    })
                })

        } else {

            var allowedURLs = [
                '/login',
                '/auth0Callback'
            ];

            var allowedPatterns = [
                '^.*?\.css',
                '^.*?\.js',
                '^.*?\.html',
                '^.*?\.png'
            ];


            var allowedByPattern = function() {
                return _.find(allowedPatterns, function(p) {
                    return req.path.match(new RegExp(p)) !== null;
                });
            };

            if (_.contains(allowedURLs, req.path) || allowedByPattern()) {
                console.log('allowed')
                next();
            } else {

                if (req.session.isLoggedIn !== true) {
                    res.sendStatus(401);
                } else {
                    next();
                }
            }
        }
    }

    let auth0CallbackHandler = (req, res, next) => {
        console.log('auth0 callback handler')
        console.log('query', req.query)
        console.log('contacting auth0 for profile')
        let request = {
            method: 'GET',
            uri: 'https://nugs.auth0.com/userinfo',
            headers: {
                Authorization: `Bearer ${req.query.access_token}`
            },
            strictSSL: false,
            json: true
        }

        restClient(request)
            .then((response) => {
                console.log('got response from auth0', response);
                // TODO : probably don't need the whole response on the session

                // update our DB
                db.collection('users').update({
                    user_id: response.user_id
                }, response, {
                    upsert: true
                });

                // drop remember-me cookie
                res.cookie(rememberMeCookieName, response.user_id, {
                    maxAge: 1000 * 60 * 60 * 24 * 90
                });

                req.session.loggedInUser = response;
                req.session.isLoggedIn = true;
                res.status(200).json(response);
            })
            .catch((err) => {
                console.log('got error', err)
                res.status(500).json({
                    error: err
                })
            })
    }

    app.use(cookieParser())
    app.use(authFilter)

    app.get('/checkLoggedIn', (req, res, next) => {
        console.log('checkLoggedIn')
            res.status(200).json(req.session.loggedInUser)
    })

    app.post('/auth0Callback', auth0CallbackHandler)




    app.listen(port, () => {
        console.log(`listening on ${port}`)
    })


})()
