import { ReactElement } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  CustomPrintButton,
  CustomProTable,
  CustomProTableTheme,
  SelectSearchable
} from '@/components/proComponents';
import { Favorites } from '@/components/business';

import {
  ISummaryReport,
  SummaryReportExportProps,
  SummaryReportSearchProps
} from './type';
import {
  exportInCSVApi,
  exportInPDFApi,
  searchSumTrafficApi
} from '@/services/audit-trials-logs-report-management';
import { omit } from 'lodash-es';
import {
  getCompleteTimePeriod,
  getRecentThreeMonth,
  montageUnitGB,
  montageUnitKB
} from '../utils';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
const MaintainUserDeleGation = (): ReactElement => {
  const actionRef = useRef<ActionType>();
  const [printKeys, setPrintKeys] = useState<SummaryReportExportProps>();
  const userInfo = useAppSelector(selectUserInfo);
  const $t = useTranslations();

  const columns: ProColumns<ISummaryReport>[] = [
    {
      title: $t('Date'),
      key: 'date',
      dataIndex: 'date',
      sorter: true,
      initialValue: getRecentThreeMonth(),
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
      title: $t('Tenant Name'),
      dataIndex: 'tenantName',
      key: 'tenantName',
      sorter: true,
      order: 1,
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
      title: $t('Message Sent'),
      key: 'msgSent',
      dataIndex: 'msgSent',
      sorter: true,
      search: false
    },
    {
      title: $t('Message Received'),
      key: 'msgReceived',
      dataIndex: 'msgReceived',
      sorter: true,
      search: false
    },
    {
      title: $t('Average Size of Message Sent'),
      key: 'averageSizeOfMsgSent',
      dataIndex: 'averageSizeOfMsgSent',
      sorter: true,
      search: false,
      render: (_, record) => montageUnitKB(record.averageSizeOfMsgSent)
    },
    {
      title: $t('Average Size of Message Received'),
      key: 'averageSizeOfMsgReceived',
      dataIndex: 'averageSizeOfMsgReceived',
      sorter: true,
      search: false,
      render: (_, record) => montageUnitKB(record.averageSizeOfMsgReceived)
    },
    {
      title: $t('Total Size of Message Sent'),
      key: 'totalSizeOfMsgSent',
      dataIndex: 'totalSizeOfMsgSent',
      sorter: true,
      search: false,
      render: (_, record) => montageUnitGB(record.totalSizeOfMsgSent)
    },
    {
      title: $t('Total Size of Message Received'),
      key: 'totalSizeOfMsgReceived',
      dataIndex: 'totalSizeOfMsgReceived',
      sorter: true,
      search: false,
      render: (_, record) => montageUnitGB(record.totalSizeOfMsgReceived)
    }
  ];

  const getDataSource = async (params: any) => {
    const param: SummaryReportSearchProps = {
      ...omit(params, ['current']),
      pageNum: params.current,
      pageSize: params.pageSize,
      sortField: params.columnKey,
      sortOrder: params.order
    };

    const printParams: SummaryReportExportProps = {
      tenantName: param.tenantName,
      date: param.date,
      sortField: param.sortField,
      sortOrder: param.sortOrder
    };
    setPrintKeys(printParams);

    const { data, total } = await searchSumTrafficApi(param);

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
    await exportInCSVApi(printKeys);
    openNotification($t('Exporting the file in CSV...'));
  };

  const handlePrintInPDF = async (): Promise<void> => {
    exportInPDFApi(printKeys);
    openNotification($t('Exporting the file in PDF...'));
  };

  const toolBarRender = () => [
    <CustomPrintButton
      key="PrintToolBarRender"
      handlePrintInCSV={handlePrintInCSV}
      handlePrintInPDF={handlePrintInPDF}
    />
  ];

  return (
    <CustomProTableTheme>
      <Favorites code="FD-S-AUD-005" label={$t('Summary of Message Traffic')} />
      <CustomProTable
        rowSelection={false}
        columns={columns}
        headerTitle={$t('List of Summary of Message Traffic')}
        searchTitle={$t('Search for Summary of Message Traffic')}
        actionRef={actionRef}
        rowKey="key"
        toolBarRender={toolBarRender}
        request={getDataSource}
      />
    </CustomProTableTheme>
  );
};

export default MaintainUserDeleGation;
