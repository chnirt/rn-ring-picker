import React, {useEffect, useRef, useState} from 'react';
import {View, Animated, PanResponder, Pressable, Text} from 'react-native';
import {debounce} from 'lodash';

export function RingPickerV5({
  visible,
  data = [],
  size = 200,
  elementSize = 50,
  maxToRenderPerBatch,
  renderItem,
  onPress = () => {},
}) {
  this.AMOUNT_OF_DATA = data.length;
  this.GIRTH_ANGLE = 360 / (maxToRenderPerBatch ?? this.AMOUNT_OF_DATA);

  // 2*π*r / 360
  const STEP_LENGTH_TO_1_ANGLERef = useRef(1);

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

  const [centeredIndex, setCenteredIndex] = useState(this.AMOUNT_OF_DATA / 2);
  const [currentIndex, setCurrentIndex] = useState(0);
  const formatData = [
    currentIndex - 2,
    currentIndex - 1,
    currentIndex,
    currentIndex + 1,
    currentIndex + 2,
  ].map((s) => {
    // console.log('data', data);
    const {item} = getItemInLoopingArray(data, s);
    // console.log(index);
    return item;
  });
  // console.log('formatData', formatData);
  const a = formatData.slice(0, 2);
  const b = formatData.slice(-3);
  const c = [...b, ...a];
  let newArray = c;
  // console.log('currentIndex', currentIndex);
  if (currentIndex >= 1) {
    const d = newArray.slice(0, this.AMOUNT_OF_DATA - 1 - currentIndex);
    const e = newArray.slice(-currentIndex);
    const f = [...e, ...d];
    newArray = f;
    if (currentIndex > this.AMOUNT_OF_DATA - 1) {
      CURRENT_VECTOR_DIFFERENCE_LENGTHRef.current = 0;
      pan.setValue(CURRENT_VECTOR_DIFFERENCE_LENGTHRef.current);
    }
  }
  if (currentIndex < 0) {
    const {index: itemIndex} = getItemInLoopingArray(data, currentIndex);
    console.log(itemIndex);
    console.log(currentIndex);
    const g = newArray.slice(Math.abs(currentIndex), this.AMOUNT_OF_DATA - 1);
    const h = newArray.slice(0, Math.abs(currentIndex));
    const i = [...g, ...h];
    newArray = i;
    if (currentIndex < -(this.AMOUNT_OF_DATA - 1)) {
      CURRENT_VECTOR_DIFFERENCE_LENGTHRef.current = 0;
      pan.setValue(CURRENT_VECTOR_DIFFERENCE_LENGTHRef.current);
    }
  }
  const e = newArray;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // console.log('onPanResponderGrant');
        resetCurrentValues();
        setPreviousDifferenceLengths(0, 0);
        pan.setValue(pan._value);
      },
      onPanResponderMove: (evt, gestureState) => {
        // console.log('onPanResponderMove');
        defineCurrentSection(gestureState.moveX, gestureState.moveY);
        checkPreviousDifferenceLengths(gestureState.dx, gestureState.dy);
        pan.setValue(CURRENT_VECTOR_DIFFERENCE_LENGTHRef.current);
        defineCenteredIndex(pan);
      },
      onPanResponderRelease: (evt, gestureState) => {
        // console.log('onPanResponderRelease');
        pan.flattenOffset();
        // defineCenteredIndex(pan);
        const ithCircleValue = getIthCircleValue(pan);
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

  useEffect(() => {
    return () => {
      CURRENT_VECTOR_DIFFERENCE_LENGTHRef.current = 0;
      pan.setValue(CURRENT_VECTOR_DIFFERENCE_LENGTHRef.current);
      resetCurrentValues();
    };
  }, [visible]);

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
      (deltaAnim._value + deltaAnim._offset) / this.GIRTH_ANGLE,
    );
    return selectedCircle * this.GIRTH_ANGLE;
  }

  function findIndexByIth(ith) {
    const stepIndex =
      -ith / STEP_LENGTH_TO_1_ANGLERef.current / this.GIRTH_ANGLE;
    return stepIndex;
  }

  function defineCenteredIndex(deltaAnim) {
    const ithCircleValue = getIthCircleValue(deltaAnim);
    const index = findIndexByIth(ithCircleValue);
    const {index: getCurrentIndex} = getItemInLoopingArray(data, index);
    // console.log('getCurrentIndex', getCurrentIndex);
    setCurrentIndex(index);

    const oppositeIndex = index + centeredIndex;
    const {index: itemIndex} = getItemInLoopingArray(data, oppositeIndex);
    setCenteredIndex(itemIndex);
  }

  function simplifyOffset(anim) {
    if (anim._value + anim._offset >= STEP_LENGTH_TO_1_ANGLERef.current)
      anim.setOffset(anim._offset - STEP_LENGTH_TO_1_ANGLERef.current);
    if (anim._value + anim._offset <= -STEP_LENGTH_TO_1_ANGLERef.current)
      anim.setOffset(anim._offset + STEP_LENGTH_TO_1_ANGLERef.current);
  }

  function resetCurrentValues() {
    STEP_LENGTH_TO_1_ANGLERef.current = 1;
    CURRENT_CIRCLE_SECTIONRef.current = null;
    CURRENT_DIRECTIONRef.current = null;
    PREVIOUS_POSITIONRef.current.X = 0;
    PREVIOUS_POSITIONRef.current.Y = 0;
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

  function getItemInLoopingArray(arr, position) {
    let item;
    let index = position % arr.length;
    item = arr[index];
    if (index < 0) {
      item = arr[arr.length + index];
    }
    return {index, item};
  }

  if (this.AMOUNT_OF_DATA === 0) {
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
          aspectRatio: 1,
          // height: size * 0.85,
          // borderColor: 'red',
          // borderWidth: 1,
          // overflow: 'hidden',
        }}
        ref={wheelNavigatorRef}
        onLayout={defineAxesCoordinatesOnLayoutDisplacement}>
        {e?.map((element, index) => {
          function rotateOnInputPixelDistanceMatchingElement(index) {
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
                        `${this.GIRTH_ANGLE * (index - 1)}deg`,
                        `${this.GIRTH_ANGLE * index}deg`,
                        `${this.GIRTH_ANGLE * (index + 1)}deg`,
                      ],
                    }),
                  },
                ],
              },
            ];
          }

          return (
            <Animated.View
              key={index}
              style={[
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: size / 2,
                  zIndex: 1,
                  elevation: 1,
                },
                ...rotateOnInputPixelDistanceMatchingElement(index),
              ]}>
              <Pressable
                style={{
                  position: 'absolute',
                  top: -size / 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  onPress(element);
                }}>
                {typeof renderItem === 'function' ? (
                  renderItem({item: element, index})
                ) : (
                  <View
                    style={{
                      borderColor: 'orange',
                      borderWidth: 1,
                      height: elementSize,
                      width: elementSize,
                      borderRadius: elementSize / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text>{element?.label}</Text>
                  </View>
                )}
              </Pressable>
            </Animated.View>
          );
        })}

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
            {/* {data.map((element, index) => {
              return (
                <Animated.View
                  key={index}
                  style={[
                    {
                      justifyContent: 'center',
                      alignItems: 'center',
                      transform: [
                        {
                          rotate: `${this.GIRTH_ANGLE * index}deg`,
                        },
                      ],
                    },
                  ]}>
                  <Pressable
                    style={{
                      position: 'absolute',
                      top: -size / 2,
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
                </Animated.View>
              );
            })} */}
            {/* <View
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                borderLeftColor: 'green',
                borderTopColor: 'red',
                borderRightColor: 'orange',
                borderBottomColor: 'yellow',
                borderWidth: size / 10,
              }}
            /> */}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
