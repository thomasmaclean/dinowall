const Obstacle = require('./obstacle');

module.exports =  class ObstacleManager{
  defaultObstacles = [];

  constructor(){
  }

  addDefaultObstacle(obstacle){
    this.defaultObstacles.push(obstacle);
  }

  getDefaultObstacles(){
    return this.defaultObstacles;
  }
}
