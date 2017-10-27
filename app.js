'use strict'

// Import the required modules
const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')

// Make an express object
const app = express()

// Sets the port for the app 
app.set('port', (process.env.port || 5000))