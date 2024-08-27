import { Button, Space } from 'antd';
import { omit } from 'lodash-es';
import { CustomModal } from '@/components/proComponents';
import type { CustomFormButtonProps } from '@/types/proComponents';

const CustomFormButton: React.FC<CustomFormButtonProps> = (props) => {
  const {
    onConfirm,
    formInstance,
    title = `${$t('Confirm to')} ${props.children}?`,
    okText = $t('Confirm')
  } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setIsModalOpen(false);
    setLoading(true);
    try {
      await onConfirm?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Space
        onClick={async () => {
          try {
            if (!loading) {
              formInstance && (await formInstance?.validateFields());
              setIsModalOpen(true);
            }
          } catch {}
        }}
      >
        <Button
          loading={loading}
          type="primary"
          {...omit(props, ['onConfirm', 'title', 'formInstance', 'okText'])}
          htmlType="button"
        >
          {props.children}
        </Button>
      </Space>

      <CustomModal
        open={isModalOpen}
        title={title}
        type="warning"
        okText={okText}
        onOk={handleConfirm}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CustomFormButton;
