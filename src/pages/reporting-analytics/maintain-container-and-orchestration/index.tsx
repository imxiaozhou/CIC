import { Favorites, AccessDashboard } from '@/components/business';
import { getGlobalParameter } from '@/services/other-functions';

const MaintainContainer = () => {
  const [url, setUrl] = useState<string>('');
  const $t = useTranslations();

  const getDashboardUrl = async () => {
    const res = await getGlobalParameter({
      type: 'EXTERNAL_LINK',
      code: 'CONTAINER_DASHBOARD'
    });
    setUrl(res?.glbPrmValue1);
  };

  useEffect(() => {
    getDashboardUrl();
  }, []);

  return (
    <>
      <Favorites
        code="FD-S-RPT-001"
        label={$t('Maintain Containerisation & Container Orchestration')}
      />
      <AccessDashboard
        title="Maintain Containerisation & Container Orchestration"
        btnText={$t('Access Dashboard for Container')}
        url={url}
      />
    </>
  );
};

export default MaintainContainer;
