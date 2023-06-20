import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ToastProvider } from 'react-native-toast-notifications';

import Announcement from './screens/Announcement';
import CreateAccount from './screens/CreateAccount';
import MemberCard from './screens/MemberCard';
import Covenant from './screens/Covenant';
import Login from './screens/Login';
import Payment from './screens/Payment';
import Registry from './screens/Registry';
import Schedule from './screens/Schedule';
import Welcome from './screens/Welcome';
import HttpProvider from './components/HttpProvider';
import UserProvider from './components/UserProvider';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <ToastProvider
      placement="bottom"
      offset={10}
      renderType={{
        custom_success: (toast) => (
          <View style={styles.toastSuccessContainer}>
            <Text style={styles.toastSuccessTitle}>
              {toast.data.title}
            </Text>
            <Text style={styles.toastText}>{toast.message}</Text>
          </View>
        ),
        custom_error: (toast) => (
          <View style={styles.toastErrorContainer}>
            <Text style={styles.toastErrorTitle}>
              {toast.data.title}
            </Text>
            <Text style={styles.toastText}>{toast.message}</Text>
          </View>
        )
      }}
    >
      <UserProvider>
        <NavigationContainer>
          <HttpProvider>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen options={{headerShown: false}} name="Login" component={Login} />
              <Stack.Screen options={{headerShown: false}} name="CreateAccount" component={CreateAccount} />
              <Stack.Screen options={{headerShown: false}} name="Welcome" component={Welcome} />
              <Stack.Screen options={{headerShown: false}} name="Announcement" component={Announcement} />
              <Stack.Screen options={{headerShown: false}} name="Schedule" component={Schedule} />
              <Stack.Screen options={{headerShown: false}} name="Registry" component={Registry} />
              <Stack.Screen options={{headerShown: false}} name="MemberCard" component={MemberCard} />
              <Stack.Screen options={{headerShown: false}} name="Covenant" component={Covenant} />
              <Stack.Screen options={{headerShown: false}} name="Payment" component={Payment} />
            </Stack.Navigator>
          </HttpProvider>
        </NavigationContainer>
      </UserProvider>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  toastSuccessContainer: {
    maxWidth: "85%",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    marginVertical: 4,
    borderRadius: 8,
    borderLeftColor: "#00C851",
    borderLeftWidth: 6,
    justifyContent: "center",
    paddingLeft: 16
  },
  toastErrorContainer: {
    maxWidth: "85%",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    marginVertical: 4,
    borderRadius: 8,
    borderLeftColor: "black",
    borderLeftWidth: 6,
    justifyContent: "center",
    paddingLeft: 16
  },
  toastSuccessTitle: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold"
  },
  toastErrorTitle: {
    fontSize: 14,
    color: "red",
    fontWeight: "bold"
  },
  toastText: {
    color: "#a3a3a3",
    marginTop: 2
  }
});

export default App;
