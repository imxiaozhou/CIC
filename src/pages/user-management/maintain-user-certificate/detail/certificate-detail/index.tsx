import { Card, Divider, Typography, Row } from 'antd';
import { CustomProTableTheme, TagStatus } from '@/components/proComponents';
import { Favorites } from '@/components/business';
import DescriptionTitle from '../../components/DescriptionTitle';
import type { CertDetail } from '../../type';
import { getCertDetail } from '@/services/user-management';
import {
  ProDescriptions,
  ProDescriptionsItemProps
} from '@ant-design/pro-components';
import { formatExpiration } from '@/utils';

const { Title } = Typography;

const CertificateDetail = () => {
  const store = useStorage();
  const [certDetail, setCertDetail] = useState<CertDetail>();
  const dateFormat = useAppSelector(selectDateFormat);
  const $t = useTranslations();
  const { userCertId } = store.get('SECOND_LEVEL_USR005_CERT_RECORD');

  const items: ProDescriptionsItemProps[] = [
    {
      key: '1',
      title: $t('Certificate Type'),
      children: certDetail?.certTypeLabel
    },
    {
      key: '2',
      title: $t('Expiration Date'),
      children: formatExpiration(certDetail, dateFormat)
    },
    {
      key: '3',
      title: $t('Certificate Status'),
      children: (
        <TagStatus status={certDetail?.certStatus as string}>
          {certDetail?.certStatusLabel}
        </TagStatus>
      )
    },
    {
      key: '4',
      title: $t('Approval Status'),
      children: (
        <TagStatus status={certDetail?.apprStatus as string}>
          {certDetail?.apprStatusLabel}
        </TagStatus>
      )
    }
  ];
  const items2: ProDescriptionsItemProps[] = [
    {
      key: 'item2-1',
      title: $t('Common Name (CN)'),
      span: 3,
      dataIndex: 'issueToCn'
    },
    {
      key: 'item2-2',
      title: $t('Email (E)'),
      span: 3,
      dataIndex: 'issueToE'
    },
    {
      key: 'item2-3',
      title: $t('Organisation Name (OU)'),
      span: 3,
      dataIndex: 'issueToOu1'
    },
    {
      key: 'item2-4',
      title: $t('Unit Name (OU)'),
      span: 3,
      dataIndex: 'issueToOu2'
    },
    {
      key: 'item2-5',
      title: $t('Tenant ID (OU)'),
      span: 3,
      dataIndex: 'issueToOu3'
    },
    {
      key: 'item2-6',
      title: $t('Identify ID (OU)'),
      span: 3,
      dataIndex: 'issueToOu4'
    },
    {
      key: 'item2-7',
      title: $t('Organisation (O)'),
      span: 3,
      dataIndex: 'issueToO'
    },
    {
      key: 'item2-8',
      title: $t('Country/Region (C)'),
      span: 3,
      dataIndex: 'issueToC'
    }
  ];
  const items3: ProDescriptionsItemProps[] = [
    {
      key: '1',
      title: $t('Common Name (CN)'),
      span: 3,
      dataIndex: 'issueByCn'
    },
    {
      key: '2',
      title: $t('Organisation Unit (OU)'),
      span: 3,
      dataIndex: 'issueByO'
    },
    {
      key: '3',
      title: $t('Locate (L)'),
      span: 3,
      dataIndex: 'issueByL'
    },
    {
      key: '4',
      title: $t('State/Province (S)'),
      span: 3,
      dataIndex: 'issueByS'
    },
    {
      key: '5',
      title: $t('Country/Region (C)'),
      span: 3,
      dataIndex: 'issueByC'
    }
  ];
  const items4: ProDescriptionsItemProps[] = [
    {
      key: '1',
      title: $t('Valid From'),
      span: 3,
      children: formatExpiration(certDetail?.validFrom, dateFormat)
    },
    {
      key: '2',
      title: $t('Valid To'),
      span: 3,
      children: formatExpiration(certDetail?.validTo, dateFormat)
    },
    {
      key: '3',
      title: $t('Version'),
      span: 3,
      dataIndex: 'certVersion'
    },
    {
      key: '4',
      title: $t('Serial Number'),
      span: 3,
      dataIndex: 'certSerNo'
    },
    {
      key: '5',
      title: $t('Signature Algorithm'),
      span: 3,
      dataIndex: 'certSignAlgor'
    },
    {
      key: '6',
      title: $t('Fingerprint'),
      span: 3,
      dataIndex: 'certFingerprint'
    }
  ];

  const getDate = async () => {
    const { data } = await getCertDetail({
      userCertId: userCertId
    });
    setCertDetail(data);
  };
  useEffect(() => {
    getDate();
  }, []);

  return (
    <CustomProTableTheme>
      <Favorites code="FD-S-USR-005" label={$t('Maintain User Certificate')} />
      <Card className="certificate-detail">
        <ProDescriptions
          title={<DescriptionTitle title={$t('Certificate Details')} />}
          layout="vertical"
          columns={items}
          dataSource={certDetail}
        />
        <Divider />
        <Row>
          <Title level={4}>{$t('Signer Information')}</Title>
          <ProDescriptions
            labelStyle={{ width: '240px' }}
            title={<Title level={5}>{$t('Issue To')}</Title>}
            columns={items2}
            dataSource={certDetail}
          />
          <Title level={4}>{$t('Issue Information')}</Title>
          <ProDescriptions
            labelStyle={{ width: '240px' }}
            title={<Title level={5}>{$t('Issue By')}</Title>}
            columns={items3}
            dataSource={certDetail}
          />
          <Title level={4}>{$t('Validity Period')}</Title>
          <ProDescriptions
            labelStyle={{ width: '240px' }}
            columns={items4}
            dataSource={certDetail}
          />
        </Row>
      </Card>
    </CustomProTableTheme>
  );
};
export default CertificateDetail;
