import { Favorites, AccessDashboard } from '@/components/business';
import { getGlobalParameter } from '@/services/other-functions';

const EnquireAccessLogs = () => {
  const [url, setUrl] = useState<string>('');
  const $t = useTranslations();

  const getDashboardUrl = async () => {
    const res = await getGlobalParameter({
      type: 'EXTERNAL_LINK',
      code: 'ACCESS_LOG'
    });
    setUrl(res?.glbPrmValue1);
  };

  useEffect(() => {
    getDashboardUrl();
  }, []);

  return (
    <>
      <Favorites code="FD-S-AUD-002" label={$t('Enquire Access Logs')} />
      <AccessDashboard
        title="Enquire Access Logs"
        btnText={$t('Access Log Viewing Page')}
        url={url}
      />
    </>
  );
};

export default EnquireAccessLogs;
