const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////



let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  if (req.method === 'OPTIONS' && req.url === '/') {
    res.writeHead(200, headers);
    res.end();
  }

  if (req.method === 'GET' && req.url === '/') {
    let directions = ['left', 'right', 'up', 'down'];
    let index = Math.floor(Math.random()* 4);
    let arrowPoint = directions[index];
    res.writeHead(200, headers);
    res.write(arrowPoint);
    res.end();
  }

  next(); // invoke next() at the end of a request to help with testing!
};
