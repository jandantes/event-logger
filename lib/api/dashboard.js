import sendRequest from './sendRequest';

const BASE_PATH = '/api/v1/dashboard';

export const getDashboardMain = query =>
  sendRequest(`${BASE_PATH}`, {
    body: JSON.stringify(query),
  });

export const getDashboardList = query =>
  sendRequest(`${BASE_PATH}/list`, {
    body: JSON.stringify(query),
  });
