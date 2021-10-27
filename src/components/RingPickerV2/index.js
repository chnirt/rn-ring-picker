import React, { useRef, useState } from 'react';
import { View, Text, Pressable, Animated, PanResponder } from 'react-native';

export function RingPickerV2({
  data = [],
  size = 200,
  elementSize = 50,
  rect = 'top',
  onPress = () => { },
  onMomentumScrollEnd = () => { },
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
        // pan.setValue(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        // console.log(
        //   'onPanResponderMove',
        //   JSON.stringify(gestureState, null, 2),
        // );
        const { dx, dy } = gestureState;
        pan.setValue(dx);
      },
      onPanResponderRelease: (evt, gestureState) => {
        // console.log('onPanResponderRelease');
        const { dx, vx } = gestureState;
        pan.flattenOffset();
        // const ithCircleValue = getIthCircleValue(dx, pan);
        // const element = data[findIndexByIth(ithCircleValue)];
        // onMomentumScrollEnd(element);
        // Animated.spring(pan, {
        //   toValue: ithCircleValue,
        //   friction: 5,
        //   tension: 10,
        //   useNativeDriver: false,
        // }).start(() => {
        //   // console.log('ithCircleValue', ithCircleValue);
        //   simplifyOffset(pan);
        // });

        Animated.spring(pan, {
          toValue: handlerValue(dx, vx)
        }).start(() => simplifyOffset(pan));
      },
    }),
  ).current;
  const viewRef = useRef();
  const XY_AXES_COORDINATESRef = useRef({
    X: 0,
    Y: 0,
    PAGE_Y: 0,
    PAGE_X: 0,
  });
  const [prevStep, setPrevStep] = useState(0);

  function findIndexByIth(ith) {
    const start = ith / pxPerDeg / deltaTheta;
    const index = data.findIndex(
      (_, index) => index === (start <= 0 ? -start : data.length - start),
    );
    return index;
  }

  const handlerValue = (dx, vx) => Math.abs(dx) > size / 8 || Math.abs(vx) > 1.3 ? getAmountForNextSlice(dx, pan._offset) : snapOffset(pan._offset);
  const snapOffset = (offset) => { return Math.round(offset / (600 / data.length)) * 600 / data.length; }
  function getAmountForNextSlice(dx, offset) {
    // This just rounds to the nearest 200 to snap the circle to the correct thirds
    const snappedOffset = snapOffset(offset);
    // Depending on the direction, we either add 200 or subtract 200 to calculate new offset position.
    const newOffset = dx > 0 ? snappedOffset + 200 : snappedOffset - 200;
    return newOffset;
  };


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

  function getIthCircleValueByIndex(index) {
    const selectedCircle = Math.round(index / (600 / data.length));
    return (selectedCircle * 600) / data.length;
  }

  function defineAxesCoordinatesOnLayoutDisplacement() {
    viewRef.current.measure((x, y, width, height, pageX, pageY) => {
      XY_AXES_COORDINATESRef.current = {
        X: pageX + width / 2,
        Y: pageY + height / 2,
        PAGE_Y: pageY,
        PAGE_X: pageX,
      };
    });
  }

  if (data.length === 0) {
    return null;
  }

  return (
    <Animated.View
      ref={viewRef}
      onLayout={defineAxesCoordinatesOnLayoutDisplacement}
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
                // const ithCircleValue = -index * deltaTheta * pxPerDeg;
                // Animated.timing(pan, {
                //   toValue: ithCircleValue,
                //   useNativeDriver: false,
                // }).start(() => {
                //   simplifyOffset(pan);
                // });
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
