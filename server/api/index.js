const eventsApi = require('./event');

function api(server) {
  server.use('/api/v1/events', eventsApi);
}

module.exports = api;
