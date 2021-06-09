import React from 'react';
import {StyleSheet, View} from 'react-native';

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
        style={{
          width: width + borderWidth,
          height: height + borderWidth,
          backgroundColor: 'transparent',
          borderColor: '#FFFFFF',
          borderWidth,
          borderRadius,
          shadowColor: '#ffffff',
          shadowOpacity: 1,
          shadowOffset: {
            width: -1,
            height: -1,
          },
          overflow: 'hidden',
        }}>
        <View
          style={{
            width: width + borderWidth,
            height: height + borderWidth,
            backgroundColor: 'transparent',
            borderColor,
            borderWidth,
            borderRadius,
            shadowColor: '#00000050',
            shadowOpacity: 1,
            shadowOffset: {
              width: 1,
              height: 1,
            },
            overflow: 'hidden',
          }}>
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
          shadowColor: '#000000',
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
  inner: {shadowOpacity: 1, elevation: 5},
});
