import { Layout, Menu, Card, Spin, Typography } from 'antd';

import { Favorites } from '@/components/business';
import { CustomFormButton } from '@/components/proComponents';
import {
  getGlobalParameters,
  updateMaintainGlobalParameters
} from '@/services/system-configurations/maintain-global-parameters';
import { GlobalParameterInitialValues } from './utils';
import {
  Counter,
  SystemLockoutConfiguration,
  EmailAddressManagement,
  FAQsConfig,
  MessageParameters,
  Appearance
} from './components';
import {
  EmailAddressProps,
  IGlobalParametersProps,
  SystemLockoutProps,
  Tkeys,
  FAQsConfigurationProps,
  IMessageParametersItem,
  AppearanceProps
} from './type';
import './index.less';
import { ForwardedRef } from 'react';

const { Sider, Content } = Layout;
const { Title } = Typography;

const Index = () => {
  const [details, setDetails] = useState<IGlobalParametersProps>(
    GlobalParameterInitialValues
  );
  const [key, setKey] = useState<Tkeys>('passwordExpiryTime');
  const [loading, setLoading] = useState<boolean>(false);

  const isDarkMode = useAppSelector(selectIsDarkMode);
  const $t = useTranslations();
  const userInfo = useAppSelector(selectUserInfo);

  const AppearanceRef = useRef<ForwardedRef<AppearanceProps>>();

  const globalParameterMenus: {
    key: Tkeys;
    label: string;
  }[] = [
    {
      key: 'passwordExpiryTime',
      label: $t('Password Expiry Time')
    },
    {
      key: 'systemIdleTimeout',
      label: $t('System Idle Timeout')
    },
    {
      key: 'systemLockout',
      label: $t('System Lockout Configuration')
    },
    {
      key: 'emailAddress',
      label: $t('Email Address Management')
    },
    {
      key: 'purgeArchiveLogs',
      label: $t('Purge and Archive Logs')
    },
    {
      key: 'fAQsConfiguration',
      label: $t('FAQs and Support Page Configuration')
    },
    {
      key: 'notificationHistory',
      label: $t('Notification History Retention')
    },
    {
      key: 'messageParameters',
      label: $t('Message Parameters')
    },
    {
      key: 'Appearance',
      label: $t('Appearance')
    }
  ];

  const getDetails = async () => {
    setLoading(true);
    const res = await getGlobalParameters({});
    if (res?.status?.code === 0) {
      setDetails(res.payload.data);
      AppearanceRef.current = res.payload.data.Appearance;
      setLoading(false);
    }
  };

  const handleSelectMenu = ({
    selectedKeys
  }: {
    selectedKeys: string[];
  }): void => {
    setKey(selectedKeys[0] as Tkeys);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const isAppearance = key === 'Appearance';
    const value = isAppearance
      ? (AppearanceRef.current as unknown as AppearanceProps)
      : details[key];
    const res = await updateMaintainGlobalParameters({
      type: key,
      value: value,
      userId: userInfo?.userId as string
    });
    if (res.status.code === 0) {
      setLoading(false);
      notification.success({
        message: $t('Submitted successfully')
      });

      if (isAppearance) {
        setDetails((v) => ({
          ...v,
          Appearance: value as AppearanceProps
        }));
      }
    }
  };

  const MenuContent = useMemo(() => {
    switch (key) {
      case 'passwordExpiryTime':
        return (
          <Counter
            label="Password Expiry Time Configuration"
            value={details.passwordExpiryTime}
            onChange={(value: number) => {
              setDetails({ ...details, passwordExpiryTime: value });
            }}
            suffix="Days"
          />
        );

      case 'systemIdleTimeout':
        return (
          <Counter
            label="System Idle Timeout"
            value={details.systemIdleTimeout}
            onChange={(value: number) => {
              setDetails({ ...details, systemIdleTimeout: value });
            }}
            suffix="Minutes"
          />
        );

      case 'systemLockout':
        return (
          <SystemLockoutConfiguration
            values={details.systemLockout}
            onChange={(values: SystemLockoutProps) => {
              setDetails({ ...details, ...values });
            }}
          />
        );

      case 'emailAddress':
        return (
          <EmailAddressManagement
            values={details.emailAddress}
            onChange={(values: EmailAddressProps) => {
              setDetails({ ...details, ...values });
            }}
          />
        );

      case 'purgeArchiveLogs':
        return (
          <Counter
            label="The Retention Period of Audit Logs"
            value={details.purgeArchiveLogs}
            suffix="Month"
            onChange={(value: number) => {
              setDetails({ ...details, purgeArchiveLogs: value });
            }}
          />
        );

      case 'fAQsConfiguration':
        return (
          <FAQsConfig
            values={details?.fAQsConfiguration}
            onChange={(values: FAQsConfigurationProps) => {
              setDetails({ ...details, fAQsConfiguration: values });
            }}
          />
        );

      case 'notificationHistory':
        return (
          <Counter
            label="Notification History Retention Period"
            value={details.notificationHistory}
            onChange={(value: number) => {
              setDetails({ ...details, notificationHistory: value });
            }}
            suffix="Days"
          />
        );

      case 'messageParameters':
        return (
          <MessageParameters
            values={details.messageParameters}
            onChange={(value: IMessageParametersItem) => {
              setDetails({ ...details, messageParameters: value });
            }}
          />
        );

      case 'Appearance':
        return (
          <Appearance
            values={details?.Appearance}
            ref={AppearanceRef as ForwardedRef<AppearanceProps>}
          />
        );
    }
  }, [details, key]);

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <>
      <Favorites code="FD-S-SYS-005" label={$t('Maintain Global Parameters')} />
      <Card
        className="globalParametersContainer"
        styles={{
          body: { padding: '0 24px 0 0' }
        }}
      >
        <Spin spinning={loading}>
          <Layout>
            <Sider
              width={320}
              theme={isDarkMode ? 'dark' : 'light'}
              style={{ borderRadius: '8px 0 0 8px' }}
            >
              <Title className="title" level={5}>
                {$t('Global Parameters')}
              </Title>
              <Menu
                mode="inline"
                theme={isDarkMode ? 'dark' : 'light'}
                defaultSelectedKeys={['password-expiry-time']}
                style={{ height: '100%' }}
                items={globalParameterMenus}
                selectedKeys={[key]}
                onSelect={handleSelectMenu}
              />
            </Sider>
            <Content>
              <Card>
                {MenuContent}
                <CustomFormButton
                  type="primary"
                  className="submitBtn"
                  onConfirm={handleSubmit}
                  style={{
                    top: 20,
                    right: 0
                  }}
                >
                  {$t('Submit')}
                </CustomFormButton>
              </Card>
            </Content>
          </Layout>
        </Spin>
      </Card>
    </>
  );
};

export default Index;
