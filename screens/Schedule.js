import React from 'react';
import {
  ActivityIndicator,
  Button,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Card, Dialog, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useToast } from 'react-native-toast-notifications';

import Header from '../components/Header';
import Footer from '../components/Footer';
import FormPickerInput from '../components/FormPickerInput';
import { API_TYPE, useHttp } from '../components/HttpProvider';
import { useUser } from '../components/UserProvider';

const Schedule = () => {
  const weekday = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];

  const [loading, setLoading] = React.useState(false);
  const [dates, setDates] = React.useState([{ id: -1, descricao: "Selecione uma data" }]);
  const [kiosks, setKiosks] = React.useState([{ id: -1, descricao: "Selecione um quiosque", disabled: false }]);
  const [busy, setBusy] = React.useState([]);
  const [date, setDate] = React.useState(null);
  const [kiosk, setKiosk] = React.useState(null);
  const [acceptTC, setAcceptTC] = React.useState(false);
  const [scheduled, setScheduled] = React.useState([]);
  const [scheduleReq, setScheduleReq] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const [scheduleToRemove, setScheduleToRemove] = React.useState(null);

  const toast = useToast();
  const { get, post, del } = useHttp();
  const { user } = useUser();

  React.useEffect(() => {
    setLoading(true);
    get(API_TYPE.API, "agenda/quiosques").then(response => {
      if (response?.rest) {
        const allDates = [{ id: null, descricao: "Selecione uma data" }];
        response.rest.datas?.forEach(d => {
          allDates.push({
            id: d.slug,
            descricao: d.descricao
          });
        });
        setDates(allDates);
        setBusy(response.rest.ocupados);
        const allKiosks = [{ id: -1, descricao: "Selecione um quiosque", disabled: false }];
        response.rest.quiosques.forEach(k => {
          allKiosks.push({ ...k, disabled: true });
        });
        setKiosks(allKiosks);
      } else {
        toast.show('Não existem datas disponíveis para agendamento.', {
          type: 'custom_error',
          data: { title: "Sem datas para agendamento" }
        });
      }
      setLoading(false);
    }, error => {
      toast.show(error ? error : "Erro desconhecido ao acessar o serviço de Agendamento.", {
        type: 'custom_error',
        data: { title: 'Erro ao acessar o serviço de agendamento' }
      });
      setLoading(false);
    });
  }, [user]);

  React.useEffect(() => {
    get(API_TYPE.API, 'agenda/agendados/' + user.user.id).then(response => {
      if (!response || !response.rest || response.rest.error) {
        toast.show(error ? error : "Erro desconhecido ao acessar o serviço de Agenda.", {
          type: 'custom_error',
          data: { title: 'Erro ao acessar o serviço de Agenda' }
        });
      } else {
        const result = response.rest.agendados;
        if (response.rest.agendados?.length) {
          response.rest.agendados.forEach(sched => {
            const date = new Date(sched.start);
            sched.description = 'Reservado para ' + weekday[date.getDay()] + ' - ' + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
          });
        }
        setScheduled(result);
      }
    });
  }, [scheduleReq]);

  const onDateChange = (value) => {
    setKiosk(kiosks[0]);
    kiosks.forEach(k => {
      k.disabled = busy[value.id]?.includes(k.id);
    });
  }

  const showDialog = (show) => {
    setVisible(show);
  }

  const schedule = () => {
    setLoading(true);
    const data = {
      email: user.user.email,
      end: date.id,
      id_grupo: '1',
      id_sub_tipo: kiosk.id,
      id_tipo: "1",
      id_usuario: user.user.id,
      start: date.id,
      termo: acceptTC,
      title: kiosk.descricao
    };

    // TODO: Remover este trecho: Altera todos os agendamentos para 2023: 
    data.end = data.end.substring(0, 3) + '3' + data.end.substring(4);
    data.start = data.start.substring(0, 3) + '3' + data.start.substring(4);

    post(API_TYPE.API, 'agenda', data).then(response => {
      setLoading(false);

      if (!response || !response.rest || response.rest.error) {
        toast.show(response.rest.error || 'Nenhuma resposta do serviço de salvar agendamento', {
          type: 'custom_error',
          data: { title: 'Erro no serviço de salvar agendamento' }
        });
      } else {
        setScheduleReq(scheduleReq + 1);
      }
    });
  }

  const removeSchedule = (schedule) => {
    setScheduleToRemove(schedule);
    showDialog(true);
  }

  const confirmRemoveSchedule = () => {
    showDialog(false);

    if (scheduleToRemove?.id) {
      setLoading(true);
      del(API_TYPE.API, 'agenda/' + scheduleToRemove.id).then(response => {
        setLoading(false);
        if (!response || !response.rest || response.rest.error) {
          toast.show(error ? error : 'Erro desconhecido no serviço de remoção do agendamento. Favor tentar novamente.', {
            type: 'custom_error',
            data: { title: 'Erro desconhecido no serviço de remoção de agendamento' }
          });
        } else {
          toast.show(response.rest.success, {
            type: 'custom_success',
            data: { title: 'Agendamento cancelado com sucesso' }
          });
          setScheduleReq(scheduleReq + 1);
        }
      });
    } else {
      toast.show('Agendamento a remover não encontrado. Favor refazer a operação', {
        type: 'custom_error',
        data: { title: 'Agendamento não encontrado' }
      });
    }
  }

  const openTC = () => {
    const url = 'https://www.sinprodf.org.br/orientacoes-e-regras-para-uso-da-chacara/';
    if (Linking.canOpenURL(url)) {
      Linking.openURL(url);
    } else {
      toast.show('O aplicativo necessita permissão para abrir seu Browser. Por favor habilite tal permissão para este aplicativo.', {
        type: 'custom_error',
        data: { title: 'Erro de permissão' }
      });
    }
  }

  const getStyle = (kiosk) => {
    if (kiosk.disabled) {
      return { color: 'gray' };
    } else {
      return { color: 'black' };
    }
  }

  return (
    <View style={styles.container}>
      <Header title="Agendamentos" />
      <ScrollView>
        <Card style={styles.card} mode='elevated'>
          <Card.Title style={styles.subtitle} subtitle='RESERVA PRÉVIA'></Card.Title>
          <Card.Title style={styles.title} title='Quiosques da Chácara' titleStyle={styles.title}></Card.Title>
          <Card.Content>
            <FormPickerInput label="Data" value={date} setValue={setDate} valueList={dates} onValueChange={onDateChange} disabled={loading} />
            <View style={styles.formControl}>
              <Text style={styles.label}>Quiosque</Text>
              <Picker style={[styles.formValue, styles.picker]} selectedValue={kiosk} onValueChange={(value) => setKiosk(value)} 
                enabled={!loading}>
                {kiosks.map((k, index) => 
                  <Picker.Item key={index} style={getStyle(k)} label={k.descricao} enabled={!k.disabled} value={k} />)
                }
              </Picker>
            </View>
            <View style={styles.formControl}>
              <Text style={styles.label}>Seu e-mail</Text>
              <Text style={styles.formValue}>{user.user.email}</Text>
            </View>
            <View style={styles.help}>
              <Text style={styles.tooltip}>E-mail para receber a confirmação do agendamento</Text>
            </View>
            <View style={styles.formControl}>
              <Text style={styles.label}>Li e aceito</Text>
              <View style={styles.formSwitch}>
                <Switch onValueChange={() => setAcceptTC(!acceptTC)} value={acceptTC} disabled={loading} />
              </View>
            </View>
            <View style={styles.help}>
              <TouchableOpacity onPress={openTC}>
                <Text style={styles.tooltip}>Clique aqui para ler as ORIENTAÇÕES E REGRAS</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
        {scheduled.map(schedule => <Card style={styles.card} key={schedule.id} mode='elevated'>
          <Card.Title title={schedule.title} subtitle={'#' + schedule.id} subtitleStyle={styles.scheduleSubtitle}></Card.Title>
          <Card.Content>
            <Paragraph>{schedule.description}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <TouchableOpacity style={styles.remove} onPress={() => removeSchedule(schedule)} disabled={loading}>
              <Text style={styles.removeText}>Cancelar</Text>
              <Icon name="delete" size={20} color="red" />
            </TouchableOpacity>
          </Card.Actions>
        </Card>)}
      </ScrollView>
      <Button title="Salvar" onPress={schedule} 
        disabled={(date?.id === -1) || (date === null) || (kiosk?.id === -1) || (kiosk === null) || !user?.user?.email || !acceptTC || loading} />
      {loading && <View style={styles.spinner}>
        <ActivityIndicator style={{alignSelf: "center"}} size="large" color="red" />
      </View>}
      <Dialog visible={visible} onDismiss={() => showDialog(false)}>
        <Dialog.Title>Confirmar</Dialog.Title>
        <Dialog.Content>
          <Paragraph>Deseja cancelar a reserva?</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <TouchableOpacity style={styles.confirmButton} onPress={confirmRemoveSchedule}>
            <Text>Ok</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={() => showDialog(false)}>
            <Text>Cancelar</Text>
          </TouchableOpacity>
        </Dialog.Actions>
      </Dialog>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  card: {
    marginBottom: 5
  },
  title: {
    fontSize: 28
  },
  subtitle: {
    marginBottom: -30
  },
  formControl: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 10,
    marginRight: 10
  },
  label: {
    flex: 1
  },
  formValue: {
    flex: 3,
    marginTop: 5,
    marginBottom: 5
  },
  picker: {
    backgroundColor: 'lightgray'
  },
  formSwitch: {
    flex: 3,
    alignItems: "flex-start"
  },
  help: {
    flex: 1
  },
  tooltip: {
    flex: 1,
    textAlign: "center",
    fontSize: 10
  },
  spinner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  scheduleSubtitle: {
    alignSelf: 'flex-end'
  },
  remove: {
    flex: 1,
    flexDirection: 'row-reverse'
  },
  removeText: {
    color: 'red'
  },
  confirmButton: {
    margin: 5
  }
});

export default Schedule;
