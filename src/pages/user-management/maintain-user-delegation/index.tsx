import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import {
  type ProColumns,
  ProFormDateRangePicker
} from '@ant-design/pro-components';
import {
  CustomProTableTheme,
  CustomProTable,
  TagStatus,
  SelectSearchable
} from '@/components/proComponents';
import { Favorites } from '@/components/business';
import Icon from '@/components/Icons';
import { searchUserDelegation } from '@/services/user-management';
import { getCommonOptions } from '@/services/common';
import { translationAllLabel, formatExpiration } from '@/utils';
import { UserDelegation } from './type';

const sessionKey = 'USER_DELEGATION';

const MaintainUserDeleGation = (): ReactElement => {
  const navigate = useNavigate();
  const store = useStorage();
  const [deleteStatus, setDeleteStatus] = useState<LabelValue[]>([]);
  const userInfo = useAppSelector(selectUserInfo);
  const dateFormat = useAppSelector(selectDateFormat);
  const storage = store.get(sessionKey);
  const [userTenantObj, setUserTenantObj] = useState([
    {
      label: storage?.userTenantLabel ?? userInfo.tenantNameLabel,
      value: storage?.userTenant ?? userInfo.tenantName
    }
  ]);
  const [delegateTenantObj, setDelegateTenantObj] = useState([
    {
      label: storage?.delegateUserTenantLabel ?? userInfo.tenantNameLabel,
      value: storage?.delegateUserTenant ?? userInfo.tenantName
    }
  ]);

  const getDataSource = async (params: any) => {
    const searchParams = {
      userTenant: params?.userTenant,
      userName: params?.userName?.trim(),
      userEmail: params?.userEmail?.trim(),
      delegateUserTenant: params?.delegateUserTenant,
      delegateUserName: params?.delegateUserName?.trim(),
      delegateUserEmail: params?.delegateUserEmail?.trim(),
      delegateDate: params?.delegateDate,
      delegateStatus: params?.delegateStatus,
      pageNum: params.current,
      pageSize: params.pageSize,
      sortField: params.columnKey,
      sortOrder: params.order
    };

    const currentStorage = store.get(sessionKey);

    store.set(sessionKey, {
      ...searchParams,
      userTenantLabel:
        currentStorage?.userTenantLabel ?? userInfo.tenantNameLabel,
      delegateUserTenantLabel:
        currentStorage?.delegateUserTenantLabel ?? userInfo.tenantNameLabel
    });

    const { data, total } = await searchUserDelegation(searchParams);

    return {
      data,
      success: true,
      total
    };
  };

  const columns: ProColumns<UserDelegation>[] = [
    {
      title: $t('User Tenant'),
      dataIndex: 'userTenant',
      initialValue: storage?.userTenant ?? userInfo.tenantName,
      key: 'userTenant',
      sorter: true,
      renderFormItem(schema, config, form, action) {
        return (
          <SelectSearchable
            defaultValue={userTenantObj}
            disabled={!userInfo.userRole!.includes('SUPER_ADM')}
            onValueChange={(newValue: LabelValue[]) => {
              form.setFieldsValue({
                userTenant: newValue[0]?.value
              });
              store.set(sessionKey, {
                ...storage,
                userTenant: newValue[0]?.value,
                userTenantLabel: newValue[0]?.label
              });
            }}
          />
        );
      }
    },
    {
      title: $t('User Name'),
      dataIndex: 'userName',
      key: 'userName',
      initialValue: storage?.userName,
      sorter: true
    },
    {
      title: $t('User Email'),
      dataIndex: 'userEmail',
      key: 'userEmail',
      initialValue: storage?.userEmail,
      sorter: true
    },
    {
      title: $t('Delegate User Tenant'),
      dataIndex: 'delegateUserTenant',
      key: 'delegateUserTenant',
      initialValue: storage?.delegateUserTenant ?? userInfo.tenantName,
      sorter: true,
      renderFormItem(schema, config, form, action) {
        return (
          <SelectSearchable
            defaultValue={delegateTenantObj}
            disabled={!userInfo.userRole!.includes('SUPER_ADM')}
            onValueChange={(newValue: LabelValue[]) => {
              form.setFieldsValue({
                delegateUserTenant: newValue[0]?.value
              });
              store.set(sessionKey, {
                ...storage,
                delegateUserTenant: newValue[0]?.value,
                delegateUserTenantLabel: newValue[0]?.label
              });
            }}
          />
        );
      }
    },
    {
      title: $t('Delegate User Name'),
      dataIndex: 'delegateUserName',
      key: 'delegateUserName',
      initialValue: storage?.delegateUserName,
      sorter: true
    },
    {
      title: $t('Delegate User Email'),
      dataIndex: 'delegateUserEmail',
      key: 'delegateUserEmail',
      initialValue: storage?.delegateUserEmail,
      sorter: true
    },
    {
      title: $t('Delegate Date'),
      key: 'delegateDate',
      dataIndex: 'delegateDate',
      initialValue: storage?.delegateDate,
      sorter: true,
      valueType: 'date',
      hideInTable: true,
      renderFormItem: () => {
        return <ProFormDateRangePicker />;
      }
    },
    {
      title: $t('Delegate From'),
      dataIndex: 'delegateFrom',
      sorter: true,
      search: false,
      render: (_, record) => formatExpiration(record.delegateFrom, dateFormat)
    },
    {
      title: $t('Delegate To'),
      dataIndex: 'delegateTo',
      sorter: true,
      search: false,
      render: (_, record) => formatExpiration(record.delegateTo, dateFormat)
    },
    {
      title: $t('Remark'),
      dataIndex: 'remark',
      key: 'remark',
      hideInSearch: true,
      sorter: true
    },
    {
      title: $t('Delegate Status'),
      dataIndex: 'delegateStatus',
      key: 'delegateStatus',
      initialValue: storage?.delegateStatus,
      sorter: true,
      render: (_, record) => (
        <TagStatus status={record.delegateStatus}>
          {record.delegateStatusLabel}
        </TagStatus>
      ),
      valueType: 'select',
      fieldProps: {
        options: translationAllLabel(deleteStatus)
      }
    },
    {
      title: $t('Action'),
      dataIndex: 'action',
      valueType: 'option',
      fixed: 'right',
      width: 50,
      render: (_, { id }) => [
        <Button
          key="view"
          type="link"
          onClick={() => {
            store.set('FIRST_LEVEL_STORAGE', { isCreate: false, id });
            navigate('/user-management/maintain-user-delegation/detail');
          }}
        >
          {$t('Edit')}
        </Button>
      ]
    }
  ];

  const handleCreateUser = (): void => {
    store.set('FIRST_LEVEL_STORAGE', { isCreate: true });
    navigate('/user-management/maintain-user-delegation/detail');
  };

  const getDelegateStatus = (): void => {
    getCommonOptions({
      mstType: 'DELEGATE_STATUS'
    }).then((options) => {
      setDeleteStatus(options);
    });
  };

  useEffect(() => {
    getDelegateStatus();
  }, []);

  const onResetCallback = () => {
    setUserTenantObj([
      { label: userInfo.tenantNameLabel, value: userInfo.tenantName }
    ]);
    setDelegateTenantObj([
      { label: userInfo.tenantNameLabel, value: userInfo.tenantName }
    ]);
    store.set(sessionKey, {
      ...storage,
      userTenantLabel: userInfo.tenantNameLabel,
      delegateUserTenantLabel: userInfo.tenantNameLabel
    });
  };

  return (
    <CustomProTableTheme>
      <Favorites code="FD-S-USR-007" label={$t('Maintain User Delegation')} />
      <CustomProTable
        columns={columns}
        pagination={{ current: storage?.pageNum, pageSize: storage?.pageSize }}
        sorter={{ columnKey: storage?.sortField, order: storage?.sortOrder }}
        headerTitle={$t('User Delegation List')}
        searchTitle={$t('Search User Delegation')}
        rowKey="id"
        rowSelection={false}
        toolBarRender={() => [
          <Button
            type="primary"
            icon={<Icon type="PlusOutlined" />}
            onClick={handleCreateUser}
            key="createDelegation"
          >
            {$t('Create User Delegation')}
          </Button>
        ]}
        request={getDataSource}
        initParams={[
          { name: 'userTenant', value: userInfo.tenantName as string },
          { name: 'delegateUserTenant', value: userInfo.tenantName as string }
        ]}
        onResetCallback={onResetCallback}
      />
    </CustomProTableTheme>
  );
};

export default MaintainUserDeleGation;
