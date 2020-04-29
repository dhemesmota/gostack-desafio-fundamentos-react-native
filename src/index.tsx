import 'react-native-gesture-handler';
import React from 'react';
import { View, StatusBar } from 'react-native';

import Routes from './routes';
import AppContainer from './hooks';

const App: React.FC = () => (
  <View style={{ backgroundColor: '#F0F0F5', flex: 1 }}>
    <AppContainer>
      <StatusBar barStyle="light-content" backgroundColor="#C6C6CF" />
      <Routes />
    </AppContainer>
  </View>
);

export default App;
