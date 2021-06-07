import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

export function Neumorphism({
  width = 50,
  height = 50,
  borderRadius = 50 / 2,
  children,
}) {
  const formattedWidth =
    typeof width === 'string' ? +width.replace('%', '') / 4 : width / 4;
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
      ]}>
      <Pressable
        style={[
          styles.inner,
          {
            backgroundColor: '#E5E6EE',
            width,
            height,
            borderRadius,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#DDE0EB',
            borderWidth: 1,

            shadowColor: '#FFFFFF',
            shadowOffset: {
              width: -formattedWidth,
              height: -formattedWidth,
            },
            shadowRadius: formattedWidth,
          },
        ]}>
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
