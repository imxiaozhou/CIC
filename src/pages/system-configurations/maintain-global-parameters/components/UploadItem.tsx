import { Flex, Input, Typography } from 'antd';
import { AppearanceItem } from '../type';
import UploadImg from './upload-img';

const { Text, Title } = Typography;
const { TextArea } = Input;

interface UploadProps {
  label: string;
  value: AppearanceItem;
  onChange: (value: AppearanceItem) => void;
}

const Index = (props: UploadProps) => {
  const { value, label, onChange } = props;
  const $t = useTranslations();

  return (
    <>
      <Title level={5} style={{ marginBottom: 30 }}>
        {label}
      </Title>
      <Flex gap={30} vertical>
        <Flex vertical gap={5}>
          <Text style={{ color: '#666869' }}>{$t('Logo')}</Text>
          <Text style={{ color: '#ABADAF' }}>
            {$t('Support .jpg, .png, .svg')}
          </Text>
          <UploadImg
            url={value?.appLogoFileName}
            onChange={(logo, name) => {
              onChange({ ...value, logo, appLogoFileName: name });
            }}
          />
        </Flex>
        <Flex gap="small" vertical>
          <Text style={{ color: '#666869' }}>{$t('Application Name')}</Text>
          <TextArea
            style={{ width: 418 }}
            defaultValue={value?.applicationName}
            showCount
            maxLength={20}
            onChange={(e) => {
              onChange({ ...value, applicationName: e.target.value ?? '' });
            }}
            placeholder={$t('Please enter')}
          />
        </Flex>
      </Flex>
    </>
  );
};

export default Index;
