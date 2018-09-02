const curl = require('curl');

const load = (url, success, failure) => {
  curl.get(url, null, (err, resp, body) => {
    if (resp.statusCode == 200) {
      success(body);
    } else {
      failure();
    }
  }); 
};

module.exports = { load };