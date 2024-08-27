import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import Icon from '@/components/Icons';
import {
  CustomProTableTheme,
  CustomProTable,
  CustomFormButton,
  TagStatus,
  SelectSearchable
} from '@/components/proComponents';
import { Favorites } from '@/components/business';
import { UserItem } from './type';
import { searchSMAUser, deleteSMAUser } from '@/services/user-management';
import {
  getCommonOptions,
  getEmailGroupsOptions,
  getUserRoleOptions
} from '@/services/common';
import { translationAllLabel, showMultipleLabel } from '@/utils';

const sessionKey = 'USER_ACCOUNT';

const UserManagement = () => {
  const store = useStorage();
  const actionRef = useRef<ActionType>();
  const navigate = useNavigate();
  const [deleteUsers, setDeleteUsers] = useState<string[]>([]);
  const [userStatusOpts, setUserStatusOpts] = useState<LabelValue[]>([]);
  const [accountStatusOpts, setAccountStatusOpts] = useState<LabelValue[]>([]);
  const [userRoleOptions, setUserRoleOptions] = useState<LabelValue[]>([]);
  const [emailGroupOptions, setEmailGroupOptions] = useState<LabelValue[]>([]);
  const storage = store.get(sessionKey);
  const userInfo = useAppSelector(selectUserInfo);
  const [tenantObj, setTenantObj] = useState([
    {
      label: storage?.tenantNameLabel ?? userInfo.tenantNameLabel,
      value: storage?.tenantName ?? userInfo.tenantName
    }
  ]);

  const getDataSource = async (params: any) => {
    const searchParams = {
      displayName: params?.displayName?.trim(),
      emailAddress: params?.emailAddress?.trim(),
      emailGroup: params?.emailGroup,
      userRole: params?.userRole,
      tenantName: params?.tenantName,
      userStatus: params?.userStatus,
      accountStatus: params?.accountStatus,
      pageNum: params.current,
      pageSize: params.pageSize,
      sortField: params.columnKey,
      sortOrder: params.order
    };

    store.set(sessionKey, {
      ...searchParams,
      tenantNameLabel:
        store.get(sessionKey)?.tenantNameLabel ?? userInfo.tenantNameLabel
    });

    const { data, total } = await searchSMAUser(searchParams);

    return {
      data,
      success: true,
      total
    };
  };

  const handleDeleteConfirm = async () => {
    const result = await deleteSMAUser({ uids: deleteUsers });
    if (result.status.code === 0) {
      notification.success({
        message: $t('Batches Disable Successfully')
      });
      actionRef?.current?.reload();
    }
  };

  const columns: ProColumns<UserItem>[] = [
    {
      title: $t('Display Name'),
      dataIndex: 'displayName',
      initialValue: storage?.displayName,
      sorter: true
    },
    {
      title: $t('Email Address'),
      dataIndex: 'emailAddress',
      initialValue: storage?.emailAddress,
      sorter: true
    },
    {
      title: $t('Email Group'),
      dataIndex: 'emailGroup',
      initialValue: storage?.emailGroup,
      sorter: true,
      valueType: 'select',
      fieldProps: {
        options: emailGroupOptions
      },
      render: (_, record) => record.emailGroupLabel
    },
    {
      title: $t('User Role'),
      dataIndex: 'userRole',
      initialValue: storage?.userRole,
      sorter: true,
      render: (_, record) => showMultipleLabel(record.userRoleLabel),
      valueType: 'select',
      fieldProps: {
        options: userRoleOptions
      }
    },
    {
      title: $t('Tenant Name'),
      dataIndex: 'tenantName',
      initialValue: storage?.tenantName ?? userInfo.tenantName,
      order: 1,
      sorter: true,
      renderFormItem(schema, config, form, action) {
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
      },
      render: (_, record) => record.tenantNameLabel ?? '-'
    },
    {
      title: $t('User Status'),
      dataIndex: 'userStatus',
      initialValue: storage?.userStatus,
      sorter: true,
      render: (_, record) => (
        <TagStatus status={record.userStatus}>
          {record.userStatusLabel}
        </TagStatus>
      ),
      valueType: 'select',
      fieldProps: {
        options: translationAllLabel(userStatusOpts)
      }
    },
    {
      title: $t('Account Status'),
      dataIndex: 'accountStatus',
      initialValue: storage?.accountStatus,
      sorter: true,
      render: (_, record) => (
        <TagStatus status={record.accountStatus}>
          {record.accountStatusLabel}
        </TagStatus>
      ),
      valueType: 'select',
      fieldProps: {
        options: translationAllLabel(accountStatusOpts)
      }
    },
    {
      title: $t('Action'),
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 120,
      render: (_, record) => [
        <Button
          key="editUser"
          type="link"
          onClick={() => {
            store.set('FIRST_LEVEL_STORAGE', record);
            navigate('/user-management/maintain-user-account/edit-user');
          }}
        >
          {$t('Edit')}
        </Button>
      ]
    }
  ];

  const getUserStatusOpts = (): void => {
    getCommonOptions({
      mstType: 'USER_STATUS'
    }).then((options) => {
      setUserStatusOpts(options);
    });
  };

  const getAccountStatusOpts = (): void => {
    getCommonOptions({
      mstType: 'ACCT_STATUS'
    }).then((options) => {
      setAccountStatusOpts(options);
    });
  };

  const getUserRoles = (): void => {
    getUserRoleOptions().then((options) => {
      setUserRoleOptions(options);
    });
  };

  const getEmailGroupOpts = (): void => {
    getEmailGroupsOptions().then((option) => {
      setEmailGroupOptions(option);
    });
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

  const tableAlertOptionRender = ({ selectedRows }: { selectedRows: any }) => (
    <CustomFormButton
      key="deleteUser"
      ghost
      icon={<Icon type="UsergroupDeleteOutlined" />}
      onClick={() =>
        setDeleteUsers(selectedRows.map((row: UserItem) => row.id))
      }
      onConfirm={handleDeleteConfirm}
    >
      {$t('Batches Disable')}
    </CustomFormButton>
  );

  useEffect(() => {
    getUserStatusOpts();
    getAccountStatusOpts();
    getUserRoles();
    getEmailGroupOpts();
  }, []);

  return (
    <CustomProTableTheme>
      <Favorites code="FD-S-USR-001" label={$t('Maintain User Account')} />
      <CustomProTable
        actionRef={actionRef}
        columns={columns}
        pagination={{ current: storage?.pageNum, pageSize: storage?.pageSize }}
        sorter={{ columnKey: storage?.sortField, order: storage?.sortOrder }}
        headerTitle={$t('User List')}
        searchTitle={$t('Search User')}
        rowKey="id"
        tableAlertOptionRender={tableAlertOptionRender}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() =>
              navigate('/user-management/maintain-user-account/add-user')
            }
            key="addUser"
          >
            <Icon type="UserAddOutlined" />
            {$t('Add User')}
          </Button>
        ]}
        request={getDataSource}
        initParams={[
          { name: 'tenantName', value: userInfo.tenantName as string }
        ]}
        onResetCallback={onResetCallback}
      />
    </CustomProTableTheme>
  );
};

export default UserManagement;
