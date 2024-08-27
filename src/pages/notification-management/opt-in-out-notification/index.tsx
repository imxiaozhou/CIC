import { Favorites } from '@/components/business';
import Icon from '@/components/Icons';
import {
  CustomProTable,
  CustomProTableTheme,
  SelectSearchable
} from '@/components/proComponents';
import type { ProColumns } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { OptInAndOutColumns } from './types';
import { searchOptInOut } from '@/services/notification-management';
import { getCommonOptions, getEmailGroupsOptions } from '@/services/common';
import { omit } from 'lodash-es';
import { translationAllLabel } from '@/utils';

const sessionKey = 'OPT_IN_OUT_NOTIFICATION';

const OptInOptOutNotification = () => {
  const navigation = useNavigate();
  const userInfo = useAppSelector(selectUserInfo);
  const [deviceOptionOpts, setDeviceOptionOpts] = useState<LabelValue[]>([]);
  const [searchParam, setSearchParam] = useState();
  const store = useStorage();
  const storage = store.get(sessionKey);
  const [tenantObj, setTenantObj] = useState([
    {
      label: storage?.tenantNameLabel ?? userInfo.tenantNameLabel,
      value: storage?.tenantName ?? userInfo.tenantName
    }
  ]);

  const columns: ProColumns<OptInAndOutColumns>[] = [
    {
      title: $t('Device Opt-in'),
      dataIndex: 'deviceOptin',
      initialValue: storage?.deviceOptin,
      order: 0,
      valueType: 'select',
      sorter: true,
      fieldProps: {
        options: translationAllLabel(deviceOptionOpts)
      }
    },
    {
      title: $t('Tenant Name'),
      dataIndex: 'tenantName',
      order: 6,
      initialValue: storage?.tenantName ?? userInfo.tenantName,
      sorter: true,
      renderFormItem(schema, config, form) {
        return (
          <SelectSearchable
            defaultValue={tenantObj}
            disabled={!userInfo.userRole!.includes('SUPER_ADM')}
            onValueChange={(newValue: LabelValue[]) => {
              form.setFieldsValue({
                tenantName: newValue[0]?.value
              });
              store.set(sessionKey, {
                ...storage,
                tenantName: newValue[0]?.value,
                tenantNameLabel: newValue[0]?.label
              });
            }}
          />
        );
      }
    },
    {
      title: $t('User Name'),
      dataIndex: 'userName',
      initialValue: storage?.userName,
      order: 5,
      sorter: true
    },
    {
      title: $t('Email Group'),
      dataIndex: 'emailGroup',
      initialValue: storage?.emailGroup,
      order: 1,
      sorter: true,
      request: async () => await getEmailGroupsOptions()
    },
    {
      title: $t('Email'),
      dataIndex: 'email',
      initialValue: storage?.email,
      order: 2,
      sorter: true
    },
    {
      title: $t('Device ID'),
      dataIndex: 'deviceID',
      search: false,
      sorter: true
    },
    {
      title: $t('Model'),
      dataIndex: 'model',
      search: false,
      sorter: true
    },
    {
      title: $t('Version'),
      dataIndex: 'version',
      search: false,
      sorter: true
    }
  ];

  const getDataSource = async (params: any) => {
    setSearchParam(params);
    const param = {
      ...omit(params, ['current']),
      userName: params.userName?.trim(),
      email: params.email?.trim(),
      pageNum: params.current,
      pageSize: params.pageSize,
      sortField: params.columnKey,
      sortOrder: params.order
    };
    store.set(sessionKey, {
      ...param,
      tenantNameLabel:
        store.get(sessionKey)?.tenantNameLabel ?? userInfo.tenantNameLabel
    });

    const { data, total } = await searchOptInOut(param);

    return {
      data,
      total
    };
  };

  const getOptions = async (type: string) => {
    const options = await getCommonOptions({ mstType: type });
    setDeviceOptionOpts(options);
  };

  useEffect(() => {
    getOptions('DEVICE_OPT_IN_STATUS');
  }, []);

  const onResetCallback = () => {
    setTenantObj([
      { label: userInfo.tenantNameLabel, value: userInfo.tenantName }
    ]);
    store.set(sessionKey, {
      ...storage,
      tenantNameLabel: userInfo.tenantNameLabel
    });
  };

  return (
    <CustomProTableTheme>
      <Favorites
        code="FD-S-NTM-004"
        label={$t('Opt-in/Opt-out Notification')}
      />
      <CustomProTable
        columns={columns}
        searchTitle={$t('Search User')}
        headerTitle={$t('User List')}
        rowKey="key"
        rowSelection={false}
        initParams={[
          { name: 'tenantName', value: userInfo.tenantName as string }
        ]}
        onResetCallback={onResetCallback}
        pagination={{ current: storage?.pageNum, pageSize: storage?.pageSize }}
        sorter={{ columnKey: storage?.sortField, order: storage?.sortOrder }}
        toolBarRender={() => [
          <Button
            key="primary"
            icon={<Icon type="FormOutlined" />}
            type="primary"
            onClick={() => {
              navigation('./edit-device-opt-in');
              store.set('FIRST_LEVEL_STORAGE', searchParam);
            }}
          >
            {$t('Edit Device Opt-in')}
          </Button>
        ]}
        request={getDataSource}
      />
    </CustomProTableTheme>
  );
};

export default OptInOptOutNotification;
