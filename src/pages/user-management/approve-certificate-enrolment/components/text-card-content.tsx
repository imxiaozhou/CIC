import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/Icons';
import {
  ProCard,
  ProDescriptions,
  ProDescriptionsItemProps
} from '@ant-design/pro-components';
import { CARD_HEADSTYLE } from '../utils';

const { Title } = Typography;

interface PropsInterface {
  title: string;
  titleChildren?: string;
  items: ProDescriptionsItemProps[];
  STY_MARGUNBOTTOM?: { [key: string]: string | number };
}

const TextCardContent = ({
  title,
  titleChildren,
  items,
  STY_MARGUNBOTTOM
}: PropsInterface) => {
  const navigation = useNavigate();

  return (
    <ProCard
      headStyle={CARD_HEADSTYLE}
      title={<Title level={4}>{title}</Title>}
      bordered={false}
      style={STY_MARGUNBOTTOM}
      extra={
        <Button
          ghost
          type="primary"
          icon={<Icon type="LeftOutlined" />}
          style={{ float: 'right' }}
          onClick={() => {
            navigation(-1);
          }}
        >
          {$t('Back')}
        </Button>
      }
    >
      <ProDescriptions
        title={titleChildren}
        layout="vertical"
        columns={items}
      />
    </ProCard>
  );
};
export default TextCardContent;
