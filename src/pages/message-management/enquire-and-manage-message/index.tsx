import { ProColumns, ProFormDateRangePicker } from '@ant-design/pro-components';
import { ReactElement } from 'react';
import { Button, Card, Modal, Typography } from 'antd';
import {
  CustomProTable,
  CustomProTableTheme
} from '@/components/proComponents';
import { Favorites } from '@/components/business';
import {
  detailManageMessage,
  searchManageMessage
} from '@/services/message-management';
import { getCommonOptions } from '@/services/common';
import { IManageMessage } from './type';
import dayjs from 'dayjs';
import { translationAllLabel, formatExpiration, getValue } from '@/utils';
import { montageUnitMB } from '../utils';

const { Title, Text } = Typography;

const getDataSource = async (params: any) => {
  const { data, total } = await searchManageMessage({
    deliveryStatus: params?.deliveryStatus,
    sentDate: params?.sentDate,
    classification: params?.classification,
    messageSize: params?.messageSize?.trim(),
    subject: params?.subject?.trim(),
    sender: params?.sender?.trim(),
    recipient: params?.recipient?.trim(),
    relatedMessage: params?.relatedMessage?.trim(),
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

const EnquireAndManageMessage = (): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);
  const [information, setInformation] = useState<string | undefined>(undefined);
  const [deliveryStatus, setDeliveryStatus] = useState<LabelValue[]>([]);
  const [classificationStatus, setClassificationStatus] = useState<
    LabelValue[]
  >([]);

  const $t = useTranslations();
  const timeFormat = useAppSelector(selectTimeFormat);

  const getDetail = async (id: string) => {
    setVisible(true);
    const res = await detailManageMessage({ id });
    if (res.status.code === 0) {
      setInformation(res?.payload?.data?.routingInformation);
    }
  };

  const columns: ProColumns<IManageMessage>[] = [
    {
      title: $t('SMA Message ID'),
      dataIndex: 'id',
      search: false,
      sorter: true
    },
    {
      title: $t('CMMP Message ID'),
      dataIndex: 'cmmpMessageId',
      search: false,
      sorter: true
    },
    {
      title: $t('Delivery Status'),
      dataIndex: 'deliveryStatus',
      sorter: true,
      valueType: 'select',
      fieldProps: {
        options: translationAllLabel(deliveryStatus)
      }
    },
    {
      title: $t('Sent Date'),
      dataIndex: 'sentDate',
      sorter: true,
      hideInTable: true,
      valueType: 'dateRange',
      initialValue: [
        dayjs().subtract(1, 'month').startOf('day'),
        dayjs().endOf('day')
      ],
      renderFormItem: () => {
        return <ProFormDateRangePicker />;
      }
    },
    {
      title: $t('Sent Date and Time'),
      dataIndex: 'sentDateAndTime',
      search: false,
      sorter: true,
      render: (_, record) =>
        formatExpiration(record.sentDateAndTime, timeFormat)
    },

    {
      title: $t('Classification'),
      dataIndex: 'classification',
      sorter: true,
      valueType: 'select',
      fieldProps: {
        options: translationAllLabel(classificationStatus)
      },
      render: (_, record) => {
        return getValue(record?.classification);
      }
    },
    {
      title: $t('Message Size'),
      dataIndex: 'messageSize',
      sorter: true,
      render: (_, record) => montageUnitMB(record.messageSize)
    },
    {
      title: $t('Subject'),
      dataIndex: 'subject',
      sorter: true
    },
    {
      title: $t('Sender'),
      dataIndex: 'sender',
      sorter: true
    },
    {
      title: $t('Recipient'),
      dataIndex: 'recipient',
      hidden: true
    },
    {
      title: $t('Related Message'),
      dataIndex: 'relatedMessage',
      hidden: true
    },
    {
      title: $t('To(s)'),
      dataIndex: 'toS',
      search: false,
      sorter: true
    },
    {
      title: $t('CC(s)'),
      dataIndex: 'ccS',
      search: false,
      sorter: true
    },
    {
      title: $t('BCC(s)'),
      dataIndex: 'bccS',
      search: false,
      sorter: true
    },
    {
      title: $t('Routing'),
      dataIndex: 'routing',
      search: false,
      fixed: 'right',
      width: 50,
      render: (_, record) => [
        <Button key="view" type="link" onClick={() => getDetail(record.id)}>
          {$t('Details')}
        </Button>
      ]
    }
  ];

  const getDelivery = (): void => {
    getCommonOptions({
      mstType: 'MSG_STATUS'
    }).then((options) => {
      const currentDelivery = options.filter((item) => item.value !== 'DRAFT');
      setDeliveryStatus(currentDelivery);
    });
  };

  const getClassification = (): void => {
    getCommonOptions({
      mstType: 'MSG_TYPE'
    }).then((options) => {
      setClassificationStatus(options);
    });
  };

  const onModalClose = () => {
    setVisible(false);
    setInformation(undefined);
  };

  useEffect(() => {
    getDelivery();
    getClassification();
  }, []);

  return (
    <>
      <CustomProTableTheme>
        <Favorites
          code="FD-S-MSG-001"
          label={$t('Enquire and Manage Message')}
        />
        <CustomProTable
          columns={columns}
          headerTitle={$t('Message List')}
          searchTitle={$t('Search Messages')}
          rowKey="id"
          rowSelection={false}
          request={getDataSource}
        />
      </CustomProTableTheme>
      <Modal open={visible} onCancel={onModalClose} width={1000} footer={null}>
        <Title level={4} className="text-center">
          {$t('Routing Information')}
        </Title>
        <Card style={{ height: 500 }}>
          <Text>{information}</Text>
        </Card>
      </Modal>
    </>
  );
};

export default EnquireAndManageMessage;
