'use strict';

class Food {
  constructor(x_position, y_position) {
    this.x = x_position;
    this.y = y_position;
  }

  get coordinates() {
    return { x: this.x, y: this.y };
  }
}

module.exports = Food