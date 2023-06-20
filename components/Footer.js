import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
  const navigation = useNavigation();
  const exit = () => {
    navigation.popToTop();
    navigation.navigate('Login');
  }

  return (<View style={styles.container}>
    <View>
      <TouchableOpacity onPress={ () => navigation.goBack() }>
        <Image style={styles.image} source={require('../assets/images/icone-voltar.png')} />
      </TouchableOpacity>
    </View>
    <View>
      <TouchableOpacity onPress={exit}>
        <Image style={styles.image} source={require('../assets/images/icone-sair.png')} />
      </TouchableOpacity>
    </View>
  </View>);
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FCFCFC',
    borderTopColor: '#D9D9D9',
    borderTopWidth: 2
  },
  image: {
    height: 50,
    width: 50
  }
});

export default Footer;
