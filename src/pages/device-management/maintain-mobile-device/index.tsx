import { Button } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';

import {
  CustomProTableTheme,
  TagStatus,
  CustomProTable,
  SelectSearchable
} from '@/components/proComponents';
import { Favorites } from '@/components/business';

import { DeviceItem, DeviceSearchParams } from './type';
import { searchDeviceListApi } from '@/services/device-management';
import { getCommonOptions } from '@/services/common';
import { translationAllLabel } from '@/utils';
import { omit } from 'lodash-es';

const sessionKey = 'MOBILE_DEVICE';

const MaintainMobileDevice = () => {
  const actionRef = useRef<ActionType>();
  const store = useStorage();
  const navigate = useNavigate();
  const userInfo = useAppSelector(selectUserInfo);

  const [regStatusOptions, setRegStatusOptions] = useState<LabelValue[]>([]);
  const [deviceLockOptions, setDeviceLockOptions] = useState<LabelValue[]>([]);
  const [deviceEnableOptions, setDeviceEnableOptions] = useState<LabelValue[]>(
    []
  );

  const storage = store.get(sessionKey);

  const [tenantObj, setTenantObj] = useState([
    {
      label: storage?.associatedUserTenantLabel ?? userInfo.tenantNameLabel,
      value: storage?.associatedUserTenant ?? userInfo.tenantName
    }
  ]);

  const getDataSource = async (params: any) => {
    const param: DeviceSearchParams = {
      ...omit(params, ['current']),
      pageNum: params.current,
      pageSize: params.pageSize,
      sortField: params.columnKey,
      sortOrder: params.order,
      deviceId: params.deviceId?.trim(),
      deviceModel: params.deviceModel?.trim(),
      deviceVersion: params.deviceVersion?.trim(),
      associatedUser: params.associatedUser?.trim(),
      associatedUserEmail: params.associatedUserEmail?.trim(),
      appVersion: params.appVersion?.trim()
    };

    store.set(sessionKey, {
      ...param,
      associatedUserTenantLabel:
        store.get(sessionKey)?.associatedUserTenantLabel ??
        userInfo.tenantNameLabel
    });

    const { data, total } = await searchDeviceListApi(param);

    return {
      data,
      success: true,
      total
    };
  };
  const getOptions = async (mstType: string): Promise<void> => {
    const data = await getCommonOptions({ mstType });
    switch (mstType) {
      case 'DEVICE_REG_STATUS':
        setRegStatusOptions(data);
        break;
      case 'DEVICE_LOCK_STATUS':
        setDeviceLockOptions(data);
        break;
      case 'DEVICE_ENABLE_STATUS':
        setDeviceEnableOptions(data);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getOptions('DEVICE_REG_STATUS');
    getOptions('DEVICE_LOCK_STATUS');
    getOptions('DEVICE_ENABLE_STATUS');
  }, []);
  const columns: ProColumns<DeviceItem>[] = [
    {
      title: $t('Device ID'),
      dataIndex: 'deviceId',
      sorter: true,
      initialValue: storage?.deviceId
    },
    {
      title: $t('Device Model'),
      dataIndex: 'deviceModel',
      sorter: true,
      initialValue: storage?.deviceModel
    },
    {
      title: $t('Device Version'),
      dataIndex: 'deviceVersion',
      sorter: true,
      initialValue: storage?.deviceVersion
    },
    {
      title: $t('Device Registration Status'),
      dataIndex: 'deviceRegistrationStatus',
      sorter: true,
      valueType: 'select',
      initialValue: storage?.deviceRegistrationStatus,
      fieldProps: {
        options: translationAllLabel(regStatusOptions)
      },
      render: (_, record: DeviceItem) => (
        <TagStatus status={record.deviceRegistrationStatus}>
          {record.deviceRegistrationStatusLabel}
        </TagStatus>
      )
    },

    {
      title: $t('Device Lock Status'),
      dataIndex: 'deviceLockStatus',
      sorter: true,
      valueType: 'select',
      initialValue: storage?.deviceLockStatus,
      fieldProps: {
        options: translationAllLabel(deviceLockOptions)
      },
      render: (_, record: DeviceItem) => <>{$t(record.deviceLockStatusLabel)}</>
    },
    {
      title: $t('Device Enable Status'),
      dataIndex: 'deviceEnableStatus',
      sorter: true,
      valueType: 'select',
      initialValue: storage?.deviceEnableStatus,
      fieldProps: {
        options: translationAllLabel(deviceEnableOptions)
      },
      render: (_, record: DeviceItem) => (
        <>{$t(record.deviceEnableStatusLabel)}</>
      )
    },
    {
      title: $t('Associated User'),
      dataIndex: 'associatedUser',
      sorter: true,
      initialValue: storage?.associatedUser
    },
    {
      title: $t('Associated User Email'),
      dataIndex: 'associatedUserEmail',
      sorter: true,
      initialValue: storage?.associatedUserEmail
    },
    {
      title: $t('Associated Tenant'),
      dataIndex: 'associatedUserTenant',
      sorter: true,
      order: 1,
      initialValue: storage?.associatedUserTenant ?? userInfo.tenantName,
      renderFormItem(schema, config, form) {
        return (
          <SelectSearchable
            defaultValue={tenantObj}
            disabled={!userInfo.userRole!.includes('SUPER_ADM')}
            onValueChange={(newValue: LabelValue[]) => {
              form.setFieldsValue({
                associatedUserTenant: newValue[0]?.value
              });
              store.set(sessionKey, {
                ...storage,
                associatedUserTenant: newValue[0]?.value,
                associatedUserTenantLabel: newValue[0]?.label
              });
            }}
          />
        );
      }
    },
    {
      title: $t('App Version'),
      dataIndex: 'appVersion',
      sorter: true,
      initialValue: storage?.appVersion
    },
    {
      title: $t('Action'),
      fixed: 'right',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="editApprove"
          type="link"
          onClick={() => {
            store.set('FIRST_LEVEL_STORAGE', record.dvcRgId);
            navigate('./details');
          }}
        >
          {$t('Edit')}
        </Button>
      ]
    }
  ];

  const onResetCallback = () => {
    setTenantObj([
      { label: userInfo.tenantNameLabel, value: userInfo.tenantName }
    ]);
    store.set(sessionKey, {
      ...storage,
      associatedUserTenantLabel: userInfo.tenantNameLabel
    });
  };

  return (
    <CustomProTableTheme>
      <Favorites code="FD-S-DVM-001" label={$t('Maintain Mobile Device')} />

      <CustomProTable
        columns={columns}
        headerTitle={$t('Mobile Device List')}
        searchTitle={$t('Search Mobile Device')}
        actionRef={actionRef}
        rowKey="dvcRgId"
        rowSelection={false}
        request={getDataSource}
        pagination={{ current: storage?.pageNum, pageSize: storage?.pageSize }}
        sorter={{ columnKey: storage?.sortField, order: storage?.sortOrder }}
        initParams={[
          { name: 'associatedUserTenant', value: userInfo.tenantName as string }
        ]}
        onResetCallback={onResetCallback}
      />
    </CustomProTableTheme>
  );
};

export default MaintainMobileDevice;
