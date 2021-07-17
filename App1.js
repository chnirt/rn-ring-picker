import React from 'react';
import {View} from 'react-native';
import {RingPickerV2} from './src/components';

const data = [...Array(5).keys()].map((element, index) => ({
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
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <RingPickerV2
        size={400}
        data={data}
        onPress={handleOnPress}
        onMomentumScrollEnd={handleOnMomentumScrollEnd}
      />
    </View>
  );
}

export default App;
