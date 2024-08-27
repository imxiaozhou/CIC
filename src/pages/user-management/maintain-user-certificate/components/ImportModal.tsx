import type { UploadProps } from 'antd';
import { Upload, Typography, Button, Form } from 'antd';
import Icon from '@/components/Icons';
import { modalProps } from '@/config/common';
import { importCertificate } from '@/services/user-management';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
const { Title, Paragraph } = Typography;
const { Dragger } = Upload;

const ImportModal = (props: {
  isOpen: boolean;
  onCancel: any;
  state: any;
  certType: string;
}) => {
  const [form] = Form.useForm<{ passphrase: string }>();
  const { isOpen, onCancel, state, certType } = props;
  const userInfo = useAppSelector(selectUserInfo);
  const [file, setFile] = useState<Blob>();

  const uploadProps: UploadProps = {
    style: {
      width: '85%',
      margin: '20px 40px 10px',
      border: '1px dashed #80baf2'
    },
    name: 'file',
    maxCount: 1,
    accept: '.pfx',
    beforeUpload: (file: any) => {
      setFile(file);
      return false;
    }
  };

  const handleOk = async () => {
    const passphrase = form.getFieldValue('passphrase');
    const jsonStr = {
      apprStatus: 'PENDING_APPR_IMPORT',
      userId: state?.userId,
      certType,
      creBy: userInfo?.userId,
      updBy: userInfo?.userId
    };
    const formData = new FormData();
    formData.append('file', file as Blob);
    formData.append('passphrase', passphrase as string);
    formData.append('jsonStr', JSON.stringify(jsonStr));
    const res = await importCertificate(formData);
    if (res.status?.code === 0) {
      notification.success({
        message: 'Import Successful'
      });
      onCancel('reload');
    }
  };

  return (
    <ModalForm
      form={form}
      width={650}
      open={isOpen}
      modalProps={{
        ...modalProps,
        onCancel: onCancel,
        okText: $t('Import'),
        styles: {
          footer: {
            display: 'flex',
            justifyContent: 'center'
          }
        }
      }}
      onFinish={handleOk}
    >
      <Typography style={{ textAlign: 'center', marginTop: 20 }}>
        <Title level={3}>{$t('Certificate Import')}</Title>
        <Dragger {...uploadProps}>
          <Paragraph className="ant-upload-drag-icon">
            <Icon type="CloudUploadOutlined" />
          </Paragraph>
          <Paragraph className="ant-upload-text">
            {$t('Support')} .pfx
          </Paragraph>
          <Paragraph className="ant-upload-hint">
            {$t('You can drag & drop here')} <br />
            {$t('or')}
          </Paragraph>
          <Button key="back" ghost type="primary">
            {$t('Choose a file')}
          </Button>
        </Dragger>
      </Typography>
      <Typography style={{ width: '85%', margin: '10px 40px 0' }}>
        <ProFormText.Password
          width="md"
          name="passphrase"
          label={$t('Passphrase')}
          rules={[
            {
              required: true,
              message: $t('Please Enter Passphrase')
            }
          ]}
        />
      </Typography>
    </ModalForm>
  );
};

export default ImportModal;
