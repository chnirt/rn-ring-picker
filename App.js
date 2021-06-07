/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {StyleSheet, View, Pressable, Text} from 'react-native';
import {RingPicker} from './src/components/RingPicker';
import {ArrowSvg, CardSvg, MenuSvg} from './src/assets';
import {Neumorphism} from './src/components/Neumorphism';

const BUTTON_SIZE = 82;
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

  const renderCircle4Item = ({item, index}) => {
    return (
      <Neumorphism width={100} height={110} borderRadius={0}>
        <View style={{padding: 10}}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              borderColor: '#000',
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CardSvg />
          </View>
          <Text
            style={{
              marginTop: 10,
              color: '#31354B',
              fontSize: 15,
              fontWeight: '400',
            }}>
            Direct Payment
          </Text>
        </View>
      </Neumorphism>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: 72,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <View style={{position: 'absolute', left: 0}}>
          <Neumorphism>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ArrowSvg fill="#717588" />
            </View>
          </Neumorphism>
        </View>
        <View style={{height: 50, justifyContent: 'center'}}>
          <Text style={{color: '#31354B', fontSize: 22, fontWeight: '600'}}>
            MoneySMART
          </Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 64,
        }}>
        <Text style={{color: '#31354B', fontSize: 18, fontWeight: '600'}}>
          Provision Jar
        </Text>

        <View
          style={{
            marginTop: 20,
          }}>
          <Neumorphism
            width="100%"
            height={140}
            borderRadius={10}
            backgroundColor="#E5E6EE">
            <View
              style={{
                padding: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: '#31354B', fontSize: 15, fontWeight: '400'}}>
                Total Provision Balance
              </Text>
              <Text
                style={{
                  color: '#31354B',
                  fontSize: 44,
                  fontWeight: '600',
                  marginTop: 15,
                }}>
                $12,260
              </Text>
            </View>
          </Neumorphism>
        </View>
      </View>
      <View style={{flex: 1, alignItems: 'center', bottom: BUTTON_SIZE}}>
        <RingPicker
          visible={visible4Circle}
          width={CIRCLE4_SIZE}
          data={data4}
          onPress={toggleCircle5}
          renderItem={renderCircle4Item}
        />
        <RingPicker
          visible={visible3Circle}
          width={CIRCLE3_SIZE}
          data={data3}
          onPress={toggleCircle4}
        />
        <RingPicker
          visible={visible2Circle}
          width={CIRCLE2_SIZE}
          data={data2}
          onPress={toggleCircle3}
        />
        <RingPicker
          visible={visible1Circle}
          width={CIRCLE1_SIZE}
          data={data1}
          onPress={toggleCircle2}
        />
        <Neumorphism
          contentContainerStyles={{
            position: 'absolute',
            flex: 1,
            bottom: -BUTTON_SIZE / 2,
            borderRadius: BUTTON_SIZE / 2,
          }}
          width={BUTTON_SIZE}
          height={BUTTON_SIZE}
          borderRadius={BUTTON_SIZE / 2}
          onPress={toggleCircle1}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <MenuSvg fill="#31354B" width={32} height={25} />
          </View>
        </Neumorphism>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E5E6EE',
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default App;
