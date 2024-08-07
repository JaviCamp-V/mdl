import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DetailsSummary, { DetailsSummaryProps } from './sections/DetailsSummary';

const SidePanel: React.FC<DetailsSummaryProps> = (props) => {
  const sections = {
    Details: <DetailsSummary {...props} />
  };
  const color = 'hsl(0deg 0% 100% / 87%)';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, sm: 4 },
        height: '100%'
      }}
    >
      {Object.entries(sections).map(([title, component]) => (
        <Box key={title} sx={{ boxShadow: '0 1px 1px rgba(0,0,0,.1)' }}>
          <Box
            sx={{
              backgroundColor: '#00568c',
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
              padding: 1,
              color
            }}
          >
            <Typography fontSize={18} fontWeight={700}>
              {title}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: 'background.paper',
              borderBottomLeftRadius: 2,
              borderBottomRightRadius: 2,
              padding: 2
            }}
          >
            {component}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default SidePanel;
