import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { useToast } from 'react-native-toast-notifications';

import AnnouncementCard from '../components/AnnouncementCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useUser } from '../components/UserProvider';
import { API_TYPE, useHttp } from '../components/HttpProvider';

const Announcement = () => {
  const [userAnnouncements, setUserAnnouncements] = React.useState([]);
  const [generalAnnouncements, setGeneralAnnouncements] = React.useState([]);
  const [loading, setLoading] = React.useState({ top: false, bottom: false });

  const toast = useToast();
  const { get } = useHttp();
  const { user } = useUser();

  const getUserAnnouncements = (allAnnouncements) => {
    const announcements = [];
    if (allAnnouncements) {
      allAnnouncements.forEach(a => {
        announcements.push({
          id: a._id,
          date: parseDate(a.data_envio),
          title: a.assunto,
          text: a.mensagem
        });
      });
    }
    return announcements;
  }

  const getGeneralAnnouncements = (allAnnouncements) => {
    const announcements = [];
    if (allAnnouncements) {
      allAnnouncements.forEach(a => {
        announcements.push({
          id: a.id,
          date: getDate(new Date(a.date)),
          title: a.title.rendered,
          text: getTitle(a.content.rendered),
          url: a.link
        });
      });
    }
    return announcements;
  }

  const getTitle = (title) => {
    const innerText = title ? title.replace(/(<([^>]+)>)/ig, '') : '';
    let result = '';
    const split = innerText.split(' ');

    for(let i = 0, items = 0; (i < split.length) && (items < 30); i++) {
      if (split[i]) {
        result += ((items === 0) ? '' : ' ') + split[i];
        items++;
      }
    }
    return result + ' [...]';
  }

  const getDate = (date) => {
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();

    if (mm < 10) mm = '0' + mm;
    if (dd < 10) dd = '0' + dd;

    return dd + '/' + mm + '/' + yyyy;
  }

  const parseDate = (date) => {
    const dateTime = date.split(' ');
    const split = dateTime[0].split('-');

    return split[2] + '/' + split[1] + '/' + split[0];
  }

  React.useEffect(() => {
    if (user?.user?.matricula) {
      setLoading({ top: true, bottom: true });
      get(API_TYPE.MONGO, 'cadastro/mensagem/' + user.user.matricula).then(response => {
        if (response?.rest?.response?.length) {
          setUserAnnouncements(getUserAnnouncements(response.rest.response));
        } else if (!response || response.error) {
          toast.show(response?.error ? response.error : 'Erro no serviço de comunicados. O serviço não retornou informação', {
            type: 'custom_error',
            data: { title: 'Comunicados' }
          });
        }
        setLoading({ top: false, bottom: loading.bottom });
      }, error => {
        toast.show(error ? error : 'Erro desconhecido no serviço de comunicados do usuário', {
          type: 'custom_error',
          data: { title: 'Erro ao recuperar comunicados' }
        });
        setLoading({ top: false, bottom: loading.bottom });
      });

      get(API_TYPE.WORDPRESS, 'posts?categories=36').then(response => {
        if (response?.length) {
          setGeneralAnnouncements(getGeneralAnnouncements(response));
        }
        setLoading({ top: loading.top, bottom: false });
      }, error => {
        toast.show(error ? error : "Erro desconhecido no serviço de comunicados gerais", {
          type: 'custom_error',
          data: { title: 'Erro ao recuperar comunicados' }
        });
        setLoading({ top: loading.top, bottom: false });
      });
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <Header title="SINPRO-DF" />
      <ScrollView>
        { userAnnouncements && userAnnouncements.map(announcement => 
          <View key={announcement.id} style={styles.card}>
            <AnnouncementCard style={styles.card} 
              id={announcement.id}
              date={announcement.date} 
              title={announcement.title} 
              text={announcement.text} 
              canArchive={true}
            />
          </View>
        )}
        { generalAnnouncements && generalAnnouncements.map(announcement =>
          <View key={announcement.id} style={styles.card}>
            <AnnouncementCard
              date={announcement.date}
              title={announcement.title}
              text={announcement.text}
              url={announcement.url}
              canArchive={false}
            />
          </View>
        )}
      </ScrollView>
      { (loading.top || loading.bottom) && <View style={styles.spinner}>
        <ActivityIndicator size="large" color="red" />
      </View> }
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: 'white'
  },
  card: {
    marginTop: 5,
    marginBottom: 5
  },
  spinner: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Announcement;
