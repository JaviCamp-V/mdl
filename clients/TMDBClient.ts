import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.TMDB_URL,
  timeout: +process.env.AXIOS_TIMEOUT! ?? 3000,
  headers: {
    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

const get = async <T>(url: string, params?: any) => {
  return (await instance.get<T>(url, { params })).data;
};

const methods = { get };
export default methods;
