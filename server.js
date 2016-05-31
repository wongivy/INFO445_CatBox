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

function displayAllGames() {
  console.log("display games");
  return new sql.Request().query('SELECT * FROM tblGame');
}

function updateGame(gameID, gameName, gameType, studioName, gameDes) {
  console.log("Updating Game");
  var query = "UPDATE tblGame SET GameName='" + gameName + "', GameTypeID=" + gameType + ", StudioID=" + studioName + ", GameDescr='" + gameDes + "' WHERE GameID=" + gameID;
  console.log(query);
  return new sql.Request().query(query);
}

function createGame(gameName, gameType, studioName, gameDes) {
  console.log("Creating Game");
  return new sql.Request()
    .input('GameTypeName', sql.VarChar(35), gameType)
    .input('StudioName', sql.VarChar(35), studioName)
    .input('GameName', sql.VarChar(100), gameName)
    .input('GameDescr', sql.VarChar(3500), gameDes)
    .execute('usp_PopulateGame')
}

function deleteGame(gameID) {
  console.log("Deleting Game");
  var query = "DELETE FROM tblGame WHERE GameID=" + gameID;
  console.log(query);
  return new sql.Request().query(query);
}

function makeRouter() {
  app.use(cors())  
 
  // frames
  app.get('/', function (req, res) {
    res.sendFile('/static/views/index.html', { root: __dirname })
  })

  app.get('/account', function (req, res) {
    res.sendFile('/static/views/account.html', { root: __dirname })
  })

  app.get('/games', function (req, res) {
    res.sendFile('/static/views/games.html', { root: __dirname })
  });

  app.get('/games/all', function (req, res) {
    displayAllGames().then(function (data) {
      res.writeHeader(200, { "Content-Type": "text/html" });

      res.write((JSON.stringify(data).split("\"}").join("\"}<br>")));
      res.end();

    });
  })

  app.post('/gameSubmit', function (req, res) {
    connectToDb().then(function () {
      var gameID = req.body.gameID;
      var gameName = req.body.gameName;
      var gameType = req.body.gameType;
      var studioName = req.body.studioName;
      var gameDes = req.body.gameDes;
      var requestType = req.body.optradio;
      console.log(requestType);
      switch (requestType) {
        case 'create':
          createGame(gameName, gameType, studioName, gameDes).then(function () {
            res.redirect('/games')
          }).catch(function (err) {
            console.log(err);
          });
          break;
        case 'update':
          updateGame(gameID, gameName, gameType, studioName, gameDes).then(function () {
            res.redirect('/games')
          }).catch(function (err) {
            console.log(err);
          });
          break;
        case 'delete':
          deleteGame(gameID).then(function () {
            res.redirect('/games')
          }).catch(function (err) {
            console.log(err);
          });
          break;
        default:
          break;
      }
    }).catch(function (error) {
      console.log(error);
    });
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