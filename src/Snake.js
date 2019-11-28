
'use strict';
module.exports = class Snake {

  constructor(reqBody, uuid) {
    var me;

    for (var snake of reqBody.snakes) {
      if (snake.id == uuid) {
        me = snake;
        break;
      }
    }

    this.tail = [me.coords[me.coords.length - 1][0], me.coords[me.coords.length - 1][1]];;
    this.head = [me.coords[0][0], me.coords[0][1]];
  }
};