const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---
// numSnakes = 0;
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // numSnakes++;
  // Response data
  var returnData = {
      color: "#00CC66",
      name: "Max Power",
      head_url: "https://emoji.slack-edge.com/T02GDU01L/chill/7c582ab11138db5e.png",
      taunt: "Catch these hands",
  };

  return response.json(returnData)
})

// Handle POST request to '/move'
app.post('/move', (req, res) => {
  try {
    // var reqBodyHistory = updateAndGetHistory(req.body);
    // console.log('Found game history with :' + reqBodyHistory.length + ' moves.');
    // console.log(req.body.turn);
    var responseData = {
        move: getMyMove(), //(req.body, reqBodyHistory),
        taunt: foosTaunt(), // optional, but encouraged!
    };
    return res.json(responseData);

} catch (err) {
    if (err.message) {
        console.log('\nMessage: ' + err.message);
    }
    if (err.stack) {
        console.log('\nStacktrace:');
        console.log('====================');
        console.log(err.stack);
    }
}
})

function foosTaunt() {
  return 'Rack City';
}

function getMyMove() {
  move_arr = ['up','down','left','right']
  index = getRandomInt(4);
  retval = move_arr[index];
  console.log('HERE!!!');
  console.log(retval);
  return retval;
}

// function updateAndGetHistory(reqBody) {
//   // game id doesnt change when you press 'q' to reset game. so if turn is 0, reset this game
//   var turn = reqBody.turn;
//   var gameID = reqBody.game_id;

//   var i = 0;
//   for (var reqBodyHistory of reqBodyHistories) {
//       if (reqBodyHistory[0].game_id == gameID) {

//           break;
//       }
//       i++;
//   }
//   if (i == reqBodyHistories.length) {
//       // if this game not yet in histories - add it
//       // begin a new game history
//       lastDiffTailByGame.push([]);
//       // set game history index to newest addition
//       i = reqBodyHistories.length - 1;
//   }
//   // if turn is 0, reset this game.
//   if (turn == 0) {
//       reqBodyHistories[i] = [];
//   }
//   reqBodyHistories[i].push(reqBody);
//   return reqBodyHistories[i];
// }

app.post('/end', (request, response) => {
  // NOTE: Any cleanup when a game is complete.
  return response.json({})
})

app.post('/ping', (request, response) => {
  // Used for checking if this snake is still alive.
  return response.json({});
})

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
