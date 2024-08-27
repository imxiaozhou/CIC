import CustomProTableTheme from '@/components/proComponents/CustomProTableTheme';
import { Favorites } from '@/components/business';
import { type ProColumns } from '@ant-design/pro-components';
import {
  UserReportItem,
  UserReportPrintProps,
  UserReportSearchProps
} from './type';
import {
  CustomPrintButton,
  CustomProTable,
  SelectSearchable,
  TagStatus
} from '@/components/proComponents';
import {
  PrintInPDFApi,
  PrintInCSVApi,
  searchUserReportApi
} from '@/services/audit-trials-logs-report-management';
import { omit } from 'lodash-es';
import { notification } from '@/hooks/useGlobalTips';
import { getCommonOptions } from '@/services/common';
import {
  formatExpiration,
  showMultipleLabel,
  translationAllLabel
} from '@/utils';

export default function ListOfUsersReport() {
  const timeFormat = useAppSelector(selectTimeFormat);
  const userInfo = useAppSelector(selectUserInfo);
  const [userStatusOptions, setUserStatusOptions] = useState<LabelValue[]>([]);
  const $t = useTranslations();

  const getOptions = async (): Promise<void> => {
    const data = await getCommonOptions({ mstType: 'USER_STATUS' });
    setUserStatusOptions(data);
  };

  useEffect(() => {
    getOptions();
  }, []);

  const columns: ProColumns<UserReportItem>[] = [
    {
      title: $t('Display Name'),
      dataIndex: 'displayName',
      key: 'displayName',
      sorter: true,
      search: false
    },
    {
      title: $t('Email Address'),
      dataIndex: 'emailAddress',
      key: 'emailAddress',
      sorter: true,
      search: false
    },
    {
      title: $t('User Role'),
      dataIndex: 'userRole',
      key: 'userRole',
      sorter: true,
      search: false,
      render: (_, record: UserReportItem) =>
        showMultipleLabel(record.userRoleLabel)
    },
    {
      title: $t('Last Log On Time'),
      dataIndex: 'lastLogOnTime',
      key: 'lastLogOnTime',
      sorter: true,
      search: false,
      render: (_, record) => formatExpiration(record.lastLogOnTime, timeFormat)
    },
    {
      title: $t('Tenant Name'),
      dataIndex: 'tenantName',
      key: 'tenantName',
      sorter: true,
      initialValue: userInfo.tenantName,
      renderFormItem: (schema, config, form) => (
        <SelectSearchable
          defaultValue={[
            {
              label: userInfo.tenantNameLabel,
              value: userInfo.tenantName
            }
          ]}
          disabled={!userInfo.userRole!.includes('SUPER_ADM')}
          onValueChange={(newValue: LabelValue[]) => {
            form.setFieldsValue({
              tenantName: newValue[0]?.value
            });
          }}
        />
      )
    },
    {
      title: $t('SMA User'),
      dataIndex: 'SMAUser',
      key: 'SMAUser',
      sorter: true,
      search: false,
      render: (_, record: UserReportItem) => $t(record.SMAUser)
    },
    {
      title: $t('User Status'),
      dataIndex: 'userStatus',
      key: 'userStatus',
      sorter: true,
      render: (_: any, record: UserReportItem) => (
        <TagStatus status={record.userStatus}>
          {record.userStatusLabel}
        </TagStatus>
      ),
      valueType: 'select',
      fieldProps: {
        options: translationAllLabel(userStatusOptions)
      }
    },
    {
      title: $t('Account Status'),
      dataIndex: 'accountStatus',
      key: 'accountStatus',
      sorter: true,
      search: false,
      render: (_: any, record: UserReportItem) => (
        <TagStatus status={record.accountStatus}>
          {record.accountStatusLabel}
        </TagStatus>
      )
    }
  ];
  const [printKeys, setPrintKeys] = useState<UserReportPrintProps>();

  const getUserReportData = async (params: any) => {
    const param: UserReportSearchProps = {
      ...omit(params, ['current']),
      pageNum: params.current,
      pageSize: params.pageSize,
      sortField: params.columnKey,
      sortOrder: params.order
    };
    const { data, total } = await searchUserReportApi(param);
    const printParams = {
      tenantName: param.tenantName,
      userStatus: param.userStatus,
      sortField: param.sortField,
      sortOrder: param.sortOrder
    };
    setPrintKeys(printParams);

    return {
      data,
      success: true,
      total
    };
  };
  const openNotification = (message: string) => {
    notification.info({
      message
    });
  };
  const handlePrintInCSV = async (): Promise<void> => {
    await PrintInCSVApi(printKeys);
    openNotification($t('Exporting the file in CSV...'));
  };

  const handlePrintInPDF = async (): Promise<void> => {
    await PrintInPDFApi(printKeys);
    openNotification($t('Exporting the file in PDF...'));
  };
  return (
    <CustomProTableTheme>
      <Favorites code="FD-S-AUD-004" label={$t('List of Users Report')} />
      <CustomProTable
        headerTitle={$t('List of User Report')}
        searchTitle={$t('Search User Report')}
        columns={columns}
        rowKey="user"
        request={getUserReportData}
        rowSelection={false}
        toolBarRender={() => [
          <CustomPrintButton
            key="PrintToolBarRender"
            handlePrintInCSV={handlePrintInCSV}
            handlePrintInPDF={handlePrintInPDF}
          />
        ]}
      />
    </CustomProTableTheme>
  );
}
