import React from 'react';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native';
import { useToast } from 'react-native-toast-notifications';

import Header from '../components/Header';
import Footer from '../components/Footer';
import FormTextInput from '../components/FormTextInput';
import { validateCPF } from '../core/util/utils';
import { API_TYPE, useHttp } from '../components/HttpProvider';

const { height } = Dimensions.get('window');

const CreateAccount = ({ navigation }) => {
  const [tempContract, setTempContract] = React.useState(false);
  const [sedfNumber, setSedfNumber] = React.useState('');
  const [cpf, setCpf] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmation, setConfirmation] = React.useState('');
  const [disableTempContract, setDisableTempContract] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const toast = useToast();
  const { get, post } = useHttp();

  const createAccount = () => {
    if (!password || !confirmation || (password?.length < 6) || (confirmation?.length < 6)) {
      toast.show('A senha necessita ter no mínimo 6 dígitos', {
        type: 'custom_error',
        data: { title: 'Campo senha inválido' }
      });
    } else if (password !== confirmation) {
      toast.show('Os campos senha e confirmar senha não conferem', {
        type: 'custom_error',
        data: { title: 'Senha não confere' }
      });
    } else {
      setLoading(true);
      const data = {
        nome: name,
        email: email,
        senha: password,
        confirmar: confirmation
      };
      if (tempContract) {
        data.cpf = cpf.replaceAll('.', '').replaceAll('-', '');
      } else {
        data.matsedf = sedfNumber;
      }
      post(API_TYPE.AUTH, 'criar.json', data).then(response => {
        setLoading(false);
        setDisableTempContract(false);
        if (!response?.rest) {
          toast.show("O serviço de Criar Conta não recebeu nenhuma informação.", {
            type: "custom_error",
            data: { title: "Erro no serviço de Criar Conta" }
          });
        } else if (response.rest.error) {
          toast.show(response.rest.error, {
            type: "custom_error",
            data: { title: "Erro no serviço de Criar Conta" }
          });
        } else {
          toast.show('Sua conta foi criada com sucesso. Realize seu Login.', {
            type: 'custom_success',
            data: { title: 'Conta criada com sucesso' }
          });
          navigation.popToTop();
          navigation.navigate('Login');
        }
      });
    }
  }

  const searchField = (field, value, minSize, maxSize) => {
    setConfirmation('');
    setPassword('');
    setEmail('');
    setName('');

    if ((value.length >= minSize) && (value.length <= maxSize)) {
      setLoading(true);

      get(API_TYPE.AUTH, `consultar.json?${field}=${value}`).then(response => {
        setLoading(false);
        if (!response?.rest) {
          setDisableTempContract(false);
          toast.show("O serviço de Consultar CPF não recebeu nenhuma informação.", {
            type: "custom_error",
            data: { title: "Erro no serviço de Consultar CPF" }
          });
        } else if (response.rest.error) {
          setDisableTempContract(false);
          toast.show(response.rest.error, {
            type: "custom_error",
            data: { title: "Erro no serviço de Consultar CPF" }
          });
        } else {
          setEmail(response.rest.response.email);
          setName(response.rest.response.nome);
          setDisableTempContract(true);
        }
      });
    } else {
      setDisableTempContract(false);
    }
  }

  const searchRegistration = () => {
    searchField('matsedf', sedfNumber, 6, 7);
  }

  const searchCpf = () => {
    searchField('cpf', cpf.replaceAll('.', '').replaceAll('-', ''), 11, 11);
  }

  return (<View style={styles.container}>
    <Header title="Criar Conta" />
    { loading ? 
      <View style={styles.spinner}><ActivityIndicator size='large' color='red' /></View> :
      <ScrollView>
        <View style={styles.formControl}>
          <Text style={styles.label}>Contrato Temporário</Text>
          <Switch onValueChange={() => setTempContract(!tempContract)} value={tempContract} disabled={disableTempContract} />
        </View>
        { tempContract ? 
          <FormTextInput label="CPF" value={cpf} setValue={setCpf} validationFunction={validateCPF} keyboardType='numeric' 
            blur={searchCpf} /> :
          <FormTextInput label="Matrícula da secretaria" value={sedfNumber} setValue={setSedfNumber} blur={searchRegistration} />
        }
        <FormTextInput label="Nome" value={name} disabled={true} />
        <FormTextInput label="Email" value={email} disabled={true} />
        <FormTextInput label="Senha" value={password} setValue={setPassword} secureTextEntry={true} />
        <FormTextInput label="Confirmar Senha" value={confirmation} setValue={setConfirmation} secureTextEntry={true} />
      </ScrollView>
    }
    <Button title="Enviar" onPress={createAccount} />
    <Footer />
  </View>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  formControl: {
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
  spinner: {
    flex: 1,
    paddingTop: height / 3
  }
});

export default CreateAccount;
