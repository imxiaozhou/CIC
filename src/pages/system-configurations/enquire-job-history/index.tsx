import { DatePicker } from 'antd';
import { ProColumns, ProFormDateRangePicker } from '@ant-design/pro-components';
import { Favorites } from '@/components/business';
import {
  CustomProTable,
  CustomProTableTheme,
  TagStatus
} from '@/components/proComponents';
import { getCommonOptions } from '@/services/common';
import { translationAllLabel, formatExpiration } from '@/utils';
import { getJobHistory } from '@/services/system-configurations/enquire-job-history';
import { JobHistoryResponse } from '@/services/system-configurations/enquire-job-history/type';

const getDataSource = async (params: any) => {
  const { data, total } = await getJobHistory({
    jobName: params?.jobName?.trim(),
    jobType: params?.jobType,
    jobStatus: params?.jobStatus,
    jobTime: params?.jobTime,
    parameters: params?.parameters?.trim(),
    pageNum: params.current,
    pageSize: params.pageSize,
    sortField: params.columnKey,
    sortOrder: params.order
  });

  return {
    data,
    success: true,
    total
  };
};

const EnquireJobHistory: React.FC = () => {
  const [jobTypeList, setJobTypeList] = useState<LabelValue[]>([]);
  const [jobStatusList, setJobStatusList] = useState<LabelValue[]>([]);
  const timeFormat = useAppSelector(selectTimeFormat);
  const $t = useTranslations();

  const columns: ProColumns<JobHistoryResponse>[] = [
    {
      title: $t('Job Name'),
      dataIndex: 'jobName',
      sorter: true,
      order: 5
    },
    {
      title: $t('Job Type'),
      dataIndex: 'jobType',
      sorter: true,
      order: 4,
      valueType: 'select',
      fieldProps: {
        options: jobTypeList
      }
    },
    {
      title: $t('Parameters'),
      dataIndex: 'parameters',
      sorter: true,
      order: 3
    },
    {
      title: $t('Start Time'),
      dataIndex: 'startTime',
      sorter: true,
      valueType: 'date',
      hideInSearch: true,
      renderFormItem: () => {
        return <DatePicker />;
      },
      render: (_, record) => formatExpiration(record.startTime, timeFormat)
    },
    {
      title: $t('Completion Time'),
      dataIndex: 'completeTime',
      sorter: true,
      valueType: 'date',
      hideInSearch: true,
      renderFormItem: () => {
        return <DatePicker />;
      },
      render: (_, record) => formatExpiration(record.completeTime, timeFormat)
    },
    {
      title: $t('Time'),
      dataIndex: 'jobTime',
      sorter: true,
      valueType: 'date',
      hideInTable: true,
      renderFormItem: () => <ProFormDateRangePicker name="jobTime" />
    },
    {
      title: $t('Job Execute Status'),
      dataIndex: 'jobStatus',
      sorter: true,
      order: 2,
      valueType: 'select',
      fieldProps: {
        options: jobStatusList
      },
      render: (_, record) => (
        <TagStatus status={record?.jobStatus}>
          {record?.jobStatusLabel}
        </TagStatus>
      )
    }
  ];

  const getJobType = async () => {
    const res = await getCommonOptions({ mstType: 'SCHEDULE_JOB_TYPE' });
    setJobTypeList(res);
  };

  const getJobStatus = async () => {
    const res = await getCommonOptions({ mstType: 'SCHEDULE_JOB_EXE_STATUS' });
    setJobStatusList(translationAllLabel(res));
  };

  useEffect(() => {
    getJobType();
    getJobStatus();
  }, []);

  return (
    <CustomProTableTheme>
      <Favorites code="FD-S-SYS-009" label={$t('Enquire Job History')} />
      <CustomProTable
        columns={columns}
        headerTitle={$t('Scheduled Job History List')}
        searchTitle={$t('Search for Scheduled Job History')}
        rowKey="id"
        rowSelection={false}
        request={getDataSource}
      />
    </CustomProTableTheme>
  );
};

export default EnquireJobHistory;
