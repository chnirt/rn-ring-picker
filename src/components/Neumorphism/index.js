import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

export function Neumorphism({
  width = 50,
  height = 50,
  borderRadius = 50 / 2,
  contentContainerStyles,
  borderColor = '#D9DFEA',
  borderWidth = 1,
  onPress = () => {},
  children,
}) {
  const divisor = 30;
  const formattedWidth =
    typeof width === 'string'
      ? +width.replace('%', '') / divisor
      : width / divisor;
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
      <Pressable
        style={[
          styles.inner,
          {
            backgroundColor: '#E5E6EE',
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
        ]}
        onPress={onPress}>
        {children}
      </Pressable>
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
