import { Card, Space, Typography } from 'antd';
import { Favorites } from '@/components/business';
import { getFaqsApi } from '@/services/other-functions';
import { store } from '@/store';

const { Title } = Typography;

const FAQs = () => {
  const [FAQData, setFAQData] = useState('');
  const lang = selectLanguage(store.getState());
  const $t = useTranslations();

  const getFAQData = async () => {
    const data = await getFaqsApi();
    setFAQData(data);
  };

  useEffect(() => {
    getFAQData();
  }, [lang]);

  return (
    <>
      <Favorites code="FD-S-OTH-002" label={$t('FAQs')} />
      <Card style={{ flex: 1 }}>
        <Space direction="vertical">
          <Title level={4}>{$t('FAQs')}</Title>
          <div dangerouslySetInnerHTML={{ __html: FAQData }} />
        </Space>
      </Card>
    </>
  );
};

export default FAQs;
