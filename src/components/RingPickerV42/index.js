import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Animated,
  PanResponder,
  Pressable,
  Text,
  Easing,
} from 'react-native';
import {debounce} from 'lodash';
import {Icons} from './components/Icons';
import {STYLES} from './styles';
import {SQUARE_DIMENSIONS} from './util';

export function RingPickerV42({
  visible,
  data = [],
  size = 200,
  elementSize = 50,
  onPress = () => {},
  isExpDistCorrection = true,
  noExpDistCorrectionDegree = 15,
}) {
  const length = data.length;
  const deltaTheta = 360 / length;

  // 2*π*r / 360
  const STEP_LENGTH_TO_1_ANGLERef = useRef(1);

  const formattedIcons = data.map((item, index) => ({
    ...item,
    index,
    id: index,
    title: index,
    label: index,
    isShown: true,
    position: new Animated.ValueXY(),
  }));

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

  this.INDEX_EXTRACTORS = {};
  const INDEX_EXTRACTORSRef = useRef({});
  this.GIRTH_ANGLE = 120;
  this.AMOUNT_OF_ICONS = formattedIcons.length;
  this.ICON_POSITION_ANGLE = this.GIRTH_ANGLE / this.AMOUNT_OF_ICONS;
  const CURRENT_ICON_SHIFTRef = useRef(0);

  const [icons, setIcons] = useState(formattedIcons);
  const currentSnappedIconRef = useRef(getCurrentSnappedMiddleIcon(icons));

  this.ALL_ICONS_FINISH_ANIMATIONS = {
    promises: icons.reduce((promises, icon) => {
      promises[icon.id] = null;
      return promises;
    }, {}),
    resolvers: icons.reduce((resolvers, icon) => {
      resolvers[icon.id] = null;
      return resolvers;
    }, {}),
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
        resetCurrentValues();
        setPreviousDifferenceLengths(0, 0);
        pan.setValue(pan._value);
      },
      onPanResponderMove: (evt, gestureState) => {
        // console.log('onPanResponderMove');
        defineCurrentSection(gestureState.moveX, gestureState.moveY);
        checkPreviousDifferenceLengths(gestureState.dx, gestureState.dy);
        pan.setValue(CURRENT_VECTOR_DIFFERENCE_LENGTHRef.current);
        CURRENT_ICON_SHIFTRef.current =
          CURRENT_VECTOR_DIFFERENCE_LENGTHRef.current /
          STEP_LENGTH_TO_1_ANGLERef.current;
        calculateIconCurrentPositions(gestureState.vx);
      },
      onPanResponderRelease: (evt, gestureState) => {
        // console.log('onPanResponderRelease');
        // pan.flattenOffset();
        // const ithCircleValue = getIthCircleValue(pan);
        // Animated.spring(pan, {
        //   toValue: ithCircleValue,
        //   friction: 5,
        //   tension: 10,
        //   useNativeDriver: false,
        // }).start(() => {
        //   simplifyOffset(pan);
        // });

        let lastGesture = {...gestureState};
        createFinishAnimationPromisesAndResolveIfIconsAreNotMovingAlready();
        Promise.all(getFinishAnimationPromises()).then(() => {
          snapNearestIconToVerticalAxis(lastGesture);
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

  function getCurrentSnappedMiddleIcon(icons) {
    return icons.filter((icon) => icon.index === 0)[0];
  }

  function getFinishAnimationPromises() {
    return icons.map(
      (icon) => this.ALL_ICONS_FINISH_ANIMATIONS.promises[icon.id],
    );
  }

  function createFinishAnimationPromisesAndResolveIfIconsAreNotMovingAlready() {
    icons.forEach((icon) => {
      this.ALL_ICONS_FINISH_ANIMATIONS.promises[icon.id] = new Promise(
        (resolve) =>
          (this.ALL_ICONS_FINISH_ANIMATIONS.resolvers[icon.id] = resolve),
      );
      !icon.position.x._animation &&
        this.ALL_ICONS_FINISH_ANIMATIONS.resolvers[icon.id]();
    });
  }

  function snapNearestIconToVerticalAxis(lastGesture) {
    let {
      minDistanceToVerticalAxis,
      minDistanceToHorizontalAxis,
      sign,
      currentSnappedIcon,
    } = getMinDistanceToVerticalAxisAndSnappedIcon();
    [minDistanceToVerticalAxis, minDistanceToHorizontalAxis] =
      updateMinimalDistanceExponentialDeflection(
        minDistanceToVerticalAxis,
        minDistanceToHorizontalAxis,
        currentSnappedIcon,
      );
    updateCurrentDirectionBasedOnNearestIconPosition(sign);
    setAdditiveMovementLength(
      sign * minDistanceToVerticalAxis,
      -minDistanceToHorizontalAxis,
    );
    setPreviousDifferenceLengths(
      lastGesture.dx + sign * minDistanceToVerticalAxis,
      lastGesture.dy + minDistanceToHorizontalAxis,
    );
    animateAllIconsToMatchVerticalAxis(currentSnappedIcon);
  }

  function getMinDistanceToVerticalAxisAndSnappedIcon() {
    let minDistanceToVerticalAxis = STEP_LENGTH_TO_1_ANGLERef.current * 360;
    let minDistanceToHorizontalAxis = STEP_LENGTH_TO_1_ANGLERef.current * 360;
    let sign = 1;
    let currentSnappedIcon = null;
    let yCoordinateFromCssStyling =
      STYLES.iconContainer.top - SQUARE_DIMENSIONS.ICON_PADDING_FROM_WHEEL;

    icons.forEach((icon) => {
      let iconXCenterCoordinate =
        icon.position.x.__getValue() + STYLES.icon.width / 2;
      let iconYCenterCoordinate = icon.position.y.__getValue();

      let distanceToXAxis = Math.abs(
        iconXCenterCoordinate -
          (XY_AXES_COORDINATESRef.current.X -
            XY_AXES_COORDINATESRef.current.PAGE_X),
      );
      let distanceToYAxis = Math.abs(
        yCoordinateFromCssStyling - iconYCenterCoordinate,
      );

      if (distanceToYAxis <= minDistanceToHorizontalAxis) {
        minDistanceToHorizontalAxis = distanceToYAxis;
      }

      if (distanceToXAxis <= minDistanceToVerticalAxis) {
        if (
          iconXCenterCoordinate >
          XY_AXES_COORDINATESRef.current.X -
            XY_AXES_COORDINATESRef.current.PAGE_X
        ) {
          sign = -1;
        } else if (
          iconXCenterCoordinate <
          XY_AXES_COORDINATESRef.current.X -
            XY_AXES_COORDINATESRef.current.PAGE_X
        ) {
          sign = 1;
        } else {
          sign = 0;
          minDistanceToVerticalAxis = 0;
        }
        minDistanceToVerticalAxis = distanceToXAxis;
        currentSnappedIcon = icon;
      }
    });

    return {
      minDistanceToVerticalAxis,
      minDistanceToHorizontalAxis,
      sign,
      currentSnappedIcon,
    };
  }

  function updateCurrentDirectionBasedOnNearestIconPosition(sign) {
    if (sign > 0) {
      CURRENT_DIRECTIONRef.current = this.DIRECTIONS.CLOCKWISE;
    } else {
      CURRENT_DIRECTIONRef.current = this.DIRECTIONS.COUNTERCLOCKWISE;
    }
  }

  function adjustMinimalExponentialDistanceCorrection(angle, minV, minH) {
    if (!isExpDistCorrection) {
      return [minV, minH];
    }

    let currentAngle = Math.round(angle);
    let lowestBoundaryDegree = 270 - noExpDistCorrectionDegree;
    let highestBoundaryDegree = 270 + noExpDistCorrectionDegree;

    if (
      currentAngle < lowestBoundaryDegree ||
      currentAngle > highestBoundaryDegree
    ) {
      let number =
        (15 - 0.004165 * Math.pow(currentAngle - 270, 2)) *
        STEP_LENGTH_TO_1_ANGLERef.current;

      return [minV - number, minH - Math.sqrt(number) / 2];
    }

    return [minV, minH];
  }

  /**
   * if current angle is lower than 270 center angle minus 15 degrees gap, that implies parabolic distance
   * from this. 30 degrees center gap - adjust minimal distance to vertical axis regarding this parabolic distance
   */
  function updateMinimalDistanceExponentialDeflection(
    minDistanceToVerticalAxis,
    minDistanceToHorizontalAxis,
    currentSnappedIcon,
  ) {
    const id = currentSnappedIcon.id;
    const index = currentSnappedIcon.index;

    let minV = minDistanceToVerticalAxis;
    let minH = minDistanceToHorizontalAxis;

    let currentAngle =
      270 +
      CURRENT_ICON_SHIFTRef.current +
      (INDEX_EXTRACTORSRef.current[id] || 0) +
      index * this.ICON_POSITION_ANGLE;

    [minV, minH] = adjustMinimalExponentialDistanceCorrection(
      currentAngle,
      minV,
      minH,
    );

    return [minV, minH];
  }

  function animateAllIconsToMatchVerticalAxis(currentSnappedIcon) {
    Animated.spring(pan, {
      toValue: CURRENT_VECTOR_DIFFERENCE_LENGTHRef.current,
      easing: Easing.linear,
      speed: 12,
      useNativeDriver: true, // if this is used - the last click after previous release will twist back nad forward
    }).start();
    CURRENT_ICON_SHIFTRef.current =
      CURRENT_VECTOR_DIFFERENCE_LENGTHRef.current /
      STEP_LENGTH_TO_1_ANGLERef.current;
    currentSnappedIconRef.current = currentSnappedIcon;
    // this.setState(
    //   {
    //     ...this.state,
    //     CURRENT_ICON_SHIFT:
    //       this.CURRENT_VECTOR_DIFFERENCE_LENGTH / this.STEP_LENGTH_TO_1_ANGLE,
    //     currentSnappedIcon: currentSnappedIcon,
    //   },
    //   () => this.calculateIconCurrentPositions(),
    // );
    calculateIconCurrentPositions();
  }

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

      calculateIconCurrentPositions();
    });
  }

  function getIthCircleValue(deltaAnim) {
    const selectedCircle = Math.round(
      (deltaAnim._value + deltaAnim._offset) / deltaTheta,
    );
    return selectedCircle * deltaTheta;
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

  function adjustCurrentIconAngleExponentially(angle) {
    let currentIconAngle = Math.round(angle);

    if (!isExpDistCorrection) {
      return currentIconAngle;
    }

    let lowestBoundaryDegree = 270 - noExpDistCorrectionDegree;
    let highestBoundaryDegree = 270 + noExpDistCorrectionDegree;

    if (currentIconAngle < lowestBoundaryDegree) {
      return (
        currentIconAngle - (15 - 0.004165 * Math.pow(currentIconAngle - 270, 2))
      );
    } else if (currentIconAngle > highestBoundaryDegree) {
      return (
        currentIconAngle + (15 - 0.004165 * Math.pow(currentIconAngle - 270, 2))
      );
    } else {
      return currentIconAngle;
    }
  }

  function calculateIconCurrentPosition(icon) {
    let currentIconAngle = calculateCurrentIconAngle(icon);
    // the Y coordinate where the center of the circle is higher than the coordinates of Icons, this is actually similar {+X:-Y} section of coordinate net
    // and INVERTED, this is basically if we'd have an upside-down screen always

    // console.log(10 - 0.00277 * Math.pow((currentIconAngle - 270), 2));
    // console.log(20 - 0.00666 * Math.pow((currentIconAngle - 270), 2));
    // console.log(15 - 0.005 * Math.pow((currentIconAngle - 270), 2));
    // this is necessary deviation since angle sometimes would be 269.931793549246 or 270.002727265348 degrees
    /**
     * y=15-1/200*(x-270)^2
     *
     * this parabolic gap matches the maximum value of 15 degrees for the angle interval of {-60°:60°}, -270° shift makes it possible to calculate the gap for X interval of {210°:330°}
     *
     * this is parabolic acceleration, basically - further the position from 270 degrees - more would be the gap from the vertical axis - thus creating the distance from center aligned icon
     */
    currentIconAngle = adjustCurrentIconAngleExponentially(currentIconAngle);

    return {
      top:
        XY_AXES_COORDINATESRef.current.Y -
        XY_AXES_COORDINATESRef.current.PAGE_Y +
        ICON_PATH_RADIUSRef.current *
          Math.sin(currentIconAngle * (Math.PI / 180)),
      left:
        XY_AXES_COORDINATESRef.current.X -
        XY_AXES_COORDINATESRef.current.PAGE_X -
        STYLES.icon.width / 2 +
        ICON_PATH_RADIUSRef.current *
          Math.cos(currentIconAngle * (Math.PI / 180)),
    };
  }

  function calculateCurrentIconAngle(icon) {
    const id = icon.id;
    const index = icon.index;

    if (!INDEX_EXTRACTORSRef.current[id]) {
      INDEX_EXTRACTORSRef.current[id] = 0;
    }

    let currentAngle =
      270 +
      CURRENT_ICON_SHIFTRef.current +
      INDEX_EXTRACTORSRef.current[id] +
      index * this.ICON_POSITION_ANGLE;

    if (currentAngle < 270 - this.GIRTH_ANGLE / 2) {
      // this.hideIconWhileMovingBehindCircle(id);
      INDEX_EXTRACTORSRef.current[id] += this.GIRTH_ANGLE;
      return currentAngle + this.GIRTH_ANGLE;
    }

    if (currentAngle > 270 + this.GIRTH_ANGLE / 2) {
      // this.hideIconWhileMovingBehindCircle(id);
      INDEX_EXTRACTORSRef.current[id] -= this.GIRTH_ANGLE;
      return currentAngle - this.GIRTH_ANGLE;
    }

    return currentAngle;
  }

  function calculateIconCurrentPositions(dx) {
    function extractCorrectRestDisplacementThreshold(dx) {
      if (!dx || ((dx) => 0 && dx <= 1)) {
        return 1;
      }

      return 10;
    }

    icons.forEach((icon, index) => {
      let coordinates = calculateIconCurrentPosition(icon);
      Animated.spring(icon.position, {
        toValue: {
          x: coordinates.left,
          y: coordinates.top,
        },
        easing: Easing.linear,
        speed: 30,
        restSpeedThreshold: 10,
        bounciness: 0,
        useNativeDriver: false,
        restDisplacementThreshold: extractCorrectRestDisplacementThreshold(dx),
      }).start((finish) => {
        finish.finished &&
          typeof this.ALL_ICONS_FINISH_ANIMATIONS.resolvers[icon.id] ===
            'function' &&
          this.ALL_ICONS_FINISH_ANIMATIONS.resolvers[icon.id]();
      });
    });
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
      <Icons
        icons={icons}
        // onPress={onPress}
        // styleIconText={styleIconText}
      />
      <View
        style={[
          STYLES.wheel,
          {
            // height: size * 0.85,
            borderColor: 'red',
            borderWidth: 1,
            // overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',

            // width: size,
            // height: size,
          },
        ]}
        ref={wheelNavigatorRef}
        onLayout={defineAxesCoordinatesOnLayoutDisplacement}>
        <Animated.View
          style={rotateOnInputPixelDistanceMatchingRadianShift()}
          {...panResponder.panHandlers}>
          <View
            style={{
              width: size,
              height: size,
              // borderRadius: size / 2,
              // borderLeftColor: 'green',
              // borderTopColor: 'red',
              // borderRightColor: 'orange',
              // borderBottomColor: 'yellow',
              // borderWidth: size / 10,
            }}
          />
        </Animated.View>

        {/* {icons.map((element, index) => {
          const rotate = element.position.interpolate({
            inputRange: [0, 90],
            outputRange: ['0deg', '90deg'],
          });

          return (
            <Animated.View
              key={index}
              style={[
                {
                  position: 'absolute',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transform: [
                    {
                      rotate,
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
      </View>
    </View>
  );
}
