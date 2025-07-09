import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export const ChartBarIcon = ({
  color = '#CCC',
  size = 24,
  style,
  ...props
}: SvgProps & { size?: number }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={style}
    {...props}
  >
    <Path
      d="M22 21H2v-2h20v2zm-3-3H5v-4h14v4zm0-6H5V8h14v4zm0-6H5V2h14v4z"
      fill={color}
    />
  </Svg>
);
