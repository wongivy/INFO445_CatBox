'use strict'

var sql = require('mssql')
var express = require('express')
var cors = require('cors')
var path = require('path')
var app = express();
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/static/public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

function getPass() {
  var pass = 'GoHuskies!'
  if (!pass) {
    throw new Error('Missing PASSWORD environment variable')
  }
  return pass
}

function connectToDb() {
  var config = {
    user: 'INFO445',
    password: getPass(),
    server: 'is-hay04.ischool.uw.edu',
    database: 'CatBox'
  }
  return sql.connect(config)
}

function addCustomer(fName, lName, username, email) {
  return new sql.Request()
    .input('CustomerFirstName', sql.VarChar(35), fName)
    .input('CustomerLastName', sql.VarChar(35), lName)
    .input('CustomerUsername', sql.VarChar(50), username)
    .input('CustomerEmail', sql.VarChar(20), email)
    .execute('usp_PopulateCustomer')
}

function makeRouter() {
  app.use(cors())  
 
  // frames
  app.get('/', (req, res) => {
    res.sendFile('/static/views/index.html', { root: __dirname })
  })

  app.get('/account', function (req, res) {
    res.sendFile('/static/views/account.html', { root: __dirname })
  })

  app.post('/submit', function (req, res) {
    connectToDb().then(function () {
      /*
      new sql.Request().query('SELECT * FROM tblCustomer').then(function (results) {
        console.log(results);
      });
      */
      var username = req.body.username;
      var fName = req.body.firstName;
      var lName = req.body.lastName;
      var email = req.body.email;
      console.log(username);
      
      addCustomer(fName, lName, username, email).then(function () {
        console.log(email);
        console.log("success");
        res.redirect('/account')
      }).catch(function (err) {
        // ... execute error checks 
        console.log("failed");
      });
    }).catch(function (err) {
      console.log(err);
    });
  });
}

function startParty() {
  connectToDb().then(() => {
    makeRouter()
    app.listen(3000);
  })
}

startParty()