import { Button } from 'antd';
import { type ActionType, type ProColumns } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';

import Icon from '@/components/Icons';
import {
  CustomProTableTheme,
  CustomProTable,
  SelectSearchable
} from '@/components/proComponents';
import { Favorites } from '@/components/business';

import { SearchUserForAdHocParams, UserItem } from './type';
import { searchSendAdHocNotificationApi } from '@/services/notification-management';
import { showMultipleLabel } from '@/utils';
import { getUserRoleOptions } from '@/services/common';
import { omit } from 'lodash-es';
const sessionKey = 'SEND_AD_HOC_NOTIFICATION';

const SendAdHocNotification = () => {
  const actionRef = useRef<ActionType>();
  const navigate = useNavigate();

  const [selectedUsers, setSelectedUsers] = useState<LabelValue[]>([]);
  const [userRoleOptions, setUserRoleOptions] = useState<LabelValue[]>([]);
  const userInfo = useAppSelector(selectUserInfo);
  const store = useStorage();
  const storage = store.get(sessionKey);
  const [tenantObj, setTenantObj] = useState([
    {
      label: storage?.tenantNameLabel ?? userInfo.tenantNameLabel,
      value: storage?.tenantName ?? userInfo.tenantName
    }
  ]);

  const getUserRoles = (): void => {
    getUserRoleOptions().then((options) => {
      setUserRoleOptions(options);
    });
  };

  useEffect(() => {
    getUserRoles();
  }, []);

  const getDataSource = async (params: any) => {
    const param: SearchUserForAdHocParams = {
      ...omit(params, ['current']),
      pageNum: params.current,
      pageSize: params.pageSize,
      sortField: params.columnKey,
      sortOrder: params.order,
      displayName: params.displayName?.trim(),
      emailAddress: params.emailAddress?.trim()
    };
    store.set(sessionKey, {
      ...param,
      tenantNameLabel:
        store.get(sessionKey)?.tenantNameLabel ?? userInfo.tenantNameLabel
    });

    const { data, total } = await searchSendAdHocNotificationApi(param);

    return {
      data,
      total
    };
  };

  const columns: ProColumns<UserItem>[] = [
    {
      title: $t('Display Name'),
      dataIndex: 'displayName',
      sorter: true,
      order: 2,
      initialValue: storage?.displayName
    },
    {
      title: $t('User Role'),
      dataIndex: 'userRole',
      sorter: true,
      order: 3,
      render: (_, record: UserItem) => showMultipleLabel(record.userRole),
      valueType: 'select',
      initialValue: storage?.userRole,
      fieldProps: {
        options: userRoleOptions
      }
    },
    {
      title: $t('User Email'),
      dataIndex: 'emailAddress',
      ellipsis: true,
      sorter: true,
      order: 1,
      initialValue: storage?.emailAddress
    },
    {
      title: $t('Tenant Name'),
      dataIndex: 'tenantName',
      initialValue: storage?.tenantName ?? userInfo.tenantName,
      sorter: true,
      order: 4,
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
    }
  ];

  const handleChange = (_: any, selectedRows: UserItem[]) => {
    setSelectedUsers(
      selectedRows.map((i: UserItem) => ({
        label: i.displayName,
        value: i.userId
      }))
    );
  };

  const onResetCallback = () => {
    setTenantObj([
      { label: userInfo.tenantNameLabel, value: userInfo.tenantName }
    ]);
    store.set(sessionKey, {
      ...storage,
      tenantNameLabel: userInfo.tenantNameLabel
    });
  };

  const goDetail = () => {
    if (selectedUsers?.length) {
      navigate('./details');
      store.set('FIRST_LEVEL_STORAGE', selectedUsers);
    } else {
      notification.error({
        message: $t(
          'Please select at least one user from the list to send ad-hoc notification.'
        ),
        placement: 'bottom'
      });
    }
  };

  return (
    <CustomProTableTheme>
      <Favorites code="FD-S-NTM-003" label={$t('Send Ad-Hoc Notification')} />
      <CustomProTable
        columns={columns}
        headerTitle={$t('User List')}
        searchTitle={$t('Search User')}
        actionRef={actionRef}
        rowKey="userId"
        className="send-as-hoc-notification"
        request={getDataSource}
        rowSelection={{
          type: 'checkbox',
          onChange: handleChange
        }}
        initParams={[
          { name: 'tenantName', value: userInfo.tenantName as string }
        ]}
        onResetCallback={onResetCallback}
        tableAlertRender={false}
        pagination={{ current: storage?.pageNum, pageSize: storage?.pageSize }}
        sorter={{ columnKey: storage?.sortField, order: storage?.sortOrder }}
        toolBarRender={() => [
          <Button type="primary" onClick={goDetail} key="addUser">
            <Icon type="BellOutlined" />
            {$t('Send Ad-Hoc Notification')}
          </Button>
        ]}
      />
    </CustomProTableTheme>
  );
};

export default SendAdHocNotification;
