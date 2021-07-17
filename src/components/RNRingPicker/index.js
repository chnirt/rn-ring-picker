import React, { createRef, useEffect, useRef, useState } from 'react'
import { View, Animated, PanResponder } from 'react-native'
import { debounce } from 'lodash';
import { CircleBlueGradient } from './components/CircleBlueGradient'
import { CircleTouchable } from './components/CircleTouchable'
import { Icons } from "./components/Icons";
import { SQUARE_DIMENSIONS } from "./util";

import { STYLES } from './styles';

export function RNRingPicker({
  girthAngle = 120,
  iconHideOnTheBackDuration = 250
}) {
  const [icons, setIcons] = useState([])
  const [XY_AXES_COORDINATES, setXY_AXES_COORDINATES] = useState({
    X: 0,
    Y: 0,
    PAGE_Y: 0,
    PAGE_X: 0
  })
  const [CURRENT_ICON_SHIFT, setCURRENT_ICON_SHIFT] = useState(0)
  const [ICON_PATH_RADIUS, setICON_PATH_RADIUS] = useState(0)
  // const [pan, setPan] = useState(new Animated.Value(0))
  const pan = useRef(new Animated.Value(0)).current;

  this.INDEX_EXTRACTORS = {};
  this.GIRTH_ANGLE = girthAngle;
  this.AMOUNT_OF_ICONS = icons.length;
  this.ICON_POSITION_ANGLE = this.GIRTH_ANGLE / this.AMOUNT_OF_ICONS;

  // 2*π*r / 360
  this.STEP_LENGTH_TO_1_ANGLE = 0;
  let stepLengthTo1Angle = useRef(0).current

  this.DIRECTIONS = {
    CLOCKWISE: "CLOCKWISE",
    COUNTERCLOCKWISE: "COUNTERCLOCKWISE"
  };

  this.CIRCLE_SECTIONS = {
    TOP_LEFT: "TOP_LEFT",
    TOP_RIGHT: "TOP_RIGHT",
    BOTTOM_LEFT: "BOTTOM_LEFT",
    BOTTOM_RIGHT: "BOTTOM_RIGHT"
  };

  this.CURRENT_CIRCLE_SECTION = null;
  this.CURRENT_DIRECTION = null;
  this.CURRENT_VECTOR_DIFFERENCE_LENGTH = 0;
  let currentVectorDifferenceLength = useRef(0).current

  this.PREVIOUS_POSITION = {
    X: 0,
    Y: 0
  };
  const previousPosition = useRef({
    X: 0,
    Y: 0
  }).current

  this.ICON_HIDE_ON_THE_BACK_DURATION = iconHideOnTheBackDuration;

  this.ALL_ICONS_FINISH_ANIMATIONS = {
    promises: icons.reduce((promises, icon) => { promises[icon.id] = null; return promises }, {}),
    resolvers: icons.reduce((resolvers, icon) => { resolvers[icon.id] = null; return resolvers }, {})
  };

  const panResponder = useRef(
    PanResponder.create({
      // Ask to be the responder:
      // onStartShouldSetPanResponder: (evt, gestureState) => true,
      // onStartShouldSetPanResponderCapture: (evt, gestureState) =>
      //   true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
        true,
      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now

        // this.hideArrowHint();
        // resetCurrentValues();
        // setPreviousDifferenceLengths(0, 0);
        // pan.setValue(pan._value);
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}

        defineCurrentSection(gestureState.moveX, gestureState.moveY);
        checkPreviousDifferenceLengths(gestureState.dx, gestureState.dy);

        // pan.setValue(this.CURRENT_VECTOR_DIFFERENCE_LENGTH);
        pan.setValue(currentVectorDifferenceLength);
        // setCURRENT_ICON_SHIFT(this.CURRENT_VECTOR_DIFFERENCE_LENGTH / this.STEP_LENGTH_TO_1_ANGLE)
        setCURRENT_ICON_SHIFT(currentVectorDifferenceLength / stepLengthTo1Angle)
        // calculateIconCurrentPositions(gestureState.vx)
        // this.setState({
        //   ...this.state,
        //   CURRENT_ICON_SHIFT: this.CURRENT_VECTOR_DIFFERENCE_LENGTH / this.STEP_LENGTH_TO_1_ANGLE
        // }, () => this.calculateIconCurrentPositions(gestureState.vx));
      },
      // onPanResponderTerminationRequest: (evt, gestureState) =>
      //   true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded

        // let lastGesture = { ...gestureState };
        // createFinishAnimationPromisesAndResolveIfIconsAreNotMovingAlready();
        // Promise
        //   .all(getFinishAnimationPromises())
        //   .then(() => snapNearestIconToVerticalAxis(lastGesture));
      },
      // onPanResponderTerminate: (evt, gestureState) => {
      //   // Another component has become the responder, so this gesture
      //   // should be cancelled
      // },
      // onShouldBlockNativeResponder: (evt, gestureState) => {
      //   // Returns whether this component should block native components from becoming the JS
      //   // responder. Returns true by default. Is currently only supported on android.
      //   return true;
      // }
    })
  ).current;
  const wheelNavigatorRef = useRef()
  // const wheelNavigatorRef = createRerf()

  useEffect(() => {
    if (CURRENT_ICON_SHIFT !== 0) {

    }
  }, [CURRENT_ICON_SHIFT])

  function getFinishAnimationPromises() {
    return icons.map((icon) => this.ALL_ICONS_FINISH_ANIMATIONS.promises[icon.id]);
  }

  function createFinishAnimationPromisesAndResolveIfIconsAreNotMovingAlready() {
    icons.forEach((icon) => {
      this.ALL_ICONS_FINISH_ANIMATIONS.promises[icon.id] = new Promise((resolve) => this.ALL_ICONS_FINISH_ANIMATIONS.resolvers[icon.id] = resolve);
      !icon.position.x._animation && this.ALL_ICONS_FINISH_ANIMATIONS.resolvers[icon.id]();
    });
  }

  function snapNearestIconToVerticalAxis(lastGesture) {
    // let { minDistanceToVerticalAxis, minDistanceToHorizontalAxis, sign, currentSnappedIcon } = this.getMinDistanceToVerticalAxisAndSnappedIcon();
    // [minDistanceToVerticalAxis, minDistanceToHorizontalAxis] = this.updateMinimalDistanceExponentialDeflection(minDistanceToVerticalAxis, minDistanceToHorizontalAxis, currentSnappedIcon);

    // this.updateCurrentDirectionBasedOnNearestIconPosition(sign);
    // this.setAdditiveMovementLength((sign * minDistanceToVerticalAxis), -minDistanceToHorizontalAxis);
    // this.setPreviousDifferenceLengths(lastGesture.dx + (sign * minDistanceToVerticalAxis), lastGesture.dy + minDistanceToHorizontalAxis);
    // this.animateAllIconsToMatchVerticalAxis(currentSnappedIcon);
  }

  function defineCurrentSection(x, y) {
    let yAxis = y < XY_AXES_COORDINATES.Y ? "TOP" : "BOTTOM";
    let xAxis = x < XY_AXES_COORDINATES.X ? "LEFT" : "RIGHT";
    this.CURRENT_CIRCLE_SECTION = this.CIRCLE_SECTIONS[`${yAxis}_${xAxis}`];
  }

  function resetCurrentValues() {
    this.CURRENT_CIRCLE_SECTION = null;
    this.CURRENT_DIRECTION = null;
    // this.PREVIOUS_POSITION.X = 0;
    // this.PREVIOUS_POSITION.Y = 0;
    previousPosition.X = 0;
    previousPosition.Y = 0
  }

  function setPreviousDifferenceLengths(x, y) {
    // this.PREVIOUS_POSITION.X = x;
    // this.PREVIOUS_POSITION.Y = y;
    previousPosition.X = x;
    previousPosition.Y = y
  }

  function checkPreviousDifferenceLengths(x, y) {
    if (this.CURRENT_CIRCLE_SECTION === null) {
      return;
    }

    // let differenceX = x - this.PREVIOUS_POSITION.X;
    // let differenceY = y - this.PREVIOUS_POSITION.Y;
    let differenceX = x - previousPosition.X;
    let differenceY = y - previousPosition.Y;

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

    switch (this.CURRENT_CIRCLE_SECTION) {
      case this.CIRCLE_SECTIONS.TOP_LEFT:
        this.CURRENT_DIRECTION = getCurrentDirectionForTopLeftQuadrant(differenceX, differenceY);
        break;
      case this.CIRCLE_SECTIONS.TOP_RIGHT:
        this.CURRENT_DIRECTION = getCurrentDirectionForTopRightQuadrant(differenceX, differenceY);
        break;
      case this.CIRCLE_SECTIONS.BOTTOM_LEFT:
        this.CURRENT_DIRECTION = getCurrentDirectionForBottomLeftQuadrant(differenceX, differenceY);
        break;
      case this.CIRCLE_SECTIONS.BOTTOM_RIGHT:
        this.CURRENT_DIRECTION = getCurrentDirectionForBottomRightQuadrant(differenceX, differenceY);
        break;
    }

    setAdditiveMovementLength(differenceX, differenceY);
    setPreviousDifferenceLengths(x, y);
  }

  function setAdditiveMovementLength(x, y) {
    let absoluteHypotenuseLength = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

    if (this.CURRENT_DIRECTION === this.DIRECTIONS.CLOCKWISE) {
      // this.CURRENT_VECTOR_DIFFERENCE_LENGTH += absoluteHypotenuseLength;
      currentVectorDifferenceLength += absoluteHypotenuseLength;
    }

    if (this.CURRENT_DIRECTION === this.DIRECTIONS.COUNTERCLOCKWISE) {
      // this.CURRENT_VECTOR_DIFFERENCE_LENGTH -= absoluteHypotenuseLength;
      currentVectorDifferenceLength -= absoluteHypotenuseLength;
    }
  }

  function calculateIconCurrentPositions(dx) {
    function extractCorrectRestDisplacementThreshold(dx) {
      if (!dx || (dx => 0 && dx <= 1)) {
        return 1;
      }

      return 10;
    }

    icons.forEach((icon) => {
      let coordinates = this.calculateIconCurrentPosition(icon);

      Animated.spring(icon.position, {
        toValue: {
          x: coordinates.left,
          y: coordinates.top
        },
        easing: Easing.linear,
        speed: 30,
        restSpeedThreshold: 10,
        bounciness: 0,
        restDisplacementThreshold: extractCorrectRestDisplacementThreshold(dx)
      }).start((finish) => finish.finished
        && typeof this.ALL_ICONS_FINISH_ANIMATIONS.resolvers[icon.id] === "function"
        && this.ALL_ICONS_FINISH_ANIMATIONS.resolvers[icon.id]());
    });
  }

  function onPress() {

  }

  function defineAxesCoordinatesOnLayoutChangeByStylesOrScreenRotation() {

  }

  function defineAxesCoordinatesOnLayoutDisplacement() {
    wheelNavigatorRef.current.measure((x, y, width, height, pageX, pageY) => {
      setICON_PATH_RADIUS(height / 2 + STYLES.icon.height / 2 + SQUARE_DIMENSIONS.ICON_PADDING_FROM_WHEEL)
      setXY_AXES_COORDINATES({
        X: pageX + (width / 2),
        Y: pageY + (height / 2),
        PAGE_Y: pageY,
        PAGE_X: pageX
      })

      // this.STEP_LENGTH_TO_1_ANGLE = 2 * Math.PI * ICON_PATH_RADIUS / 360;
      stepLengthTo1Angle = 2 * Math.PI * ICON_PATH_RADIUS / 360;

      // calculateIconCurrentPositions();
    });

  }

  function rotateOnInputPixelDistanceMatchingRadianShift() {
    return [
      {
        transform: [
          {
            rotate: pan.interpolate({
              // inputRange: [-(this.GIRTH_ANGLE * this.STEP_LENGTH_TO_1_ANGLE), 0, this.GIRTH_ANGLE * this.STEP_LENGTH_TO_1_ANGLE],
              inputRange: [-(this.GIRTH_ANGLE * stepLengthTo1Angle), 0, this.GIRTH_ANGLE * stepLengthTo1Angle],
              outputRange: [`-${this.GIRTH_ANGLE}deg`, "0deg", `${this.GIRTH_ANGLE}deg`]
            })
          }
        ]
      }
    ]
  }

  function goToCurrentFocusedPage() {

  }

  return (
    <View
    // style={style}
    // onLayout={debounce(defineAxesCoordinatesOnLayoutChangeByStylesOrScreenRotation, 100)}
    >
      <Icons
        icons={icons}
        onPress={onPress}
      // styleIconText={styleIconText} 
      />
      <View
        style={[STYLES.wheel]}
        ref={wheelNavigatorRef}
        onLayout={defineAxesCoordinatesOnLayoutDisplacement}>
        {/* {this.state.showArrowHint && <View style={STYLES.swipeArrowHint}><SwipeArrowHint /></View>} */}
        <Animated.View
          style={rotateOnInputPixelDistanceMatchingRadianShift()}
          {...panResponder.panHandlers}>
          <CircleBlueGradient />
        </Animated.View>
        {/* <View
          style={STYLES.wheelTouchableCenter}
        >
          <CircleTouchable onPress={goToCurrentFocusedPage} />
        </View> */}
      </View>
    </View>
  )
}

