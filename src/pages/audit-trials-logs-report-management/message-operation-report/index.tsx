import { Favorites } from '@/components/business';
import {
  CustomPrintButton,
  CustomProTable,
  CustomProTableTheme,
  SelectSearchable,
  TagStatus
} from '@/components/proComponents';
import { type ActionType, type ProColumns } from '@ant-design/pro-components';
import {
  MessageOperationReportColumns,
  MessageOperationReportPrintParams,
  MessageOperationReportSearchParams
} from './type';
import {
  getCommonOptions,
  getEmailGroupsOptions,
  getUserRoleOptions
} from '@/services/common';
import {
  formatExpiration,
  showMultipleLabel,
  translationAllLabel
} from '@/utils';
import { omit } from 'lodash-es';
import {
  postCSVApi,
  postPDFApi,
  searchMessageOperationReportApi
} from '@/services/audit-trials-logs-report-management';
import {
  getCompleteTimePeriod,
  getRecentThreeMonth,
  montageUnitKB,
  montageUnitS
} from '../utils';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
const MessageOperationReport = () => {
  const actionRef = useRef<ActionType>();
  const userInfo = useAppSelector(selectUserInfo);
  const [printKeys, setPrintKeys] =
    useState<MessageOperationReportPrintParams>();
  const [userStatusOptions, setUserStatusOptions] = useState<LabelValue[]>([]);
  const [userRoleOptions, setUserRoleOptions] = useState<LabelValue[]>([]);
  const [emailGroupOptions, setEmailGroupOptions] = useState<LabelValue[]>([]);
  const $t = useTranslations();

  const timeFormat = useAppSelector(selectTimeFormat);

  const getOptions = async (mstType: string): Promise<void> => {
    switch (mstType) {
      case 'EMAIL_GROUP':
        setEmailGroupOptions(await getEmailGroupsOptions());
        break;
      case 'USER_STATUS':
        setUserStatusOptions(await getCommonOptions({ mstType }));
        break;
      case 'USER_ROLES':
        setUserRoleOptions(await getUserRoleOptions());
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getOptions('EMAIL_GROUP');
    getOptions('USER_STATUS');
    getOptions('USER_ROLES');
  }, []);

  const columns: ProColumns<MessageOperationReportColumns>[] = [
    {
      title: $t('Date'),
      dataIndex: 'date',
      sorter: true,
      order: 4,
      valueType: 'date',
      initialValue: getRecentThreeMonth(),
      render: (_, record) => formatExpiration(record.date, timeFormat),
      renderFormItem: (schema, config, form) => (
        <RangePicker
          picker="month"
          onChange={(_: any, dateStrings: [string, string]) => {
            form.setFieldsValue({
              date: getCompleteTimePeriod(dateStrings)
            });
          }}
        />
      )
    },
    {
      title: $t('Display Name'),
      dataIndex: 'displayName',
      search: false,
      sorter: true
    },
    {
      title: $t('Email Address'),
      dataIndex: 'emailAddress',
      search: false,
      sorter: true
    },
    {
      title: $t('Email Group'),
      dataIndex: 'emailGroup',
      sorter: true,
      order: 3,
      valueType: 'select',
      fieldProps: {
        options: emailGroupOptions
      }
    },
    {
      title: $t('User Role'),
      dataIndex: 'userRole',
      valueType: 'select',
      sorter: true,
      order: 2,
      render: (_, record: MessageOperationReportColumns) =>
        showMultipleLabel(record.userRole),
      fieldProps: {
        options: userRoleOptions
      }
    },
    {
      title: $t('Tenant Name'),
      dataIndex: 'tenantName',
      sorter: true,
      order: 5,
      initialValue: userInfo.tenantName,
      renderFormItem(schema, config, form) {
        return (
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
        );
      }
    },
    {
      title: $t('User Status'),
      dataIndex: 'userStatus',
      valueType: 'select',
      sorter: true,
      order: 1,
      fieldProps: {
        options: translationAllLabel(userStatusOptions)
      },
      render: (_, record: MessageOperationReportColumns) => (
        <TagStatus status={record.userStatus}>
          {record.userStatusLabel}
        </TagStatus>
      )
    },
    {
      title: $t('Account Status'),
      dataIndex: 'accountStatus',
      search: false,
      sorter: true,
      render: (_, record: MessageOperationReportColumns) => (
        <TagStatus status={record.accountStatus}>
          {record.accountStatusLabel}
        </TagStatus>
      )
    },
    {
      title: $t('Message Size'),
      dataIndex: 'messageSize',
      search: false,
      sorter: true,
      render: (_, record: MessageOperationReportColumns) =>
        montageUnitKB(record.messageSize, 2)
    },
    {
      title: $t('Time for Receive'),
      dataIndex: 'timeforReceive',
      search: false,
      sorter: true,
      render: (_, record: MessageOperationReportColumns) =>
        montageUnitS(record.timeforReceive)
    },
    {
      title: $t('Time for Send'),
      dataIndex: 'timeforSend',
      search: false,
      sorter: true,
      render: (_, record: MessageOperationReportColumns) =>
        montageUnitS(record.timeforSend)
    }
  ];

  const searchMessageOperationReport = async (params: any) => {
    const param: MessageOperationReportSearchParams = {
      ...omit(params, ['current']),
      pageNum: params.current,
      pageSize: params.pageSize,
      sortField: params.columnKey,
      sortOrder: params.order
    };
    const { data, total } = await searchMessageOperationReportApi(param);

    const printParams = {
      sentDate: param.sentDate,
      emailGroup: param.emailGroup,
      userRole: param.userRole,
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

  const openNotification = (message: string): void => {
    notification.info({
      message
    });
  };

  const handlePrintInCSV = async (): Promise<void> => {
    await postCSVApi(printKeys);
    openNotification($t('Exporting the file in CSV...'));
  };

  const handlePrintInPDF = async () => {
    await postPDFApi(printKeys);
    openNotification($t('Exporting the file in PDF...'));
  };

  return (
    <CustomProTableTheme>
      <Favorites code="FD-S-AUD-006" label={$t('Message Operation Report')} />
      <CustomProTable
        columns={columns}
        headerTitle={$t('List of Message Operation Report')}
        searchTitle={$t('Search for Message Operation Report')}
        rowKey="hashKey"
        actionRef={actionRef}
        rowSelection={false}
        request={searchMessageOperationReport}
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
};

export default MessageOperationReport;
