import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const FormPickerInput = ({label, value, setValue, valueList, disabled, onValueChange}) => {
  const onChange = (value) => {
    if (onValueChange) {
      onValueChange(value);
    }
    setValue(value);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Picker style={styles.value} selectedValue={value} onValueChange={(value) => onChange(value)} enabled={!disabled}>
        {valueList?.map(i => <Picker.Item key={i.id} label={i.descricao} value={i} />)}
      </Picker>
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
    justifyContent: "center",
    flexWrap: 'wrap'
  },
  value: {
    flex: 3,
    flexDirection: "row",
    backgroundColor: 'lightgray',
    marginTop: 5,
    marginBottom: 5
  }
});

export default FormPickerInput;
