import { Favorites } from '@/components/business';
import {
  CustomModal,
  CustomProTableTheme,
  TagStatus
} from '@/components/proComponents';
import type {
  ActionType,
  ProDescriptionsItemProps
} from '@ant-design/pro-components';
import {
  getSMAUserApproveCertPageBasic,
  getSMAUserApproCertApproveRej
} from '@/services/user-management';
import {
  ApproCertPageDataBasicResponse,
  CertPageDataApproveReject
} from '@/services/user-management/approve-certificate-enrollment/type';

import { useNavigate } from 'react-router-dom';
import ApproveUserProtable from '../components/approve-user-protable';
import TextCardContent from '../components/text-card-content';
import { ApproveUserProtableType, IsContentInterface } from '../type';
import { STY_MARGUNBOTTOM, BasicDefault } from '../utils';
import { showMultipleLabel } from '@/utils';

enum MenusOption {
  approve = 'Approve',
  reject = 'Reject',
  view = 'View'
}

const ApproveUserCertificate = () => {
  const navigation = useNavigate();
  const store = useStorage();
  const { user_id } = store.get('FIRST_LEVEL_STORAGE');
  const APPROVE_CONTENT: IsContentInterface = {
    title: $t('Confirm to Approve?'),
    type: 'warning'
  };

  const REJECT_CONTENT: IsContentInterface = {
    title: $t('Confirm to Reject?'),
    type: 'warning'
  };

  const rmActionRef = useRef<ActionType>();
  const cmActionRef = useRef<ActionType>();
  const gActionRef = useRef<ActionType>();
  const eActionRef = useRef<ActionType>();
  const [basicState, setBasicState] =
    useState<ApproCertPageDataBasicResponse>(BasicDefault);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContent, setIsContent] =
    useState<IsContentInterface>(APPROVE_CONTENT);

  const [curCertHeaderTitle, setCurCertHeaderTitle] = useState<string>('');
  const [approveRejectParams, setApproveRejectParams] =
    useState<CertPageDataApproveReject>({
      id: '',
      approvalStatus: ''
    });
  const lang = useAppSelector(selectLanguage);
  const showTenantNameByLang = useMemo(() => {
    let tn: string | undefined = '';
    switch (lang) {
      case 'hk':
        tn = basicState?.tenantTCName;
        break;
      case 'cn':
        tn = basicState?.tenantSCName;
        break;
      default:
        tn = basicState?.tenantName;
        break;
    }
    return tn;
  }, [lang, basicState]);
  const items: ProDescriptionsItemProps[] = [
    {
      key: '1',
      title: $t('Display Name'),
      children: basicState?.displayName
    },
    {
      key: '2',
      title: $t('Email Address'),
      children: basicState?.emailAddress
    },
    {
      key: '3',
      title: $t('Tenant Name'),
      children: showTenantNameByLang
    },
    {
      key: '4',
      title: $t('Email Group'),
      children: basicState?.emailGroup
    },
    {
      key: '5',
      title: $t('User Role'),
      children: showMultipleLabel(basicState.userRole)
    },
    {
      key: '6',
      title: $t('User Status'),
      children: (
        <TagStatus status={basicState.userStatus}>
          {$t(basicState.userStatusLabel)}
        </TagStatus>
      )
    },
    {
      key: '7',
      title: $t('Account Status'),
      children: (
        <TagStatus status={basicState.accountStatus}>
          {$t(basicState.accountStatusLabel)}
        </TagStatus>
      )
    }
  ];

  const postBasicData = async (id: string) => {
    const result: any = await getSMAUserApproveCertPageBasic({ id: user_id });

    setBasicState(result.data);
  };

  const onSelect = (
    key: string,
    record: ApproveUserProtableType,
    headerTitle: string
  ) => {
    setCurCertHeaderTitle(headerTitle);
    switch (key) {
      case MenusOption.approve:
        setApproveRejectParams({
          id: record.id,
          approvalStatus: 'APPROVED'
        });
        setIsModalOpen(true);
        setIsContent(APPROVE_CONTENT);
        break;
      case MenusOption.reject:
        setApproveRejectParams({
          id: record.id,
          approvalStatus: 'REJECTED'
        });
        setIsModalOpen(true);
        setIsContent(REJECT_CONTENT);
        break;
      case MenusOption.view:
        store.set('SECOND_LEVEL_STORAGE', record.id);
        navigation('./certificate-details');
        break;

      default:
        break;
    }
  };

  const approveUserTableMap = [
    {
      headerTitle: $t('RM-Cert(DI)'),
      certType: 'RM',
      onSelect: onSelect,
      actionRef: rmActionRef
    },
    {
      headerTitle: $t('CM-Cert(DI)'),
      certType: 'CM',
      onSelect: onSelect,
      actionRef: cmActionRef
    },
    {
      headerTitle: 'g-Cert',
      certType: 'G_CERT',
      onSelect: onSelect,
      actionRef: gActionRef
    },
    {
      headerTitle: 'e-Cert(O)',
      certType: 'E_CERT',
      onSelect: onSelect,
      actionRef: eActionRef
    }
  ];

  const TableMaps = useMemo(() => {
    if (user_id) {
      return approveUserTableMap.map((i) => (
        <ApproveUserProtable
          key={i.headerTitle}
          headerTitle={i.headerTitle}
          onSelect={i.onSelect}
          actionRef={i.actionRef}
          certificationType={i.certType}
          id={user_id}
        />
      ));
    }
  }, [user_id]);

  const handleOk = async () => {
    if (approveRejectParams.id) {
      const result: any = await getSMAUserApproCertApproveRej(
        approveRejectParams
      );
      if (result.status.code === 0) {
        approveUserTableMap
          .filter((i) => i.headerTitle === curCertHeaderTitle)?.[0]
          ?.actionRef.current?.reload();
        setIsModalOpen(false);
        setCurCertHeaderTitle('');
        notification.success({
          message:
            approveRejectParams.approvalStatus === 'APPROVED'
              ? $t('Approve Success')
              : $t('Reject Success')
        });

        setApproveRejectParams({ id: '', approvalStatus: '' });
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurCertHeaderTitle('');
  };

  useEffect(() => {
    if (user_id) {
      postBasicData(user_id);
    }
  }, [user_id]);

  return (
    <CustomProTableTheme>
      <Favorites
        code="FD-S-USR-006"
        label={$t('Approve Certificate Enrollment')}
      />
      <TextCardContent
        title={$t('Approve User Certificate Page')}
        titleChildren={$t('Basic Information')}
        items={items}
        STY_MARGUNBOTTOM={STY_MARGUNBOTTOM}
      />
      <>{TableMaps}</>

      <CustomModal
        open={isModalOpen}
        title={isContent.title}
        type={isContent.type}
        onOk={handleOk}
        onCancel={handleCancel}
        zIndex={101}
      />
    </CustomProTableTheme>
  );
};
export default ApproveUserCertificate;
