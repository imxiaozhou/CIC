import { Favorites, AccessDashboard } from '@/components/business';
import { getGlobalParameter } from '@/services/other-functions';

const EnquireMessageQueue = () => {
  const [url, setUrl] = useState<string>('');
  const $t = useTranslations();

  const getDashboardUrl = async () => {
    const res = await getGlobalParameter({
      type: 'EXTERNAL_LINK',
      code: 'MQ_DASHBOARD'
    });
    setUrl(res?.glbPrmValue1);
  };

  useEffect(() => {
    getDashboardUrl();
  }, []);

  return (
    <>
      <Favorites
        code="FD-S-RPT-003"
        label={$t('Enquire the status of the message queue(s)')}
      />
      <AccessDashboard
        title="Enquire the status of the message queue(s)"
        btnText={$t('Access Dashboard')}
        url={url}
      />
    </>
  );
};

export default EnquireMessageQueue;
