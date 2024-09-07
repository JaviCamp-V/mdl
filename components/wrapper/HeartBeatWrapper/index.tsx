/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import { updateLastActive } from '@/features/auth/services/authService';

interface HeartBeatWrapperProps {
  children: React.ReactNode;
}
const HeartBeatWrapper: React.FC<HeartBeatWrapperProps> = async ({ children }) => {
  await updateLastActive();
  return <React.Fragment>{children}</React.Fragment>;
};

export default HeartBeatWrapper;
