import sendRequest from './sendRequest';

const BASE_PATH = '/api/v1/dashboard';

export const getDashboardMain = () =>
  sendRequest(`${BASE_PATH}`, {
    method: 'GET',
  });
