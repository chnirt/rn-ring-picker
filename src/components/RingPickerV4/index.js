import React, {useRef, useState} from 'react';
import {View, Animated, PanResponder, Pressable, Text} from 'react-native';
import {debounce} from 'lodash';

export function RingPickerV4({
  data = [],
  size = 200,
  elementSize = 50,
  rect = 'top',
  maxToRenderPerBatch = 5,
  onPress = () => {},
  onMomentumScrollEnd = () => {},
}) {
  const cloneData = data.slice(0, maxToRenderPerBatch);
  const [newData, setNewData] = useState(cloneData);
  this.GIRTH_ANGLE = 120;
  const rects = {
    top: 'top',
    right: 'left',
    left: 'right',
    bottom: 'bottom',
  };
  const deltaTheta = 360 / maxToRenderPerBatch;

  // 2*π*r / 360
  const STEP_LENGTH_TO_1_ANGLERef = useRef(1);

  const pxPerDeg = (this.GIRTH_ANGLE * STEP_LENGTH_TO_1_ANGLERef.current) / 120;

  this.DIRECTIONS = {
    CLOCKWISE: 'CLOCKWISE',
    COUNTERCLOCKWISE: 'COUNTERCLOCKWISE',
  };

  this.CIRCLE_SECTIONS = {
    TOP_LEFT: 'TOP_LEFT',
    TOP_RIGHT: 'TOP_RIGHT',
    BOTTOM_LEFT: 'BOTTOM_LEFT',
    BOTTOM_RIGHT: 'BOTTOM_RIGHT',
  };

  const CURRENT_CIRCLE_SECTIONRef = useRef(0);
  const CURRENT_DIRECTIONRef = useRef(null);
  const CURRENT_VECTOR_DIFFERENCE_LENGTHRef = useRef(0);

  const PREVIOUS_POSITIONRef = useRef({
    X: 0,
    Y: 0,
  });
  const XY_AXES_COORDINATESRef = useRef({
    X: 0,
    Y: 0,
    PAGE_Y: 0,
    PAGE_X: 0,
  });
  const ICON_PATH_RADIUSRef = useRef(0);
  const wheelNavigatorRef = useRef();
  const pan = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // console.log('onPanResponderGrant');
        setPreviousDifferenceLengths(0, 0);
        pan.setValue(pan._value);
        pan.setValue(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        // console.log('onPanResponderMove');
        defineCurrentSection(gestureState.moveX, gestureState.moveY);
        checkPreviousDifferenceLengths(gestureState.dx, gestureState.dy);
        pan.setValue(CURRENT_VECTOR_DIFFERENCE_LENGTHRef.current);
      },
      onPanResponderRelease: (evt, gestureState) => {
        // console.log('onPanResponderRelease');
        pan.flattenOffset();
        const ithCircleValue = getIthCircleValue(pan);
        const element = newData.find(
          (_, index) => index === findIndexByIth(ithCircleValue),
        );
        Animated.spring(pan, {
          toValue: ithCircleValue,
          friction: 5,
          tension: 10,
          useNativeDriver: false,
        }).start(() => {
          // const newIndex = data.findIndex(
          //   (item) => item.label === element.label,
          // );
          // const cloneData = data.slice(
          //   newIndex,
          //   newIndex + maxToRenderPerBatch,
          // );
          // setNewData(cloneData);
          onMomentumScrollEnd(element);
          simplifyOffset(pan);
        });
      },
    }),
  ).current;

  function defineCurrentSection(x, y) {
    let yAxis = y < XY_AXES_COORDINATESRef.current.Y ? 'TOP' : 'BOTTOM';
    let xAxis = x < XY_AXES_COORDINATESRef.current.X ? 'LEFT' : 'RIGHT';
    CURRENT_CIRCLE_SECTIONRef.current =
      this.CIRCLE_SECTIONS[`${yAxis}_${xAxis}`];
  }

  function checkPreviousDifferenceLengths(x, y) {
    if (CURRENT_CIRCLE_SECTIONRef.current === null) {
      return;
    }

    let differenceX = x - PREVIOUS_POSITIONRef.current.X;
    let differenceY = y - PREVIOUS_POSITIONRef.current.Y;

    let getCurrentDirectionForYForLeftHemisphere = (diffY) => {
      if (diffY < 0) {
        return this.DIRECTIONS.CLOCKWISE;
      }
      if (diffY > 0) {
        return this.DIRECTIONS.COUNTERCLOCKWISE;
      }
    };

    let getCurrentDirectionForXForTopHemisphere = (diffX) => {
      if (diffX < 0) {
        return this.DIRECTIONS.COUNTERCLOCKWISE;
      }
      if (diffX > 0) {
        return this.DIRECTIONS.CLOCKWISE;
      }
    };

    let getCurrentDirectionForYForRightHemisphere = (diffY) => {
      if (diffY < 0) {
        return this.DIRECTIONS.COUNTERCLOCKWISE;
      }
      if (diffY > 0) {
        return this.DIRECTIONS.CLOCKWISE;
      }
    };

    let getCurrentDirectionForXForBottomHemisphere = (diffX) => {
      if (diffX < 0) {
        return this.DIRECTIONS.CLOCKWISE;
      }
      if (diffX > 0) {
        return this.DIRECTIONS.COUNTERCLOCKWISE;
      }
    };

    function getCurrentDirectionForTopLeftQuadrant(diffX, diffY) {
      if (diffX === 0) {
        return getCurrentDirectionForYForLeftHemisphere(diffY);
      }
      return getCurrentDirectionForXForTopHemisphere(diffX);
    }

    function getCurrentDirectionForTopRightQuadrant(diffX, diffY) {
      if (diffX === 0) {
        return getCurrentDirectionForYForRightHemisphere(diffY);
      }
      return getCurrentDirectionForXForTopHemisphere(diffX);
    }

    function getCurrentDirectionForBottomLeftQuadrant(diffX, diffY) {
      if (diffX === 0) {
        return getCurrentDirectionForYForLeftHemisphere(diffY);
      }
      return getCurrentDirectionForXForBottomHemisphere(diffX);
    }

    function getCurrentDirectionForBottomRightQuadrant(diffX, diffY) {
      if (diffX === 0) {
        return getCurrentDirectionForYForRightHemisphere(diffY);
      }
      return getCurrentDirectionForXForBottomHemisphere(diffX);
    }

    switch (CURRENT_CIRCLE_SECTIONRef.current) {
      case this.CIRCLE_SECTIONS.TOP_LEFT:
        CURRENT_DIRECTIONRef.current = getCurrentDirectionForTopLeftQuadrant(
          differenceX,
          differenceY,
        );
        break;
      case this.CIRCLE_SECTIONS.TOP_RIGHT:
        CURRENT_DIRECTIONRef.current = getCurrentDirectionForTopRightQuadrant(
          differenceX,
          differenceY,
        );
        break;
      case this.CIRCLE_SECTIONS.BOTTOM_LEFT:
        CURRENT_DIRECTIONRef.current = getCurrentDirectionForBottomLeftQuadrant(
          differenceX,
          differenceY,
        );
        break;
      case this.CIRCLE_SECTIONS.BOTTOM_RIGHT:
        CURRENT_DIRECTIONRef.current =
          getCurrentDirectionForBottomRightQuadrant(differenceX, differenceY);
        break;
    }

    setAdditiveMovementLength(differenceX, differenceY);
    setPreviousDifferenceLengths(x, y);
  }

  function setAdditiveMovementLength(x, y) {
    let absoluteHypotenuseLength = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

    if (CURRENT_DIRECTIONRef.current === this.DIRECTIONS.CLOCKWISE) {
      CURRENT_VECTOR_DIFFERENCE_LENGTHRef.current += absoluteHypotenuseLength;
    }

    if (CURRENT_DIRECTIONRef.current === this.DIRECTIONS.COUNTERCLOCKWISE) {
      CURRENT_VECTOR_DIFFERENCE_LENGTHRef.current -= absoluteHypotenuseLength;
    }
  }

  function setPreviousDifferenceLengths(x, y) {
    PREVIOUS_POSITIONRef.current = {
      X: x,
      Y: y,
    };
  }

  function defineAxesCoordinatesOnLayoutDisplacement() {
    wheelNavigatorRef.current.measure((x, y, width, height, pageX, pageY) => {
      ICON_PATH_RADIUSRef.current = height / 2;
      XY_AXES_COORDINATESRef.current = {
        X: pageX + width / 2,
        Y: pageY + height / 2,
        PAGE_Y: pageY,
        PAGE_X: pageX,
      };
      STEP_LENGTH_TO_1_ANGLERef.current =
        (2 * Math.PI * ICON_PATH_RADIUSRef.current) / 360;
    });
  }

  function getIthCircleValue(deltaAnim) {
    const selectedCircle = Math.round(
      (deltaAnim._value + deltaAnim._offset) / deltaTheta,
    );
    return selectedCircle * deltaTheta;
  }

  function findIndexByIth(ith) {
    if (ith >= 360 || ith <= -360) {
      ith = ith % 360;
    }
    const start = ith / pxPerDeg / deltaTheta;
    const index = data.findIndex(
      (_, index) =>
        index === (start <= 0 ? -start : maxToRenderPerBatch - start),
    );
    return index;
  }

  function simplifyOffset(anim) {
    if (anim._value + anim._offset >= STEP_LENGTH_TO_1_ANGLERef.current)
      anim.setOffset(anim._offset - STEP_LENGTH_TO_1_ANGLERef.current);
    if (anim._value + anim._offset <= -STEP_LENGTH_TO_1_ANGLERef.current)
      anim.setOffset(anim._offset + STEP_LENGTH_TO_1_ANGLERef.current);
  }

  function rotateOnInputPixelDistanceMatchingRadianShift() {
    return [
      {
        transform: [
          {
            rotate: pan.interpolate({
              inputRange: [
                -(this.GIRTH_ANGLE * STEP_LENGTH_TO_1_ANGLERef.current),
                0,
                this.GIRTH_ANGLE * STEP_LENGTH_TO_1_ANGLERef.current,
              ],
              outputRange: [
                `-${this.GIRTH_ANGLE}deg`,
                '0deg',
                `${this.GIRTH_ANGLE}deg`,
              ],
            }),
          },
        ],
      },
    ];
  }

  function defineAxesCoordinatesOnLayoutChangeByStylesOrScreenRotation() {
    defineAxesCoordinatesOnLayoutDisplacement();
  }

  if (data.length === 0) {
    return null;
  }

  return (
    <View
      onLayout={debounce(
        defineAxesCoordinatesOnLayoutChangeByStylesOrScreenRotation,
        100,
      )}>
      <View
        style={{
          width: size,
          height: size,
        }}
        ref={wheelNavigatorRef}
        onLayout={defineAxesCoordinatesOnLayoutDisplacement}>
        <Animated.View
          style={rotateOnInputPixelDistanceMatchingRadianShift()}
          {...panResponder.panHandlers}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: size,
              height: size,
            }}>
            {newData.map((element, index) => {
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
                      onPress(element);
                    }}>
                    <Text>{element?.label}</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
