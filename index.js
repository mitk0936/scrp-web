const http = require('http');
const url = require('url');
const curl = require('curl');
const scrape = require('./scrape');

const FETCH_ERROR = 'Problems with fetching external website data.';
const UNKNOWN_REQUEST = 'UNKNOWN_REQUEST';
const PARSING_ERROR = 'PARSING_ERROR';

const server = http.createServer();

server.on('request', (request, response) => {
  const { method } = request;
  const urlParts = url.parse(request.url, true);
  const query = urlParts.query;

  if (method === 'GET' && query.sc) {
    curl.get(query.sc, null, (err, resp, body) => {
      if (resp.statusCode == 200) {
        const result = scrape.start(body);
        
        try {
          response.end(JSON.stringify(result));
        } catch (e) {
          response.end(PARSING_ERROR);
        }

      } else {
        response.end(FETCH_ERROR);
      }
    }); 
  } else {
    response.end(UNKNOWN_REQUEST);
  }
});

server.listen(process.env.PORT || 3000);