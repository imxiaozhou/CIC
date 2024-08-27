import Keycloak, { type KeycloakConfig } from 'keycloak-js';

const keycloak_url =
  process.env.REACT_SMA_APP_KEYCLOAK_URL || 'http://10.89.104.58:8000';

const keycloakConfig: KeycloakConfig = {
  url: keycloak_url,
  realm: 'sma-web',
  clientId: 'sma-web-app'
};

const keycloak = new Keycloak(keycloakConfig);

export const initOptions = {
  onLoad: 'login-required', // check-sso or login-required
  checkLoginIframe: false
};

export default keycloak;
