import { Modal, Upload, Typography } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import Icon from '@/components/Icons';
import { downImg } from '@/services/common';

const { Text } = Typography;

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(new Error('error'));
  });
};

interface Props {
  onChange: (logo: string, name: string) => void;
  url: string;
}

const UploadImg = (props: Props) => {
  const { onChange, url } = props;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  let fileUrl = '';

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
    );
  };

  const handleChange: UploadProps['onChange'] = ({ file, fileList }) => {
    setFileList(fileList);
    if (file.status === 'done') {
      const {
        payload: {
          data: { base64, fileName }
        },
        status
      } = file.response;
      if (status.code === 0) {
        onChange(base64, fileName);
      }
    }
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
        color: '#0A52C6',
        fontSize: 16,
        cursor: 'pointer'
      }}
      type="button"
    >
      <Icon type="CloudUploadOutlined" />
      <Text style={{ marginLeft: 5, color: '#0A52C6' }}>{$t('Upload')}</Text>
    </button>
  );

  const getImg = async () => {
    const { logoBase64, appLogoFileName } = await downImg({ fileName: url });
    onChange(logoBase64, appLogoFileName);
    setFileList([
      {
        uid: appLogoFileName,
        name: appLogoFileName,
        url: `data:image/${appLogoFileName
          .split('.')
          .pop()};base64,${logoBase64}`
      }
    ]);
  };

  useEffect(() => {
    getImg();
    return () => {
      window.URL.revokeObjectURL(fileUrl);
    };
  }, []);

  return (
    <>
      <Upload
        action="/sma-adm/api/common/upload-logo"
        headers={{
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem('tokens') as string)?.token
          }`
        }}
        listType="picture-card"
        accept=".png, .jpg, .svg"
        fileList={fileList}
        maxCount={1}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default UploadImg;
