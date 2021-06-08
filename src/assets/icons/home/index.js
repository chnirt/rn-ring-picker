import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export function HomeSvg(props) {
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
        d="M21 13v10h-6v-6H9v6H3V13H0L12 1l12 12h-3zm-1-5.907V2h-3v2.093l3 3z"
      />
    </Svg>
  );
}
