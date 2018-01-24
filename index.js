/**************************************************************/
/* College Success Scholars Internships App - Pre-Alpha       */
/* This app is a work-in-progress. It is a Facebook messenger */ 
/* app that will interact with the user and find internships  */
/* that are most suited for him/her based on proximity,       */
/* interests, and skills.                                     */
/*                                                            */
/* This app builds on open-source code provided here:         */
/*  https://github.com/jw84/messenger-bot-tutorial.           */
/*                                                            */
/*  Copyright© 2018 under MIT License.                        */
/**************************************************************/


'use strict'

/* Constant for "Express" object. Express creates a web server
 * and allows us to process GET and POST HTTP requests. This 
 * will create the "webhook" for our app, which allows our server
 * to communicate with Facebook. */ 
const express = require('express')

/* Constant for "body-parser" object. Body-parser allows us to 
 * parse texts in different forms (e.g. HTML, JSON, etc.). */
const bodyParser = require('body-parser')

/* Constant for "Request" object. Request allows us to format
 * GET and POST requests that will be sent to the webhook created
 * by Express. */
const request = require('request')

/* This creates an actual instance of express that we can use
 * to call methods on. */
const app = express()

/* Sets the port that we want our app to use for communication. 
 * It will either use the port selected by Heroku or 5000 by 
 * default. */
app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

/* This line sets up the response from our web server at the
 * base URL. */
app.get('/', function (req, res) {
	res.send('Internship app is responding...')
})

/* These lines set up the response for our "webhook". The 
 * webhook will serve as an endpoint in communication between
 * our Express server and Facebook messenger. Note that queries
 * for all requests made to the webhook must have the correct 
 * verify token, which we set up in Facebook for Developers. */
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'softdev') {
		res.send(req.query['hub.challenge'])
	} else {
		res.send('Error, wrong token')
	}
})

/* These lines will POST data to our webhook after receiving text 
 * from the Facebook user. Currently, all the bot can do is send
 * text messages and echo postback messages. */
app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			// The substring method is used because texts can only be 200 characters
			sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
			continue
		}
	}
	// 200 is the universal OK status
	res.sendStatus(200)
})


// Our Facebook Page Access Token
const token = process.env.FB_PAGE_ACCESS_TOKEN;

/* This function takes care of formatting a JSON with the 
 * text we want to respond with. It takes two parameters:
 * sender and text. Sender is the ID of the Facebook user
 * who originally sent the text message for us to respond 
 * to, while text is the text that WE want to respond with. */
function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

/*
function sendGenericMessage(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "First card",
					"subtitle": "Element #1 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/rift.png",
					"buttons": [{
						"type": "web_url",
						"url": "https://www.messenger.com",
						"title": "web url"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Second card",
					"subtitle": "Element #2 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
					"buttons": [{
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for second element in a generic bubble",
					}],
				}]
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}
*/

/* These lines allow our Express server to listen on the port
 * we declared above and "listen" for requests. */
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})