import React, { forwardRef } from 'react';
import { Slide, SlideProps } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

const SlideTransition = forwardRef<unknown, TransitionProps & { children: React.ReactElement<any, any> }>(
  (props, ref) => <Slide direction="up" ref={ref} {...props} />
);

SlideTransition.displayName = 'SlideTransition';

export default SlideTransition;
