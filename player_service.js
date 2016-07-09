const express = require('express');
const bodyParser = require("body-parser");

const winston = require('winston');

const version = require('./package.json').version;
const player = require('./player');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
  res.send(200, 'OK')
});

<<<<<<< HEAD
app.post('/', function (req, res) {

  if (req.body.action == 'bet_request') {

    try {
      player.bet_request(JSON.parse(req.body.game_state), function (bet) {
        winston.info('Bet:', bet);
        res.send(200, bet.toString());
      });
    } catch (error) {
      winston.error('Catch Error', error);
      winston.error('Bet:', bet);
      wisnton.error('Req, res', req.body, res.body);
      bet(game_state.current_buy_in);
    }
  } else if (req.body.action == 'showdown') {
    player.showdown(JSON.parse(req.body.game_state));
    res.send(200, 'OK');
  } else if (req.body.action == 'version') {
    res.send(200, version);
  } else {
    res.send(200, 'OK')
  }

});

port = parseInt(process.env['PORT'] || 1337);
host = "0.0.0.0";
app.listen(port, host);
console.log('Listening at http://' + host + ':' + port)
