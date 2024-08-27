import type { ProColumns } from '@ant-design/pro-components';
import { omit } from 'lodash-es';
import { useNavigate } from 'react-router-dom';
import { Favorites } from '@/components/business';
import {
  CustomProTableTheme,
  CustomProTable,
  TagStatus,
  SelectSearchable
} from '@/components/proComponents';
import { Button } from 'antd';
import {
  getCommonOptions,
  getEmailGroupsOptions,
  getUserRoleOptions
} from '@/services/common';
import { ApproCertSearchResponse } from '@/services/user-management/approve-certificate-enrollment/type';
import { searchSMAUserApproveCertList } from '@/services/user-management';
import {
  translationAllLabel,
  showMultipleLabel,
  formatExpiration
} from '@/utils';

const sessionKey = 'CERTIFICATE_ENROLMENT';

const ApproveCertificateManagement = () => {
  const navigation = useNavigate();
  const store = useStorage();
  const [userStatusOpts, setUserStatusOpts] = useState<LabelValue[]>([]);
  const [userRoleOptions, setUserRoleOptions] = useState<LabelValue[]>([]);
  const [accountStatusOpts, setAccountStatusOpts] = useState<LabelValue[]>([]);
  const [certApprovalStatusOpts, setCertApprovalStatusOpts] = useState<
    LabelValue[]
  >([]);
  const [emailGroupOptions, setEmailGroupOptions] = useState<LabelValue[]>([]);
  const storage = store.get(sessionKey);
  const userInfo = useAppSelector(selectUserInfo);
  const dateFormat = useAppSelector(selectDateFormat);
  const [tenantObj, setTenantObj] = useState([
    {
      label: storage?.tenantNameLabel ?? userInfo.tenantNameLabel,
      value: storage?.tenantName ?? userInfo.tenantName
    }
  ]);
  const searchUserCertificate = async (params: any) => {
    const searchParams = {
      ...omit(params, ['current', 'columnKey', 'order']),
      displayName: params?.displayName?.trim(),
      emailAddress: params?.emailAddress?.trim(),
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

    const { data, total } = await searchSMAUserApproveCertList(searchParams);
    return {
      data,
      success: true,
      total
    };
  };

  const columns: ProColumns<ApproCertSearchResponse>[] = [
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
      render: (_, record) => record?.tenantNameLabel ?? record?.tenantName
    },
    {
      title: $t('Email Group'),
      dataIndex: 'emailGroup',
      initialValue: storage?.emailGroup,
      valueType: 'select',
      fieldProps: {
        options: emailGroupOptions
      },
      sorter: true
    },
    {
      title: $t('User Role'),
      dataIndex: 'userRole',
      initialValue: storage?.userRole,
      valueType: 'select',
      render: (_, record) => showMultipleLabel(record.userRoleLabel),
      fieldProps: {
        options: userRoleOptions
      },
      sorter: true
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
      title: $t('Certificate Type'),
      dataIndex: 'certType',
      initialValue: storage?.certType,
      search: false,
      sorter: true,
      render: (_, record) => record.certTypeLabel
    },
    {
      title: $t('Certificate Status'),
      dataIndex: 'certStatus',
      initialValue: storage?.certStatus,
      search: false,
      sorter: true,
      render: (_, record) => (
        <TagStatus status={record.certStatus}>
          {record.certStatusLabel}
        </TagStatus>
      )
    },
    {
      title: $t('Certificate Expiration'),
      dataIndex: 'validTo',
      initialValue: storage?.validTo,
      search: false,
      sorter: true,
      render: (_, record) => formatExpiration(record, dateFormat)
    },
    {
      title: $t('Certificate Approval Status'),
      dataIndex: 'certApprovalStatus',
      initialValue: storage?.certApprovalStatus ?? 'PENDING_APPR_ANY',
      render: (_, record) => (
        <TagStatus status={record.certApprovalStatus}>
          {record.certApprovalStatusLabel}
        </TagStatus>
      ),
      valueType: 'select',
      fieldProps: {
        options: translationAllLabel(certApprovalStatusOpts)
      },
      sorter: true
    },
    {
      title: $t('Action'),
      valueType: 'option',
      fixed: 'right',
      width: 120,
      key: 'option',
      render: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              store.set('FIRST_LEVEL_STORAGE', record);
              navigation(`./certificate-page`);
            }}
          >
            {$t('View')}
          </Button>
        );
      }
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
        case 'CERT_APPR_STATUS':
          setCertApprovalStatusOpts(options);
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
    getOptions('CERT_APPR_STATUS');
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
      certApprovalStatus: 'PENDING_APPR_ANY'
    });
  };

  return (
    <CustomProTableTheme>
      <Favorites
        code="FD-S-USR-006"
        label={$t('Approve Certificate Enrollment')}
      />
      <CustomProTable
        columns={columns}
        pagination={{ current: storage?.pageNum, pageSize: storage?.pageSize }}
        sorter={{ columnKey: storage?.sortField, order: storage?.sortOrder }}
        rowSelection={false}
        headerTitle={$t('User Certificate Summary')}
        searchTitle={$t('Search User')}
        rowKey="id"
        request={searchUserCertificate}
        initParams={[
          { name: 'tenantName', value: userInfo.tenantName as string },
          { name: 'certApprovalStatus', value: 'PENDING_APPR_ANY' }
        ]}
        onResetCallback={onResetCallback}
      />
    </CustomProTableTheme>
  );
};

export default ApproveCertificateManagement;
