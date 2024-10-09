import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ value, onValueChange }) => {
  const backgroundColor = value ? '#059669' : 'grey';

  return (
    <Pressable
      style={[styles.switch, { backgroundColor }]}
      onPress={() => onValueChange(!value)}
    >
      <View style={[styles.circle, { marginLeft: value ? 20 : 0 }]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 5,
    justifyContent: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
});

export default CustomSwitch;
