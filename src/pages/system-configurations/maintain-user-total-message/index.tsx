import { Button } from 'antd';
import { type ProColumns } from '@ant-design/pro-components';
import Icon from '@/components/Icons';
import {
  CustomProTable,
  CustomProTableTheme,
  SelectSearchable,
  TagStatus
} from '@/components/proComponents';
import { useNavigate } from 'react-router-dom';
import Favorites from '@/components/business/Favorites';
import { MaintainUserSettingItem } from './type';
import { getUserTotalMessageList } from '@/services/system-configurations';
import { omit } from 'lodash-es';
import { formatAddBG } from '../utils';
import {
  getCommonOptions,
  getUserRoleOptions,
  getEmailGroupsOptions
} from '@/services/common';
import { translationAllLabel, showMultipleLabel } from '@/utils';
import { SearchParams } from '@/services/system-configurations/maintain-user-total-message/type';

const sessionKey = 'USER_TOTAL_MESSAGE';
const MaintainUserTotalMessage = () => {
  const navigateTo = useNavigate();
  const store = useStorage();
  const [emailGroupOpts, setEmailGroupOpts] = useState<LabelValue[]>([]);
  const [userRoleOpts, setUserRoleOpts] = useState();
  const [userStatusOpts, setUserStatusOpts] = useState<LabelValue[]>([]);
  const [accountStatusOpts, setAccountStatusOpts] = useState<LabelValue[]>([]);
  const [selectedRows, setSelectedRows] = useState<MaintainUserSettingItem[]>();
  const userInfo = useAppSelector(selectUserInfo);
  const storage = store.get(sessionKey);

  const [tenantObj, setTenantObj] = useState([
    {
      label: storage?.tenantNameLabel ?? userInfo.tenantNameLabel,
      value: storage?.tenantName ?? userInfo.tenantName
    }
  ]);
  const [hasData, setHasData] = useState(true);

  const columns: ProColumns<MaintainUserSettingItem>[] = [
    {
      title: $t('Display Name'),
      dataIndex: 'displayName',
      initialValue: storage?.displayName,
      sorter: true
    },
    {
      title: $t('Warning Level'),
      dataIndex: 'warningLevel',
      sorter: true,
      search: false
    },
    {
      title: $t('Send Restriction'),
      dataIndex: 'sendLimit',
      sorter: true,
      search: false
    },
    {
      title: $t('Receive Restriction'),
      dataIndex: 'receiveLimit',
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
      initialValue: storage?.tenantName ?? userInfo.tenantName,
      order: 1,
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
      render: (_, record: MaintainUserSettingItem) =>
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
      render: (_, record: MaintainUserSettingItem) => (
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
      render: (_, record: MaintainUserSettingItem) => (
        <TagStatus status={record.accountStatus}>
          {record.accountStatusLabel}
        </TagStatus>
      )
    }
  ];

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

    const { data, total } = await getUserTotalMessageList(param);
    setHasData(!data?.length);
    const list = formatAddBG(data);
    return {
      data: list,
      success: true,
      total
    };
  };

  const goAdjustMessageStorageQuota = () => {
    if (selectedRows?.length) {
      navigateTo(`./adjust-message-storage-quota`);
      store.set('FIRST_LEVEL_STORAGE', selectedRows);
    } else {
      notification.error({
        message: $t(
          'Please select at least one user from the list to Adjust Mailbox Storage Quota.'
        ),
        placement: 'bottom'
      });
    }
  };

  const getOptions = async (mstType: string) => {
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
        code="FD-S-SYS-002"
        label={$t('Maintain User Setting of Mailbox Storage Quota')}
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
            key="adjustParameters"
            type="primary"
            icon={<Icon type="SettingOutlined" />}
            onClick={goAdjustMessageStorageQuota}
          >
            {$t('Adjust Mailbox Storage Quota')}
          </Button>
        ]}
      />
    </CustomProTableTheme>
  );
};

export default MaintainUserTotalMessage;
