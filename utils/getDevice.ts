'use server';

import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { X_Device_ID } from '@/libs/common';
import { plusYears } from './dateUtils';

const generateDeviceId = () => {
  const deviceId = uuidv4();
  cookies().set(X_Device_ID, deviceId, {
    expires: plusYears(new Date(), 100),
    sameSite: 'lax',
    secure: true,
    httpOnly: true, // Add this for extra security
    path: '/'
  });
  return deviceId;
};

const getDeviceId = () => (cookies().get(X_Device_ID)?.value as string) ?? generateDeviceId();

export default getDeviceId;
