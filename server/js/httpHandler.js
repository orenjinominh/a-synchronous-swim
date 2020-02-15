const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const msgQueue = require('./messageQueue');
const serverUrl = 'http://127.0.0.1:3000'
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

  if (req.method === 'GET') {

    if (req.url === '/') {
      res.writeHead(200, headers);
      let value = msgQueue.dequeue();

      if (value !== undefined) {
        res.write(value);
      }

      res.end();
      next();

    } else if (req.url === '/background.jpg') {
      fs.readFile(module.exports.backgroundImageFile, (err, data) => {
        if (err) {
          res.writeHead(404, headers);
        } else {
          res.writeHead(200, headers);
          res.write(data, 'binary');
        }
        res.end();
        next();
      })
    } else {
      res.writeHead(404, headers);
      res.end();
      next();
    }
  }

  if (req.method === 'OPTIONS' && req.url === '/') {
    res.writeHead(200, headers);
    res.end();
    next();
  }


  if(req.method === 'POST' && req.url === '/uploadedPic') {

    var imagedata = [];
    req.on('data', function(chunk) {
        imagedata.push(chunk);
    });
    req.on('end', function() {
        imagedata = Buffer.concat(imagedata);
        res.writeHead(201, headers);
        var uploadedFile = multipart.getFile(imagedata);
        var uploadedImg = uploadedFile.data;

        fs.writeFileSync(module.exports.backgroundImageFile, uploadedImg, 'binary', function(err) {
            if (err) throw err;
            console.log('File saved.');
        });
        res.end();
        next();
    });

};


  };


