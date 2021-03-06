import React, { useRef, useEffect } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const RADIUS = 100;

export function RingPicker({
  visible = false,
  width = RADIUS,
  contentContainerStyle,
  data = [],
  onPress = () => { },
  renderItem,
  children,
}) {
  const length = data.length;
  const degreePerItem = 360 / length;
  const degreeLimit = degreePerItem * (length - 1);
  const moveLimit = width * (length - 1);

  const pan = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    reset();
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
        // console.log('onPanResponderMove', pan.x._value);
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 })
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        // console.log(
        //   'onPanResponderMove',
        //   pan.x._value,
        //   JSON.stringify(gestureState, null, 2),
        // );
        pan.setValue({
          x: gestureState.dx,
          y: gestureState.dy,
        });
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        // console.log('onPanResponderRelease');
        pan.flattenOffset();
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    }),
  ).current;

  function toRadians(angle) {
    return angle * (Math.PI / 180);
  }

  function reset() {
    pan.setValue({ x: 0, y: 0 });
  }

  if (!visible) return null;

  return (
    <View
      style={[
        styles.container,
        {
          bottom: -width / 2,
        },
        contentContainerStyle,
      ]}
      {...panResponder.panHandlers}>
      <Animated.View
        style={[
          styles.box,
          { width, borderRadius: width },
          {
            transform: [
              {
                rotate: pan.x.interpolate({
                  inputRange: [-moveLimit, 0, moveLimit],
                  outputRange: [
                    `-${degreeLimit}deg`,
                    '0deg',
                    `${degreeLimit}deg`,
                  ],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}>
        {data.length > 0 &&
          data.map((item, index) => {
            const transformStyle = {
              1: [
                {
                  translateY: index === 0 ? -width / 2 : 0,
                },
              ],
              2: [
                {
                  translateY: index === 0 ? -width / 2 : 0,
                },
                {
                  translateY: index === 1 ? width / 2 : 0,
                },
              ],
              3: [
                {
                  translateY: index === 0 ? -width / 2 : 0,
                },
                {
                  translateX:
                    index === 1
                      ? (Math.cos(toRadians(degreePerItem - 90)) * width) / 2
                      : 0,
                },
                {
                  translateY:
                    index === 1
                      ? (Math.sin(toRadians(degreePerItem - 90)) * width) / 2
                      : 0,
                },
                {
                  translateX:
                    index === length - 1
                      ? -(Math.cos(toRadians(degreePerItem - 90)) * width) / 2
                      : 0,
                },
                {
                  translateY:
                    index === length - 1
                      ? (Math.sin(toRadians(degreePerItem - 90)) * width) / 2
                      : 0,
                },
              ],
              4: [
                {
                  translateY: index === 0 ? -width / 2 : 0,
                },
                {
                  translateX: index === 1 ? width / 2 : 0,
                },
                {
                  translateY: index === 2 ? width / 2 : 0,
                },
                {
                  translateX: index === 3 ? -width / 2 : 0,
                },
              ],
              5: [
                {
                  translateY: index === 0 ? -width / 2 : 0,
                },
                {
                  translateX:
                    index === 1
                      ? (Math.cos(toRadians(degreePerItem - 90)) * width) / 2
                      : 0,
                },
                {
                  translateY:
                    index === 1
                      ? (Math.sin(toRadians(degreePerItem - 90)) * width) / 2
                      : 0,
                },
                {
                  translateX:
                    index === 4
                      ? -(Math.cos(toRadians(degreePerItem - 90)) * width) / 2
                      : 0,
                },
                {
                  translateY:
                    index === 4
                      ? (Math.sin(toRadians(degreePerItem - 90)) * width) / 2
                      : 0,
                },
                {
                  translateX:
                    index === 2
                      ? (Math.cos(toRadians(degreePerItem * 2 - 90)) * width) /
                      2
                      : 0,
                },
                {
                  translateY:
                    index === 2
                      ? (Math.sin(toRadians(degreePerItem * 2 - 90)) * width) /
                      2
                      : 0,
                },
                {
                  translateX:
                    index === 3
                      ? -(Math.cos(toRadians(degreePerItem * 2 - 90)) * width) /
                      2
                      : 0,
                },
                {
                  translateY:
                    index === 3
                      ? (Math.sin(toRadians(degreePerItem * 2 - 90)) * width) /
                      2
                      : 0,
                },
              ],
              12: [
                {
                  translateY: index === 0 ? -width / 2 : 0,
                },
                {
                  translateX:
                    index === 1
                      ? (Math.cos(toRadians(degreePerItem - 90)) * width) / 2
                      : 0,
                },
                {
                  translateY:
                    index === 1
                      ? (Math.sin(toRadians(degreePerItem - 90)) * width) / 2
                      : 0,
                },
                {
                  translateX:
                    index === length - 1
                      ? -(Math.cos(toRadians(degreePerItem - 90)) * width) / 2
                      : 0,
                },
                {
                  translateY:
                    index === length - 1
                      ? (Math.sin(toRadians(degreePerItem - 90)) * width) / 2
                      : 0,
                },
                {
                  translateX:
                    index === 2
                      ? (Math.cos(toRadians(degreePerItem * 2 - 90)) * width) /
                      2
                      : 0,
                },
                {
                  translateY:
                    index === 2
                      ? (Math.sin(toRadians(degreePerItem * 2 - 90)) * width) /
                      2
                      : 0,
                },
                {
                  translateX:
                    index === length - 2
                      ? -(Math.cos(toRadians(degreePerItem * 2 - 90)) * width) /
                      2
                      : 0,
                },
                {
                  translateY:
                    index === length - 2
                      ? (Math.sin(toRadians(degreePerItem * 2 - 90)) * width) /
                      2
                      : 0,
                },
                {
                  translateX:
                    index === 3
                      ? (Math.cos(toRadians(degreePerItem * 3 - 90)) * width) /
                      2
                      : 0,
                },
                {
                  translateY:
                    index === 3
                      ? (Math.sin(toRadians(degreePerItem * 3 - 90)) * width) /
                      2
                      : 0,
                },
                {
                  translateX:
                    index === length - 3
                      ? -(Math.cos(toRadians(degreePerItem * 3 - 90)) * width) /
                      2
                      : 0,
                },
                {
                  translateY:
                    index === length - 3
                      ? (Math.sin(toRadians(degreePerItem * 3 - 90)) * width) /
                      2
                      : 0,
                },
                {
                  translateX:
                    index === 4
                      ? (Math.cos(toRadians(degreePerItem * 4 - 90)) * width) /
                      2
                      : 0,
                },
                {
                  translateY:
                    index === 4
                      ? (Math.sin(toRadians(degreePerItem * 4 - 90)) * width) /
                      2
                      : 0,
                },
                {
                  translateX:
                    index === length - 4
                      ? -(Math.cos(toRadians(degreePerItem * 4 - 90)) * width) /
                      2
                      : 0,
                },
                {
                  translateY:
                    index === length - 4
                      ? (Math.sin(toRadians(degreePerItem * 4 - 90)) * width) /
                      2
                      : 0,
                },
                {
                  translateX:
                    index === 5
                      ? (Math.cos(toRadians(degreePerItem * 5 - 90)) * width) /
                      2
                      : 0,
                },
                {
                  translateY:
                    index === 5
                      ? (Math.sin(toRadians(degreePerItem * 5 - 90)) * width) /
                      2
                      : 0,
                },
                {
                  translateX:
                    index === length - 5
                      ? -(Math.cos(toRadians(degreePerItem * 5 - 90)) * width) /
                      2
                      : 0,
                },
                {
                  translateY:
                    index === length - 5
                      ? (Math.sin(toRadians(degreePerItem * 5 - 90)) * width) /
                      2
                      : 0,
                },
                {
                  translateY: index === 6 ? width / 2 : 0,
                },
              ],
            };

            return (
              <Pressable
                key={index}
                style={[styles.button, {

                  transform: [
                    ...transformStyle[length],
                    {
                      rotate: `${degreePerItem * index}deg`,
                    },
                  ],
                }]}
                onPress={() => onPress(item)}>
                {typeof renderItem == 'function' ? (
                  renderItem({ item, index })
                ) : (
                  <Text>{item?.label}</Text>
                )}
              </Pressable>
            );
          })}
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: RADIUS / 2,
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  box: {
    width: RADIUS * 2,
    aspectRatio: 1,
    borderRadius: RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
  }
});
