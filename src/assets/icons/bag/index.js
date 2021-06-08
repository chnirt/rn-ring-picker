import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export function BagSvg(props) {
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
        d="M9 6H7V4a2 2 0 012-2h6a2 2 0 012 2v2h-2V4.5a.5.5 0 00-.5-.5h-5a.5.5 0 00-.5.5V6zm9.847 5.723c-.265 0-.48.349-.48.779 0 .43.215.778.48.778s.48-.349.48-.778c0-.431-.215-.779-.48-.779zM24 7v15H0V7h24zM6 12H4v1h2v-1zm3 0H7v1h2v-1zm3 0h-2v1h2v-1zm3 0h-2v1h2v-1zm5 .479c-.004-.786-.536-1.479-1.235-1.479-.352 0-2.405.858-2.765 1v1c.351.139 2.38 1 2.733 1 .721 0 1.271-.728 1.267-1.521z"
      />
    </Svg>
  );
}
