import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export function BitCoinSvg(props) {
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
        d="M11.5 11.5V9c1.75 0 2.789.25 2.789 1.25 0 1.172-1.684 1.25-2.789 1.25zm0 .997V15c1.984 0 3.344-.188 3.344-1.258 0-1.148-1.469-1.245-3.344-1.245zM24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-7 1.592c0-1.279-1.039-1.834-1.789-2.025.617-.223 1.336-1.138 1.046-2.228-.245-.922-1.099-1.74-3.257-1.813V6h-1v1.5h-.5V6h-1v1.5H8V9h.817c.441 0 .683.286.683.702v4.444c0 .429-.253.854-.695.854h-.539l-.25 1.489H10.5V18h1v-1.511h.5V18h1v-1.5c2.656 0 4-1.167 4-2.908z"
      />
    </Svg>
  );
}
