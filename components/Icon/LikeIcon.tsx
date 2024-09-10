import React from 'react';
import Iconify, { IconifyProps } from './Iconify';

type OmittedProps = Omit<IconifyProps, 'icon'>;

type LikeIconProps = OmittedProps & {
  hasLiked: boolean;
};

const LikeIcon: React.FC<LikeIconProps> = (props) => {
  const { hasLiked, ...rest } = props;
  return (
    <Iconify
      icon="mdi:heart-outline"
      color={hasLiked ? '#f44455' : 'text.primary'}
      width={14}
      height={14}
      sx={{
        '&:hover': { opacity: 0.8, color: hasLiked ? 'text.primary' : '#f44455' }
      }}
      {...rest}
    />
  );
};

export default LikeIcon;
