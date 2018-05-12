const eventsApi = require('./event');
const dashboardApi = require('./dashboard');

function api(server) {
  server.use('/api/v1/events', eventsApi);
  server.use('/api/v1/dashboard', dashboardApi);
}

module.exports = api;
