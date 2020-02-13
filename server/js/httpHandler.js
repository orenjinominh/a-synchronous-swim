const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const msgQueue = require('./messageQueue');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////



let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);


  // if (req.method === 'GET' && req.url === '/random') {
  //   let directions = ['left', 'right', 'up', 'down'];
  //   let index = Math.floor(Math.random()* directions.length);
  //   let arrowPoint = directions[index];
  //   res.writeHead(200, headers);
  //   res.write(arrowPoint);
  //   res.end();
  // }

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, headers);
    let value = msgQueue.dequeue();

    var imgPath = path.join('.', 'spec', 'water-lg.jpg');
    var readStream = fs.createReadStream(imgPath);

    readStream.on('data', function(data) {
      res.write(data);
    });
    res.end();

    if (value === undefined) {
      res.end();
    } else {
      res.write(value);
      res.end();
    }

  }

  if (req.method === 'OPTIONS' && req.url === '/') {
    res.writeHead(200, headers);
    res.end();
  }

  next(); // invoke next() at the end of a request to help with testing!
};
