/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ImageBackground } from 'react-native';
import {
  ArrowSvg,
  BagSvg,
  BitCoinSvg,
  CardSvg,
  MenuSvg,
  HomeSvg,
  CoinSvg,
  ChartSvg,
  MoneySvg,
  UserSvg,
} from './src/assets';
import { RingPicker, CurvedText, Neumorphism } from './src/components';
import ActiveFan from './src/assets/icons/active-fan.png';
import Fan from './src/assets/icons/fan.png';
import ActiveFan1 from './src/assets/icons/active-fan1.png';
import Fan1 from './src/assets/icons/fan1.png';

const BUTTON_SIZE = 82;
const CIRCLE1_SIZE = 190;
const CIRCLE2_SIZE = 330;
const CIRCLE3_SIZE = 550;

const data1 = [
  { id: 'data1-1', label: 'Home', icon: HomeSvg },
  { id: 'data1-2', label: 'Wealth', icon: CoinSvg },
  { id: 'data1-3', label: 'MoneySmart', icon: ChartSvg },
  { id: 'data1-4', label: 'Financial', icon: MoneySvg },
  { id: 'data1-5', label: 'Personal Goals', icon: UserSvg },
];
const data2 = [
  { id: 'data2-1', label: 'WealthCLOCK Snapshot' },
  { id: 'data2-2', label: 'WealthSPEED Snapshot' },
  { id: 'data2-3', label: 'XXXXXXXXXXXXXXXX' },
  { id: 'data2-4', label: 'XXXXXXXXXXXXXXXX' },
  { id: 'data2-5', label: 'Financial Wellbeing Status' },
];
const data3 = [...Array(12).keys()].map((item, index) => {
  if (index === 0) {
    return {
      id: `data3-${item}`,
      label: 'Direct Payment',
      icon: BitCoinSvg,
      color: '#3DB054',
    };
  }
  if (index === 11) {
    return {
      id: `data3-${item}`,
      label: 'Primary Accounts',
      icon: BagSvg,
      color: '#FD7622',
    };
  }
  return {
    id: `data3-${item}`,
    label: 'Credit Card Jars',
    icon: CardSvg,
    color: '#0861D5',
  };
});

const App = () => {
  const [visible, setVisible] = useState(false);
  const [key1, setKey1] = useState();
  const [key2, setKey2] = useState();
  const [key3, setKey3] = useState();

  const handlePress = () => {
    if (visible) {
      setKey1(null);
      setKey2(null);
      setKey3(null);
      setVisible(false);
      return;
    }
    setVisible(true);
  };
  const toggleCircle1 = (item) => {
    if (key1) {
      setKey1(null);
      setKey2(null);
      setKey3(null);
      return;
    }
    setKey1(item.id);
  };
  const toggleCircle2 = (item) => {
    if (key2) {
      setKey2(null);
      setKey3(null);
      return;
    }
    setKey2(item.id);
  };
  const toggleCircle3 = (item) => {
    if (key3) {
      setKey3(null);
      return;
    }
    setKey3(item.id);
  };

  const handleBack = () => console.log('BACK');

  const renderCircle1Item = ({ item }) => {
    return (
      <ImageBackground
        style={{
          width: 150,
          height: 90,
          resizeMode: 'cover', // or 'stretch'
          justifyContent: 'center',
          alignItems: 'center',
        }}
        source={key1 === item.id ? ActiveFan : Fan}>
        <CurvedText
          style={{
            position: 'absolute',
            top: 0,
          }}
          fill={key1 === item.id ? '#FFFFFF' : '#31354B'}
          width={CIRCLE1_SIZE}
          height={CIRCLE1_SIZE}
          fontSize={12}>
          {item?.label}
        </CurvedText>
        <View style={{ marginTop: 5 }}>
          <item.icon fill={key1 === item.id ? '#FFFFFF' : '#31354B'} />
        </View>
      </ImageBackground>
    );
  };

  const renderCircle2Item = ({ item }) => {
    return (
      <ImageBackground
        style={{
          width: 218,
          height: 63,
          resizeMode: 'cover', // or 'stretch'
          justifyContent: 'center',
          alignItems: 'center',
        }}
        source={key2 === item.id ? ActiveFan1 : Fan1}>
        <CurvedText
          style={{
            position: 'absolute',
            top: -70 / 2,
          }}
          fill={key2 === item.id ? '#FFFFFF' : '#31354B'}
          width={CIRCLE2_SIZE + 70}
          height={CIRCLE2_SIZE + 70}
          fontSize={12}>
          {item?.label}
        </CurvedText>
      </ImageBackground>
    );
  };

  const renderCircle3Item = ({ item }) => {
    return (
      <Neumorphism
        backgroundColor={key3 === item.id ? '#FD8C25' : '#E5E6EE'}
        width={100}
        height={110}
        borderRadius={12}
        borderWidth={0}>
        <View style={{ padding: 10 }}>
          <Neumorphism
            type="inset"
            width={36}
            height={36}
            borderRadius={10}
            borderWidth={0.5}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <item.icon fill={item.color} width={20} height={20} />
            </View>
          </Neumorphism>
          <Text
            style={{
              marginTop: 10,
              color: key3 === item.id ? '#FFFFFF' : '#31354B',
              fontSize: 15,
              fontWeight: '400',
            }}>
            {item?.label}
          </Text>
        </View>
      </Neumorphism>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <Pressable onPress={handleBack}>
            <Neumorphism>
              <View style={styles.backSvgContainer}>
                <ArrowSvg fill="#717588" width={20} height={20} />
              </View>
            </Neumorphism>
          </Pressable>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>MoneySMART</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.bodyTitleText}>Provision Jar</Text>

        <View style={styles.cardContainer}>
          <Neumorphism
            width="100%"
            height={140}
            borderRadius={10}
            backgroundColor="#E5E6EE"
            borderWidth={0}>
            <View style={styles.infoCardContainer}>
              <Text style={styles.cardTitleText}>Total Provision Balance</Text>
              <Text style={styles.cardCurrencyText}>$12,260</Text>
            </View>
          </Neumorphism>
        </View>
      </View>

      <View style={styles.ringPickerContainer}>
        <RingPicker
          visible={key2}
          width={CIRCLE3_SIZE}
          data={data3}
          onPress={toggleCircle3}
          renderItem={renderCircle3Item}
        />
        <RingPicker
          visible={key1}
          width={CIRCLE2_SIZE}
          data={data2}
          onPress={toggleCircle2}
          renderItem={renderCircle2Item}
        />
        <RingPicker
          visible={visible}
          width={CIRCLE1_SIZE}
          data={data1}
          onPress={toggleCircle1}
          renderItem={renderCircle1Item}
        />
        <Pressable style={styles.menuButton} onPress={handlePress}>
          <Neumorphism
            width={BUTTON_SIZE}
            height={BUTTON_SIZE}
            borderRadius={BUTTON_SIZE / 2}
            borderWidth={visible ? 1 : 0}>
            <View style={styles.menuSvgContainer}>
              <View
                style={[styles.smallMenuSVGContainer, {
                  backgroundColor: visible ? '#FD571F' : 'transparent',
                  borderColor: visible ? '#CE471970' : 'transparent',
                }]}>
                <MenuSvg
                  fill={visible ? '#FFFFFF' : '#31354B'}
                  width={32}
                  height={25}
                />
              </View>
            </View>
          </Neumorphism>
        </Pressable>
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
  header: {
    marginTop: 72,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  backButtonContainer: { position: 'absolute', left: 0 },
  backSvgContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: { height: 50, justifyContent: 'center' },
  titleText: { color: '#31354B', fontSize: 22, fontWeight: '600' },
  body: {
    marginTop: 64,
  },
  bodyTitleText: { color: '#31354B', fontSize: 18, fontWeight: '600' },
  cardContainer: {
    marginTop: 20,
  },
  infoCardContainer: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitleText: { color: '#31354B', fontSize: 15, fontWeight: '400' },
  cardCurrencyText: {
    color: '#31354B',
    fontSize: 44,
    fontWeight: '600',
    marginTop: 15,
  },
  ringPickerContainer: { flex: 1, alignItems: 'center', bottom: 70 },
  menuButton: {
    position: 'absolute',
    flex: 1,
    bottom: -BUTTON_SIZE / 2,
    borderRadius: BUTTON_SIZE / 2,
  },
  menuSvgContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  smallMenuSVGContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
  }
});

export default App;
