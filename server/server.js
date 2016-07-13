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
const argv = require('minimist')(process.argv.slice(2));
const path = require('path')


module.exports = (() => {

    let port = process.env.PORT || 5000

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

    let db = pmongo('mongodb://localhost/sensorsMongoExample')

    let authFilter = (req, res, next) => {
        console.log('authFilter, cookies', req.cookies)
        console.log('req path', req.path);

        var allowedURLs = [
            '/login'
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
            next();
        } else {

            if (req.session.isLoggedIn !== true) {
                res.sendStatus(401);
            } else {
                next();
            }
        }

    }

    app.use(authFilter)

    // Additional middleware which will set headers that we need on each request.
    app.use(function(req, res, next) {
        // Set permissive CORS header - this allows this server to be used only as
        // an API server in conjunction with something like webpack-dev-server.
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Disable caching so we'll always get the latest comments.
        res.setHeader('Cache-Control', 'no-cache');
        next();
    });

    let dashboardHandler = (req, res, next) => {
        let mockData = [
            'dashboard item one',
            'dashboard item two',
            'dashboard item three'
        ]
        res.json(mockData)
    }

    app.post('/sensors', (req, res) => {

        console.log(req.body)
        db.collection('sensors').insert(req.body)
            .then(() => {
                console.log('inserted ok')
                res.sendStatus(201)
            })
            .catch(er => {
                res.sendStatus(500, {
                    error: er
                })
            })

    })

    app.get('/checkLoggedIn', (req, res, next) => {
      // the filter does the work
      res.send(200);
    })

    app.get('/sensors', (req, res) => {
        db.collection('sensors').find()
            .then(results => {
                res.json(results)
            })
            .catch(er => {
                res.sendStatus(500, {
                    error: er
                })
            })
    })

    app.get('/dashboard', dashboardHandler)

    app.listen(port, () => {
        console.log(`listening on ${port}`)
    })



})()
