'use strict'

// Import the required modules
const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')

// Make an express object
const app = express()

// Sets the port for the app 
app.set('port', (process.env.port || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json (JSON = JavaScript Object Notation)
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
	res.send('Chatbot up and running!')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
	// Let's make the verify token random to enforce security
	if (req.query['hub.verify_token'] === 'dUD2dYajVZ') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})