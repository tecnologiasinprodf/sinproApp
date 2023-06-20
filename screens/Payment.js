import React from 'react';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Card, Dialog, Divider, Paragraph, Title } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useUser } from '../components/UserProvider';
import { API_TYPE, useHttp } from '../components/HttpProvider';
import { useToast } from 'react-native-toast-notifications';

const { height } = Dimensions.get('window');
const lastMonth = new Date();

const Payment = () => {
  const [loadingInvoice, setLoadingInvoice] = React.useState(true);
  const [loadingContracts, setLoadingContracts] = React.useState(true);
  const [loadingPayments, setLoadingPayments] = React.useState(true);
  const [loadingUser, setLoadingUser] = React.useState(true);
  const [session, setSession] = React.useState(null);
  const [invoice, setInvoice] = React.useState(null);
  const [contracts, setContracts] = React.useState([]);
  const [payments, setPayments] = React.useState([]);
  const [userInfo, setUserInfo] = React.useState({});
  const [contract, setContract] = React.useState(null);

  const toast = useToast();
  const navigation = useNavigation();
  const { get } = useHttp();
  const { user } = useUser();
  let webview = null;

  React.useEffect(() => {
    lastMonth.setMonth(lastMonth.getMonth() - 1);

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
        setUserInfo(response.rest.response);
      }
      setLoadingUser(false);
    }, error => {
      toast.show(error ? error : "Erro desconhecido no serviço de Associados", {
        type: 'custom_error',
        data: { title: 'Erro no serviço de Associados' }
      });
      setLoadingUser(false);
    });

    get(API_TYPE.MOBILE, 'contratos/planos.json').then(response => {
      if (!response?.rest) {
        toast.show("O serviço de Contratos não retornou nenhuma informação.", {
          type: "custom_error",
          data: { title: "Erro no serviço de Contratos" }
        });
      } else if (response.rest.error) {
        toast.show(response.rest.error, {
          type: "custom_error",
          data: { title: "Erro no serviço de Contratos" }
        });
      } else {
        response.rest.response.forEach(item => {
          const mes = (new Date()).getMonth() + 1;
          if (item.mes === 3) {
            if((mes >= 1) && (mes <= 3)) {
              item.observacao = 'Primeira trimestralidade de ';
            }
            if((mes >= 4) && (mes <= 6)) {
              item.observacao = 'Segunda trimestralidade de ';
            }
            if((mes >= 7) && (mes <= 9)) {
              item.observacao = 'Terceira trimestralidade de ';
            }
            if((mes >= 10) && (mes <= 12)) {
              item.observacao = 'Quarta trimestralidade de ';
            }
          } else if (item.mes === 6) {
            if (mes < 6) {
              item.observacao = 'Primeira semestralidade de ';
            } else {
              item.observacao = 'Segunda semestralidade de ';
            }
          } else {
            item.observacao = 'Referente ao ano de ';
          }
          item.observacao += (new Date()).getFullYear();
        });
        setContracts(response.rest.response);
        setLoadingContracts(false);
      }
    }, error => {
      toast.show(error ? error : "Erro desconhecido no serviço de Contratos", {
        type: 'custom_error',
        data: { title: 'Erro no serviço de Contratos' }
      });
      setLoadingContracts(false);
    });

    if (user?.user?.matricula) {
      get(API_TYPE.MOBILE, 'contratos/boleto.json?matricula=' + user?.user?.matricula).then(response => {
        if (!response?.rest) {
          toast.show("O serviço de Boletos não retornou nenhuma informação.", {
            type: "custom_error",
            data: { title: "Erro no serviço de Boletos" }
          });
        } else if (response.rest.error) {
          toast.show(response.rest.error, {
            type: "custom_error",
            data: { title: "Erro no serviço de Boletos" }
          });
        } else {
          if (response.rest.response) {
            response.rest.response.msg = '2ª Via do boleto';
          } else {
            response.rest.response.msg = 'R$ ' + response.rest.response.msg;
          }
          setInvoice(response.rest.response);
          setLoadingInvoice(false);
        }
      }, error => {
        toast.show(error ? error : "Erro desconhecido no serviço de Boletos", {
          type: 'custom_error',
          data: { title: 'Erro no serviço de Boletos' }
        });
        setLoadingInvoice(false);
      });

      get(API_TYPE.MOBILE, 'contratos/pagamentos.json?matricula=' + user?.user?.matricula).then(response => {
        if (!response?.rest) {
          toast.show("O serviço de Pagamentos não retornou nenhuma informação.", {
            type: "custom_error",
            data: { title: "Erro no serviço de Pagamentos" }
          });
        } else if (response.rest.error) {
          toast.show(response.rest.error, {
            type: "custom_error",
            data: { title: "Erro no serviço de Pagamentos" }
          });
        } else {
          setPayments(response.rest.response);
          setLoadingPayments(false);
        }
      }, error => {
        toast.show(error ? error : "Erro desconhecido no serviço de Pagamentos", {
          type: 'custom_error',
          data: { title: 'Erro no serviço de Pagamentos' }
        });
        setLoadingPayments(false);
      });
    } else {
      toast.show("O usuário não foi encontrado. Favor fechar e reabrir o App.", {
        type: "custom_error",
        data: { title: "Usuário não encontrado" }
      });
      navigation.navigate('Login');
    }
  }, []);

  const formatDate = (strDate) => {
    const z = (str) => { return ('0' + str).slice(-2); }
    const date = new Date(strDate);
    return z(date.getDate()) + '/' + z(date.getMonth() + 1) + '/' + date.getFullYear();
  }

  const openPayment = (url) => {
console.log("openPayment", url);
  }

  const createPayment = (payment) => {
    const contract = payment;
    setContract(null);
    setLoadingInvoice(true);

    get(API_TYPE.MOBILE, `pagseguro/createBoleto.json?matricula=${user.user.matricula}&plano=${contract.id}&session=${session}`)
    .then(response => {
debugger;
      if (!response?.rest) {
        toast.show("O serviço de Geração de Boletos não retornou nenhuma informação.", {
          type: "custom_error",
          data: { title: "Erro no serviço de Geração de Boletos" }
        });
      } else if (response.rest.error) {
        toast.show(response.rest.error, {
          type: "custom_error",
          data: { title: "Erro no serviço de Geração de Boletos" }
        });
      } else {
        response.rest.response.msg = 'Gerado com sucesso';
        setInvoice(response.rest.response);
      }
      setLoadingInvoice(false);
    }, error => {
      toast.show(error ? error : "Erro desconhecido no serviço de Geração de Boletos", {
        type: 'custom_error',
        data: { title: 'Erro no serviço de Geração de Boletos' }
      });
      setLoadingInvoice(false);
    });
  }

  return (
    <View style={styles.container}>
      <Header title="Pagamentos" />
      { (!session || loadingContracts || loadingInvoice || loadingPayments || loadingUser) ? 
        <View style={styles.spinner}><ActivityIndicator style={styles.loading} size='large' color='red' /></View> :
        <ScrollView>
          <Card style={styles.card} mode='elevated'>
            <Card.Content>
              {invoice?.payment_link ?<View>
                <View style={styles.item}>
                  <View style={styles.itemIcon}><Icon name="receipt-long" size={40} color='black'></Icon></View>
                  <View style={styles.itemText}>
                    <Title>{invoice.msg}</Title>
                  </View>
                  <View>
                    <TouchableOpacity style={styles.itemButton} onPress={() => openPayment(invoice.id)}>
                      <Title style={styles.buttonText}>Gerar Boleto</Title>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.item}>
                  <Paragraph>
                    Boleto no valor de <Text style={styles.bold}>
                      R$ {invoice.valor_pago}
                    </Text> gerado em nossa conta no <Text style={styles.bold}>
                      PagSeguro
                    </Text> na data de <Text style={styles.bold}>
                      {invoice.data_envio}
                    </Text>. Enviamos o boleto para o email registrado em nosso cadastro.
                  </Paragraph>
                </View>
              </View> :
              userInfo?.autonomo ? <View>
                <Title>Opções de Pagamento</Title>
                <Divider />
                {contracts && contracts.map(item => <View key={item.id} style={styles.item}>
                  <View style={styles.itemIcon}><Icon name="receipt-long" size={40} color='black'></Icon></View>
                  <View style={styles.itemText}>
                    <Title>R$ {item.valor} {item.descricao}</Title>
                    <Paragraph>{item.observacao}</Paragraph>
                  </View>
                  {session && <View>
                    <TouchableOpacity style={styles.itemButton} onPress={() => setContract(item)} disabled={loadingInvoice}>
                      <Title style={styles.buttonText}>Gerar</Title>
                    </TouchableOpacity>
                  </View>}
                  <Divider />
                </View>)}
              </View> : 
              <View>
                <Title>Cadastro</Title>
                <View style={styles.info}>
                  <Text style={styles.infoLabel}>Situação</Text>
                  <Paragraph style={styles.infoValue}>{userInfo.situacao}</Paragraph>
                </View>
                <View style={styles.info}>
                  <Text style={styles.infoLabel}>Pagamento</Text>
                  <Paragraph style={styles.infoValue}>Mês {lastMonth.getMonth() + 1}/{lastMonth.getFullYear()}</Paragraph>
                </View>
                <View style={styles.info}>
                  <Text style={styles.infoLabel}>Mat. SINPRO</Text>
                  <Paragraph style={styles.infoValue}>{userInfo.id}</Paragraph>
                </View>
                <View style={styles.info}>
                  <Text style={styles.infoLabel}>Mat. SEDF</Text>
                  <Paragraph style={styles.infoValue}>{userInfo.matsedf}</Paragraph>
                </View>
                <View style={styles.info}>
                  <Text style={styles.infoLabel}>Associação</Text>
                  <Paragraph style={styles.infoValue}>{formatDate(userInfo.data_associacao)}</Paragraph>
                </View>
                <View style={styles.info}>
                  <Text style={styles.infoLabel}>Admissão</Text>
                  <Paragraph style={styles.infoValue}>{formatDate(userInfo.data_admissao)}</Paragraph>
                </View>
                <View style={styles.info}>
                  <Text style={styles.infoLabel}>Aposentadoria</Text>
                  <Paragraph style={styles.infoValue}>{userInfo.aposentado ? formatDate(userInfo.data_aposentadoria) : ''}</Paragraph>
                </View>
              </View>}
              { userInfo?.autonomo ? <View styles={styles.card}>
                <Title>Histórico de pagamentos por trimestre</Title>
                <Divider />
                {payments && payments.map((payment, index) => <View key={index} style={styles.item}>
                  <View style={styles.itemIcon}><Icon name='check-circle' size={40} color='green'></Icon></View>
                  <View style={styles.itemText}>
                    <Paragraph style={styles.paymentText}>Trimestre {payment.referente} pago em {payment.data_pagamento}</Paragraph>
                  </View>
                </View>)}
              </View> : null }
            </Card.Content>
          </Card>
        </ScrollView>
      }
      <Dialog visible={contract !== null} onDismiss={() => setContract(null)}>
        <Dialog.Title>Confirmar Pagamento {contract?.descricao}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>R$ {contract?.valor}</Paragraph>
          <Paragraph>{contract?.observacao}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <View style={styles.actions}>
            <Button title="Cancelar" onPress={() => setContract(null)} />
            <Button title="Ok, Gerar Boleto" onPress={() => createPayment(contract)} />
          </View>
        </Dialog.Actions>
      </Dialog>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: 'white'
  },
  loading: {
    height: height / 3
  },
  spinner: {
    flex: 1
  },
  card: {
    marginTop: 5
  },
  item: {
    flex: 6,
    flexDirection: 'row',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    marginBottom: 5
  },
  itemIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemText: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemButton: {
    flex: 1,
    padding: 5,
    margin: 15,
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#3880ff'
  },
  buttonText: {
    color: '#3880ff'
  },
  bold: {
    fontWeight: 'bold'
  },
  paymentText: {
    fontWeight: 'normal',
    fontSize: 14
  },
  info: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 10,
    marginRight: 10
  },
  infoLabel: {
    flex: 1,
    justifyContent: "center"
  },
  infoValue: {
    flex: 1,
    backgroundColor: 'lightgray',
    marginTop: 5,
    marginBottom: 5,
    borderColor: 'black',
    borderWidth: 1,
    padding: 5
  },
  subTitle: {
    flex: 1,
    fontSize: 20
  },
  message: {
    flex: 1,
    fontSize: 16
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default Payment;
