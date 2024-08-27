import {
  Button,
  Card,
  Flex,
  Row,
  Space,
  Typography,
  Descriptions,
  Spin
} from 'antd';
import { useNavigate } from 'react-router-dom';
import type { DescriptionsProps } from 'antd';
import { CustomFormButton } from '@/components/proComponents';
import { Favorites, LookupUser } from '@/components/business';
import { ILookup } from '@/types/business';
import Icon from '@/components/Icons';
import { DeviceItem } from '../type';
import { getCommonOptions, getTenantOptionsApi } from '@/services/common';
import { deviceDetailApi, saveDeviceApi } from '@/services/device-management';
import { translationAllLabel } from '@/utils';
import { ProFormSelect } from '@ant-design/pro-components';

const { Title, Text } = Typography;

const ApprovePage = () => {
  const navigate = useNavigate();
  const store = useStorage();
  const id = store.get('FIRST_LEVEL_STORAGE');
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState<DeviceItem>();
  const [lockOptions, setLockOptions] = useState<LabelValue[]>([]);
  const [enableOptions, setEnableOptions] = useState<LabelValue[]>([]);
  const [regOptions, setRegOptions] = useState<LabelValue[]>([]);
  const [tenantOptions, setTenantOptions] = useState<LabelValue[]>([]);
  const getOptions = async (mstType: string): Promise<void> => {
    const res = await getCommonOptions({ mstType });
    switch (mstType) {
      case 'DEVICE_ENABLE_STATUS':
        setEnableOptions(res);
        break;
      case 'DEVICE_LOCK_STATUS':
        setLockOptions(res);
        break;
      case 'DEVICE_REG_STATUS':
        setRegOptions(res);
        break;
      default:
        break;
    }
  };

  const getTenantOptions = async (): Promise<void> => {
    const res = await getTenantOptionsApi({
      keyword: ''
    });
    setTenantOptions(res);
  };

  const getDetail = async (dvcRgId: string): Promise<void> => {
    setLoading(true);
    const res = await deviceDetailApi(dvcRgId);
    setLoading(false);
    setFields(res);
  };

  useEffect(() => {
    getOptions('DEVICE_ENABLE_STATUS');
    getOptions('DEVICE_LOCK_STATUS');
    getOptions('DEVICE_REG_STATUS');
    getTenantOptions();
    getDetail(id);
  }, []);

  const handleChange = (value: ILookup | string, key: string) => {
    if (key === 'associatedUser' && value instanceof Object) {
      setFields(
        (obj) =>
          ({
            ...obj,
            associatedUserId: value.uid,
            associatedUser: value.userName,
            associatedUserEmail: value.userEmail,
            associatedUserTenant: value.userTenant,
            associatedUserTenantId: tenantOptions.find(
              (tenant) => tenant.label === value.userTenant
            )?.value
          } as DeviceItem)
      );
    } else {
      setFields(
        (obj) =>
          ({
            ...obj,
            [key]: value
          } as DeviceItem)
      );
    }
  };

  const items: DescriptionsProps['items'] = [
    {
      label: $t('Device ID'),
      key: 'deviceId',
      children: fields?.deviceId
    },
    {
      label: $t('Device Model'),
      key: 'deviceModel',
      children: fields?.deviceModel
    },
    {
      label: $t('Device Version'),
      key: 'deviceVersion',
      children: fields?.deviceVersion
    },
    {
      label: $t('Device Registration Status'),
      key: 'deviceRegistrationStatus',
      children: (
        <ProFormSelect
          key="deviceRegistrationStatus"
          allowClear={false}
          style={{ width: '100%' }}
          options={translationAllLabel(regOptions)}
          fieldProps={{
            value: fields?.deviceRegistrationStatus,
            onChange: (value) => handleChange(value, 'deviceRegistrationStatus')
          }}
        />
      )
    },
    {
      label: $t('Device Lock Status'),
      key: 'deviceLockStatus',
      children: (
        <ProFormSelect
          key="deviceLockStatus"
          allowClear={false}
          style={{ width: '100%' }}
          options={translationAllLabel(lockOptions)}
          fieldProps={{
            value: fields?.deviceLockStatus,
            onChange: (value) => handleChange(value, 'deviceLockStatus')
          }}
        />
      )
    },
    {
      label: $t('Device Enable Status'),
      key: 'deviceEnableStatus',
      children: (
        <ProFormSelect
          key="deviceEnableStatus"
          style={{ width: '100%' }}
          allowClear={false}
          options={translationAllLabel(enableOptions)}
          fieldProps={{
            value: fields?.deviceEnableStatus,
            onChange: (value) => handleChange(value, 'deviceEnableStatus')
          }}
        />
      )
    },

    {
      label: $t('Associated User'),
      key: 'associatedUser',
      children: (
        <Space>
          <Text style={{ marginRight: 10 }}>{fields?.associatedUser}</Text>

          <LookupUser
            onAdd={(user: ILookup) => handleChange(user, 'associatedUser')}
          />
        </Space>
      )
    },

    {
      label: $t('Associated User Email'),
      key: 'associatedUserEmail',
      children: fields?.associatedUserEmail
    },

    {
      label: $t('Associated Tenant'),
      key: 'associatedUserTenant',
      children: fields?.associatedUserTenant
    },
    {
      label: $t('App Version'),
      key: 'appVersion',
      children: fields?.appVersion
    }
  ];

  const handleSave = async () => {
    saveDeviceApi({ ...fields } as DeviceItem).then((res) => {
      if (res.status.msg === 'ok') {
        let obj = { ...fields };
        setFields(obj as DeviceItem);
        notification.success({
          message: $t('Save successfully')
        });
        navigate(-1);
      } else {
        notification.error({
          message: res.status.msg
        });
      }
    });
  };

  const handleBack = () => {
    navigate('/device-management/maintain-mobile-device');
  };

  return (
    <Spin spinning={loading}>
      <Favorites code="FD-S-DVM-001" label={$t('Maintain Mobile Device')} />
      <Card style={{ flex: 1 }}>
        <Flex justify="space-between" style={{ marginBottom: '16px' }}>
          <Title level={4}>{$t('Device Registration Information')}</Title>
          <Button
            type="primary"
            ghost
            icon={<Icon type="LeftOutlined" />}
            onClick={handleBack}
          >
            {$t('Back')}
          </Button>
        </Flex>
        <Descriptions
          layout="vertical"
          items={items}
          column={3}
          contentStyle={{ marginRight: 20 }}
        />
        <Row justify="end" style={{ marginTop: 40 }}>
          <CustomFormButton
            type="primary"
            style={{ marginRight: 16 }}
            // disabled={fields?.deviceRegistrationStatus !== 'pending'}
            onConfirm={handleSave}
          >
            {$t('Save')}
          </CustomFormButton>
        </Row>
      </Card>
    </Spin>
  );
};

export default ApprovePage;
