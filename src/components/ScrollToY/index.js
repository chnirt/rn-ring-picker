import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Button,
  Pressable,
  Animated,
  PanResponder,
  Dimensions,
  Easing,
} from 'react-native';

export function ScrollToY() {
  const scrollRef = useRef();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.paragraph}>Some form goes here</Text>

      <ScrollView ref={scrollRef}>
        <Text>Field 1</Text>
        <TextInput style={styles.textInput} />

        <Text>Field 2</Text>
        <TextInput style={styles.textInput} />

        <Text
          onLayout={(event) => {
            console.log(event.nativeEvent.layout);
            this.fieldThreeLayout = event.nativeEvent.layout;
          }}>
          Field 3
        </Text>
        <TextInput style={styles.textInput} />

        <Text>Field 4</Text>
        <TextInput style={styles.textInput} />

        {[...Array(7).keys()].map((item, i) => (
          <Text key={i} style={styles.paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>
        ))}

        <Button
          title="Sibmit"
          onPress={() => {
            scrollRef.current?.scrollTo({
              y: this.fieldThreeLayout.y,
              animated: true,
            });
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderRadius: 5,
    borderWidth: 1,
  },
  paragraph: {
    marginTop: 10,
    marginBottom: 10,
  },
});
