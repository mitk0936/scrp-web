const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const fs = require('fs');

const dir = './output';

const run = ({
  onOutputFolderCleaned
}) => {
  rimraf(dir, () => {
    mkdirp(dir, function (err) {
      if (err) {
        throw 'Failed to create output folder';
      } else {
        onOutputFolderCleaned();
      }
    });
  });

  const saveFile = (name, data, retried = false) => {
    const fileName = name.replace('https://ballotpedia.org/', '');

    try {
      fs.writeFileSync(`./output/${fileName}.json`, data);
    } catch (e) {
      if (!retried) {
        setTimeout(() => saveFile(name, data, true), 500);
      }
    }
  };

  return { saveFile };
};

module.exports = { run };
