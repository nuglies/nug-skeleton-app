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
const http = require('http');

module.exports = (() => {

    let port = process.env.PORT || 5000

    let app = express()
    app.use(express.static(path.join(__dirname, '../client')));
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    let db = pmongo('mongodb://localhost/sensorsMongoExample')

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
        /*
        let mockData = [
            'dashboard item one',
            'dashboard item two',
            'dashboard item three'
        ]
        */


    /**
     * HOW TO Make an HTTP Call - GET
     */
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
        //res.json("statusCode: ", res.statusCode)
        // uncomment it for header details
      //console.log("headers: ", res.headers);

        var content="";
        res2.on('data', function(d) {
           // console.info('GET result:\n');
            //process.stdout.write(d);
           // console.info('\n\nCall completed');
            //console.info("result:", d)
            //var jd = encoding.convert(d, "UTF-8");
            //console.info(d);
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


   app.post('/sensorupdate', (req, res) => {

        console.log(req.body)

        var sensorid = pmongo.ObjectId(req.body._id);
        console.log(sensorid);
        db.collection('sensors').findAndModify({
			query: { "_id": sensorid },
			update: req.body,
			upsert: true
		}).then((out) => {
                //console.log(out)
                res.sendStatus(200)
            })
            .catch(er => {
                console.log(er);
                res.sendStatus(500, {
                    error: er
                })
            })

    })

    app.get('/sensors', (req, res) => {

      var customerid = req.query.customerid;
      console.log(customerid);
        db.collection('sensors').find({customerid: customerid}).sort({"growState":1})
            .then(results => {
                res.json(results)
            })
            .catch(er => {
                res.sendStatus(500, {
                    error: er
                })
            })
    })





    app.get('/sensordefaults', (req, res) => {
    var customer_id = req.query.customer_id;



    if(customer_id!=0) {
    	//customer_id=pmongo.ObjectId(customer_id);
    	customer_id = customer_id;


    }  else {
    	//console.log("is zero");
    	customer_id = parseInt(customer_id);

    	//console.log(customer_id);
    }



        db.collection('sensordefaults').findOne({
		customer_id: customer_id
		}).then(function(doc) {
			// doc._id.toString() === '523209c4561c640000000001'
			//console.log(doc);

			if(doc == null) {



			//customer level settings not found, search on customer 0



        db.collection('sensordefaults').findOne({
		customer_id: parseInt(0)
		}).then(function(doc) {
			// doc._id.toString() === '523209c4561c640000000001'
			//console.log(doc);

			res.json(doc);
		})
		.catch(er => {
							res.sendStatus(500, {
								error: er
							})
						})



			} else {
			//customer level settings found
			res.json(doc);

			}
		})
		.catch(er => {
							res.sendStatus(500, {
								error: er
							})
						})
    })


  app.post('/sensordefaults', (req, res) => {
		//console.log('save settings');
        //console.log(req.body.customer_id)


		db.collection('sensordefaults').findAndModify({
			query: { customer_id: req.body.customer_id },
			update: req.body,
			upsert: true
		}).then(() => {
                //console.log('inserted ok')
                res.sendStatus(200)
            })
            .catch(er => {
                res.sendStatus(500, {
                    error: er
                })
            })


      /*
        db.collection('sensordefaults').insert(req.body)
            .then(() => {
                console.log('inserted ok')
                res.sendStatus(201)
            })
            .catch(er => {
                res.sendStatus(500, {
                    error: er
                })
            })
	  */
    })


	app.get('/sensors/:sensor', function(req, res) {
	// db.unicorns.find({_id: ObjectId("TheObjectId")})
	// req.paramse.sensor

    // find a document using a native ObjectId
db.collection('sensors').findOne({
	_id: pmongo.ObjectId(req.params.sensor)
}).then(function(doc) {
	// doc._id.toString() === '523209c4561c640000000001'
	//console.log(doc);
	res.json(doc);
})
.catch(er => {
					res.sendStatus(500, {
						error: er
					})
				})
;


    /*
	 db.collection('sensors').find({_id:new ObjectId("574fae623f0649da072dd481")})
				.then(results => {
				console.log("results");

				console.log(results);
					res.json(results)
				})
				.catch(er => {
					res.sendStatus(500, {
						error: er
					})
				})
		*/

	})




/// user services
    app.get('/clientId', (req, res) => {
       res.json({"clientId":"TdtdYCDQHSR3TtNgsMuCXHfjHDyxMsmB"})
    })


	app.get('/users', (req, res) => {
		  //console.log(req);
		  var email = req.query.email;

		  db.collection('users').find({
		  'profile.email': email
		  })
            .then(results => {
                res.json(results)
            })
            .catch(er => {
                res.sendStatus(500, {
                    error: er
                })
            })

		})



  app.post('/users', (req, res) => {
		//console.log('save user');
        //console.log(req.body)
        db.collection('users').insert(req.body)
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


  app.post('/customercode', (req, res) => {
		//console.log('get customer for secret code');
        //console.log(req.body)
        db.collection('customers').find({
        	secretcode: req.body.params.secretcode
        })
            .then((results) => {

            	//console.log(results.length);

            	if(results.length != 0) {

            	//we got a match on secretcode - add user to database
            		//console.log(results[0]._id);

            		var customer_id=pmongo.ObjectId(results[0]._id);
            		var userData = {
            			customer_id: customer_id,
            			isAdmin: req.body.params.isAdmin,
            			profile: req.body.params.userData

            		};


            		 db.collection('users').insert(userData)
            .then((userInserted) => {
                //console.log('inserted ok')


                var rspJson = {
                userid : userInserted._id,
                customerid : customer_id
                };

            	res.json(rspJson);
                res.sendStatus(201);


            })
            .catch(er => {
                res.sendStatus(500, {
                    error: er
                })
            })



    } //if
    	else {
    		//no match on secretcode
    		//console.log("no match");
    		var rspJson = {userid : 0, customerid : 0}
    		res.json(rspJson);

    	}
    }) //customer then

    }) //post

  app.post('/customers', (req, res) => {
		console.log('save customer');
        console.log(req.body)

        /*
       db.collection('customers').insert(req.body, function(err,docsInserted){
			console.log(err);
			res.sendStatus(201);
		})*/

        var companyData = {
        customer : req.body.params.company,
        secretcode : req.body.params.secretcode
        }

        db.collection('customers').insert(companyData)
            .then((docsInserted) => {
                console.log(docsInserted);

                var userData = {
                customer_id: docsInserted._id,
                isAdmin: req.body.params.isAdmin,
                profile: req.body.params.userData
                }


                db.collection('users').insert(userData)
            .then((userInserted) => {
                console.log('inserted ok')


                var rspJson = {
                userid : userInserted._id,
                customerid : docsInserted._id
                }


                res.json(rspJson);
                res.sendStatus(201);

                //res.sendStatus(201)
            })
            .catch(er => {
                res.sendStatus(500, {
                    error: er
                })
            }); //insert user


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
