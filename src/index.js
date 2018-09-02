const http = require('http');
const url = require('url');

const pageLoad = require('./page-load');
const mockedLoad = require('./mocked-load');
const scrape = require('./scrape');

const LOAD_DATA_ERROR = 'LOAD_DATA_ERROR';
const UNKNOWN_REQUEST = 'UNKNOWN_REQUEST';
const PARSING_ERROR = 'PARSING_ERROR';

const server = http.createServer();

const fetchData = (url, response) => {
  return pageLoad.load(url, (body) => {
    const result = scrape.start(body);
    
    try {
      response.end(
        JSON.stringify(result)
      );
    } catch (e) {
      response.end(PARSING_ERROR);
    }
  }, () => response.end(LOAD_DATA_ERROR));
};

const loadMockedData = (response) => {
  return mockedLoad.load((body) => {
    const result = scrape.start(body);

    try {
      response.end(
        JSON.stringify(result)
      );
    } catch (e) {
      response.end(PARSING_ERROR);
    }
  }, () => response.end(LOAD_DATA_ERROR))
}

server.on('request', (request, response) => {
  const urlParts = url.parse(request.url, true);
  const isGETRequest = request.method === 'GET';

  switch (true) {
    case Boolean(isGETRequest && urlParts.query.mocked):
      return loadMockedData(response);
    case Boolean(isGETRequest && urlParts.query.sc):
      return fetchData(urlParts.query.sc, response);
    default:
      response.end(UNKNOWN_REQUEST);
  }

  response.end(UNKNOWN_REQUEST);
});

server.listen(process.env.PORT || 3000);