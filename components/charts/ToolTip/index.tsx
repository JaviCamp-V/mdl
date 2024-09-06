import React from 'react';
import { Circle } from '@mui/icons-material';
import { Box, Card, CardContent, Divider, Paper, Typography } from '@mui/material';

const ChartToolTip: React.FC = (props: any) => {
  const { active, payload, label, labelFormatter, formatter, ...rest } = props;

  if (!active || !payload || !payload.length) return <React.Fragment />;

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: '2px',
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.95,
        margin: 0,
        padding: 1,
        height: '100%'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          //   gap: 0.5,
          paddingX: 0,
          paddingY: 0,
          margin: 0,
          height: '100%'
        }}
      >
        <Typography fontSize={13} fontWeight={'bolder'}>
          {labelFormatter ? labelFormatter(label) : label}
        </Typography>
        {payload.map((item: any) => {
          const [value, name] = formatter ? formatter(item.value, item.name) : [item.value, item.name];
          return (
            <Box
              key={name}
              sx={{
                display: 'flex',
                gap: 0.4,
                justifyContent: 'left',
                alignItems: 'center',
                padding: 0,
                margin: 0,
                height: '100%'
              }}
            >
              <Box
                sx={{
                  border: `1.5px solid ${item.stroke}`,
                  backgroundColor: item.color,
                  padding: 0.5,
                  display: 'inline-block'
                }}
              ></Box>

              <Typography fontSize={12}>{name}:</Typography>
              <Typography fontSize={12}>{value}</Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default ChartToolTip;
