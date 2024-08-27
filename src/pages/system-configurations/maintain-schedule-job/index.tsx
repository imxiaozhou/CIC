import {
  ProFormDatePicker,
  type ActionType,
  type ProColumns
} from '@ant-design/pro-components';
import {
  CustomFormButton,
  CustomProTable,
  CustomProTableTheme,
  TagStatus
} from '@/components/proComponents';
import Favorites from '@/components/business/Favorites';
import Icon from '@/components/Icons';
import AddOrEdit from './components/AddOrEdit';
import {
  MaintainScheduleJobItem,
  QueryMaintainScheduleJobListProps
} from './type';
import {
  getMaintainScheduleJobListApi,
  runNowScheduleJobApi,
  removeScheduleJobApi
} from '@/services/system-configurations';
import { getCommonOptions } from '@/services/common';
import { formatExpiration, translationAllLabel } from '@/utils';
import { omit } from 'lodash-es';
import { Button } from 'antd';

const getDataSource = async (params: any) => {
  const param: QueryMaintainScheduleJobListProps = {
    ...omit(params, ['current']),
    pageNum: params.current,
    pageSize: params.pageSize,
    sortField: params.columnKey,
    sortOrder: params.order,
    jobName: params.jobName?.trim(),
    parameters: params.parameters?.trim()
  };
  const { data, total } = await getMaintainScheduleJobListApi(param);
  return {
    data,
    success: true,
    total
  };
};

const MaintainScheduleJob = () => {
  const [jobStatusOptions, setStatusOptions] = useState<LabelValue[]>([]);
  const [jobTypeOptions, setTypeOptions] = useState<LabelValue[]>([]);
  const [selectIsEdit, setSelectIsEdit] = useState<boolean>(false);
  const [selectJob, setSelectJob] = useState<MaintainScheduleJobItem>();
  const [isOpen, setIsOpen] = useState(false);
  const timeFormat = useAppSelector(selectTimeFormat);
  const tableRef = useRef<ActionType>();
  const $t = useTranslations();

  const getOptions = async (mstType: string): Promise<void> => {
    switch (mstType) {
      case 'SCHEDULE_JOB_STATUS':
        setStatusOptions(await getCommonOptions({ mstType }));
        break;
      case 'SCHEDULE_JOB_TYPE':
        setTypeOptions(await getCommonOptions({ mstType }));
        break;
      default:
        break;
    }
  };

  const handleRunNow = ({ jobName, parameters }: MaintainScheduleJobItem) => {
    runNowScheduleJobApi({ jobName, param: parameters as string }).then(
      (res) => {
        if (res.status.code === 0)
          notification.success({
            message: $t('Run Now Successfully')
          });
        tableRef?.current?.reload();
      }
    );
  };

  const handleDelete = (id: string) => {
    removeScheduleJobApi({ id }).then((res) => {
      if (res.status.code === 0)
        notification.success({
          message: $t('Delete Successfully')
        });
      tableRef?.current?.reload();
    });
  };

  const columns: ProColumns<MaintainScheduleJobItem>[] = [
    {
      title: $t('Job Name'),
      dataIndex: 'jobName',
      sorter: true,
      order: 3
    },
    {
      title: $t('Parameters'),
      dataIndex: 'parameters',
      sorter: true,
      order: 1
    },
    {
      title: $t('Job Type'),
      dataIndex: 'jobType',
      sorter: true,
      order: 2,
      valueType: 'select',
      fieldProps: { options: translationAllLabel(jobTypeOptions) }
    },

    {
      title: $t('Create Date'),
      dataIndex: 'createDate',
      sorter: true,
      renderFormItem: () => <ProFormDatePicker />,
      render: (_, record) => formatExpiration(record.createDate, timeFormat)
    },
    {
      title: $t('Last Execute Date'),
      dataIndex: 'lastExecuteDate',
      sorter: true,
      renderFormItem: () => <ProFormDatePicker />,
      render: (_, record) =>
        formatExpiration(record.lastExecuteDate, timeFormat)
    },
    {
      title: $t('Next Execute Date'),
      dataIndex: 'nextExecuteDate',
      sorter: true,
      renderFormItem: () => <ProFormDatePicker />,
      render: (_, record) =>
        formatExpiration(record.nextExecuteDate, timeFormat)
    },
    {
      title: $t('Job Status'),
      dataIndex: 'jobStatus',
      sorter: true,
      valueType: 'select',
      fieldProps: {
        options: translationAllLabel(jobStatusOptions)
      },
      render: (_, record: MaintainScheduleJobItem) => (
        <TagStatus status={record.jobStatus as string}>
          {record.jobStatusLabel}
        </TagStatus>
      )
    },
    {
      title: $t('Action'),
      dataIndex: 'action',
      valueType: 'option',
      fixed: 'right',
      width: 120,
      render: (_, record: MaintainScheduleJobItem) => [
        <CustomFormButton
          type="link"
          key="runNow"
          onConfirm={() => handleRunNow(record)}
        >
          {$t('Run Now')}
        </CustomFormButton>,
        <Button type="link" key="update" onClick={() => handleEditJob(record)}>
          {$t('Update')}
        </Button>,
        <CustomFormButton
          type="link"
          danger
          key="delete"
          okText={$t('Delete')}
          onConfirm={() => handleDelete(record?.id)}
        >
          {$t('Delete')}
        </CustomFormButton>
      ]
    }
  ];

  const handleAddJob = () => {
    setIsOpen(true);
    setSelectIsEdit(false);
    setSelectJob(undefined);
  };

  const handleEditJob = (record: MaintainScheduleJobItem) => {
    setIsOpen(true);
    setSelectIsEdit(true);
    setSelectJob(record);
  };

  const handleIsOpen = (value: boolean) => setIsOpen(value);

  useEffect(() => {
    getOptions('SCHEDULE_JOB_STATUS');
    getOptions('SCHEDULE_JOB_TYPE');
  }, []);

  return (
    <CustomProTableTheme>
      <Favorites code="FD-S-SYS-008" label={$t('Maintain Schedule Job')} />
      <CustomProTable
        actionRef={tableRef}
        rowSelection={false}
        columns={columns}
        searchTitle={$t('Search Job')}
        headerTitle={$t('Scheduled Job List')}
        rowKey="id"
        request={getDataSource}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<Icon type="PlusOutlined" />}
            onClick={() => handleAddJob()}
          >
            {$t('Add Schedule Job')}
          </Button>
        ]}
      />
      <AddOrEdit
        isEdit={selectIsEdit}
        isOpen={isOpen}
        job={selectJob}
        onClose={() => {
          tableRef?.current?.reload();
        }}
        setIsOpen={handleIsOpen}
      />
      ,
    </CustomProTableTheme>
  );
};

export default MaintainScheduleJob;
