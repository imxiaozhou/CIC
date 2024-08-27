import { useNavigate } from 'react-router-dom';
import { Button, Flex, Typography } from 'antd';
import Icon from '@/components/Icons';
const { Title } = Typography;

const DescriptionTitle = (props: { title: string }) => {
  const { title } = props;
  const navigateTo = useNavigate();
  return (
    <Flex justify="space-between">
      <Title level={4}>{$t(title)}</Title>
      <Button
        ghost
        type="primary"
        icon={<Icon type="LeftOutlined" />}
        onClick={() => navigateTo(-1)}
      >
        {$t('Back')}
      </Button>
    </Flex>
  );
};

export default DescriptionTitle;
