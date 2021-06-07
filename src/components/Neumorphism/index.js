import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

export function Neumorphism({width = 50, borderRadius = 50 / 2, children}) {
  return (
    <View
      style={[
        styles.outer,
        {
          shadowColor: '#000000',
          shadowOffset: {
            width: width / 5,
            height: width / 5,
          },
          shadowRadius: width / 5,
        },
      ]}>
      <Pressable
        style={[
          styles.inner,
          {
            backgroundColor: '#E5E6EE',
            width,
            aspectRatio: 1,
            borderRadius,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#DDE0EB',
            borderWidth: 1,

            shadowColor: '#FFFFFF',
            shadowOffset: {
              width: -width / 5,
              height: -width / 5,
            },
            shadowRadius: width / 5,
          },
        ]}>
        {children}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    shadowOffset: {
      width: 12,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  inner: {
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
  },
});
