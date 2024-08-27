import { Favorites, AccessDashboard } from '@/components/business';
import { getGlobalParameter } from '@/services/other-functions';

const EnquireLogs = () => {
  const [url, setUrl] = useState<string>('');
  const $t = useTranslations();

  const getDashboardUrl = async () => {
    const res = await getGlobalParameter({
      type: 'EXTERNAL_LINK',
      code: 'ACCESS_BACKEND_LOG'
    });
    setUrl(res?.glbPrmValue1);
  };

  useEffect(() => {
    getDashboardUrl();
  }, []);

  return (
    <>
      <Favorites
        code="FD-S-AUD-003"
        label={$t(
          'Enquire Log for Different Processes, Services and Activities'
        )}
      />
      <AccessDashboard
        title={$t(
          'Enquire Log for Different Processes, Services and Activities'
        )}
        btnText={$t('Access Backend Log Viewing Page')}
        url={url}
      />
    </>
  );
};

export default EnquireLogs;
