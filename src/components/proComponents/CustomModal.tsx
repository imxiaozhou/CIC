import { Modal, Flex, Typography } from 'antd';
import Icon from '@/components/Icons';
import type { CustomModalProps } from '@/types/proComponents';

const { Title } = Typography;

const CustomModal: React.FC<CustomModalProps> = (props) => {
  return (
    <Modal
      okText={props.type === 'warning' && $t('Confirm')}
      {...props}
      style={{ top: '25%' }}
      styles={{
        footer: {
          display: 'flex',
          justifyContent: 'center'
        }
      }}
      maskClosable={props.maskClosable ?? false}
      title=""
      zIndex={props.zIndex ?? 10000}
      classNames={{ footer: props.type === 'warning' ? '' : 'hidden-cancel' }}
    >
      <Flex vertical align="center" gap="middle">
        {props.type === 'warning' ? (
          <Icon
            type="WarningFilled"
            style={{ fontSize: 32, color: '#FF8B00' }}
          />
        ) : (
          <Icon
            type="CheckCircleFilled"
            style={{ fontSize: 32, color: '#0A52C6' }}
          />
        )}
        <Title level={5}>{props.title}</Title>
      </Flex>
    </Modal>
  );
};

export default CustomModal;
