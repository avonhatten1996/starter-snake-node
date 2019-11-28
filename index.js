const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const Food = require('./food.js')
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

const board = null;
let menu = [];

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---
function updateFood(request) {
  request.board.food.foreach((food) => {
    food = new Food(food.x, food.y)
    menu.push(food);
  })
}

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // NOTE: Do something here to start the game
  updateFood(request);

  // Response data
  const data = {
    color: '#DFFF00',
  }

  nextMove = 'left';

  return response.json(data)
})

/*
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
*/

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

function getCloseFood(request) {
  const my_snake_x = request.you.body[0].x;
  const my_snake_y = request.you.body[0].y;
  const retval = null;

  menu.forEach((food) => {
    x_diff = Math.abs(food.coordinates.x - my_snake_x);
    y_diff = Math.abs(food.coordinates.y - my_snake_y);
    if( x_diff < 2 || y_diff < 2) {
      retval = food;
    }
  })

  return retval;
}

function getFoodDirection(request) {
  const my_snake_x = request.you.body[0].x;
  const my_snake_y = request.you.body[0].y;

  x_diff = food.coordinates.x - my_snake_x;
  y_diff = food.coordinates.y - my_snake_y;

  if (x_diff > 0 && x_diff <= 3) {
    return 'right';
  }

  if (x_diff < 0 && x_diff >= -3) {
    return 'left';
  }

  if (y_diff > 0 && y_diff <= 3) {
    return 'up';
  }

  if (y_diff < 0 && y_diff >= -3) {
    return 'down';
  }
}

function generateNextMove(request) {
  food = getCloseFood(request.body);
  if (food !== null) {
    return getFoodDirection(food, request.body);
  }
  return circle();

  /*
  // find shortest valid path to a food
  head_x = me.body[0].x
  head_y = me.body[0].y

  let min_food_x;
  let min_food_y;
  */
}

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  // instantiate every turn. Previous state doesn't matter
  // instantiateBoard();
  // populateBoard(request.body.board, request.body.you);

  const nextMove = generateNextMove(request);

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

// //

// // For deployment to Heroku, the port needs to be set using ENV, so
// // we check for the port number in process.env
// app.set('port', (process.env.PORT || 9001))

// app.enable('verbose errors')

// app.use(logger('dev'))
// app.use(bodyParser.json())
// app.use(poweredByHandler)

// // --- SNAKE LOGIC GOES BELOW THIS LINE ---

// // Handle POST request to '/start'
// app.post('/start', (request, response) => {
//   // NOTE: Do something here to start the game

//   // Response data
//   const data = {
//     color: '#DFFF00',
//   }

//   nextMove = 'left';

//   return response.json(data)
// })

// let lastMove = 'left';

// // function getCloseFood(request) {
// //   const my_snake_x = request.you.body.x;
// //   const my_snake_y = request.you.body.y;

// //   menu.forEach((food) => {
// //     x_diff = Math.abs(food.coordinates.x - my_snake_x);
// //     y_diff = Math.abs(food.coordinates.y - my_snake_y);
// //     if( x_diff < 2 || y_diff < 2) {
// //       return food
// //     }
// //   })

// //   return null;
// // }

// // function getFoodDirection(request) {
// //   const my_snake_x = request.you.body.x;
// //   const my_snake_y = request.you.body.y;

// //   x_diff = food.coordinates.x - my_snake_x;
// //   y_diff = food.coordinates.y - my_snake_y;

// //   if (x_diff === 1) {
// //     return 'right';
// //   }

// //   if (x_diff === -1) {
// //     return 'left';
// //   }

// //   if (y_diff === 1) {
// //     return 'up';
// //   }

// //   if (y_diff === -1) {
// //     return 'down';
// //   }
// // }

// function generateNextMove() {
//   // food = getCloseFood()
//   // if (food !== null) {
//   //  return getFoodDirection(food, request);
//   // }

//   return 'down'

//   // if (lastMove === 'up') {
//   //   return 'right';
//   // }

//   // if (lastMove === 'right') {
//   //   return 'down';
//   // }

//   // if (lastMove === 'down') {
//   //   return 'left'
//   // }

//   // if (lastMove === 'left') {
//   //   return 'up';
//   // }

//   // return 'down';
// }


// // Handle POST request to '/move'
// app.post('/move', (request, response) => {
//   // NOTE: Do something here to generate your move
//   // updateFood(request);

//   const nextMove = generateNextMove();

//   // Response data
//   const data = {
//     move: nextMove, // one of: ['up','down','left','right']
//   }

//   lastMove = nextMove;

//   return response.json(data)
// })

// app.post('/end', (request, response) => {
//   // NOTE: Any cleanup when a game is complete.
//   return response.json({})
// })

// app.post('/ping', (request, response) => {
//   // Used for checking if this snake is still alive.
//   return response.json({});
// })

// // --- SNAKE LOGIC GOES ABOVE THIS LINE ---

// app.use('*', fallbackHandler)
// app.use(notFoundHandler)
// app.use(genericErrorHandler)

// app.listen(app.get('port'), () => {
//   console.log('Server listening on port %s', app.get('port'))
// })
