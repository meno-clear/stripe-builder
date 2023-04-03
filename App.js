import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'react-redux';
import { ActiveStorageProvider } from 'react-native-activestorage';
import { API_ENDPOINT } from './src/config/constants';
import { createStore } from 'redux';
import { AuthProvider } from './src/context/auth';
import { CartProvider } from './src/context/cart';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {enableLatestRenderer} from 'react-native-maps';
import Navigator from './src/Navigator';
import reducers from './src/reducers';

const store = createStore(reducers);

export default function App() {
enableLatestRenderer(true);
  return (
  <AuthProvider>
  <CartProvider>
    <Provider store={store}>
     <ActiveStorageProvider host={`${API_ENDPOINT}`}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </SafeAreaProvider>
      <Toast />
     </ActiveStorageProvider>
    </Provider>
  </CartProvider>
  </AuthProvider>
  );
}