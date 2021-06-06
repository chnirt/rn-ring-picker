/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {RingPicker} from './src/components/RingPicker';

const BUTTON_SIZE = 100;
const CIRCLE1_SIZE = 200;
const CIRCLE2_SIZE = 300;
const CIRCLE3_SIZE = 400;
const CIRCLE4_SIZE = 500;

const data1 = [...Array(2).keys()];
const data2 = [...Array(3).keys()];
const data3 = [...Array(5).keys()];
const data4 = [...Array(4).keys()];

const App = () => {
  const [visible1Circle, setCircle1Visible] = useState(true);
  const [visible2Circle, setCircle2Visible] = useState(true);
  const [visible3Circle, setCircle3Visible] = useState(true);
  const [visible4Circle, setCircle4Visible] = useState(true);

  const openCircle1 = () => setCircle1Visible(true);
  const closeCircle1 = () => setCircle1Visible(false);
  const openCircle2 = () => setCircle2Visible(true);
  const closeCircle2 = () => setCircle2Visible(false);
  const openCircle3 = () => setCircle3Visible(true);
  const closeCircle3 = () => setCircle3Visible(false);
  const openCircle4 = () => setCircle4Visible(true);
  const closeCircle4 = () => setCircle4Visible(false);

  const toggleCircle1 = () => {
    if (visible1Circle) {
      closeCircle1();
      closeCircle2();
      closeCircle3();
      closeCircle4();
      return;
    }
    openCircle1();
  };
  const toggleCircle2 = () => {
    if (visible2Circle) {
      closeCircle2();
      closeCircle3();
      closeCircle4();
      return;
    }
    openCircle2();
  };
  const toggleCircle3 = () => {
    if (visible3Circle) {
      closeCircle3();
      closeCircle4();
      return;
    }
    openCircle3();
  };
  const toggleCircle4 = () => {
    if (visible4Circle) {
      closeCircle4();
      return;
    }
    openCircle4();
  };
  const toggleCircle5 = () => console.log('END');

  return (
    <View style={styles.container}>
      <RingPicker
        visible={visible4Circle}
        contentContainerStyle={{
          marginBottom: BUTTON_SIZE,
        }}
        width={CIRCLE4_SIZE}
        data={data4}
        onPress={toggleCircle5}
      />
      <RingPicker
        visible={visible3Circle}
        contentContainerStyle={{
          marginBottom: BUTTON_SIZE,
        }}
        width={CIRCLE3_SIZE}
        data={data3}
        onPress={toggleCircle4}
      />
      <RingPicker
        visible={visible2Circle}
        contentContainerStyle={{
          marginBottom: BUTTON_SIZE,
        }}
        width={CIRCLE2_SIZE}
        data={data2}
        onPress={toggleCircle3}
      />
      <RingPicker
        visible={visible1Circle}
        contentContainerStyle={{
          marginBottom: BUTTON_SIZE,
        }}
        width={CIRCLE1_SIZE}
        data={data1}
        onPress={toggleCircle2}
      />
      <Pressable
        style={{
          position: 'absolute',
          flex: 1,
          bottom: -BUTTON_SIZE / 2,
          width: BUTTON_SIZE,
          aspectRatio: 1,
          borderRadius: BUTTON_SIZE / 2,
          borderColor: 'red',
          borderWidth: 10,
          marginBottom: BUTTON_SIZE,
        }}
        onPress={toggleCircle1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
