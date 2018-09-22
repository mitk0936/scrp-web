const socketIo = require('socket.io');
const CONSTANTS = require('../constants');
const statusService = require('./status-service/index');
const fetcherService = require('./fetcher-service/index');
const scrapeService = require('./scrape-service/index');

const mockedUrls = [
  'https://ballotpedia.org/George_W._Bush',
  'https://ballotpedia.org/Lisa_Murkowski'
];

const run = (server) => {
  const io = socketIo(server);

  const emitStatus = (status) => io.emit('status', { status });
  const emitMessage = ({ type, message }) => io.emit('message', { type, message });
  
  const runningStatusStore = statusService.run({
    onStatusChange: emitStatus
  });

  runningStatusStore.setStatus(CONSTANTS.STATUS.IDLE);

  io.on('connection', (client) => {
    client.on('status', ({ status }) => {

      const processStarted = Boolean(
        status !== runningStatusStore.getStatus() &&
        status === CONSTANTS.STATUS.RUNNING
      );

      runningStatusStore.setStatus(status);

      if (processStarted) {
        fetcherService.run({
          urls: mockedUrls,
          onLoadStarted: (url) => emitMessage({
            type: 'warning',
            message: `Loading started for ${url}`
          }),
          onLoaded: (url, body) => {
            emitMessage({
              type: 'SUCCESS',
              message: JSON.stringify(scrapeService.run({ html: body }))
            })
          },
          onRequestFailed: (url) => {
            emitMessage({
              type: 'FAILURE',
              message: url
            });
          },
          getCurrentStatus: runningStatusStore.getStatus
        })();
      }
    });

    client.emit('status', { status: runningStatusStore.getStatus() });
  });
};

module.exports = { run };