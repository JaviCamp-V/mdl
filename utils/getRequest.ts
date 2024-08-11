import { cookies, headers } from 'next/headers';

const getRequest = () => {
  const cookieData = cookies().getAll();
  const headersData = headers();

  const request = {
    headers: Object.fromEntries(headersData),
    cookies: Object.fromEntries(cookieData.map((c) => [c.name, c.value]))
  } as any;

  return request;
};

export default getRequest;
