import { getMaintainUiDefaultSettingDetail } from '@/services/system-configurations';
import { setDateFormat } from '@/store/reducer/userSlice';
import { persistor, store } from '@/store';
import { useKeycloak } from '@react-keycloak/web';
import { logoutSystem } from '@/services/login';

export const initUserSetting = async (tntId: string) => {
  const userSetting = await getMaintainUiDefaultSettingDetail({
    tntId
  });
  store.dispatch(setDateFormat(userSetting.data.webApp.dateFormat));
};

export const useLogout = () => {
  const { keycloak } = useKeycloak();
  const clearLogout = (cb?: Function): void => {
    logoutSystem()
      .then(() => {
        if (cb) {
          cb?.();
        }
      })
      .finally(() => {
        keycloak.logout({ redirectUri: window.location.origin });
        persistor.purge();
        sessionStorage.clear();
        localStorage.removeItem('sessionId');
      });
  };
  return clearLogout;
};
