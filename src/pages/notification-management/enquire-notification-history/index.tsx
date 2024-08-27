import type { ProColumns } from '@ant-design/pro-components';
import { Favorites } from '@/components/business';
import { ProFormDateRangePicker } from '@ant-design/pro-components';
import {
  CustomProTable,
  CustomProTableTheme
} from '@/components/proComponents';
import { getCommonOptions } from '@/services/common';
import { translationAllLabel, formatExpiration } from '@/utils';
import { getNotificationHistory } from '@/services/notification-management';

const getDataSource = async (params: any) => {
  const { data, total } = await getNotificationHistory({
    type: params?.type,
    template: params?.template?.trim(),
    content: params?.content?.trim(),
    sender: params?.sender?.trim(),
    sentDateAndTime: params?.sentDateAndTime,
    recipient: params?.recipient?.trim(),
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

const EnquireNotificationHistory: React.FC = () => {
  const [notificationType, setNotificationType] = useState<LabelValue[]>([]);
  const timeFormat = useAppSelector(selectTimeFormat);
  const $t = useTranslations();

  const columns: ProColumns<any>[] = [
    {
      title: $t('Type'),
      key: 'type',
      dataIndex: 'type',
      sorter: true,
      order: 5,
      formItemProps: { label: $t('Notification Type') },
      valueType: 'select',
      fieldProps: {
        options: translationAllLabel(notificationType)
      }
    },
    {
      title: $t('Template'),
      key: 'template',
      dataIndex: 'template',
      sorter: true,
      order: 4,
      formItemProps: { label: $t('Notification Template') }
    },
    {
      title: $t('Content'),
      dataIndex: 'content',
      key: 'content',
      sorter: true,
      order: 3,
      formItemProps: { label: $t('Notification Content') }
    },
    {
      title: $t('Sender'),
      dataIndex: 'sender',
      key: 'sender',
      sorter: true,
      order: 2
    },
    {
      title: $t('Recipient'),
      dataIndex: 'recipient',
      key: 'recipient',
      sorter: true
    },
    {
      title: $t('Sent Date and Time'),
      dataIndex: 'sentDateAndTime',
      key: 'sentDateAndTime',
      sorter: true,
      valueType: 'date',
      order: 1,
      formItemProps: { label: $t('Sent Date') },
      renderFormItem: () => <ProFormDateRangePicker />,
      render: (_, record) =>
        formatExpiration(record.sentDateAndTime, timeFormat)
    }
  ];

  const getNotificationType = (): void => {
    getCommonOptions({
      mstType: 'NOTIFICATION_TYPE'
    }).then((options) => {
      setNotificationType(options);
    });
  };

  useEffect(() => {
    getNotificationType();
  }, []);

  return (
    <CustomProTableTheme>
      <Favorites
        code="FD-S-NTM-001"
        label={$t('Enquire Notification History')}
      />
      <CustomProTable
        columns={columns}
        headerTitle={$t('Notification History')}
        searchTitle={$t('Search Notification')}
        rowKey="key"
        rowSelection={false}
        request={getDataSource}
      />
    </CustomProTableTheme>
  );
};

export default EnquireNotificationHistory;
