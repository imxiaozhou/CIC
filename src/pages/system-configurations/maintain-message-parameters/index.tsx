import { type ProColumns } from '@ant-design/pro-components';
import { ReactElement } from 'react';
import { Button } from 'antd';
import {
  CustomProTable,
  CustomProTableTheme,
  SelectSearchable,
  TagStatus
} from '@/components/proComponents';
import { useNavigate } from 'react-router-dom';
import { Favorites } from '@/components/business';
import { IMessageParameters } from './type';
import Icon from '@/components/Icons';
import { getMessageParameters } from '@/services/system-configurations';
import { omit } from 'lodash-es';
import { translationAllLabel, showMultipleLabel } from '@/utils';
import {
  getCommonOptions,
  getEmailGroupsOptions,
  getUserRoleOptions
} from '@/services/common';
import { SearchParams } from '@/services/system-configurations/maintain-message-parameters/type';

const sessionKey = 'MESSAGE_PARAMETERS';

const MaintainMessageParameters = (): ReactElement => {
  const navigate = useNavigate();
  const [emailGroupOpts, setEmailGroupOpts] = useState<LabelValue[]>([]);
  const [userRoleOpts, setUserRoleOpts] = useState();
  const [userStatusOpts, setUserStatusOpts] = useState<LabelValue[]>([]);
  const [accountStatusOpts, setAccountStatusOpts] = useState<LabelValue[]>([]);
  const [selectedRows, setSelectedRows] = useState<IMessageParameters[]>();
  const [hasData, setHasData] = useState(true);
  const userInfo = useAppSelector(selectUserInfo);
  const store = useStorage();
  const storage = store.get(sessionKey);
  const [tenantObj, setTenantObj] = useState([
    {
      label: storage?.tenantNameLabel ?? userInfo.tenantNameLabel,
      value: storage?.tenantName ?? userInfo.tenantName
    }
  ]);

  const columns: ProColumns<IMessageParameters>[] = [
    {
      title: $t('Display Name'),
      dataIndex: 'displayName',
      initialValue: storage?.displayName,
      sorter: true
    },
    {
      title: $t('Maximum Recipients'),
      dataIndex: 'maxRecipients',
      sorter: true,
      search: false
    },
    {
      title: $t('Predefined Period'),
      dataIndex: 'predefinedPeriod',
      sorter: true,
      search: false
    },
    {
      title: $t('Maximum Message'),
      dataIndex: 'maxEmail',
      sorter: true,
      search: false
    },
    {
      title: $t('Email Address'),
      dataIndex: 'emailAddress',
      initialValue: storage?.emailAddress,
      sorter: true
    },
    {
      title: $t('Tenant Name'),
      dataIndex: 'tenantName',
      order: 1,
      sorter: true,
      initialValue: storage?.tenantName ?? userInfo.tenantName,
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
      title: $t('Email Group'),
      dataIndex: 'emailGroup',
      initialValue: storage?.emailGroup,
      sorter: true,
      valueType: 'select',
      fieldProps: {
        options: emailGroupOpts
      }
    },
    {
      title: $t('User Role'),
      dataIndex: 'userRole',
      initialValue: storage?.userRole,
      sorter: true,
      valueType: 'select',
      render: (_, record: IMessageParameters) =>
        showMultipleLabel(record.userRole),
      fieldProps: {
        options: userRoleOpts
      }
    },

    {
      title: $t('User Status'),
      dataIndex: 'userStatus',
      initialValue: storage?.userStatus,
      sorter: true,
      valueType: 'select',
      fieldProps: {
        options: translationAllLabel(userStatusOpts)
      },
      render: (_, record: IMessageParameters) => (
        <TagStatus status={record.userStatus}>
          {record.userStatusLabel}
        </TagStatus>
      )
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
      render: (_, record: IMessageParameters) => (
        <TagStatus status={record.accountStatus}>
          {record.accountStatusLabel}
        </TagStatus>
      )
    }
  ];

  const GoToAdjustMessageParameters = (): void => {
    if (selectedRows?.length) {
      navigate('./adjust-message-parameters');
      store.set('FIRST_LEVEL_STORAGE', selectedRows);
    } else {
      notification.error({
        message: $t(
          'Please select at least one user from the list to Adjust Message Parameters.'
        ),
        placement: 'bottom'
      });
    }
  };

  const getDataSource = async (params: any) => {
    const param: SearchParams = {
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

    const { data, total } = await getMessageParameters(param);
    //  没数据时禁用点击
    setHasData(!data?.length);
    return {
      data,
      success: true,
      total
    };
  };
  const getOptions = async (mstType: string): Promise<void> => {
    switch (mstType) {
      case 'emailGroup':
        setEmailGroupOpts(await getEmailGroupsOptions());
        break;
      case 'userRole':
        setUserRoleOpts(await getUserRoleOptions());
        break;
      case 'USER_STATUS':
        setUserStatusOpts(await getCommonOptions({ mstType }));
        break;
      case 'ACCT_STATUS':
        setAccountStatusOpts(await getCommonOptions({ mstType }));
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    getOptions('emailGroup');
    getOptions('userRole');
    getOptions('USER_STATUS');
    getOptions('ACCT_STATUS');
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
        code="FD-S-SYS-007"
        label={$t('Maintain Message Parameters')}
      />
      <CustomProTable
        columns={columns}
        searchTitle={$t('Search User')}
        headerTitle={$t('User List')}
        rowKey="rm"
        request={getDataSource}
        tableAlertRender={false}
        pagination={{ current: storage?.pageNum, pageSize: storage?.pageSize }}
        sorter={{ columnKey: storage?.sortField, order: storage?.sortOrder }}
        initParams={[
          { name: 'tenantName', value: userInfo.tenantName as string }
        ]}
        onResetCallback={onResetCallback}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows)
        }}
        toolBarRender={() => [
          <Button
            disabled={hasData}
            type="primary"
            icon={<Icon type="SettingOutlined" />}
            onClick={GoToAdjustMessageParameters}
            key="adjustParameters"
          >
            {$t('Adjust Message Parameters')}
          </Button>
        ]}
      />
    </CustomProTableTheme>
  );
};

export default MaintainMessageParameters;
