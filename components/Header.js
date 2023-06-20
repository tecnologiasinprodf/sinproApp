import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { useUser } from './UserProvider';

const Header = ({ title }) => {
  const { user } = useUser();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="account-circle" size={50} color="#EBEBEB"></Icon>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View><Text style={styles.userText}>Olá, {user?.user?.nome}</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#C2272D',
    paddingTop: 25,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between'    
  },
  title: {
    color: '#FCFCFC',
    fontWeight: 'bold',
    fontSize: 30
  },
  userText: {
    color: '#FCFCFC',
    fontWeight: 'bold',
    fontSize: 20
  }
});

export default Header;
