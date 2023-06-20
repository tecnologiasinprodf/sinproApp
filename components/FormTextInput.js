import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

const FormTextInput = ({label, value, setValue, validationFunction, disabled, keyboardType, secureTextEntry, blur}) => {
  const onChange = (text) => {
    if (validationFunction) {
        setValue(validationFunction(text));
    } else {
        setValue(text);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={value} keyboardType={keyboardType || 'default'} onBlur={blur} 
        onChangeText={(text) => onChange(text)} editable={!disabled} secureTextEntry={Boolean(secureTextEntry)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 10,
    marginRight: 10
  },
  label: {
    flex: 1,
    justifyContent: "center"
  },
  input: {
    flex: 3,
    flexDirection: "row",
    backgroundColor: 'lightgray',
    marginTop: 5,
    marginBottom: 5,
    borderColor: 'black',
    borderWidth: 1
  }
});

export default FormTextInput;
