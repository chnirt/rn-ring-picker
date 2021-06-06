import React, {useRef, useState} from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const RADIUS = 100;
const buttons = [Array(5).keys()];

export function RingPicker({
  visible,
  width = RADIUS,
  contentContainerStyle,
  data = [],
  onPress = () => {},
  children,
}) {
  const pan1 = useRef(new Animated.ValueXY()).current;

  // const pan = useRef(new Animated.Value(0)).current;

  function getDegree(anchor, point, type = 'right') {
    const directions = {
      right: 0,
      top: 90,
      left: 180,
      bottom: 270,
    };
    const dy = anchor.y - point.y;
    const dx = anchor.x - point.x;
    const angle = Math.atan2(dy, dx);
    const degree = (angle * 180) / Math.PI + 180;

    return degree;
  }

  const panResponder = useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      // onMoveShouldSetPanResponder: (evt, gestureState) => true,
      // onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
        console.log('onPanResponderMove');
        console.log(
          'Location',
          evt.nativeEvent.locationX,
          evt.nativeEvent.locationY,
        );
        console.log('Move', gestureState.moveX, gestureState.moveY);
        console.log('D', gestureState.dx, gestureState.dy);
        // const anchor = {
        //   x: evt.nativeEvent.locationX,
        //   y: evt.nativeEvent.locationY,
        // };
        // const point = {
        //   x: RADIUS,
        //   y: RADIUS,
        // };
        // const degree = getDegree(anchor, point);
        // console.log('Degree', degree);
        // pan.setOffset(degree + 75);
        pan1.setOffset({
          x: pan1.x._value,
          y: pan1.y._value,
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        // pan.setValue({
        //   x: gestureState.dx,
        //   y: gestureState.dy,
        // });
        console.log('onPanResponderMove');
        // console.log(
        //   'Location',
        //   evt.nativeEvent.locationX,
        //   evt.nativeEvent.locationY,
        // );
        // console.log('Move', gestureState.moveX, gestureState.moveY);
        // console.log('D', gestureState.dx, gestureState.dy);
        // const anchor = {
        //   x: evt.nativeEvent.locationX,
        //   y: evt.nativeEvent.locationY,
        // };
        // const point = {
        //   x: RADIUS,
        //   y: RADIUS,
        // };
        // const degree = getDegree(anchor, point);
        // console.log('Degree', Math.round(degree));
        // pan.setValue(degree);
        pan1.setValue({
          x: gestureState.dx,
          y: gestureState.dy,
        });
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        console.log('onPanResponderRelease');
        // pan.flattenOffset();
        pan1.flattenOffset();
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
          {width, borderRadius: width},
          {
            transform: [
              {
                rotate: pan1.x.interpolate({
                  inputRange: [-width * 2, 0, width * 2],
                  outputRange: ['-180deg', '0deg', '180deg'],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}>
        {data.length > 0 &&
          data.map((item, index) => {
            const length = data.length;
            const degreePerItem = 360 / length;
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
                    index === 2
                      ? -(Math.cos(toRadians(degreePerItem - 90)) * width) / 2
                      : 0,
                },
                {
                  translateY:
                    index === 2
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
            };
            return (
              <Pressable
                key={index}
                style={{
                  position: 'absolute',
                  borderColor: 'blue',
                  borderWidth: 1,
                  transform: [
                    ...transformStyle[length],
                    {
                      rotate: `${degreePerItem * index}deg`,
                    },
                  ],
                }}
                onPress={onPress}>
                <Text>{item}</Text>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
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
    borderTopColor: 'red',
    borderRightColor: 'orange',
    borderLeftColor: 'pink',
    borderBottomColor: 'purple',
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
