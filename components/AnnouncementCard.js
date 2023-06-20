import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import { Card, Paragraph, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useToast } from 'react-native-toast-notifications';

import { API_TYPE, useHttp } from './HttpProvider';

const AnnouncementCard = ({ id, date, title, text, url, canArchive }) => {
  const [hide, setHide] = React.useState(false);
  const toast = useToast();
  const { put } = useHttp();

  const openURL = () => {
    if (url) {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          toast.show('O aplicativo necessita permissão para abrir seu Browser. Por favor habilite tal permissão para este aplicativo.', {
            type: 'custom_error',
            data: { title: 'Erro de permissão' }
          });
        }
      });
    }
  }

  const archive = () => {
    put(API_TYPE.MONGO, 'cadastro/mensagem/' + id, { data_arquivo: (new Date()).toISOString() }).then(response => {
      if (!response || !response.rest || response.rest.error) {
        toast.show(response.rest.error || "Nenhuma resposta do serviço de arquivamento de mensagens.", {
          type: 'custom_error',
          data: { title: 'Erro no serviço de arquivamento de mensagem' }
        });
      } else {
        if (response.rest.success) {
          toast.show(response.rest.success, {
            type: 'custom_success',
            data: { title: 'Sucesso ao arquivar mensagem' }
          });
          setHide(true);
        }
      }
    });
  }

  if (hide) return <></>;

  return (
    <Card onPress={openURL} mode="elevated">
      <Card.Content>
        <Paragraph style={styles.content}>{date}</Paragraph>
        <Title>{title}</Title>
        <Paragraph style={styles.content}>{text}</Paragraph>
      </Card.Content>
      { canArchive &&
        <Card.Actions>
          <TouchableOpacity style={styles.archiveButton} onPress={archive}>
            <Icon name="assignment-returned" size={20} color="blue" />
            <Text style={styles.archiveText}>Arquivar</Text>
          </TouchableOpacity>
        </Card.Actions>
      }
    </Card>
  );
}

const styles = StyleSheet.create({
  date: {
    color: "darkgray"
  },
  archiveButton: {
    flex: 1,
    flexDirection: 'row-reverse'
  },
  archiveText: {
    color: "blue"
  }
});

export default AnnouncementCard;
