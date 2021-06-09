import React from 'react';
import Svg, {
  Circle,
  Text as SvgText,
  TextPath,
  TSpan,
  G,
  Path,
} from 'react-native-svg';

export function CircularText(props) {
  const {
    fill = '#000',
    fontSize = 10,
    direction = 'top',
    width = 100,
    height = 100,
    children,
  } = props;
  const directions = {
    top: -180,
    right: -90,
    left: 90,
    bottom: 0,
  };
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <G id="circle">
        {/* <Path
          d="M 64,0 A 64,64 0 0 1 -64,0 A 64,64 0 0 1 64,0"
          transform="translate(150,150)"
          stroke="darkblue"
          fill="none"
        /> */}
        <Circle
          r={width / 3}
          x={width / 2}
          y={width / 2}
          transform={`rotate(${directions[direction]})`}
        />
      </G>
      <SvgText fill={fill} fontSize={fontSize}>
        <TextPath href="#circle">
          <TSpan dx="0" dy={-fontSize}>
            {children}
          </TSpan>
        </TextPath>
      </SvgText>
    </Svg>
  );
}
