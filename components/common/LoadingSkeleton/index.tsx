import React from 'react';
import Skeleton from '@mui/material/Skeleton';

type Props = {
  width?: string | number | React.CSSProperties;
  height?: string | number | React.CSSProperties;
};
const LoadingSkeleton: React.FC<Props> = ({ width = '100%', height = '100%' }) => {
  return <Skeleton sx={{ height, width }} variant="rounded" />;
};

export default LoadingSkeleton;
