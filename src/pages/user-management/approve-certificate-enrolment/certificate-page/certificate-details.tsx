import { Favorites } from '@/components/business';
import { CustomProTableTheme, TagStatus } from '@/components/proComponents';
import { getSMAUserApproveCertPageDetail } from '@/services/user-management';
import {
  ApproveCertPageDataDetailParams,
  ValidityPeriodItems,
  IssueByItems,
  IssueToItems,
  TextItems
} from '@/services/user-management/approve-certificate-enrollment/type';
import {
  ProCard,
  ProDescriptions,
  ProDescriptionsItemProps
} from '@ant-design/pro-components';
import { Typography } from 'antd';
import TextCardContent from '../components/text-card-content';
import { CARD_HEADSTYLE, SIGNER_PRODESCRIPTIONS } from '../utils';
import { formatExpiration } from '@/utils';

const { Title } = Typography;

const CertificateDetails = () => {
  const [textState, setTextState] = useState<TextItems>();
  const [issueToState, setIssueToState] = useState<IssueToItems>();
  const [issueByState, setIssueByState] = useState<IssueByItems>();
  const [validityPeriodState, setValidityPeriodState] =
    useState<ValidityPeriodItems>();
  const dateFormat = useAppSelector(selectDateFormat);
  const store = useStorage();
  const id = store.get('SECOND_LEVEL_STORAGE');

  const textItems: ProDescriptionsItemProps[] = [
    {
      key: '1',
      title: $t('Certificate Type'),
      children: textState?.certificateTypeLabel
    },
    {
      key: '2',
      title: $t('Expiration Date'),
      children: formatExpiration(validityPeriodState, dateFormat)
    },
    {
      key: '3',
      title: $t('Certificate Status'),
      children: (
        <TagStatus status={textState?.certificateStatus as string}>
          {textState?.certificateStatusLabel}
        </TagStatus>
      )
    },
    {
      key: '4',
      title: $t('Approval Status'),
      children: (
        <TagStatus status={textState?.approvalStatus as string}>
          {textState?.approvalStatusLabel}
        </TagStatus>
      )
    }
  ];

  const issueToItems: ProDescriptionsItemProps[] = [
    {
      key: '1',
      title: $t('Common Name(CN)'),
      children: issueToState?.commonNameCN
    },
    {
      key: '2',
      title: $t('Email(E)'),
      children: issueToState?.emailE
    },
    {
      key: '3',
      title: $t('Organisation Name (OU)'),
      children: issueToState?.organisationUnitOU1
    },
    {
      key: '4',
      title: $t('Unit Name (OU)'),
      children: issueToState?.organisationUnitOU2
    },
    {
      key: '5',
      title: $t('Tenant ID (OU)'),
      children: issueToState?.organisationUnitOU3
    },
    {
      key: '6',
      title: $t('Identify ID (OU)'),
      children: issueToState?.organisationUnitOU4
    },
    {
      key: '5',
      title: $t('Organisation(O)'),
      children: issueToState?.organisationO
    },
    {
      key: '6',
      title: $t('Country or Region(C)'),
      children: issueToState?.countryOrRegionC
    }
  ];

  const issueByItems: ProDescriptionsItemProps[] = [
    {
      key: '1',
      title: $t('Common Name(CN)'),
      children: issueByState?.commonNameCN
    },
    {
      key: '2',
      title: $t('Organisation Unit(OU)'),
      children: issueByState?.organisationUnitOU
    },
    {
      key: '3',
      title: $t('Locate(L)'),
      children: issueByState?.locateL
    },
    {
      key: '4',
      title: $t('State/Province(S)'),
      children: issueByState?.stateProvinceS
    },
    {
      key: '5',
      title: $t('Country/Region(C)'),
      children: issueByState?.countryRegionC
    }
  ];

  const validityPeriodItems: ProDescriptionsItemProps[] = [
    {
      key: '1',
      title: $t('Valid From'),
      children: formatExpiration(validityPeriodState?.validFrom, dateFormat)
    },
    {
      key: '2',
      title: $t('Valid To'),
      children: formatExpiration(validityPeriodState?.validTo, dateFormat)
    },
    {
      key: '3',
      title: $t('Version'),
      children: validityPeriodState?.version
    },
    {
      key: '4',
      title: $t('Serial Number'),
      children: validityPeriodState?.serialNumber
    },
    {
      key: '5',
      title: $t('Signature Algorithm'),
      children: validityPeriodState?.signatureAlgorithm
    },
    {
      key: '6',
      title: $t('Fingerprint'),
      children: validityPeriodState?.fingerprint
    }
  ];

  const postCertificateData = async (
    params: ApproveCertPageDataDetailParams
  ) => {
    const result: any = await getSMAUserApproveCertPageDetail(params);

    const { textItems, issueToItems, issueByItems, validityPeriodItems } =
      result.data;
    setTextState(textItems);
    setIssueToState(issueToItems);
    setIssueByState(issueByItems);
    setValidityPeriodState(validityPeriodItems);
  };

  useEffect(() => {
    if (id) {
      postCertificateData({ id });
    }
  }, [id]);

  return (
    <CustomProTableTheme>
      <Favorites
        code="FD-S-USR-006"
        label={$t('Approve Certificate Enrollment')}
      />
      <TextCardContent
        title={$t('Certificate Details')}
        items={textItems}
        STY_MARGUNBOTTOM={{ borderRadius: '8px 8px 0 0' }}
      />

      <ProCard
        title={<Title level={4}>{$t('Signer Information')}</Title>}
        bordered={false}
        style={{ borderRadius: 0 }}
        headStyle={{ borderTop: '1px solid #f0f0f0', borderBottom: 0 }}
      >
        <ProDescriptions
          title={$t('Issue To')}
          column={1}
          labelStyle={SIGNER_PRODESCRIPTIONS}
          columns={issueToItems}
        />
      </ProCard>

      <ProCard
        title={<Title level={4}>{$t('Issue Information')}</Title>}
        bordered={false}
        style={{ borderRadius: '0 0 8px 8px' }}
        headStyle={CARD_HEADSTYLE}
      >
        <ProDescriptions
          title={$t('Issue By')}
          column={1}
          labelStyle={SIGNER_PRODESCRIPTIONS}
          columns={issueByItems}
        />
        <ProDescriptions
          title={$t('Validity Period')}
          column={1}
          labelStyle={SIGNER_PRODESCRIPTIONS}
          columns={validityPeriodItems}
        />
      </ProCard>
    </CustomProTableTheme>
  );
};

export default CertificateDetails;
