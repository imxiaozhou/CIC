import { Button } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import {
  CustomProTableTheme,
  TagStatus,
  CustomProTable,
  SelectSearchable
} from '@/components/proComponents';
import { Favorites } from '@/components/business';
import { searchSMAUserApproveAccList } from '@/services/user-management';
import {
  getCommonOptions,
  getEmailGroupsOptions,
  getUserRoleOptions
} from '@/services/common';

import { UserItem } from './type';
import {
  translationAllLabel,
  showMultipleLabel,
  formatExpiration
} from '@/utils';

const sessionKey = 'ACCOUNT_CREATION';

const UserManagement = () => {
  const navigate = useNavigate();
  const store = useStorage();
  const [userStatusOpts, setUserStatusOpts] = useState<LabelValue[]>([]);
  const [userRoleOptions, setUserRoleOptions] = useState<LabelValue[]>([]);
  const [accountStatusOpts, setAccountStatusOpts] = useState<LabelValue[]>([]);
  const [emailGroupOptions, setEmailGroupOptions] = useState<LabelValue[]>([]);
  const storage = store.get(sessionKey);
  const userInfo = useAppSelector(selectUserInfo);
  const timeFormat = useAppSelector(selectTimeFormat);
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

    const { data, total } = await searchSMAUserApproveAccList(searchParams);

    return {
      data,
      success: true,
      total
    };
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
      valueType: 'select',
      fieldProps: {
        options: userRoleOptions
      },
      render: (_, record) => showMultipleLabel(record.userRoleLabel)
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
      initialValue: storage?.userStatus ?? 'PENDING',
      sorter: true,
      valueType: 'select',
      fieldProps: {
        options: translationAllLabel(userStatusOpts)
      },
      render: (_, record) => {
        return (
          <TagStatus status={record.userStatus}>
            {record.userStatusLabel}
          </TagStatus>
        );
      }
    },
    {
      title: $t('Account Status'),
      dataIndex: 'accountStatus',
      initialValue: storage?.accountStatus,
      sorter: true,
      valueType: 'select',
      fieldProps: {
        options: translationAllLabel(accountStatusOpts)
      },
      render: (_, record) => {
        return (
          <TagStatus status={record.accountStatus}>
            {record.accountStatusLabel}
          </TagStatus>
        );
      }
    },
    {
      title: $t('Requested By'),
      dataIndex: 'requestBy',
      sorter: true,
      search: false
    },
    {
      title: $t('Request Time'),
      dataIndex: 'requestTime',
      sorter: true,
      search: false,
      render: (_, record) => {
        return formatExpiration(record.requestTime, timeFormat);
      }
    },
    {
      title: $t('Approve/Rejected By'),
      dataIndex: 'approveRejBy',
      sorter: true,
      search: false,
      render: (_, record) => {
        return record.approveBy ?? record.rejectBy ?? '-';
      }
    },
    {
      title: $t('Approve/Rejected Time'),
      dataIndex: 'approveRejTime',
      sorter: true,
      search: false,
      render: (_, record) => {
        return formatExpiration(
          record.approveTime ?? record.rejectTime,
          timeFormat
        );
      }
    },

    {
      title: $t('Action'),
      fixed: 'right',
      dataIndex: 'option',
      valueType: 'option',
      width: 120,
      render: (_, { id }) => [
        <Button
          key="editApprove"
          type="link"
          onClick={() => {
            store.set('FIRST_LEVEL_STORAGE', id);
            navigate('./details');
          }}
        >
          {$t('Edit')}
        </Button>
      ]
    }
  ];

  const getOptions = async (type: string) => {
    if (type === 'userRole') {
      let res = await getUserRoleOptions();
      setUserRoleOptions(res || []);
    } else {
      let options = await getCommonOptions({
        mstType: type
      });
      switch (type) {
        case 'USER_STATUS':
          setUserStatusOpts(options);
          break;
        case 'ACCT_STATUS':
          setAccountStatusOpts(options);
          break;
      }
    }
  };

  const getEmailGroupOpts = (): void => {
    getEmailGroupsOptions().then((option) => {
      setEmailGroupOptions(option);
    });
  };
  useEffect(() => {
    getOptions('USER_STATUS');
    getOptions('ACCT_STATUS');
    getOptions('userRole');
    getEmailGroupOpts();
  }, []);

  const onResetCallback = () => {
    setTenantObj([
      { label: userInfo.tenantNameLabel, value: userInfo.tenantName }
    ]);

    store.set(sessionKey, {
      ...storage,
      tenantNameLabel: userInfo.tenantNameLabel,
      userStatus: 'PENDING'
    });
  };

  return (
    <CustomProTableTheme>
      <Favorites code="FD-S-USR-002" label={$t('Approve Account Creation')} />

      <CustomProTable
        columns={columns}
        pagination={{ current: storage?.pageNum, pageSize: storage?.pageSize }}
        sorter={{ columnKey: storage?.sortField, order: storage?.sortOrder }}
        rowSelection={false}
        headerTitle={$t('User List')}
        searchTitle={$t('Search User')}
        rowKey="id"
        request={getDataSource}
        initParams={[
          { name: 'tenantName', value: userInfo.tenantName as string },
          { name: 'userStatus', value: 'PENDING' }
        ]}
        onResetCallback={onResetCallback}
      />
    </CustomProTableTheme>
  );
};

export default UserManagement;
