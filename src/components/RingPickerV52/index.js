import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, PanResponder, Pressable, Text } from 'react-native';
import { debounce, range } from 'lodash'

export function RingPickerV52({
  visible,
  data = [],
  size = 200,
  elementSize = 50,
  maxToRenderPerBatch = 0,
  renderItem,
  onPress = () => { },
  // onMomentumScrollEnd = () => { },
}) {
  this.LENGTH = data.length;
  this.AMOUNT_OF_DATA = Math.min(maxToRenderPerBatch, this.LENGTH);
  this.GIRTH_ANGLE = 360 / this.AMOUNT_OF_DATA;

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

  const [currentIndex, setCurrentIndex] = useState(0);
  // console.log('currentIndex', currentIndex);
  const indexes = range(
    Math.round(currentIndex - parseInt(maxToRenderPerBatch / 2, 10)),
    Math.round(currentIndex + parseInt(maxToRenderPerBatch / 2, 10) + 1),
  );
  // console.log("indexes---", indexes);
  // console.log('data', data);
  const findItemByIndex = (index) => data[(this.LENGTH + (index % this.LENGTH)) % this.LENGTH]
  const renderedData = indexes.map((i) => {
    // console.log('i', i);
    return findItemByIndex(i);
  });
  // console.log("renderedData---", renderedData);
  for (let i = 0; i < parseInt(indexes.length / 2, 10); i++) {
    renderedData.push(renderedData.shift());
  }
  if (currentIndex >= 0) {
    for (let i = 0; i < currentIndex; i++) {
      renderedData.unshift(renderedData.pop());
    }
  } else {
    for (let i = 0; i > currentIndex; i--) {
      renderedData.push(renderedData.shift());
    }
  }
  // console.log('renderedData', JSON.stringify(renderedData, null, 2));

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // console.log('onPanResponderGrant');
        resetCurrentValues();
        setPreviousDifferenceLengths(0, 0);
        pan.setValue(pan._value);
        pan.setOffset(0)
      },
      onPanResponderMove: (evt, gestureState) => {
        // console.log('onPanResponderMove');
        defineCurrentSection(gestureState.moveX, gestureState.moveY);
        checkPreviousDifferenceLengths(gestureState.dx, gestureState.dy);
        pan.setValue(CURRENT_VECTOR_DIFFERENCE_LENGTHRef.current);

        const ithCircleValue = getIthCircleValue(pan)
        const index = -ithCircleValue / this.GIRTH_ANGLE
        setCurrentIndex(index)
      },
      onPanResponderRelease: (evt, gestureState) => {
        // console.log('onPanResponderRelease');
        pan.flattenOffset();

        const ithCircleValue = getIthCircleValue(pan);
        // console.log("ithCircleValue---", ithCircleValue);
        Animated.spring(pan, {
          toValue: ithCircleValue,
          friction: 5,
          tension: 10,
          useNativeDriver: false,
        }).start(({ finished }) => {
          if (finished) {
            simplifyOffset(pan)
          }
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

  function getIthCircleValue(deltaAnim, step = 0) {
    const selectedCircle = Math.round(
      (deltaAnim._value + deltaAnim._offset + step) / this.GIRTH_ANGLE,
    );
    return selectedCircle * this.GIRTH_ANGLE;
  }

  // function getIthCircleValueWithIndex(index) {
  //   const selectedCircle = index;
  //   return selectedCircle * this.GIRTH_ANGLE;
  // }

  // function findIndexByIth(ith) {
  //   const stepIndex =
  //     -ith / STEP_LENGTH_TO_1_ANGLERef.current / this.GIRTH_ANGLE;
  //   return stepIndex;
  // }

  // function defineIndex(deltaAnim) {
  //   const ithCircleValue = getIthCircleValue(deltaAnim);
  //   // console.log("ithCircleValue---", ithCircleValue);
  //   // console.log("CURRENT_CIRCLE_SECTIONRef.current---", CURRENT_CIRCLE_SECTIONRef.current);
  //   const index = findIndexByIth(ithCircleValue);
  //   return (maxToRenderPerBatch + index) % maxToRenderPerBatch;
  // }

  const getAmountForNextSlice = (dx, offset) => {
    // This just rounds to the nearest 200 to snap the circle to the correct thirds
    const snappedOffset = snapOffset(offset);
    // Depending on the direction, we either add 200 or subtract 200 to calculate new offset position. (200 are equal to 120deg!)
    // const newOffset = dx > 0 ? snappedOffset + 200 : snappedOffset - 200; // fixed for 3 circles
    const newOffset = dx > 0 ? snappedOffset + STEP_LENGTH_TO_1_ANGLERef.current / this.LENGTH : snappedOffset - STEP_LENGTH_TO_1_ANGLERef.current / this.LENGTH;
    return newOffset;
  }
  const snapOffset = (offset) => { return Math.round(offset / (STEP_LENGTH_TO_1_ANGLERef.current / this.LENGTH)) * STEP_LENGTH_TO_1_ANGLERef.current / this.LENGTH; }

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
          borderColor: 'red',
          borderWidth: 1,
          overflow: 'hidden',
        }}
        ref={wheelNavigatorRef}
        onLayout={defineAxesCoordinatesOnLayoutDisplacement}>
        {renderedData?.map((element, index) => {
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

          {/* const backgroundColor = pan.interpolate({
            inputRange: [
              -(this.GIRTH_ANGLE * STEP_LENGTH_TO_1_ANGLERef.current),
              0,
              this.GIRTH_ANGLE * STEP_LENGTH_TO_1_ANGLERef.current,
            ],
            outputRange: [
              "#00aaFF",
              "#808080",
              "#00aaFF"
            ],
          }) */}

          {/* const colors = ['red', 'green', 'blue', 'orange', 'yellow', 'pink']; */ }

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
                  // backgroundColor: colors[index],
                }}
                onPress={() => {
                  // TODO: Scroll to index
                  onPress(element);
                  const foundItem = findItemByIndex(currentIndex)
                  // if (element.id === foundItem.id) return
                  let newIndex = index
                  if (index > Math.floor(renderedData.length / 2)) {
                    newIndex = index - renderedData.length
                  }
                  console.log("STEP_LENGTH_TO_1_ANGLERef.current", STEP_LENGTH_TO_1_ANGLERef.current)
                  console.log("CURRENT_CIRCLE_SECTIONRef.current", CURRENT_CIRCLE_SECTIONRef.current)
                  console.log("CURRENT_DIRECTIONRef.current", CURRENT_DIRECTIONRef.current)
                  console.log("PREVIOUS_POSITIONRef.current.X", PREVIOUS_POSITIONRef.current.X)
                  console.log("PREVIOUS_POSITIONRef.current.Y", PREVIOUS_POSITIONRef.current.Y)




                  // console.log("currentIndex", currentIndex);
                  // console.log("index", index);
                  // console.log("newIndex", newIndex);
                  // console.log("-newIndex * this.GIRTH_ANGLE", -newIndex * this.GIRTH_ANGLE);
                  const newIthCircleValue = getIthCircleValue(pan, this.GIRTH_ANGLE)
                  CURRENT_VECTOR_DIFFERENCE_LENGTHRef.current = newIthCircleValue
                  // console.log("newIthCircleValue", newIthCircleValue)

                  // pan.setValue(newIthCircleValue)
                  Animated.spring(pan, {
                    toValue: newIthCircleValue,
                    friction: 5,
                    tension: 10,
                    useNativeDriver: false,
                  }).start(({ finished }) => {
                    if (finished) {
                      simplifyOffset(pan)
                      const newCurrentIndex = -newIthCircleValue / this.GIRTH_ANGLE
                      // console.log(newCurrentIndex)
                      // setCurrentIndex(newCurrentIndex)

                      // setTimeout(() => {
                      // }, 1000)
                    }
                  });
                }}>
                {typeof renderItem === 'function' ? (
                  renderItem({ item: element, index })
                ) : (
                  <View
                    style={{
                      borderColor: 'orange',
                      borderWidth: 1,
                      width: elementSize,
                      height: elementSize,
                      borderRadius: elementSize / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text>
                      {element?.label}
                    </Text>
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

RingPickerV52.propTypes = {
  maxToRenderPerBatch: function (props, propName, componentName) {
    if (props[propName] % 2 === 0) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Expected Odd Number, got Even Number. Validation failed.'
      );
    }
    return null
  },
};
