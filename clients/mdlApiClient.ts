import { cookies, headers } from 'next/headers';
import axios from 'axios';
import { JWT, getToken } from 'next-auth/jwt';
import RefreshTokenRequest from '@/types/Auth/IResfreshTokenRequest';
import getDeviceId from '@/utils/getDevice';
import { X_API_KEY, X_Device_ID } from '@/libs/common';


/**
 * Default configuration for Axios.
 */
const instance = axios.create({
  baseURL: process.env.MDL_URL,
  timeout: +Number(process.env.AXIOS_TIMEOUT ?? 3000),
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Retrieves the Next Auth token from the cookies and headers.
 * @returns A promise that resolves to the Next Auth token.
 */

const getNextAuthToken = async (): Promise<JWT | null> => {
  const cookieData = cookies().getAll();
  const headersData = headers();

  const request = {
    headers: Object.fromEntries(headersData),
    cookies: Object.fromEntries(cookieData.map((c) => [c.name, c.value]))
  } as any;

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  return token;
};

/**
 * Retrieves the Bearer token from the cookies and headers.
 * @returns A promise that resolves to the Bearer token.
 */
const getBearerToken = async (): Promise<string> => {
  const token = await getNextAuthToken();
  return token?.accessToken ?? '';
};

/***
 * Retrieve refresh token from cookies and headers
 * @returns A promise that resolves to the refresh token
 */
const getRefreshToken = async (): Promise<string> => {
  const token = await getNextAuthToken();
  return token?.refreshToken ?? '';
};

/**
 * Interceptor to add headers conditionally based on the endpoint.
 */
instance.interceptors.request.use(async (config) => {
  if (!config?.url?.startsWith('user') && !config?.url?.startsWith('admin')) {
    // Add API Key and Device ID for /auth/ endpoints
    config.headers[X_API_KEY] = process.env.MDL_API_KEY;
    config.headers[X_Device_ID] = getDeviceId();
  }
  if (config?.url?.startsWith('user/') || config?.url?.startsWith('admin') || config?.url?.startsWith('auth/logout')) {
    const token = await getBearerToken();
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

/**
 * Sends a POST request
 * @param endpoint - The API endpoint.
 * @param request - The request payload.
 * @param params - Optional URL search parameters.
 * @returns A promise that resolves to the response data.
 */
const post = async <T1, T2>(endpoint: string, request: T1, params?: URLSearchParams): Promise<T2> => {
  const response = await instance.post<T2>(endpoint, request, { params });
  return response.data;
};

/**
 * Sends a GET request
 * @param url - The API endpoint.
 * @param params - Optional query parameters.
 * @returns A promise that resolves to the response data.
 */
const get = async <T>(url: string, params?: any): Promise<T> => {
  const response = await instance.get<T>(url, { params });
  return response.data;
};

/**
 * Sends a DELETE request with optional authentication.
 * @param url - The API endpoint.
 * @returns A promise that resolves to the response data.
 * @returns A promise that resolves to the response data.
 */

const del = async <T>(url: string): Promise<T> => {
  const response = await instance.delete<T>(url);
  return response.data;
};

/**
 * send refresh token request
 */

const refreshToken = async <T>(url: string): Promise<any> => {
  const refreshToken = await getRefreshToken();
  const response = await post<RefreshTokenRequest, T>(url, { refreshToken });
  return response;
};
// Export the HTTP methods for use in other parts of the application.
const methods = { get, post, del, refreshAuthToken: refreshToken };

export default methods;