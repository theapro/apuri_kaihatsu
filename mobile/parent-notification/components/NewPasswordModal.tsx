import React, { useState, useContext } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';

const NewPasswordModal = ({ isVisible, onSubmit, onCancel }: {isVisible: boolean, onSubmit: (newPassword: string) => {}, onCancel: () => {}}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    if (newPassword === confirmPassword && newPassword !== '') {
      onSubmit(newPassword);
    } else {
      // Handle error: passwords do not match or are empty
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Create New Password</Text>
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="New Password"
            onChangeText={setNewPassword}
          />
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Confirm New Password"
            onChangeText={setConfirmPassword}
          />
          <Button title="Submit" onPress={handleSubmit} />
          <Button title="Cancel" onPress={onCancel} color="red" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  input: {
    width: 200,
    height: 40,
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
