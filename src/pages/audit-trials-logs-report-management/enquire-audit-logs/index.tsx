import {
  ProColumns,
  ProFormDateTimeRangePicker
} from '@ant-design/pro-components';
import { ReactElement } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  CustomPrintButton,
  CustomProTable,
  CustomProTableTheme,
  SelectSearchable
} from '@/components/proComponents';
import { Favorites } from '@/components/business';
import {
  AuditPrintInCSV,
  AuditPrintInPDF,
  getAuditLogs
} from '@/services/audit-trials-logs-report-management';
import { IAuditLogs } from './type';
import { formatExpiration } from '@/utils';

const sessionKey = 'AUDIT_LOGS';

const EnquireAuditLogs = (): ReactElement => {
  const store = useStorage();
  const navigate = useNavigate();
  const timeFormat = useAppSelector(selectTimeFormat);
  const userInfo = useAppSelector(selectUserInfo);
  const [printKeys, setPrintKeys] = useState<any>();

  const storage = store.get(sessionKey);
  const [dateObj, setDateObj] = useState([
    dayjs().startOf('day').format('YYYY-MM-DD HH:mm'),
    dayjs().endOf('day').format('YYYY-MM-DD HH:mm')
  ]);
  const [tenantObj, setTenantObj] = useState([
    {
      label: storage?.tenantNameLabel ?? userInfo.tenantNameLabel,
      value: storage?.tenantName ?? userInfo.tenantName
    }
  ]);
  const [eventType, setEventType] = useState(storage?.eventTypeDefault);

  const getDataSource = async (params: any) => {
    const printParams = {
      tenantName: params?.tenantName,
      userEmail: params?.userEmail?.trim(),
      delegateUserEmail: params?.delegateUserEmail?.trim(),
      delegationDate: [
        dayjs(params?.delegationDate[0]).format('YYYY-MM-DD HH:mm'),
        dayjs(params?.delegationDate[1]).format('YYYY-MM-DD HH:mm')
      ],
      ipAddress: params?.ipAddress?.trim(),
      eventType: params?.eventType,
      sortField: params.columnKey,
      sortOrder: params.order
    };

    const searchParams = {
      ...printParams,
      pageNum: params?.current,
      pageSize: params?.pageSize
    };

    setPrintKeys(printParams);

    const currentStorage = store.get(sessionKey);

    store.set(sessionKey, {
      ...searchParams,
      tenantNameLabel:
        currentStorage?.tenantNameLabel ?? userInfo.tenantNameLabel,
      eventTypeDefault: currentStorage?.eventTypeDefault
    });

    const { data, total } = await getAuditLogs(searchParams);

    return {
      data,
      success: true,
      total
    };
  };

  const columns: ProColumns<IAuditLogs>[] = [
    {
      title: $t('Tenant Name'),
      dataIndex: 'tenantName',
      initialValue: storage?.tenantName ?? userInfo.tenantName,
      order: 3,
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
      }
    },
    {
      title: $t('User Email'),
      dataIndex: 'userEmail',
      initialValue: storage?.userEmail,
      sorter: true
    },
    {
      title: $t('Delegate User Email'),
      dataIndex: 'delegateUserEmail',
      initialValue: storage?.delegateUserEmail,
      sorter: true
    },
    {
      title: $t('Time'),
      dataIndex: 'time',
      sorter: true,
      search: false,
      render: (_, record) => formatExpiration(record.time, timeFormat)
    },
    {
      title: $t('Time'),
      dataIndex: 'delegationDate',
      sorter: true,
      hideInTable: true,
      valueType: 'dateTimeRange',
      order: 2,
      initialValue: storage?.delegationDate ?? dateObj,
      renderFormItem: () => (
        <ProFormDateTimeRangePicker
          name="delegationDate"
          fieldProps={{
            format: 'YYYY-MM-DD HH:mm'
          }}
        />
      )
    },
    {
      title: $t('IP Address'),
      dataIndex: 'ipAddress',
      initialValue: storage?.ipAddress,
      sorter: true
    },
    {
      title: $t('Event Type'),
      dataIndex: 'eventType',
      sorter: true,
      order: 1,
      initialValue: storage?.eventType,
      renderFormItem(schema, config, form, action) {
        return (
          <SelectSearchable
            mode="multiple"
            url="sma-adm/api/common/search-event-type"
            defaultValue={eventType}
            onValueChange={(newValue: LabelValue[]) => {
              form.setFieldsValue({
                eventType: newValue.map((item) => item.value)
              });
              store.set(sessionKey, {
                ...storage,
                eventType: newValue.map((item) => item.value),
                eventTypeDefault: newValue
              });
            }}
          />
        );
      },
      render: (_, record) => record?.eventTypeLabel
    },
    {
      title: $t('Action'),
      dataIndex: 'action',
      fixed: 'right',
      width: 50,
      search: false,
      render: (_, record) => [
        <Button
          key="view"
          type="link"
          onClick={() => {
            store.set('FIRST_LEVEL_STORAGE', record.id);
            navigate(
              '/audit-trials-logs-report-management/enquire-audit-logs/details'
            );
          }}
        >
          {$t('Details')}
        </Button>
      ]
    }
  ];

  const openNotification = (message: string) => {
    notification.info({
      message
    });
  };

  const handlePrintInCSV = async () => {
    await AuditPrintInCSV(printKeys);
    openNotification($t('Exporting the file in CSV...'));
  };

  const handlePrintInPDF = async () => {
    await AuditPrintInPDF(printKeys);
    openNotification($t('Exporting the file in PDF...'));
  };

  const onResetCallback = () => {
    setTenantObj([
      { label: userInfo.tenantNameLabel, value: userInfo.tenantName }
    ]);
    setDateObj([
      dayjs().startOf('day').format('YYYY-MM-DD HH:mm'),
      dayjs().endOf('day').format('YYYY-MM-DD HH:mm')
    ]);
    setEventType([]);
    store.set(sessionKey, {
      ...storage,
      tenantNameLabel: userInfo.tenantNameLabel,
      eventTypeDefault: []
    });
  };

  return (
    <CustomProTableTheme>
      <Favorites
        code="FD-S-AUD-001"
        label={$t('Enquire Audit Logs for the events')}
      />
      <CustomProTable
        columns={columns}
        headerTitle={$t('Audit Log List')}
        searchTitle={$t('Search Audit Log')}
        rowKey="id"
        rowSelection={false}
        request={getDataSource}
        pagination={{ current: storage?.pageNum, pageSize: storage?.pageSize }}
        sorter={{ columnKey: storage?.sortField, order: storage?.sortOrder }}
        toolBarRender={() => [
          <CustomPrintButton
            key="PrintToolBarRender"
            handlePrintInCSV={handlePrintInCSV}
            handlePrintInPDF={handlePrintInPDF}
          />
        ]}
        initParams={[
          { name: 'tenantName', value: userInfo.tenantName as string },
          { name: 'delegationDate', value: dateObj as unknown as string }
        ]}
        onResetCallback={onResetCallback}
      />
    </CustomProTableTheme>
  );
};

export default EnquireAuditLogs;
