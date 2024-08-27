import {
  Card,
  Button,
  Descriptions,
  Typography,
  Row,
  TableColumnsType,
  Table
} from 'antd';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/Icons';
import { getAuditLogsDetail } from '@/services/audit-trials-logs-report-management';
import { AuditLogsDetailResponse } from '@/services/audit-trials-logs-report-management/enquire-audit-logs/type';
import { DataType } from '../type';
import { getValue } from '@/utils';
import { Favorites } from '@/components/business';

const { Item } = Descriptions;
const { Title } = Typography;

const UserDelegation: React.FC = () => {
  const navigate = useNavigate();
  const store = useStorage();
  const id = store.get('FIRST_LEVEL_STORAGE');
  const [logDetail, setLogDetail] = useState<AuditLogsDetailResponse>();

  const getLogDetail = async () => {
    const { data } = await getAuditLogsDetail({ id });
    setLogDetail(data);
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: $t('Key'),
      dataIndex: 'key',
      responsive: ['md']
    },
    {
      title: $t('Value'),
      dataIndex: 'value',
      responsive: ['lg']
    }
  ];

  useEffect(() => {
    getLogDetail();
  }, []);

  return (
    <>
      <Favorites
        code="FD-S-AUD-001"
        label={$t('Enquire Audit Logs for the events')}
      />
      <Card>
        <Row justify="space-between" align="middle">
          <Title level={4}>{$t('Audit Log List Details')}</Title>
          <Button type="primary" ghost onClick={() => navigate(-1)}>
            <Icon type="LeftOutlined" />
            {$t('Back')}
          </Button>
        </Row>
        <Descriptions column={3} layout="vertical">
          <Item label={$t('Tenant Name')}>
            {getValue(logDetail?.tenantName)}
          </Item>
          <Item label={$t('User Email')}>{getValue(logDetail?.userEmail)}</Item>
          <Item label={$t('Delegate User Email')}>
            {getValue(logDetail?.delegateUserEmail)}
          </Item>
          <Item label={$t('Time')}>{getValue(logDetail?.time)}</Item>
          <Item label={$t('IP Address')}>{getValue(logDetail?.ipAddress)}</Item>
          <Item label={$t('Event Type')}>
            {getValue(logDetail?.eventTypeLabel)}
          </Item>
        </Descriptions>
        <Title level={5}>{$t('Detail')}</Title>
        <Table
          columns={columns}
          dataSource={logDetail?.detail}
          pagination={false}
        />
      </Card>
    </>
  );
};

export default UserDelegation;
