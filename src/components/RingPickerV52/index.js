import React, {useEffect, useRef, useState} from 'react';
import {View, Animated, PanResponder, Pressable, Text} from 'react-native';
import {debounce, range} from 'lodash';

export function RingPickerV52({
  visible,
  data = [],
  size = 200,
  elementSize = 50,
  maxToRenderPerBatch,
  renderItem,
  onPress = () => {},
  onMomentumScrollEnd = () => {},
}) {
  this.AMOUNT_OF_DATA = maxToRenderPerBatch ?? data.length;
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

  console.log('currentIndex', currentIndex);

  const rangeArray = range(
    currentIndex - parseInt(maxToRenderPerBatch / 2, 10),
    currentIndex + parseInt(maxToRenderPerBatch / 2, 10) + 1,
  );

  const showedData = rangeArray.map((s) => {
    // console.log('data', data);
    // const {item} = getItemInLoopingArray(data, s);
    // console.log(index);
    // return item;
    return data[(data.length + s) % data.length];
  });
  // console.log('showedData', JSON.stringify(showedData, null, 2));
  for (let i = 0; i < parseInt(rangeArray.length / 2, 10); i++) {
    showedData.push(showedData.shift());
  }
  for (let i = 0; i < currentIndex; i++) {
    console.log('currentIndex', currentIndex);
    showedData.unshift(showedData.pop());
  }
  // if (currentIndex === 1) {
  //   showedData.unshift(showedData.pop());
  // }
  const formattedShowedData = showedData.map((d, index) => {
    return {
      ...d,
      position: index,
      show: true,
    };
  });
  console.log(
    'formattedShowedData',
    JSON.stringify(formattedShowedData, null, 2),
  );

  const formatData = [...data].map((item, index) => {
    // console.log('item', item);
    const existed = formattedShowedData.findIndex((sd) => sd.id === item.id);
    // console.log('existed', existed);
    // // const existed = indexs.some((i) => i === index);
    // // const pushed = a.some((i) => i === index);
    // // const a = indexs.slice(0, (this.AMOUNT_OF_DATA - 1) / 2);
    // console.log(currentIndex, existed);
    // const formatPosition = (index) => {
    //   let position = index;
    //   const mod = index % (data.length - 1);
    //   console.log('index', index);
    //   console.log('data.length - 1', data.length - 1);
    //   console.log('mod', mod);
    //   // if (currentIndex !== 0 && mod === 0) {
    //   //   position -= 1;
    //   // }

    //   // if (currentIndex === 1 && index === data.length - 1) {
    //   //   position -= 1;
    //   // }
    //   // if (
    //   //   currentIndex < this.AMOUNT_OF_DATA - 1 / 2 &&
    //   //   (index === data.length - 1 || index === data.length - 2)
    //   // ) {
    //   //   position -= 1;
    //   // }
    //   // if (currentIndex === 15) {
    //   //   if (index === 15 || index === 14 || index === 13) {
    //   //     position -= 1;
    //   //   }
    //   // }
    //   // if (currentIndex === 14) {
    //   //   if (index === 15 || index === 14 || index === 13 || index === 12) {
    //   //     position -= 1;
    //   //   }
    //   // }
    //   // if (currentIndex === 13) {
    //   //   position -= 1;
    //   // }

    //   return position;
    // };
    return {
      ...item,
      position: existed,
      show: existed !== -1,
    };
  });

  // console.log('formatData', JSON.stringify(formatData, null, 2));

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
        const index = defineIndex(pan);
        setCurrentIndex(index);
      },
      onPanResponderRelease: (evt, gestureState) => {
        // console.log('onPanResponderRelease');
        pan.flattenOffset();
        // const {item} = defineIndex(pan);
        // onMomentumScrollEnd(item);
        const ithCircleValue = getIthCircleValue(pan);

        Animated.spring(pan, {
          toValue: ithCircleValue,
          friction: 5,
          tension: 10,
          useNativeDriver: false,
        }).start(() => {
          // console.log(
          //   'CURRENT_VECTOR_DIFFERENCE_LENGTHRef.current',
          //   CURRENT_VECTOR_DIFFERENCE_LENGTHRef.current,
          // );
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

  function getIthCircleValueWithIndex(index) {
    const selectedCircle = index;
    return selectedCircle * this.GIRTH_ANGLE;
  }

  function findIndexByIth(ith) {
    const stepIndex =
      -ith / STEP_LENGTH_TO_1_ANGLERef.current / this.GIRTH_ANGLE;
    return stepIndex;
  }

  function defineIndex(deltaAnim) {
    const ithCircleValue = getIthCircleValue(deltaAnim);
    const index = findIndexByIth(ithCircleValue);
    return (maxToRenderPerBatch + index) % maxToRenderPerBatch;
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
      index = arr.length + index;
      item = arr[index];
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
        {formattedShowedData?.map((element, index) => {
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

          const colors = ['red', 'green', 'blue', 'orange', 'yellow', 'pink'];

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
                ...rotateOnInputPixelDistanceMatchingElement(element.position),
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
                  // const ithCircleValue = getIthCircleValueWithIndex(-index);
                  // Animated.spring(pan, {
                  //   toValue: ithCircleValue,
                  //   friction: 5,
                  //   tension: 10,
                  //   useNativeDriver: false,
                  // }).start();
                  console.log(index);
                  onPress(element);
                }}>
                {typeof renderItem === 'function' ? (
                  renderItem({item: element, index})
                ) : (
                  <View
                    style={{
                      borderColor: 'orange',
                      borderWidth: 1,
                      width: element?.show ? elementSize : 0,
                      height: element?.show ? elementSize : 0,
                      borderRadius: elementSize / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text>
                      {/* i-{index} */}
                      {/* l- */}
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
