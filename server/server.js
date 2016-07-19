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
                '/auth0Callback',
                '/dashboard',
                '/sensordefaults',
                '/sensors'
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
                .catch(err => {
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

    let dashboardHandler = (req, res, next) => {


    // options for GET
    var optionsget = {
        host : 'cjparker.us', // here only the domain name
        // (no http/https !)
        //port : 80,
        path : '/nug/api/rawData', // the rest of the url with parameters if needed
        method : 'GET' // do GET
    };


    // do the GET request
    var reqGet = http.request(optionsget, function(res2) {
        console.info("statusCode: ", res.statusCode);
        res.status = res2.statusCode;

        var content="";
        res2.on('data', function(d) {

            content += d;
        });

        res2.on('end', function () {
                // remove 'undefined that appears before JSON for some reason
                ////content = JSON.parse(content.substring(9, content.length));
                res.setHeader('Content-Type', 'application/json');
               // console.info(content);
                res.json(content);
        });

    });

    reqGet.end();
    reqGet.on('error', function(e) {
        console.error(e);
    });


        //res.json(mockData)
    }

    app.get('/dashboard', dashboardHandler)

 app.get('/sensors', (req, res) => {


     var getSensorsForCompany = '[{"_id":"5780754691b08ab10ffbd6ed","sensorName":"Sensor Clone","strain":"Kush","growState":"Clone","customerid":"5780746f91b08ab10ffbd6e9"},{"_id":"578074f591b08ab10ffbd6ec","sensorName":"Sensor Flower","strain":"Kush","growState":"Flower","customerid":"5780746f91b08ab10ffbd6e9"},{"_id":"5780747c91b08ab10ffbd6eb","sensorName":"first sensor","strain":"kush","growState":"Grow","customerid":"5780746f91b08ab10ffbd6e9"}]';
    res.status(200).json(getSensorsForCompany)
    })





    app.get('/sensordefaults', (req, res) => {

     var getSettingsForCompany = '{ "customer_id" : 0, "par" : [ { "min" : 800, "max" : 1400, "blue" : 453, "red" : 600 } ], "growStates" : [ { "growState" : "flower", "settings" : [ { "lightsOn" : { "time" : "06:00", "heat" : [ { "max" : 95, "min" : 75 } ], "humidity" : [ { "max" : 65, "min" : 55 } ] }, "lightsOff" : { "time" : "18:00", "heat" : [ { "max" : 72, "min" : 62 } ], "humidity" : [ { "max" : 90, "min" : 75 } ] } } ] }, { "growState" : "clone", "settings" : [ { "lightsOn" : { "time" : "06:00", "heat" : [ { "max" : 72, "min" : 69 } ], "humidity" : [ { "max" : 65, "min" : 55 } ] }, "lightsOff" : { "time" : "20:00", "heat" : [ { "max" : 72, "min" : 69 } ], "humidity" : [ { "max" : 65, "min" : 55 } ] } } ] }, { "growState" : "grow", "settings" : [ { "lightsOn" : { "time" : "09:00", "heat" : [ { "max" : 72, "min" : 69 } ], "humidity" : [ { "max" : 65, "min" : 55 } ] }, "lightsOff" : { "time" : "16:00", "heat" : [ { "max" : 72, "min" : 69 } ], "humidity" : [ { "max" : 65, "min" : 55 } ] } } ] } ] }';

        res.status(200).json(getSettingsForCompany)
    })


    app.listen(port, () => {
        console.log(`listening on ${port}`)
    })


})()
