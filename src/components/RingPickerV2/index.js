import React, {useRef, useState} from 'react';
import {View, Text, Pressable, Animated, PanResponder} from 'react-native';

export function RingPickerV2({
  data = [],
  size = 200,
  elementSize = 50,
  rect = 'top',
  onPress = () => {},
  onMomentumScrollEnd = () => {},
}) {
  const rects = {
    top: 'top',
    right: 'left',
    left: 'right',
    bottom: 'bottom',
  };
  const deltaTheta = 360 / data.length;
  const pxPerDeg = 200 / 120;
  const pan = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // console.log('onPanResponderGrant');
        pan.setOffset(pan._value);
        pan.setValue(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        // console.log('onPanResponderMove');
        const {dx} = gestureState;
        pan.setValue(dx);
      },
      onPanResponderRelease: (evt, gestureState) => {
        // console.log('onPanResponderRelease');
        const {dx} = gestureState;
        pan.flattenOffset();
        const ithCircleValue = getIthCircleValue(dx, pan);
        const element = data[findIndexByIth(ithCircleValue)];
        onMomentumScrollEnd(element);
        Animated.spring(pan, {
          toValue: ithCircleValue,
          friction: 5,
          tension: 10,
          useNativeDriver: false,
        }).start(() => {
          simplifyOffset(pan);
        });
      },
    }),
  ).current;
  const [prevStep, setPrevStep] = useState(0);

  function findIndexByIth(ith) {
    const start = ith / pxPerDeg / deltaTheta;
    const index = data.findIndex(
      (_, index) => index === (start <= 0 ? -start : data.length - start),
    );
    return index;
  }

  function simplifyOffset(anim) {
    if (anim._value + anim._offset >= 600) anim.setOffset(anim._offset - 600);
    if (anim._value + anim._offset <= -600) anim.setOffset(anim._offset + 600);
  }

  function getIthCircleValue(dx, deltaAnim) {
    const selectedCircle = Math.round(
      (deltaAnim._value + deltaAnim._offset) / (600 / data.length),
    );
    return (selectedCircle * 600) / data.length;
  }
  if (data.length === 0) {
    return null;
  }

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [
          {
            rotate: pan.interpolate({
              inputRange: [-200, 0, 200],
              outputRange: ['-120deg', '0deg', '120deg'],
            }),
          },
        ],
      }}
      {...panResponder.panHandlers}>
      {data.map((element, index) => {
        return (
          <View
            key={index}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              transform: [
                {
                  rotate: `${deltaTheta * index}deg`,
                },
              ],
            }}>
            <Pressable
              style={{
                position: 'absolute',
                [rects[rect]]: -size / 2,
                borderColor: 'orange',
                borderWidth: 1,
                height: elementSize,
                width: elementSize,
                borderRadius: elementSize / 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                const ithCircleValue = -index * deltaTheta * pxPerDeg;
                // const ithCircleValue = getIthCircleValue(0, pan);
                // const isFirst = index === 0;
                // const isLast = index === data.length - 1;
                // setPrevStep(index);
                // // if (index > data.length / 2) {
                // //   console.log('>');
                // // } else {
                // //   console.log('<');
                // // }
                // console.log(index, ithCircleValue, deltaTheta * pxPerDeg);
                // if (isFirst) {
                //   pan.setValue(0);
                //   if (prevStep === 1) {
                //     return;

                //     // console.log(
                //     //   'prevStep === 1👾',
                //     //   index,
                //     //   ithCircleValue,
                //     //   deltaTheta * pxPerDeg,
                //     // );
                //     // Animated.timing(pan, {
                //     //   toValue: 0,
                //     //   useNativeDriver: false,
                //     // }).start(() => {
                //     //   // pan.setValue(0);
                //     // });
                //     // return;
                //   }
                //   // pan.setValue(0);
                //   return;
                //   //   // console.log(
                //   //   //   'prevStep !== 1👾',
                //   //   //   index,
                //   //   //   ithCircleValue,
                //   //   //   deltaTheta * pxPerDeg,
                //   //   // );
                //   //   Animated.timing(pan, {
                //   //     toValue: -600,
                //   //     useNativeDriver: false,
                //   //   }).start(() => {
                //   //     pan.setValue(0);
                //   //   });
                //   //   return;
                // }
                // if (isLast && prevStep === 0) {
                //   pan.setValue(-550);
                //   // return;
                //   //   // console.log(
                //   //   //   'index === data.length - 1 && prevStep === 0👾',
                //   //   //   index,
                //   //   //   ithCircleValue,
                //   //   //   deltaTheta * pxPerDeg,
                //   //   // );
                //   //   Animated.timing(pan, {
                //   //     toValue: deltaTheta * pxPerDeg,
                //   //     useNativeDriver: false,
                //   //   }).start(() => {
                //   //     pan.setValue(ithCircleValue);
                //   //   });
                //   //   return;
                // }
                Animated.timing(pan, {
                  toValue: ithCircleValue,
                  useNativeDriver: false,
                }).start(() => {
                  simplifyOffset(pan);
                });
                onPress(element);
              }}>
              <Text>{element?.label}</Text>
            </Pressable>
          </View>
        );
      })}
    </Animated.View>
  );
}
