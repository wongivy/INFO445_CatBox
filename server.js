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

function getGameObject(gameID) {
    return new sql.Request().query('SELECT * FROM tblGame WHERE GameID =' + gameID);
}

function makeRouter() {
  app.use(cors())  
 
  // frames
  app.get('/', function (req, res) {
    res.sendFile('/static/views/index.html', { root: __dirname })
  })

  app.get('/games/all', function (req, res) {
    displayAllGames().then(function (data) {
      return res.json(data);
    });
  })

  app.get('/edit/:gameID', function (req, res) {
    res.sendFile('/static/views/edit.html', { root: __dirname })
  })
  
  app.get("/getGame/:gameID", function(req, res) {
    var gameID = req.params.gameID;
    console.log(gameID);
    getGameObject(gameID).then(function(data) {
      return res.json(data);
    })
  })

  app.get('/delete', function (req, res) {
    deleteGame(gameID).then(function () {
      console.log(req.gameID);
      res.redirect('/')
    }).catch(function (err) {
      console.log(err);
    });
  })

  app.post('/create', function (req, res) {
    connectToDb().then(function () {
      var gameID = req.body.gameID;
      var gameName = req.body.gameName;
      var gameType = req.body.gameType;
      var studioName = req.body.studioName;
      var gameDes = req.body.gameDes;

      createGame(gameName, gameType, studioName, gameDes).then(function () {
        res.redirect('/')
      }).catch(function (err) {
        console.log(err);
      });
    });
  })

  app.post('/gameSubmit', function (req, res) {
    connectToDb().then(function () {
      var gameID = req.body.gameID;
      var gameName = req.body.gameName;
      var gameType = req.body.gameType;
      var studioName = req.body.studioName;
      var gameDes = req.body.gameDes;
      updateGame(gameID, gameName, gameType, studioName, gameDes).then(function() {
          res.redirect('/')
      });
    }).catch(function (error) {
      console.log(error);
    });
  })

  app.post('/submit', function (req, res) {
    connectToDb().then(function () {
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