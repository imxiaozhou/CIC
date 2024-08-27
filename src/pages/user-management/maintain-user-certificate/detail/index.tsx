import {
  ProDescriptions,
  type ActionType,
  ProDescriptionsItemProps
} from '@ant-design/pro-components';
import { Card } from 'antd';
import { CustomProTableTheme, TagStatus } from '@/components/proComponents';
import { Favorites } from '@/components/business';
import { BasicInfoInterface } from '../type';
import DescriptionTitle from '../components/DescriptionTitle';
import SectionsProTable from '../components/SectionsProTable';
import { getBasicInfo } from '@/services/user-management';
import { showMultipleLabel } from '@/utils';

const Detail = () => {
  const $t = useTranslations();
  const store = useStorage();
  const actionRef = useRef<ActionType>();
  const actionRef2 = useRef<ActionType>();
  const actionRef3 = useRef<ActionType>();
  const actionRef4 = useRef<ActionType>();
  const recordInfo = store.get('FIRST_LEVEL_STORAGE');

  const lang = useAppSelector(selectLanguage);

  const [basicInfo, setBasicInfo] = useState<BasicInfoInterface>();

  const showTenantNameByLang = useMemo(() => {
    let tn: string | undefined = '';
    switch (lang) {
      case 'hk':
        tn = basicInfo?.tenantTCName;
        break;
      case 'cn':
        tn = basicInfo?.tenantSCName;
        break;
      default:
        tn = basicInfo?.tenantName;
        break;
    }
    return tn;
  }, [lang, basicInfo]);
  const items: ProDescriptionsItemProps[] = [
    {
      key: '1',
      label: $t('Display Name'),
      children: basicInfo?.displayName
    },
    {
      key: '2',
      label: $t('Email Address'),
      children: basicInfo?.emailAddress
    },
    {
      key: '3',
      label: $t('Tenant Name'),
      children: showTenantNameByLang
    },
    {
      key: '4',
      label: $t('Email Group'),
      children: basicInfo?.emailGroup
    },
    {
      key: '5',
      label: $t('User Role'),
      children: showMultipleLabel(basicInfo?.userRole)
    },
    {
      key: '6',
      label: $t('User Status'),
      children: (
        <TagStatus status={basicInfo?.userStatus as string}>
          {basicInfo?.userStatusLabel}
        </TagStatus>
      )
    },
    {
      key: '7',
      label: $t('Account Status'),
      children: (
        <TagStatus status={basicInfo?.accountStatus as string}>
          {basicInfo?.accountStatusLabel}
        </TagStatus>
      )
    }
  ];
  const certificateSections = [
    {
      rowKey: 'RM',
      headerTitle: $t('RM-Cert(DI)'),
      actionRef: actionRef
    },
    {
      rowKey: 'CM',
      headerTitle: $t('CM-Cert(DI)'),
      actionRef: actionRef2
    },
    {
      rowKey: 'G_CERT',
      headerTitle: 'g-Cert',
      actionRef: actionRef3
    },
    {
      rowKey: 'E_CERT',
      headerTitle: 'e-Cert(O)',
      actionRef: actionRef4
    }
  ];

  const getBasicData = async (userId: string) => {
    const { data } = await getBasicInfo({ userId });
    setBasicInfo(data);
  };

  useEffect(() => {
    getBasicData(recordInfo?.userId);
  }, []);

  return (
    <CustomProTableTheme>
      <Favorites code="FD-S-USR-005" label={$t('Maintain User Certificate')} />
      <Card className="form-card">
        <ProDescriptions
          title={<DescriptionTitle title={$t('Basic Information')} />}
          layout="vertical"
          columns={items}
        />
      </Card>
      {certificateSections.map((item) => (
        <SectionsProTable
          key={item.rowKey}
          rowKey={item.rowKey}
          state={{ ...recordInfo, ...basicInfo }}
          actionRef={item.actionRef}
          headerTitle={item.headerTitle}
        />
      ))}
    </CustomProTableTheme>
  );
};
export default Detail;
