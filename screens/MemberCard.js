import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { 
  Card,
  Paragraph,
  Title
} from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { useToast } from 'react-native-toast-notifications';
import base64 from 'react-native-base64';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_TYPE, useHttp } from '../components/HttpProvider';
import { useUser } from '../components/UserProvider';

const { api } = __DEV__ ? require('../assets/config.dev.json') : require('../assets/config.json');

const { height, width } = Dimensions.get("window");

const states = [ "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RO", "RS", "RR", "SC", "SE", "SP", "TO" ];

const months = [ "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ];

const MemberCard = () => {
  const [cardUser, setCardUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [issuers, setIssuers] = React.useState(null);
  const [issuer, setIssuer] = React.useState('');
  const [validity, setValidity] = React.useState('');
  const [id, setId] = React.useState(null);
  const toast = useToast();
  const { user } = useUser();
  const { get } = useHttp();

  React.useEffect(() => {
    if (user?.user?.matricula) {
      get(API_TYPE.CADASTRO, 'associado.json?matricula=' + user.user.matricula).then(response => {
        if (!response?.rest || !response.rest.response) {
          toast.show('O serviço de Associados não retornou informação.', {
            type: 'custom_error',
            data: { title: "Erro no serviço de Associados" }
          });
        } else if (response.rest.error) {
          toast.show(response.rest.error, {
            type: "custom_error",
            data: { title: "Erro ao utilizar o serviço de Associados" }
          });
        } else {
          setId(response.rest.response.id);
          setCardUser(response.rest.response);
        }
        setLoading(false);
      }, error => {
        toast.show(error ? error : "Erro desconhecido no serviço de Associados", {
          type: 'custom_error',
          data: { title: 'Erro no serviço de Associados' }
        });
        setLoading(false);
      });

      get(API_TYPE.CADASTRO, 'orgaos.json').then(response => {
        if (!response?.rest?.response) {
          toast.show("O serviço de Órgãos Emissores não retornou informação.", {
            type: 'custom_error',
            data: { title: 'Erro no serviço de Órgão Emissor' }
          });
          setIssuers([]);
        } else if (response.rest.error) {
          toast.show(response.error, {
            type: 'custom_error',
            data: { title: 'Erro no serviço de Órgão Emissor' }
          });
          setIssuers([]);
        } else if (!response.rest.response.length) {
          toast.show("Nenhum registro de Órgão Emissor cadastrado.", {
            type: 'custom_error',
            data: { title: "Registro de Órgão Emissor não encontrado no cadastro" }
          });
          setIssuers([]);
        } else {
          setIssuers(response.rest.response);
        }
      }, error => {
        toast.show(error ? error : 'Erro desconhecido no serviço de Cadastro -> Órgão Emissor', {
          type: 'custom_error',
          data: { title: 'Erro no serviço de Órgão Emissor' }
        });
      });
    }
  }, []);

  React.useEffect(() => {
    if (cardUser && issuers) {
      const value = issuers.find(i => i.id === cardUser.orgaos_id);
      if (value) {
        setIssuer(value.descricao + '/' + states[cardUser.uf_expedidor - 1]);
      } else {
        toast.show('Órgão Expedidor id: ' + cardUser.orgaos_id + '. Não encontrado na base de dados.', {
          type: 'custom_error',
          data: { title: 'Órgão Emissor não encontrado' }
        });
      }

      const d = new Date();
      d.setMonth(d.getMonth() + 1);
      setValidity('01 de ' + months[d.getMonth()] + ' de ' + d.getFullYear());

      setLoading(false);
    }
  }, [cardUser, issuers]);

  return (
    <View style={styles.container}>
      <Header title="Carteirinha Virtual" />
      { loading ? <View style={styles.view}>
        <ActivityIndicator style={styles.loading} size="large" color="red" />
      </View> :
      <ScrollView>
        <ScrollView horizontal={true}>
          <Card mode="elevated" style={styles.card}>
            <Card.Content>
              <View style={styles.bgAvatar}></View>
              <Image style={styles.logo} source={require('../assets/images/logo.png')} />
              <Image style={styles.avatar} source={{uri: `${api.api}publico/avatar/${user?.user?.matricula}?${(new Date()).getTime()}`}} />
              <Title style={styles.title}>{cardUser.sexos_id === 1 ? 'PROFESSORA' : 'PROFESSOR' }</Title>
              <Title style={styles.nome}>{cardUser.nome}</Title>
              <View style={styles.bottom}>
                <View style={styles.info}>
                  <Paragraph style={styles.infoText}>RG: {cardUser.rg} {issuer}</Paragraph>
                  <Paragraph style={styles.infoText}>CPF: {cardUser.cpf}</Paragraph>
                  { (cardUser.matsedf !== 'AUTONOMO') && <Paragraph style={styles.infoText}>Mat. SEEDF: {cardUser.matsedf}</Paragraph> }
                  <Paragraph style={styles.infoText}>Mat. SINPRO: {("000000" + user?.user?.matricula).slice(-6) }</Paragraph>
                </View>
                <Paragraph style={styles.validity}>Validade {validity}</Paragraph>
                <View style={styles.qrcodeRight}>
                  <View style={styles.qrcodeContainer}>
                    { id && <QRCode style={styles.qrcode} color="black" backgroundColor="white" size={100} 
                      value={ "https://www.sinprodf.org.br/validar-carteirinha/?uid=" + base64.encode(id) }/> }
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>
          <View style={{ height: 500 }}></View>
        </ScrollView>
      </ScrollView> }
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  view: {
    flex: 1
  },
  loading: {
    top: height / 3
  },
  card: {
    flex: 1,
    transform: [
      { rotate: '90deg' },
      { translateX: 110 },
      { translateY: 95 }
    ],
    width: 520,
    maxHeight: 320,
    padding: 0,
    margin: 0
  },
  bgAvatar: {
    marginTop: -16,
    marginLeft: 230,
    marginRight: 125,
    marginBottom: 0,
    backgroundColor: 'royalblue',
    borderTopLeftRadius: 150,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    width: 150,
    height: 150
  },
  logo: {
    position: 'absolute',
    top: 0,
    width: 208,
    height: 78
  },
  avatar: {
    position: 'absolute',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 5,
    width: 150,
    height: 150,
    top: 0,
    right: 0
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingLeft: 10,
    marginTop: -50
  },
  nome: {
    backgroundColor: 'red',
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
    width: 520,
    paddingLeft: 10,
    height: 30,
    margin: 0,
    marginLeft: -16
  },
  bottom: {
    flexDirection: 'row',
    backgroundColor: 'royalblue'
  },
  info: {
    backgroundColor: 'royalblue',
    minHeight: 150,
    width: 246,
    padding: 16,
    marginLeft: -16,
    marginTop: -2
  },
  infoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  },
  validity: {
    color: 'black',
    position: 'absolute',
    fontSize: 10,
    zIndex: 9999,
    bottom: 125,
    right: 20
  },
  qrcodeRight: {
    width: 275,
    top: 0,
    borderBottomLeftRadius: 150,
    backgroundColor: 'white'
  },
  qrcodeContainer: {
    width: 70,
    backgroundColor: 'white',
    top: 30,
    left: 130
  },
  qrcode: {
    flexDirection: 'row',
    position: 'absolute',
    right: 100,
    bottom: 100,
    zIndex: 9999
  }
});

export default MemberCard;
