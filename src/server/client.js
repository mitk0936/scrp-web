const socketIo = require('socket.io');
const CONSTANTS = require('../constants');
const statusService = require('./status-service/index');
const fetcherService = require('./fetcher-service/index');
const scrapeService = require('./scrape-service/index');
const fileService = require('./file-service/index');

const mockedUrls = [
  'https://ballotpedia.org/George_W._Bush',
  'https://ballotpedia.org/Lisa_Murkowski',
  'https://ballotpedia.org/Gosho',
  'https://ballotpedia.org/Barack_Obama',
  'https://ballotpedia.org/Donald_Trump',
  'https://ballotpedia.org/Mike_Pence',
  'https://ballotpedia.org/Margaret_Stock',
  'https://ballotpedia.org/Joe_Miller'
];

const run = (server) => {
  const io = socketIo(server);

  const emitStatus = (status) => io.emit('status', { status });
  const emitMessage = ({ type, message, json }) => io.emit('message', { type, message, json });
  
  const runningStatusStore = statusService.run({ onStatusChange: emitStatus });

  runningStatusStore.setStatus(CONSTANTS.STATUS.IDLE);

  io.on('connection', (client) => {
    
    client.emit('status', {
      status: runningStatusStore.getStatus()
    });
    
    client.on('status', ({ status }) => {

      const scrapingStarted = Boolean(
        status !== runningStatusStore.getStatus() &&
        status === CONSTANTS.STATUS.RUNNING
      );

      runningStatusStore.setStatus(status);

      if (scrapingStarted) {
        const { saveFile } = fileService.run({
          onOutputFolderCleaned: () => {
            const { loadData } = fetcherService.run({
              urls: mockedUrls,
              onLoadStarted: (url) => emitMessage({
                type: CONSTANTS.EVENT_TYPES.WARNING,
                message: `Fetching started (${url})`
              }),
              onLoaded: (url, body) => {
                const json = scrapeService.run({
                  html: body,
                  onError: (message) => emitMessage({
                    type: CONSTANTS.EVENT_TYPES.FAILURE,
                    message: `SCRIPT ERROR: ${message} (${url})`
                  })
                });

                if (json) {
                  emitMessage({
                    type: CONSTANTS.EVENT_TYPES.SUCCESS,
                    message: `Data loaded successfully for (${url})`,
                    json
                  });

                  saveFile(url, JSON.stringify(json));
                } else {
                  emitMessage({
                    type: CONSTANTS.EVENT_TYPES.FAILURE,
                    message: `MISSING DATA for ${url}`
                  });
                }
              },
              onRequestFailed: (url, statusCode) => {
                emitMessage({
                  type: CONSTANTS.EVENT_TYPES.FAILURE,
                  message: `Failed to load (${url}), Status: ${statusCode}`
                });
              },
              onQueueFinished: () => runningStatusStore.setStatus(CONSTANTS.STATUS.FINISHED),
              getCurrentStatus: runningStatusStore.getStatus
            });

            loadData();
          }
        });
      }
    });
    
  });
};

module.exports = { run };