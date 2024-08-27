import { Button, Card, Row, Typography, Spin, notification } from 'antd';
import { useNavigate } from 'react-router-dom';

import { Favorites } from '@/components/business';
import Icon from '@/components/Icons';
import { TagStatus, CustomFormButton } from '@/components/proComponents';
import {
  getSMAUserApproveAccDetail,
  getSMAUserAccApproveRej
} from '@/services/user-management';
import {
  ProDescriptions,
  ProDescriptionsItemProps
} from '@ant-design/pro-components';

import { UserItem, ApproveProps, ApproveAccountDetailParams } from '../type';
import { defaultDetailObj } from '../utils';
import { showMultipleLabel, formatExpiration } from '@/utils';

const { Title } = Typography;

const getUserStatusApproveStatus = async (params: ApproveProps) => {
  const result: any = await getSMAUserAccApproveRej(params);

  return {
    code: result.status.code,
    data: result.payload.data,
    success: true
  };
};

const getAccountDetails = async (params: ApproveAccountDetailParams) => {
  const result: any = await getSMAUserApproveAccDetail(params);
  return {
    code: result.status.code,
    data: result.payload.data,
    success: true
  };
};

const ApprovePage = () => {
  const store = useStorage();
  const id = store.get('FIRST_LEVEL_STORAGE');
  const navigate = useNavigate();

  const [fields, setFields] = useState<UserItem>(defaultDetailObj);
  const [loading, setLoading] = useState<boolean>(false);
  const timeFormat = useAppSelector(selectTimeFormat);

  const items: ProDescriptionsItemProps[] = [
    {
      title: $t('Display Name'),
      key: 'displayName',
      children: fields.displayName
    },
    {
      title: $t('First Name'),
      key: 'firstName',
      children: fields.firstName
    },
    {
      title: $t('Last Name'),
      key: 'lastName',
      children: fields.lastName
    },
    {
      title: $t('Email Address'),
      key: 'emailAddress',
      children: fields.emailAddress
    },
    {
      title: $t('Phone Number'),
      key: 'phoneNumber',
      children: fields.phoneNumber
    },
    {
      title: $t('Fax Number'),
      key: 'faxNumber',
      children: fields.faxNumber
    },
    {
      title: $t('Location'),
      key: 'location',
      children: fields.location
    },
    {
      title: $t('Position'),
      key: 'position',
      children: fields.position
    },
    {
      title: $t('Rank'),
      key: 'rank',
      children: fields.rank
    },
    {
      title: $t('Substantive Rank'),
      key: 'substantiveRank',
      children: fields.substantiveRank
    },
    {
      title: $t('Title'),
      key: 'title',
      children: fields.title
    },
    {
      title: $t('Unit'),
      key: 'unit',
      children: fields.unit
    },
    {
      title: $t('Tenant Name'),
      key: 'tenantName',
      children: fields.tenantName
    },
    {
      title: $t('User Status'),
      key: 'userStatus',
      children: (
        <TagStatus status={fields.userStatus}>
          {fields.userStatusLabel}
        </TagStatus>
      )
    },
    {
      title: $t('Account Status'),
      key: 'accountStatus',
      children: (
        <TagStatus status={fields.accountStatus}>
          {fields.accountStatusLabel}
        </TagStatus>
      )
    },
    { title: $t('Requested By'), key: 'requestBy', children: fields.requestBy },
    {
      title: $t('Request Time'),
      key: 'requestTime',
      children: formatExpiration(fields.requestTime, timeFormat)
    },
    {
      title: $t('Approve/Rejected Time'),
      key: 'approveRejTime',
      children: formatExpiration(
        fields.approveTime ?? fields.rejectTime,
        timeFormat
      )
    },
    {
      title: $t('User Role'),
      key: 'userRoleLabel',
      children: showMultipleLabel(fields.userRoleLabel)
    }
  ];

  useEffect(() => {
    if (id) {
      getDetails(id);
    }
  }, [id]);

  const getDetails = async (id: string) => {
    setLoading(true);
    const { code, data } = await getAccountDetails({ id });
    setLoading(false);
    if (code === 0) {
      setFields(data);
    }
  };

  const handleApproveReject = async (modalType: 'approved' | 'rejected') => {
    const res = await getUserStatusApproveStatus({
      id: id,
      otpType: modalType
    });
    if (res.code === 0) {
      getDetails(id);
      notification.success({
        message:
          modalType === 'approved'
            ? $t('Approve Success')
            : $t('Reject Success')
      });
    }
  };

  const handleBack = () => {
    navigate('/user-management/approve-account-creation');
  };

  return (
    <Spin spinning={loading}>
      <Favorites code="FD-S-USR-002" label={$t('Approve Account Creation')} />
      <Card
        title={
          <Row justify="space-between" align="middle">
            <Title level={4}>{$t('User Account Approval')}</Title>
            <Button type="primary" ghost onClick={handleBack}>
              <Icon type="LeftOutlined" /> {$t('Back')}
            </Button>
          </Row>
        }
        styles={{ header: { borderBottom: 'unset', marginTop: 12 } }}
      >
        <ProDescriptions layout="vertical" columns={items} column={3} />
        <Row justify="end" style={{ marginTop: 40 }}>
          <CustomFormButton
            type="primary"
            ghost
            style={{ marginRight: 16 }}
            disabled={fields?.userStatus !== 'PENDING'}
            onConfirm={async () => {
              await handleApproveReject('rejected');
            }}
          >
            {$t('Reject')}
          </CustomFormButton>
          <CustomFormButton
            type="primary"
            title={$t('Confirm to Approve?')}
            disabled={fields?.userStatus !== 'PENDING'}
            onConfirm={async () => {
              await handleApproveReject('approved');
            }}
          >
            {$t('Approve')}
          </CustomFormButton>
        </Row>
      </Card>
    </Spin>
  );
};

export default ApprovePage;
