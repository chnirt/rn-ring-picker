import React, { useRef, useState } from 'react';
import {
  View,
  Animated,
  PanResponder,
  Button,
  Text,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {
  RingPickerV2,
  RingPickerV42,
  RingPickerV5,
  RingPickerV52,
} from './src/components';
import RNRingPicker from './src/components/RNRingPicker/sample';

const STEP = 90;
const data = [...Array(20).keys()].map((element, index) => ({
  id: index,
  label: element,
}));

function App() {
  const [step, setStep] = useState(STEP);
  const [selected, setSelected] = useState({})
  const handleOnPress = (element) => {
    // console.log('handleOnPress', element);
    // setSelected(element)
  };

  const handleOnMomentumScrollEnd = (element) => {
    // console.log('handleOnMomentumScrollEnd', element);
    // setSelected(element)
  };

  const onPress = (step) => {
    data.map((item, index) => {
      Animated.timing(item.position, {
        toValue: item.position._value + step,
        useNativeDriver: true,
        speed: 30,
        restSpeedThreshold: 10,
        bounciness: 0,
      }).start();
    });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>

      {/* <RingPickerV2 data={data} /> */}
      <RingPickerV52
        data={data}
        selectedItem={selected}
        onPress={handleOnPress}
        onMomentumScrollEnd={handleOnMomentumScrollEnd}
        size={300}
        maxToRenderPerBatch={5}
      />
    </View>
  );
}

export default App;
