import { Button } from 'antd';
import CustomModal from './CustomModal';
import { useNavigate } from 'react-router-dom';
import { CustomCancelButtonProps } from '@/types/proComponents';
import { omit } from 'lodash-es';

export default function CustomCancelButton(props: CustomCancelButtonProps) {
  const { title = $t('Are you sure to discard the changes?') } = props;
  const navigate = useNavigate();
  const [cancelVisible, setCancelVisible] = useState(false);
  return (
    <>
      <Button
        {...omit(props, ['title'])}
        onClick={() => setCancelVisible(true)}
      >
        {props.children}
      </Button>

      <CustomModal
        open={cancelVisible}
        title={title}
        type="warning"
        okText={$t('Continue Editing')}
        cancelText={$t('Discard')}
        onOk={() => setCancelVisible(false)}
        onCancel={(e: any) =>
          e.target.innerText === $t('Discard')
            ? navigate(-1)
            : setCancelVisible(false)
        }
      />
    </>
  );
}
