import { Favorites, AccessDashboard } from '@/components/business';
import { getGlobalParameter } from '@/services/other-functions';

const MaintainVirtualMachine = () => {
  const [url, setUrl] = useState<string>('');
  const $t = useTranslations();

  const getDashboardUrl = async () => {
    const res = await getGlobalParameter({
      type: 'EXTERNAL_LINK',
      code: 'VM_DASHBOARD'
    });
    setUrl(res?.glbPrmValue1);
  };

  useEffect(() => {
    getDashboardUrl();
  }, []);

  return (
    <>
      <Favorites code="FD-S-RPT-002" label={$t('Maintain Virtual Machine')} />
      <AccessDashboard
        title="Maintain Virtual Machine"
        btnText={$t('Access Dashboard for VM')}
        url={url}
      />
    </>
  );
};

export default MaintainVirtualMachine;
