const keypressHandler = require('./js/keypressHandler');
keypressHandler.initialize(message => console.log(`Message received: ${message}`));

const httpHandler = require('./js/httpHandler');


const http = require('http');
const server = http.createServer(httpHandler.router);

const port = 3000;
const ip = '127.0.0.1';
server.listen(port, ip);

console.log('Server is running in the terminal!');
console.log(`Listening on http://${ip}:${port}`);

const fs = require('fs')

// fs.readFile('C:\Users\robac\pt-sprints\rpt20-a-synchronous-swim\server\index.js', (err, data) => {
//   if (err) {
//     console.error(err)
//     return
//   }
//   console.log(data)
// })


