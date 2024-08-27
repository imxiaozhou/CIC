import { ProCard } from '@ant-design/pro-components';
import {
  Button,
  Col,
  Card,
  Empty,
  Row,
  Space,
  Spin,
  Typography,
  Flex
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { DashboardListItem } from './type';
import Icon from '@/components/Icons';
import { menus } from '@/config/menuConfig';
import { Favorites } from '@/components/business';
import { dashboardApi, toggleFavoritesApi } from '@/services/dashboard';

const { Title, Text } = Typography;

const colorMap: { [key: string]: string } = {
  UserOutlined: '#FFA800',
  MobileOutlined: '#0A52C6',
  MenuOutlined: '#694AE4',
  MailOutlined: '#00804A',
  BarChartOutlined: '#E649D2',
  BellOutlined: '#F5CD47',
  PieChartOutlined: '#694AE4',
  DatabaseOutlined: '#2C67FF',
  BulbOutlined: '#4f585d'
};

const getDashboardInfoById = (id: string) => {
  const itemData = { id } as DashboardListItem;
  if (id === 'FD-S-OTH-002') {
    Object.assign(itemData, {
      subTitle: 'FAQs',
      route: '/other-functions/FAQs',
      icon: 'BulbOutlined',
      title: 'Other Functions'
    });
  } else if (id === 'FD-S-USR-003') {
    Object.assign(itemData, {
      subTitle: 'Change Password',
      route: '/other-functions/change-password',
      icon: 'BulbOutlined',
      title: 'Other Functions'
    });
  } else {
    for (const menu of menus) {
      const menuItem = menu?.children?.find((item) => item.code === id);
      if (menuItem) {
        Object.assign(itemData, {
          subTitle: menuItem.label,
          route: menuItem.key,
          icon: menu.icon,
          title: menu.label
        });
        break;
      }
    }
  }
  return itemData;
};

// 根据id数组遍历获取dashboard list
const resToDashboardList = (data: string[]) =>
  data.map((item: string) => getDashboardInfoById(item));

const CardTitle = ({ item }: { item: DashboardListItem }) => {
  return (
    <Space size="middle">
      <Icon
        type={item.icon}
        style={{
          fontSize: 30,
          color: colorMap[item.icon],
          backgroundColor: `${colorMap[item.icon]}1a`,
          padding: 6,
          borderRadius: 6
        }}
      />
      <Text style={{ color: '#666869', fontSize: 16, fontWeight: 100 }}>
        {$t(item.title)}
      </Text>
    </Space>
  );
};

const Dashboard = () => {
  const navigateTo = useNavigate();
  const menus = useAppSelector(selectMenuItem);
  const userInfo = useAppSelector(selectUserInfo);
  const [list, setList] = useState<DashboardListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (functionCode: string) => {
    const param = { userId: userInfo.userId, functionCode, status: 0 };
    const res = await toggleFavoritesApi(param);
    if (res.status.code === 0) {
      notification.success({
        message: $t('Delete Successfully')
      });
      getList();
    }
  };
  const getList = async () => {
    const res = await dashboardApi({ userId: userInfo.userId });
    const dashboardList = resToDashboardList(res.data.sort());
    setList(dashboardList || []);
    setLoading(false);
  };

  useEffect(() => {
    getList();
  }, []);

  const handleCardClick = (code: string, route: string): void => {
    menus.includes(code)
      ? navigateTo(route)
      : notification.error({
          message: $t('No permission to link')
        });
  };

  return (
    <Space direction="vertical">
      <Favorites label={$t('Dashboard')} />
      <Spin spinning={loading} style={{ marginTop: 100 }}>
        <Row gutter={[16, 16]}>
          {list.map((item) => (
            <Col key={item.id} span={8}>
              <ProCard
                style={{ height: 144 }}
                headStyle={{ alignItems: 'flex-start' }}
                hoverable
                title={<CardTitle item={item} />}
                extra={
                  <Button
                    type="link"
                    icon={<Icon type="CloseOutlined" />}
                    onClick={() => handleDelete(item.id)}
                  />
                }
                bordered
                onClick={() => handleCardClick(item.id, item.route)}
              >
                <Flex style={{ position: 'relative', height: '100%' }}>
                  <Title level={5}>{$t(item.subTitle)}</Title>
                  <Icon
                    type={item.icon}
                    style={{
                      fontSize: 56,
                      color: colorMap[item.icon],
                      position: 'absolute',
                      right: -8,
                      bottom: 0,
                      opacity: 0.15
                    }}
                  />
                </Flex>
              </ProCard>
            </Col>
          ))}
        </Row>
        {!list.length && (
          <Card style={{ height: 500, paddingTop: '12%' }}>
            <Empty />
          </Card>
        )}
      </Spin>
    </Space>
  );
};

export default Dashboard;
