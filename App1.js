import React from 'react';
import {View} from 'react-native';
import {RingPickerV2, RingPickerV3} from './src/components';
import RNRingPicker from './src/components/RNRingPicker/sample';

const data = [...Array(12).keys()].map((element, index) => ({
  id: index,
  label: element,
}));

function App() {
  const handleOnPress = (element) => {
    console.log('handleOnPress', element);
  };

  const handleOnMomentumScrollEnd = (element) => {
    console.log('handleOnMomentumScrollEnd', element);
  };

  return (
    <View
      style={{
        flex: 1,
        // justifyContent: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        // bottom: -400 / 3,
      }}>
      {/* <RingPickerV2
        size={400}
        data={data}
        onPress={handleOnPress}
        onMomentumScrollEnd={handleOnMomentumScrollEnd}
      /> */}
      <RNRingPicker />
      <RingPickerV3
        data={data}
        onPress={handleOnPress}
        onMomentumScrollEnd={handleOnMomentumScrollEnd}
      />
    </View>
  );
}

export default App;
