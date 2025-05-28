import { CreateAxiosDefaults } from 'axios';

export const SERVER_API = process.env.REACT_APP_API_URL_REST;

const mainApi: CreateAxiosDefaults = {
  baseURL: SERVER_API,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export default mainApi;
