import React from 'react';
import { StyleSheet, View } from 'react-native';

export function Neumorphism({
  width = 50,
  height = 50,
  borderRadius = 50 / 2,
  contentContainerStyles,
  borderColor = '#D3DAE7',
  borderWidth = 1,
  backgroundColor = '#E5E6EE',
  type = 'normal',
  children,
}) {
  const divisor = 30;
  const formattedWidth =
    typeof width === 'string'
      ? +width.replace('%', '') / divisor
      : width / divisor;
  const isInset = type === 'inset';
  if (isInset) {
    return (
      <View
        style={[styles.insetOuter, {
          width: width + borderWidth,
          height: height + borderWidth,
          borderRadius,
        }]}>
        <View
          style={[styles.insetInner, {
            width: width + borderWidth,
            height: height + borderWidth,
            borderColor,
            borderWidth,
            borderRadius,
          }]}>
          {children}
        </View>
      </View>
    );
  }
  return (
    <View
      style={[
        styles.outer,
        {
          shadowColor: '#00000070',
          shadowOffset: {
            width: formattedWidth,
            height: formattedWidth,
          },
          shadowRadius: formattedWidth,
        },
        contentContainerStyles,
      ]}>
      <View
        style={[
          styles.inner,
          {
            backgroundColor,
            width,
            height,
            borderRadius,
            borderColor,
            borderWidth,

            shadowColor: '#FFFFFF',
            shadowOffset: {
              width: -formattedWidth,
              height: -formattedWidth,
            },
            shadowRadius: formattedWidth,
          },
        ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    shadowOpacity: 0.3,
    elevation: 5,
  },
  inner: { shadowOpacity: 1, elevation: 5 },
  insetOuter: {
    backgroundColor: 'transparent',
    borderColor: "transparent",
    borderRightColor: '#FFFFFF',
    borderBottomColor: "#FFFFFF",
    borderWidth: 1,
    shadowColor: '#FFFFFF',
    shadowOpacity: 1,
    shadowOffset: {
      width: -1,
      height: -1,
    },
    overflow: 'hidden',
  },
  insetInner: {
    backgroundColor: 'transparent',
    shadowColor: '#00000050',
    shadowOpacity: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    overflow: 'hidden',
  }
});
