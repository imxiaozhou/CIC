import ReactDOM from 'react-dom/client';
import { App } from 'antd';
import AdminApp from './App';
import { Provider } from 'react-redux';
import { store, persistor } from '@/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak, { initOptions } from './config/keycloak';
import { DarkModeConfigProvider } from '@/components/DarkModeSwitch';
import { ThemeColorConfigProvider } from '@/components/ThemeColors';
import 'antd/dist/reset.css';
import './App.css';
import './assets/css/editor.less';
import './assets/css/global.less';

const tokenLogger = (tokens: any) => {
  localStorage.setItem('tokens', JSON.stringify(tokens));
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <DarkModeConfigProvider>
        <ThemeColorConfigProvider>
          <ReactKeycloakProvider
            authClient={keycloak}
            initOptions={initOptions}
            onTokens={tokenLogger}
          >
            <App
              message={{ maxCount: 1 }}
              notification={{ maxCount: 1, placement: 'bottom' }}
            >
              <AdminApp />
            </App>
          </ReactKeycloakProvider>
        </ThemeColorConfigProvider>
      </DarkModeConfigProvider>
    </PersistGate>
  </Provider>
);
