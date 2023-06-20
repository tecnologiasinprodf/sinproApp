import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

import Header from '../components/Header';
import Footer from '../components/Footer';

const Welcome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header title="Bem Vindo" navigation={navigation} />
      <ScrollView>
        <View style={styles.content}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Announcement')}>
            <Image style={styles.image} source={require('../assets/images/comunicados.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Schedule')}>
            <Image style={styles.image} source={require('../assets/images/agendamentos.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Registry')}>
            <Image style={styles.image} source={require('../assets/images/atualizar-cadastro.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MemberCard')}>
            <Image style={styles.image} source={require('../assets/images/carteirinha-virtual.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Covenant')}>
          <Image style={styles.image} source={require('../assets/images/convenios.png')} />
            </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Payment')}>
            <Image style={styles.image} source={require('../assets/images/pagamentos.png')} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    padding: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    margin: 15,
    width: 160,
    height: 120,
    alignItems: 'center',
    textAlign: 'center'
  },
  image: {
    width: 160,
    height: 120,
    borderRadius: 10
  }
});

export default Welcome;
