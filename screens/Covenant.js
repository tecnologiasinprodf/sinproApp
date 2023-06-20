import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_TYPE, useHttp } from '../components/HttpProvider';

const { height, width } = Dimensions.get("window");

const Covenant = () => {
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState([]);

  const toast = useToast();
  const { get } = useHttp();

  React.useEffect(() => {
    get(API_TYPE.MASTERCLIN, 'destaques').then(response => {
      if (!response?.rest) {
        toast.show("O serviço de Destaques do Convênio não recebeu nenhuma informação.", {
          type: "custom_error",
          data: { title: "Erro no serviço de Convênios" }
        });
      } else if (response.rest.error) {
        toast.show(response.rest.error, {
          type: "custom_error",
          data: { title: "Erro no serviço de Convênios" }
        });
      } else if (!response.rest.parceiros?.length) {
        toast.show("O serviço de Destaques do Convênio não recebeu nenhuma informação", {
          type: "custom_error",
          data: { title: "Erro no serviço de Convênios" }
        });
      } else {
        const list = response.rest.parceiros;
        list.forEach(item => {
          item.content = getContent(item.beneficio || '');
        });
        setItems(list);
      }
      setLoading(false);
    }, error => {
      toast.show(error ? error : 'Erro desconhecido no serviço de Destaques de Convênio', {
        type: 'custom_error',
        data: { title: 'Erro no serviço de Convênios' }
      });
      setLoading(false);
    });
  }, []);

  const getContent = (html) => {
    const whiteSpace = '&nbsp;';
    let str = html.replace(/<[^>]+>/g, '');
    while(str.indexOf(whiteSpace) > 0) {
      str = str.replace('&nbsp;', ' ');
    }
    return str;
  }

  const openUrl = (url) => {
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

  return (
    <View style={styles.container}>
      <Header title="CONVÊNIOS - Masterclin" />
      {loading ? 
        <View style={styles.spinner}><ActivityIndicator style={styles.loading} size='large' color='red' /></View> :
        <ScrollView>
          {items && items.map(item => <Card style={styles.card} key={item.id} mode="elevated">
            <TouchableOpacity onPress={() => openUrl(item.hotsite)}>
              <Card.Title title={item.nome} subtitle={item.categoria?.nome} subtitleStyle={styles.subtitle} />
              <Card.Content style={styles.content}>
                <SafeAreaView style={{ flex: 1, height: 100, width: width }}>
                  <Paragraph>{ item.content }</Paragraph>
                </SafeAreaView>
              </Card.Content>
              </TouchableOpacity>
          </Card>)}
        </ScrollView>
      }
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: 'white'
  },
  content: {
    flex: 1,
    flexDirection: "column"
  },
  card: {
    marginTop: 5
  },
  subcontent: {
    flex: 1,
    flexDirection: "row-reverse"
  },
  subtitle: {
    textAlign: 'right'
  },
  spinner: {
    flex: 1
  },
  loading: {
    top: height / 3
  }
});

export default Covenant;
