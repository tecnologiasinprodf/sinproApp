import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import DatePicker from 'react-native-date-picker';

const FormDateInput = ({label, value, setValue, disabled, locale}) => {
  const [openDatePicker, setOpenDatePicker] = React.useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.formRow} onPress={() => setOpenDatePicker(true)} disabled={disabled}>
        <Text>
          {(value.getDate() < 10) ? ('0' + value.getDate()) : value.getDate()}/
          {((value.getMonth() + 1) < 10) ? ('0' + (value.getMonth() + 1)) : (value.getMonth() + 1)}/
          {value.getFullYear()}
        </Text>
      </TouchableOpacity>
      <DatePicker modal open={openDatePicker} date={value} maximumDate={new Date()} mode="date" locale={locale ?? "pt-BR"}
        onConfirm={(newDate) => { setOpenDatePicker(false); setValue(newDate) }}
        onCancel={() => { setOpenDatePicker(false) }}
      />
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
  formRow: {
    flex: 3,
    flexDirection: "row"
  }
});

export default FormDateInput;
