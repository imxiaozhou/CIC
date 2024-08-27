import { CustomProTableTheme } from '@/components/proComponents';

import { Favorites } from '@/components/business';
import ForSuperAdmin from './components/for-super-admin';
import ForAdmin from './components/for-admin';

export default function MaintainNotificationTemplates() {
  const userInfo = useAppSelector(selectUserInfo);

  return (
    <CustomProTableTheme>
      <Favorites
        code="FD-S-NTM-002"
        label={$t('Maintain Notification Templates')}
      />
      {userInfo.userRole!.includes('SUPER_ADM') ? (
        <ForSuperAdmin />
      ) : (
        <ForAdmin />
      )}
    </CustomProTableTheme>
  );
}
