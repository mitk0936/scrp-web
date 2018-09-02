const fs = require('fs');

const load = (success, failure) => {
  fs.readFile('./samples/sample_1.html', 'utf8', function (err, data) {
    if (data) {
      success(data);
    } else {
      console.log(err);
      failure(data);
    }
  })
};

module.exports = { load };