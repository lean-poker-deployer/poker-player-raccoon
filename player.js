var startHandRanger = require('./startHand/startHand');
var pjson = require('./package.json');

var CONST_AGRESSION_LEVEL = 0.125;

module.exports = {

  VERSION: pjson.version,

  bet_request: function (game_state, bet) {

    var players = {in_tournament: 0, in_game: 0};
    var max_opponent_stack = 0;

    game_state.players.forEach(function (player) {
      if (player.status === 'active') {
        players.in_game++;
        players.in_tournament++;
        if(player.id != game_state.in_action) {
          max_opponent_stack = Math.max(max_opponent_stack, player.stack + player.bet);
        }
      }
      if(player.status === 'folded') {
        players.in_tournament++;
      }
    });

    var ourbot = game_state.players[game_state.in_action];
    var hand_rang = startHandRanger(ourbot.hole_cards);
    var stack_size = ourbot.stack/max_opponent_stack;

    if(game_state.community_cards.length) {
      bet(ourbot.stack);
    }

    if (foldOrAllIn(players, hand_rang, ourbot.stack, max_opponent_stack, game_state.small_blind) === 'fold') {
      bet(0);
    } else {
      var minRaise = game_state.current_buy_in - ourbot.bet + game_state.minimum_raise;
      bet(Math.min(ourbot.stack, minRaise * 3));
    }

  },

  showdown: function(game_state) {

  }
};

/*
 players more - less agressive 2-7
 cardsRang more - less agressive 1 - 100
 stackSize less - more agressive
 */
function foldOrAllIn(players, hand_rang, our_stact, max_opponent_stack, small_blind) {
  var stack_multi = our_stact/max_opponent_stack;
  if (hand_rang < 0.02) {
    return 'allin';
  }
  if(stack_multi > 1 && hand_rang < CONST_AGRESSION_LEVEL * stack_multi) {
    return 'allin';
  }
  if (players.in_tournament === 2) {
    if(hand_rang > 0.4) {
      return 'fold';
    } else {
      return 'allin';
    }
  }

  var ICM = our_stact/(2* small_blind);

  if(ICM < 12 && hand_rang < ICM/4 * 0.1) {
    return 'allin';
  }

  return 'fold';
}
