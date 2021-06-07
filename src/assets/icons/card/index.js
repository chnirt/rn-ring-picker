import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export function CardSvg(props) {
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
        d="M22 4H2a2 2 0 00-2 2v12a2 2 0 002 2h20a2 2 0 002-2V6a2 2 0 00-2-2zm0 13.5a.5.5 0 01-.5.5h-19a.5.5 0 01-.5-.5V11h20v6.5zM22 8H2V6.5a.5.5 0 01.5-.5h19a.5.5 0 01.5.5V8zm-9 6H4v-1h9v1zm-3 2H4v-1h6v1zm10-2h-3v-1h3v1z"
      />
    </Svg>
  );
}
