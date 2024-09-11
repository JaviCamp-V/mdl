'use client';

import React from 'react';
import {
  Bar,
  CartesianGrid,
  Legend,
  BarChart as ReBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import ChartProps from '@/types/common/ChartProps';
import Values from '@/types/common/Values';
import ChartToolTip from '../ToolTip';

interface Plots<T> {
  key: Extract<keyof T, string>;
  color: string;
  borderColor: string;
}

interface BarChartProps<T extends Values> extends ChartProps {
  xAxisDataKey: Extract<keyof T, string>;
  plots: Plots<T>[];
  data: T[];
  gridLines?: string;
}
const BarChart = <T extends Values>({
  xAxisDataKey,
  plots,
  data,
  width,
  height = 400,
  gridLines = '4 1',
  margin = {
    top: 20,
    right: 30,
    left: 20,
    bottom: 5
  }
}: BarChartProps<T>) => {
  return (
    <ResponsiveContainer width="100%" height={'100%'} style={{ backgroundColor: 'inherit' }}>
      <ReBarChart
        data={data}
        margin={margin}
        height={height}
        width={width}
        style={{ backgroundColor: 'inherit' }}
        barCategoryGap={'5%'}
        {...{
          overflow: 'visible'
        }}
      >
        <CartesianGrid style={{ backgroundColor: 'inherit' }} stroke="hsla(210, 8%, 51%, .13)" fillOpacity={0.2} />
        <XAxis
          interval={0}
          dataKey={xAxisDataKey}
          domain={[0, 'auto']}
          padding="no-gap"
          style={{ fontSize: 12 }}
          type="category"
          scale={'auto'}
          includeHidden
          allowDuplicatedCategory
          allowDataOverflow={false}
          tickSize={8}
          angle={-45}
          textAnchor="end"
        />
        <YAxis
          style={{ fontSize: 13, padding: 0, margin: 0 }}
          tickSize={1}
          padding={{ top: 0, bottom: 0 }}
          tick={{ strokeWidth: 2 }}
        />
        <Tooltip content={ChartToolTip} />
        {plots.map((plot) => (
          <Bar key={plot.key} dataKey={plot.key} fill={plot.color} stroke={plot.borderColor} minPointSize={1} />
        ))}
      </ReBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
