import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

const FormPickerInput = ({label, addButtonLabel, valueList, setValueList, validationFunction, disabled, isPhone}) => {
  const onValueChange = (value, index) => {
    const newList = [];
    const newValue = validationFunction ? validationFunction(value) : value;
    for(let i = 0; i < valueList?.length; i++) {
        newList.push((i === index) ? newValue : valueList[i]);
    }
    setValueList(newList);
  }

  const addNewValue = () => {
    const newList = [];
    valueList.forEach(e => {
      newList.push(e);
    });
    newList.push('');
    setValueList(newList);
  }

  const removeValue = (index) => {
    const newList = [];
    for (let i = 0; i < valueList?.length; i++) {
      if (i !== index) {
        newList.push(valueList[i]);
      }
    }
    setValueList(newList);
  }

  return(
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.formList}>
          {valueList.map((e, index) => <View style={styles.formRow} key={index}>
            <TextInput style={styles.value} value={e} keyboardType={isPhone ? 'phone-pad' : 'default' } 
              onChangeText={(value) => onValueChange(value, index)} />
            <TouchableOpacity style={styles.listRemoveButton} onPress={() => removeValue(index)}>
              <Icon name="cancel" size={20} color="red" />
            </TouchableOpacity>
          </View>)}
        </View>
      </View>
      <TouchableOpacity style={styles.listAddButton} onPress={addNewValue} disabled={disabled}>
        <Text>{addButtonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginRight: 10
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5
  },
  label: {
    flex: 1,
    justifyContent: "center"
  },
  formList: {
    flex: 3,
    flexDirection: "column"
  },
  formRow: {
    flex: 3,
    flexDirection: "row"
  },
  value: {
    flex: 3,
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5
  },
  listAddButton: {
    flex: 1,
    flexDirection: "row-reverse"
  },
  listRemoveButton: {
    justifyContent: "center"
  }
});

export default FormPickerInput;
