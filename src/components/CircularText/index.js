import React from 'react';
import { Text } from 'react-native';
import Svg, {
  Circle,
  Text as SvgText,
  TextPath,
  TSpan,
  G,
  Line,
  Rect,
  Defs,
  Path,
} from 'react-native-svg';

export function CircularText(props) {
  const {
    fill = '#000',
    width = 100,
    height = 100,
    fontSize = width / 10,
    style,
    children,
  } = props;

  return (
    <Svg style={style} width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <G id="circle">
        <Circle
          r={width / 3}
          x={width / 2}
          y={width / 2}
          transform="rotate(90)"
        />
      </G>
      <SvgText
        fill={fill}
        fontSize={fontSize}>
        <TextPath href="#circle" startOffset="50%">
          <TSpan
            dx="0" dy={-fontSize} textAnchor="middle">
            {children}
          </TSpan>
        </TextPath>
      </SvgText>
    </Svg>
  );
}
