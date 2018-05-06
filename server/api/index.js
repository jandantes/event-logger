import eventsApi from './event';

export default function api(server) {
  server.use('/api/v1/events', eventsApi);
}
