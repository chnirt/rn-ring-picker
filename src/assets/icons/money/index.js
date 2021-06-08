import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export function MoneySvg(props) {
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
        d="M0 5v14h24V5H0zm12 12a5 5 0 11.001-10.001A5 5 0 0112 17zm.25-2.526V15h-.5v-.499a3.459 3.459 0 01-1.5-.363l.228-.821c.478.185 1.114.382 1.612.27.575-.13.693-.721.058-1.006-.466-.215-1.89-.402-1.89-1.621 0-.682.52-1.292 1.492-1.426V9h.5v.509c.362.009.769.072 1.222.21l-.181.824c-.384-.134-.809-.257-1.222-.232-.744.044-.811.688-.291.958.855.402 1.972.701 1.972 1.772.001.859-.671 1.317-1.5 1.433z"
      />
    </Svg>
  );
}
