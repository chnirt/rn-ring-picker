import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export function ArrowSvg(props) {
  const {fill = '#000', width = 24, height = 24} = props;
  return (
    <Svg
      {...props}
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      clipRule="evenodd">
      <Path
        fill={fill}
        d="M2.117 12l7.527 6.235L9 19l-9-7.521L9 4l.645.764L2.116 11H24v1H2.117z"
      />
    </Svg>
  );
}
