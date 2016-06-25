#!/usr/bin/env node

'use strict'

const express = require('express')
const morgan = require('morgan')
const _ = require('underscore')
const fs = require('fs')
const bodyParser = require('body-parser')
const session = require('express-session')
const moment = require('moment')
const Q = require('q')
const argv = require('minimist')(process.argv.slice(2));
const path = require('path')
const MongoClient = require('mongodb').MongoClient
    , format = require('util').format,
 ObjectID = require('mongodb').ObjectID


module.exports = (() => {

    let port = process.env.PORT || 5000

    let app = express()
    app.use(express.static(path.join(__dirname, '../client')));
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended: true
    }));


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
		MongoClient.connect('mongodb://127.0.0.1:27017/sensorsMongoExample', function(err, db) {
    	if(err) throw err;

        //console.log(req.body)
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
		}) //
    })

    app.get('/sensors', (req, res) => {

    MongoClient.connect('mongodb://127.0.0.1:27017/sensorsMongoExample', function(err, db) {
    if(err) throw err;

    var customer_id = req.query.customer_id;
        db.collection('sensors').find({
        	customer_id: customer_id
        }).toArray(function(err, results) {
        	res.json(results);
        })


        }) //
    })



    app.get('/sensordefaults', (req, res) => {

    MongoClient.connect('mongodb://127.0.0.1:27017/sensorsMongoExample', function(err, db) {
    if(err) throw err;

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
		}, function (err,doc) {

		if(doc == null) {

		console.log("no result for customer");

			//customer level settings not found, search on customer 0



        db.collection('sensordefaults').findOne({
		customer_id: parseInt(0)
		}, function(err, defDoc) {

			console.log(defDoc);
			res.json(defDoc);
		})



			} else {
			//customer level settings found

			console.log("found results for this customer");
			res.json(doc);

			}

		})




		/*
		.then(function(doc) {
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

			*/

    }) //
    })


  app.post('/sensordefaults', (req, res) => {
		//console.log('save settings');
        //console.log(req.body.customer_id)

	MongoClient.connect('mongodb://127.0.0.1:27017/sensorsMongoExample', function(err, db) {
    if(err) throw err;

		db.collection('sensordefaults').findAndModify({
			query: { customer_id: req.body.customer_id },
			update: req.body,
			upsert: true,
			new: true
		},function(err,modDoc) {
			res.json(modDoc);
		})

	  }) //
    })


	app.get('/sensors/:sensor', function(req, res) {
	// db.unicorns.find({_id: ObjectId("TheObjectId")})
	// req.paramse.sensor
	MongoClient.connect('mongodb://127.0.0.1:27017/sensorsMongoExample', function(err, db) {
    if(err) throw err;

			// find a document using a native ObjectId
		db.collection('sensors').find({
			_id: new ObjectID(req.params.sensor)
		}).toArray(function(err, results) {

			res.json(results);
		})

   }) //

	})




/// user services
    app.get('/clientId', (req, res) => {
       res.json({"clientId":"TdtdYCDQHSR3TtNgsMuCXHfjHDyxMsmB"})
    })


	app.get('/users', (req, res) => {

	MongoClient.connect('mongodb://127.0.0.1:27017/sensorsMongoExample', function(err, db) {

//    console.log(db);
    if(err)
    {
    res.sendStatus(500, {
                    error: err
                })
    }
    //throw err;

		  //console.log(req);
		  var email = req.query.email;
			console.log(email);


		//this is mongoclient syntax
		 db.collection("users").find({'profile.email': email}).toArray(function(err, results) {

		 res.json(results);
		 })

    /*
    docs.each(function(err, doc) {
      if(doc) {
       // console.log(doc);
        res.json(doc);
      }
      else {
        res.end();
      }
    });
    */


		/*
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
		*/
            }) //

		})


/*
//Deprecated

  app.post('/users', (req, res) => {

  MongoClient.connect('mongodb://127.0.0.1:27017/sensorsMongoExample', function(err, db) {
    if(err) throw err;

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

            }) //

    })

*/
  app.post('/customercode', (req, res) => {
		//console.log('get customer for secret code');
        //console.log(req.body)

        MongoClient.connect('mongodb://127.0.0.1:27017/sensorsMongoExample', function(err, db) {
	    if(err) throw err;




		db.collection('customers').find({
        	secretcode: req.body.params.secretcode
        }).toArray(function(err, results) {
  			// Do something...




		//console.log(results);




  			if(results.length != 0) {

            	//we got a match on secretcode - add user to database
            		//console.log(results[0]._id);

            		var customer_id=new ObjectID(results[0]._id);
            		var userData = {
            			customer_id: customer_id,
            			isAdmin: req.body.params.isAdmin,
            			profile: req.body.params.userData

            		};
					//console.log(userData);

            		 db.collection('users').insert(userData,function(err, userInserted) {
					//console.log (userInserted);
            		 var rspJson = {
						userid : userInserted.insertedIds[0],
						customerid : customer_id
						};

						res.json(rspJson);
						//res.sendStatus(201);

            		 })




    } //if
    	else {
    		//no match on secretcode
    		//console.log("no match");
    		var rspJson = {userid : 0, customerid : 0}
    		res.json(rspJson);

    	}


		})


	})
    }) //post

  app.post('/customers', (req, res) => {
		//console.log('save customer');
        //console.log(req.body)
	MongoClient.connect('mongodb://127.0.0.1:27017/sensorsMongoExample', function(err, db) {
    if(err) throw err;



        var companyData = {
        customer : req.body.params.company,
        secretcode : req.body.params.secretcode
        }

        db.collection('customers').insert(companyData, function(err,docsInserted) {

		console.log(docsInserted.insertedIds);


                var userData = {
                customer_id: docsInserted.insertedIds,
                isAdmin: req.body.params.isAdmin,
                profile: req.body.params.userData
                }

                console.log(userData);

                db.collection('users').insert(userData, function(err,userInserted) {
					console.log('inserted ok')


					var rspJson = {
					userid : userInserted.insertedIds[0],
					customerid : docsInserted.insertedIds[0]
					}


					res.json(rspJson);
					//res.sendStatus(201);

                })


        })





            }) //

    })
    app.get('/dashboard', dashboardHandler)

    app.listen(port, () => {
        console.log(`listening on ${port}`)
    })



})()
