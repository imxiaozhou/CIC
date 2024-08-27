import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { omit } from 'lodash-es';
import type { ProColumns } from '@ant-design/pro-components';
import {
  CustomProTable,
  CustomProTableTheme,
  SelectSearchable,
  TagStatus
} from '@/components/proComponents';
import { Favorites } from '@/components/business';
import { searchUserCertificate } from '@/services/user-management';
import { SearchResponse } from '@/services/user-management/maintain-user-certificate/type';
import {
  getCommonOptions,
  getEmailGroupsOptions,
  getUserRoleOptions
} from '@/services/common';
import {
  translationAllLabel,
  showMultipleLabel,
  formatExpiration
} from '@/utils';

const sessionKey = 'USER_CERTIFICATE';

const MaintainUserCertificate = () => {
  const navigateTo = useNavigate();
  const store = useStorage();
  const [emailGroupOpts, setEmailGroupOpts] = useState<LabelValue[]>([]);
  const [userRoleOpts, setUserRoleOpts] = useState<LabelValue[]>([]);
  const [userStatusOpts, setUserStatusOpts] = useState<LabelValue[]>([]);
  const [accountStatusOpts, setAccountStatusOpts] = useState<LabelValue[]>([]);
  const [certTypeOpts, setCertTypeOpts] = useState<LabelValue[]>([]);
  const [certStatusOpts, setCertStatusOpts] = useState<LabelValue[]>([]);
  const [certExpirationOpts, setCertExpirationOpts] = useState<LabelValue[]>(
    []
  );
  const [certApprStatusOpts, setCertApprStatusOpts] = useState<LabelValue[]>(
    []
  );
  const storage = store.get(sessionKey);
  const userInfo = useAppSelector(selectUserInfo);
  const dateFormat = useAppSelector(selectDateFormat);

  const [tenantObj, setTenantObj] = useState([
    {
      label: storage?.tenantNameLabel ?? userInfo.tenantNameLabel,
      value: storage?.tenantName ?? userInfo.tenantName
    }
  ]);

  const columns: ProColumns<SearchResponse>[] = [
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
      render: (_, record) => showMultipleLabel(record.userRole),
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
      render: (_, row) => (
        <TagStatus status={row.userStatus}>{row.userStatusLabel}</TagStatus>
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
      render: (_, row) => (
        <TagStatus status={row.accountStatus}>
          {row.accountStatusLabel}
        </TagStatus>
      )
    },
    {
      title: $t('Certificate Type'),
      dataIndex: 'certType',
      initialValue: storage?.certType,
      sorter: true,
      valueType: 'select',
      render: (_, row) => row.certTypeLabel ?? '-',
      fieldProps: {
        options: certTypeOpts
      }
    },
    {
      title: $t('Certificate Status'),
      dataIndex: 'certStatus',
      initialValue: storage?.certStatus,
      sorter: true,
      valueType: 'select',
      fieldProps: {
        options: translationAllLabel(certStatusOpts)
      },
      render: (_, row) => (
        <TagStatus status={row.certStatus}>{row.certStatusLabel}</TagStatus>
      )
    },
    {
      title: $t('Certificate Expiration'),
      dataIndex: 'certExpiration',
      initialValue: storage?.certExpiration,
      sorter: true,
      valueType: 'select',
      fieldProps: {
        options: translationAllLabel(certExpirationOpts)
      },
      render: (_, row) => formatExpiration(row, dateFormat)
    },
    {
      title: $t('Certificate Approval Status'),
      dataIndex: 'certApprStatus',
      initialValue: storage?.certApprStatus,
      sorter: true,
      valueType: 'select',
      fieldProps: {
        options: translationAllLabel(certApprStatusOpts)
      },
      render: (_, row) => (
        <TagStatus status={row.certApprStatus}>
          {row.certApprStatusLabel}
        </TagStatus>
      )
    },
    {
      title: $t('Action'),
      dataIndex: 'option',
      valueType: 'option',
      width: 120,
      fixed: 'right',
      render: (_, record) => [
        <Button type="link" key="view" onClick={() => gotoView(record)}>
          {$t('View')}
        </Button>
      ]
    }
  ];

  const gotoView = (record: any) => {
    store.set('FIRST_LEVEL_STORAGE', record);
    navigateTo('./detail');
  };
  const getDataSource = async (params: any) => {
    const searchParams = {
      ...omit(params, ['current', 'columnKey', 'order']),
      displayName: params?.displayName?.trim(),
      emailAddress: params?.emailAddress?.trim(),
      pageNum: params.current,
      pageSize: params.pageSize,
      sortField:
        params.columnKey === 'certExpiration' ? 'validTo' : params.columnKey,
      sortOrder: params.order
    };

    store.set(sessionKey, {
      ...searchParams,
      tenantNameLabel:
        store.get(sessionKey)?.tenantNameLabel ?? userInfo.tenantNameLabel
    });

    const { data, total } = await searchUserCertificate(searchParams);
    return {
      data,
      success: true,
      total
    };
  };
  const getOptions = async (type: string) => {
    let options;
    switch (type) {
      case 'emailGroup':
        options = await getEmailGroupsOptions();
        setEmailGroupOpts(options);
        break;
      case 'userRole':
        options = await getUserRoleOptions();
        setUserRoleOpts(options);
        break;
      case 'USER_STATUS':
        options = await getCommonOptions({ mstType: type });
        setUserStatusOpts(options);
        break;
      case 'ACCT_STATUS':
        options = await getCommonOptions({ mstType: type });
        setAccountStatusOpts(options);
        break;
      case 'CERT_TYPE':
        options = await getCommonOptions({ mstType: type });
        setCertTypeOpts(options);
        break;
      case 'CERT_STATUS':
        options = await getCommonOptions({ mstType: type });
        setCertStatusOpts(options);
        break;
      case 'CERT_EXPIRY_RANGE':
        options = await getCommonOptions({ mstType: type });
        setCertExpirationOpts(options);
        break;
      case 'CERT_APPR_STATUS':
        options = await getCommonOptions({ mstType: type });
        setCertApprStatusOpts(options);
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
    getOptions('CERT_TYPE');
    getOptions('CERT_STATUS');
    getOptions('CERT_EXPIRY_RANGE');
    getOptions('CERT_APPR_STATUS');
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
      <Favorites code="FD-S-USR-005" label={$t('Maintain User Certificate')} />
      <CustomProTable
        columns={columns}
        pagination={{ current: storage?.pageNum, pageSize: storage?.pageSize }}
        sorter={{ columnKey: storage?.sortField, order: storage?.sortOrder }}
        rowSelection={false}
        headerTitle={$t('User Certificate Summary')}
        searchTitle={$t('Search User')}
        rowKey="rm"
        request={getDataSource}
        initParams={[
          { name: 'tenantName', value: userInfo.tenantName as string }
        ]}
        onResetCallback={onResetCallback}
      />
    </CustomProTableTheme>
  );
};

export default MaintainUserCertificate;
