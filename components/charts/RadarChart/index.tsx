'use client';

import React from 'react';
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as ReRadarChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import ChartProps from '@/types/common/ChartProps';
import Values from '@/types/common/Values';
import ChartToolTip from '../ToolTip';

interface Plots<T> {
  key: Extract<keyof T, string>;
  color: string;
  borderColor: string;
}

interface RadarChartProps<T extends Values> extends ChartProps {
  xAxisDataKey: Extract<keyof T, string>;
  plots: Plots<T>[];
  data: T[];
}
const RadarChar = <T extends Values>({ data, width, height = 400, xAxisDataKey, plots }: RadarChartProps<T>) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="hsla(210, 8%, 51%, .13)" />
        <PolarAngleAxis dataKey={xAxisDataKey} style={{ fontSize: 13 }} />
        {plots.map((plot) => (
          <Radar key={plot.key} dataKey={plot.key} stroke={plot.borderColor} fill={plot.color} dot />
        ))}
        <Tooltip content={ChartToolTip} formatter={(value, name) => [`${value}%`, name]} />
      </ReRadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChar;
