const pageLoad = require('./page-load');
const CONSTANTS = require('../../constants');

const run = ({
  urls,
  onLoadStarted,
  onLoaded,
  onRequestFailed,
  getCurrentStatus,
  onQueueFinished
}) => {
  let allURLs = [...urls];
  let requestedTailCount = 0;

  const getURLs = (count) => allURLs.splice(0, count);
  const appendUrl = (url) => allURLs.push(url);

  const loadData = (count = 20) => {
    if (getCurrentStatus() !== CONSTANTS.STATUS.RUNNING) {
      return;
    }

    const loadingURLs = getURLs(count);

    if (loadingURLs.length === 0 && requestedTailCount === 0) {
      onQueueFinished();
    }

    loadingURLs.forEach((url) => {
      onLoadStarted(url);

      requestedTailCount++;

      pageLoad.load({
        url,
        success: (body) => {
          requestedTailCount--;
          onLoaded(url, body);
          loadData(1);
        },
        failure: (statusCode) => {
          if (statusCode !== 404) {
            appendUrl(url);
          }

          requestedTailCount--;
          onRequestFailed(url, statusCode);
          loadData(1);
        }
      });
    });
  };

  return { loadData };
};

module.exports = { run };