import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEWS_URL,
  timeout: +process.env.AXIOS_TIMEOUT! ?? 3000
});

const get = async <T>(url: string, params: URLSearchParams) => {
  params.append('apiKey', process.env.NEWS_API_KEY!);
  return (await instance.get<T>(url, { params })).data;
};

const methods = { get };
export default methods;
