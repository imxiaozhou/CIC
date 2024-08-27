import Icon from '@/components/Icons';
import { Dropdown, Avatar, Typography, Flex } from 'antd';
import type { MenuProps } from 'antd';
import { selectUserInfo } from '@/store/reducer/userSlice';
import { useAppSelector } from '@/hooks/useAppHooks';
import { useNavigate } from 'react-router-dom';
import { CustomModal } from '@/components/proComponents';

const { Text } = Typography;

const enum PersonalCenterMenuKeys {
  FAQs = 'FAQs',
  ModifyPassword = 'MODIFYPASSWORD',
  Logout = 'LOGOUT'
}

export default function PersonalCenterEntry() {
  const navigate = useNavigate();
  const [isLogout, setIsLogout] = useState<boolean>(false);

  const items: MenuProps['items'] = [
    {
      key: PersonalCenterMenuKeys.ModifyPassword,
      label: $t('Change Password'),
      icon: <Icon type="FormOutlined" />
    },
    {
      key: PersonalCenterMenuKeys.FAQs,
      label: $t('FAQs'),
      icon: <Icon type="QuestionCircleOutlined" />
    },
    { type: 'divider' },
    {
      key: PersonalCenterMenuKeys.Logout,
      danger: true,
      label: $t('Logout'),
      icon: <Icon type="LogoutOutlined" />
    }
  ];
  const userInfo = useAppSelector(selectUserInfo);

  const clearLogout = useLogout();
  const handleLogout = (): void => {
    clearLogout(() => {
      setIsLogout(false);
    });
  };
  return (
    <>
      <Dropdown
        arrow
        placement="bottom"
        menu={{
          items,
          onClick: (e) => {
            switch (e.key) {
              case PersonalCenterMenuKeys.ModifyPassword:
                navigate('/other-functions/change-password');
                break;
              case PersonalCenterMenuKeys.FAQs:
                navigate('/other-functions/FAQs');
                break;
              case PersonalCenterMenuKeys.Logout:
                setIsLogout(true);
                break;
            }
          }
        }}
      >
        <Flex style={{ userSelect: 'none' }} align="center">
          <Avatar size="default" icon={<Icon type="UserOutlined" />} />
          <Text style={{ maxWidth: 120, marginLeft: 8 }} ellipsis>
            {userInfo.displayName}
          </Text>
        </Flex>
      </Dropdown>
      <CustomModal
        title={$t('Are you sure to logout?')}
        open={isLogout}
        type="warning"
        onOk={handleLogout}
        onCancel={() => setIsLogout(false)}
      />
    </>
  );
}
