
const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const server = require('./mockServer');
const multipart = require('../js/multipartUtils');
const httpHandler = require('../js/httpHandler');



describe('server responses', () => {

  it('should respond to a OPTIONS request', (done) => {
    let {req, res} = server.mock('/', 'OPTIONS');

    httpHandler.router(req, res);
    expect(res._responseCode).to.equal(200);
    expect(res._ended).to.equal(true);
    expect(res._data.toString()).to.be.empty;

    done();
  });

  it('should respond to a GET request for a swim command', (done) => {
    let {req, res} = server.mock('/random', 'GET');

    httpHandler.router(req, res);
    expect(res._responseCode).to.equal(200);
    expect(res._ended).to.equal(true);
    console.log('data--->', res._data);
    expect(res._data.toString()).to.not.be.empty;
    expect(['left', 'right', 'up', 'down']).to.contain(res._data.toString());

    done();
  });

  it('should respond with 404 to a GET request for a missing background image', (done) => {
    httpHandler.backgroundImageFile = path.join('.', 'spec', 'missing.jpg');
    let {req, res} = server.mock('/background.jpg', 'GET');

    httpHandler.router(req, res, () => {
      expect(res._responseCode).to.equal(404);
      expect(res._ended).to.equal(true);
      done();
    });
  });

  it('should respond with 200 to a GET request for a present background image', (done) => {
    httpHandler.backgroundImageFile = path.join('.', 'background.jpg');
    let {req, res} = server.mock('/background.jpg', 'GET');
    httpHandler.router(req, res, () => {
      expect(res._responseCode).to.equal(200);
      expect(res._ended).to.equal(true);
      done();
    });
  });

  var postTestFile = path.join('.', 'spec', 'water-lg.multipart');

  it('should respond to a POST request to save a background image', (done) => {
   fs.readFile(postTestFile, (err, fileData) => {
      httpHandler.backgroundImageFile = path.join('.', 'spec', 'temp.jpg');
      let {req, res} = server.mock('/uploadedPic', 'POST', fileData);

      httpHandler.router(req, res, () => {
        expect(res._responseCode).to.equal(201);
        expect(res._ended).to.equal(true);
        done();
      });
    });
  });

  it('should send back the previously saved image', (done) => {
    fs.readFile(postTestFile, (err, fileData) => {
     httpHandler.backgroundImageFile = path.join('.', 'spec', 'temp.jpg');
      let post = server.mock('/uploadedPic', 'POST', fileData);

      httpHandler.router(post.req, post.res, () => {
        let get = server.mock('/background.jpg', 'GET');
        httpHandler.router(get.req, get.res, () => {
          var testSingleFile = multipart.getFile(fileData);
          expect(Buffer.compare(testSingleFile.data, get.res._data)).to.equal(0);
          done();
        });
      });
    });
  });
});
