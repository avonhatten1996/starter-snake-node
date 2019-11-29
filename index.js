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

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // NOTE: Do something here to start the game

  // Response data
  const data = {
    color: '#DFFF00',
  }

  nextMove = 'left';

  return response.json(data)
})

let board = null;
function instantiateBoard() {
  board = new Array();
  for (let i = 0; i < 11; i++) {
    board[i] = new Array();
    for (let j = 0; j < 11; j++) {
      board[i][j] = '0';
    }
  }

  return;
}

function populateBoard(thisBoard, me) {
  // food
  const foodLocations = thisBoard.food;
  for (let foodLocation of foodLocations) {
    board[foodLocation.x][foodLocation.y] = 'food';
  }

  // other snakes
  const snakes = thisBoard.snakes;
  for (let snake of snakes) {
    for(let coordinate of snake.body) {
      board[coordinate.x][coordinate.y] = 'snake';
    }
  }

  // me
  for (let coordinate of me.body) {
    board[coordinate.x][coordinate.y] = 'me';
  }

  return;
}

let lastMove = 'left';
function circle() {
  if (lastMove === 'up') {
    return 'right';
  }

  if (lastMove === 'right') {
    return 'down';
  }

  if (lastMove === 'down') {
    return 'left'
  }

  if (lastMove === 'left') {
    return 'up';
  }

  return 'down';
}

function generateNextMove(me, foods) {
  // return circle();

  // find shortest path to a food
  headX = me.body[0].x
  headY = me.body[0].y

  let x, y;
  let minDistance = null;

  for (food of foods) {
    const thisDistance = Math.abs(headX - food.x) + Math.abs(headY - food.y);

    if (minDistance === null || thisDistance < minDistance) {
      minDistance = thisDistance;
      x = food.x;
      y = food.y;
    }
  }

  // move in the direction of closest food
  // @TODO handle if it's in opposite direction
  if (x < headX) {
    return 'left';
  }

  if (x > headX) {
    return 'right';
  }

  if (y > headY) {
    return 'down';
  }

  return 'up';
}

function isMoveSafe(me, move) {
  let x = me.body[0].x;
  let y = me.body[0].y;

  if (move === 'right') {
    x += 1;
  } else if (move === 'left') {
    x -= 1;
  } else if (move === 'up') {
    y -= 1;
  } else {
    y += 1;
  }

  if(x > board.length || x < 0 || y > board.length || y < 0) {
    return false
  }

  if (board[x][y] != '0' && board[x][y] != 'food') {
    return false;
  }

  return true;
}

function survivalMove(me) {
  let direction = 'up';
  let x = me.body[0].x;
  let y = me.body[0].y;

  const move_up_is_safe = isMoveSafe(me, 'up');
  const move_down_is_safe = isMoveSafe(me, 'down');
  // const move_right_is_safe = isMoveSafe(me, 'right');
  const move_left_is_safe = isMoveSafe(me, 'left');

  if (x === 10) {
    if (move_down_is_safe) {
      direction = 'down';
    } else if (move_up_is_safe) {
      direction = 'up';
    } else {
      direction = 'left';
    }

    return direction;
  }

  if (x === 0) {
    if (move_up_is_safe) {
      direction = 'up';
    } else if (move_down_is_safe) {
      direction = 'down';
    } else {
      direction = 'right';
    }

    return direction;
  }

  if (y === 0) {
    if (isMoveSafe(me, 'right')) {
      direction = 'right';
    } else if (move_left_is_safe) {
      direction = 'left';
    } else {
      direction = 'down';
    }

    return direction;
  }

  if (y === 10) {
    if (isMoveSafe(me, 'right')) {
      direction = 'right';
    } else if (move_left_is_safe) {
      direction = 'left';
    } else {
      direction = 'up';
    }

    return direction;
  }

  if (board[x+1][y] === '0') {
    direction = 'right';
  }

  if (board[x-1][y] === '0') {
    direction = 'left';
  }

  if (board[x][y+1] === '0') {
    direction = 'down';
  }

  return direction;
}

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  // instantiate every turn. Previous state doesn't matter
  instantiateBoard();
  populateBoard(request.body.board, request.body.you);

  // const nextMove = generateNextMove();
  let nextMove = generateNextMove(request.body.you, request.body.board.food);

  if (!isMoveSafe(request.body.you, nextMove)) {
    // forget the food, just survive!
    nextMove = survivalMove(request.body.you);
  }

  // Response data
  const data = {
    move: nextMove, // one of: ['up','down','left','right']
  }

  lastMove = nextMove;

  return response.json(data)
})

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