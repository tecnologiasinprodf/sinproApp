import React from "react";
import {
  ActivityIndicator,
  Button,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Dialog, Paragraph } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';

import { validateCPF } from '../core/util/utils';
import { useUser } from '../components/UserProvider';
import { API_TYPE, useHttp } from '../components/HttpProvider';

const { height, width } = Dimensions.get("window");

const Login = ({ navigation }) => {
  const [ matricula, setMatricula ] = React.useState(null);
  const [ password, setPassword ] = React.useState(null);
  const [ login, setLogin ] = React.useState(false);
  const [ loading, setLoading ] = React.useState(false);
  const [ showForgot, setShowForgot ] = React.useState(false);
  const [ code, setCode ] = React.useState('');
  const [ showEnroll, setShowEnroll ] = React.useState(false);
  const [ name, setName ] = React.useState('');
  const [ cpf, setCpf ] = React.useState('');
  const [ id, setId ] = React.useState('');
  const [ email, setEmail ] = React.useState('');
  const [ phone, setPhone ] = React.useState('');

  const toast = useToast();
  const { post } = useHttp();
  const { setUser } = useUser();

  React.useEffect(() => {
    if (login) {
      setLoading(true);
      post(API_TYPE.AUTH, 'auth.json', {
        device: 'pwa',
        login: matricula,
        senha: password
      }).then(response => {
        if (response?.rest?.response?.user) {
          if (response.rest.response.user.matricula) {
            setUser(response.rest.response);
            navigation.navigate('Welcome');
          } else {
            toast.show("Serviço de login não retornou a matrícula do usuário", {
              type: "custom_error",
              data: { title: "Erro a realizar Login" }
            });
          }
        } else {
          if (response?.rest?.error) {
            toast.show(response.rest.error, { type: 'custom_error', data: { title: 'Erro no login' } });
          } else {
            toast.show("Erro desconhecido ao realizar login.", { type: 'custom_error', data: { title: 'Erro código ' + response.status } });
          }
          setUser(null);
        }
        setLoading(false);
      }, error => {
        setUser(null);
        toast.show("Erro desconhecido ao realizar login. Mensagem: " + error, { type: 'custom_error', data: { title: 'Erro no login' } });
        setLoading(false);
      });
    }
    setLogin(false);
  }, [login]);

  const enroll = () => {
    const url = 'mailto:informatica@sinprodf.org.br?subject=Solicitação de Filiação&body=Nova solicitação de filiação. Nome: ' + 
      name + '. CPF: ' + cpf + '. RG: ' + id + '. E-Mail: ' + email + '. Telefone: ' + phone + '.';
    if (Linking.canOpenURL(url)) {
      Linking.openURL(url);
      toast.show('Você será direcionado a enviar um e-mail de solicitação', {
        type: 'custom_success',
        data: { title: 'Envio de Solicitação de Filiação' }
      });
    } else {
      toast.show('Seu dispositivo não pode enviar o email necessário. Favor se dirigir ao Sinpro-DF para realizar sua filiação.', {
        type: 'custom_error',
        data: { title: 'Erro ao enviar o E-Mail' }
      });
    }
    setShowEnroll(false);
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={require('../assets/images/background.jpeg')} style={styles.image}></Image>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => setShowForgot(true)}>
          <Text style={styles.lowerButtons}>Esqueci Minha Senha</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
          <Text style={styles.lowerButtons}>Criar Login</Text>
        </TouchableOpacity>
      </View>
      <TextInput style={[styles.inputText, styles.inputTextTop]} placeholder="Matrícula" value={matricula} 
          onChangeText={(event) => setMatricula(event)} editable={!loading && !showForgot && !showEnroll} />
      <TextInput style={[styles.inputText, styles.inputTextBottom]} secureTextEntry={true} placeholder="Sua senha" 
        value={password} onChangeText={(event) => setPassword(event)} editable={!loading && !showForgot && !showEnroll} />
      { loading && <View style={styles.spinner}>
        <ActivityIndicator size="large" color='#C2272D' />
      </View> }
      { (showForgot || showEnroll) && <View style={styles.dialog}>
        <Dialog visible={showForgot} onDismiss={() => setShowForgot(false)}>
          <Dialog.Title>Esqueci Minha Senha</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Você receberá uma nova senha em seu email.</Paragraph>
            <TextInput style={styles.textDialog} placeholder="código ou matrícula" value={code} 
              onChangeText={(text) => setCode(text)} keyboardType="numeric" />
          </Dialog.Content>
          <Dialog.Actions style={styles.actionsDialog}>
            <Button title="Enviar" onPress={() => alert('Funcionalidade em desenvolvimento. Favor entrar diretamente em contato com o Sinpro-DF.')} />
          </Dialog.Actions>
        </Dialog>
        <Dialog visible={showEnroll} onDismiss={() => setShowEnroll(false)}>
          <Dialog.Title>Filiação</Dialog.Title>
          <Dialog.Content>
            <TextInput style={styles.textDialog} placeholder="Nome" value={name} onChangeText={(text) => setName(text)} />
            <TextInput style={styles.textDialog} placeholder="CPF" value={cpf} onChangeText={(text) => setCpf(validateCPF(text))} 
              keyboardType="numeric" />
            <TextInput style={styles.textDialog} placeholder="RG" value={id} onChangeText={(text) => setId(text)} />
           <TextInput style={styles.textDialog} placeholder="E-Mail" value={email} onChangeText={(text) => setEmail(text)} />
           <TextInput style={styles.textDialog} placeholder="Telefone" value={phone} onChangeText={(text) => setPhone(text)} 
              keyboardType="phone-pad"/>
          </Dialog.Content>
          <Dialog.Actions style={styles.actionsDialog}>
            <Button title="Enviar" onPress={() => enroll()} />
          </Dialog.Actions>
        </Dialog>
      </View> }
      <TouchableOpacity style={styles.button} onPress={() => setLogin(true)} disabled={showForgot || showEnroll}>
        <Text style={styles.textButton}>Entrar</Text>
      </TouchableOpacity>
      <View style={styles.enroll}>
        <TouchableOpacity onPress={() => setShowEnroll(true)}>
          <Text style={styles.lowerButtons}>Filie-se</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FCFCFC'
  },
  image: {
    height: height / 2,
    width: width
  },
  inputText: {
    backgroundColor: 'lightgray',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    width: 3* width / 4,
    alignSelf: 'center',
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 2
  },
  inputTextTop: {
    marginTop: 50
  },
  inputTextBottom: {
    marginBottom: 25
  },
  dialog: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: 10
  },
  button: {
    justifyContent: 'center',
    backgroundColor: '#C2272D',
    width: 3 * width / 4,
    height: 50,
    alignSelf: 'center',
    borderRadius: 5,
    zIndex: 1
  },
  textButton: {
    color: '#FCFCFC',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  spinner: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 10
  },
  textDialog: {
    color: "black",
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'lightgray'
  },
  actionsDialog: {
    justifyContent: 'center'
  },
  lowerButtons: {
    color: '#C2272D',
    fontWeight: 'bold'
  },
  enroll: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20
  }
});

export default Login;
