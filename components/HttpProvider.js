import React from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';

import { useUser } from './UserProvider';

export const HttpContext = React.createContext(null);

export const useHttp = () => {
  return React.useContext(HttpContext);
}

export const API_TYPE = {
  API: 'api',
  AUTH: 'auth',
  CADASTRO: 'cadastro',
  MASTERCLIN: 'masterclin',
  MOBILE: 'mobile',
  MONGO: 'mongo',
  WORDPRESS: 'wordpress'
}

let token = null;

const HttpProvider = (props) => {
  const axiosInstance = axios.create();
  const { user } = useUser();
  const navigation = useNavigation();
  const toast = useToast();

  React.useEffect(() => {
    if (user?.token) {
      token = user.token;
    } else {
      token = null;
    }
  }, [user]);

  axiosInstance.interceptors.request.use((config) => {
    if (token) {
      config.headers.authorization = token;
    }
    return config;
  });

  const value = React.useMemo(() => {
    const { api } = __DEV__ ? require('../assets/config.dev.json') : require('../assets/config.json');

    const processRequest = (request, url, navigation) => {
      return new Promise(function(resolve, reject) {
        request.then(response => {
          if (!response) {
            toast.show('O serviço não retornou resposta para a URL: ' + url, {
              type: 'custom_error',
              data: { title: 'Resposta nula' }
            });
            reject();
          } else if (response.status === 401) {
            toast.show('Sua sessão expirou. Por favor realize novo login', {
              type: 'custom_error',
              data: { title: 'Sessão expirada' }
            });
            navigation.navigate('Login');
            reject();
          } else if ((response.status >= 200) && (response.status < 300)) {
            resolve(response.data);
          }
          reject(response.data);
        }, error => reject(error.message || JSON.stringify(error)));
      });
    }

    const getRequest = (url, config, type) => {
      const baseUrl = getBaseUrl(type);
      if (baseUrl) {
        return axiosInstance.get(baseUrl + url, config);
      }
      return Promise.reject(type + " Api not found in services!");
    }

    const postRequest = (url, data, config, type) => {
      const baseUrl = getBaseUrl(type);
      if (baseUrl) {
        return axiosInstance.post(baseUrl + url, data, config);
      }
      return Promise.reject(type + " Api not found in services!");
    }

    const putRequest = (url, data, config, type) => {
      const baseUrl = getBaseUrl(type);
      if (baseUrl) {
        return axiosInstance.put(baseUrl + url, data, config);
      }
      return Promise.reject(type + " Api not found in services!");
    }

    const patchRequest = (url, data, config, type) => {
      const baseUrl = getBaseUrl(type);
      if (baseUrl) {
        return axiosInstance.patch(baseUrl + url, data, config);
      }
      return Promise.reject(type + " Api not found in services!");
    }

    const deleteRequest = (url, config, type) => {
      const baseUrl = getBaseUrl(type);
      if (baseUrl) {
        return axiosInstance.delete(baseUrl + url, config);
      }
      return Promise.reject(type + " Api not found in services!");
    }

    const getBaseUrl = (type) => {
      switch(type) {
        case API_TYPE.API:
          return api.api;
        case API_TYPE.AUTH:
          return api.auth;
        case API_TYPE.CADASTRO:
          return api.cadastro;
        case API_TYPE.MASTERCLIN:
          return api.masterclin;
        case API_TYPE.MOBILE:
          return api.mobile;
        case API_TYPE.MONGO:
          return api.mongo;
        case API_TYPE.WORDPRESS:
          return api.wordpress;
        default:
          return null;
      }
    }

    return {
      get: (type, url, config) => processRequest(getRequest(url, config, type), url, navigation),
      post: (type, url, data, config) => processRequest(postRequest(url, data, config, type), url, navigation),
      put: (type, url, data, config) => processRequest(putRequest(url, data, config, type), url, navigation),
      patch: (type, url, data, config) => processRequest(patchRequest(url, data, config, type), url, navigation),
      del: (type, url, config) => processRequest(deleteRequest(url, config, type), url, navigation)
    }
  }, []);

  return (
    <HttpContext.Provider value={value}>
      {props.children}
    </HttpContext.Provider>
  )
}

export default HttpProvider;
