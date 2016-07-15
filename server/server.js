#!/usr/bin/env node

'use strict'

const express = require('express')
const morgan = require('morgan')
const _ = require('underscore')
const fs = require('fs')
const bodyParser = require('body-parser')
const session = require('express-session')
const bluebird = require('bluebird')
const mongodb = require('mongodb')
const moment = require('moment')
const Q = require('q')
const argv = require('minimist')(process.argv.slice(2))
const path = require('path')
const http = require('http')
const restClient = require('request-promise')
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session)

module.exports = (() => {

    let db
    let mongoClient = bluebird.promisifyAll(mongodb).MongoClient;

    const rememberMeCookieName = 'nugliRememberMe'

    let port = process.env.PORT || 3000

    let defaultMongoDBURI = 'mongodb://localhost/nugli'
    let mongoDBURI = process.env.MONGODB_URI || defaultMongoDBURI
    console.log('mongoDBURI', mongoDBURI)

    let app = express()
    app.use(express.static(path.join(__dirname, '../client')));

    app.use(session({
        secret: 'uuddd77788998sdfsdfh----',
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({
            url: mongoDBURI
        })
    }));
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    mongoClient.connect(mongoDBURI)
        .then((connected) => {
            console.log('connected to mongo')
            db = connected
        })
        .catch(err => {
            console.log('error connecting to mongo', err)
        })

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
                    if (!user) {
                        console.log('no user found, rejected')
                        res.sendStatus(401)
                    } else {
                        req.session.loggedInUser = user
                        req.session.isLoggedIn = true;
                        next()
                    }
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
                })
                .then(() => {
                    console.log('updated / inserted user')
                })
                catch(err => {
                    console.log('error inserting user',err)
                })

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
    app.use(morgan('combined'))
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
