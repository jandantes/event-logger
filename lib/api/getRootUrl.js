export default function getRootUrl() {
  const dev = process.env.NODE_ENV !== 'production';
  const port = dev ? 54321 : 8000;
  const ROOT_URL = dev ? `http://localhost:${port}` : 'https://altitude-events.now.sh';

  return ROOT_URL;
}
