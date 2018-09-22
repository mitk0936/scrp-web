const pageLoad = require('./page-load');
const CONSTANTS = require('../../constants');

const run = ({
  urls,
  onLoadStarted,
  onLoaded,
  onRequestFailed,
  getCurrentStatus
}) => {
  let allURLs = [...urls];

  const getURLs = (count) => allURLs.splice(0, count);

  const triggerLoadingData = (count = 5) => {
    if (getCurrentStatus() !== CONSTANTS.STATUS.RUNNING) {
      return;
    }

    const loadingURLs = getURLs(count);

    loadingURLs.forEach((url) => {
      onLoadStarted(url);

      pageLoad.load(url, (body) => {
        if (getCurrentStatus() !== CONSTANTS.STATUS.RUNNING) {
          return;
        }

        onLoaded(url, body);
        triggerLoadingData(1);
      }, () => {
        if (getCurrentStatus() !== CONSTANTS.STATUS.RUNNING) {
          return;
        }

        onRequestFailed(url);
        triggerLoadingData(1);
      });
    });
  };

  return triggerLoadingData;
};

module.exports = { run };