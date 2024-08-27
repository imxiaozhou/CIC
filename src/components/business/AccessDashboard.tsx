import { Card, Flex, Space, Image, Button, Typography } from 'antd';
import Icon from '@/components/Icons';
import type { AccessDashboardType } from '@/types/business';

const { Title, Text } = Typography;

const AccessDashboard = ({ title, btnText, url }: AccessDashboardType) => {
  const onOpenUrl = () => window.open(url, '_blank');

  return (
    <Card style={{ flex: 1 }}>
      <Title level={4}>{$t(title)}</Title>
      <Flex vertical style={{ paddingTop: '32px' }}>
        <Space align="center" direction="vertical" size="middle">
          <Image
            src={`${import.meta.env.BASE_URL}access_dashboard.png`}
            preview={false}
            width={320}
          />
          <Text>
            {$t('Please click " (0) " to view more details', [btnText])}
          </Text>
          <Button
            type="primary"
            ghost
            icon={<Icon type="ExportOutlined" />}
            onClick={onOpenUrl}
          >
            {btnText}
          </Button>
        </Space>
      </Flex>
    </Card>
  );
};

export default AccessDashboard;
