import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export function ChartSvg(props) {
  const {fill = '#000', width = 24, height = 24} = props;
  return (
    <Svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24">
      <Path
        fill={fill}
        d="M5 19H1v-4h4v4zm6 0H7v-8h4v8zm6 0h-4V6h4v13zm6 0h-4V0h4v19zm1 2H0v2h24v-2z"
      />
    </Svg>
  );
}
