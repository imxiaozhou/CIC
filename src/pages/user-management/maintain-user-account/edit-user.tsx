import { Card, Flex, Button, Typography, Space, Form } from 'antd';
import {
  ProForm,
  ProFormCheckbox,
  ProFormSelect,
  ProDescriptions
} from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { Favorites } from '@/components/business';
import { CustomFormButton } from '@/components/proComponents';
import Icon from '@/components/Icons';
import ResetPassword from './components/ResetPassword';
import { AddressBookItem, AddUserForm } from './type';
import { getCommonOptions, getUserRoleOptions } from '@/services/common';
import { submitSMAUser } from '@/services/user-management';
import { translationAllLabel } from '@/utils';

const { Title } = Typography;
const { Meta } = Card;

const SearchBook = () => {
  const store = useStorage();
  const [form] = Form.useForm<AddUserForm>();
  const [user] = useState<AddressBookItem>(store.get('FIRST_LEVEL_STORAGE'));
  const [userStatusOpts, setUserStatusOpts] = useState<LabelValue[]>([]);
  const [accountStatusOpts, setAccountStatusOpts] = useState<LabelValue[]>([]);
  const [userRoleOptions, setUserRoleOptions] = useState<LabelValue[]>([]);
  const navigate = useNavigate();

  const columns = [
    {
      label: $t('Display Name'),
      key: 'displayName',
      children: user?.displayName
    },
    {
      label: $t('First Name'),
      key: 'firstName',
      children: user?.firstName
    },
    {
      label: $t('Last Name'),
      key: 'lastName',
      children: user?.lastName
    },
    {
      label: $t('Email Address'),
      key: 'emailAddress',
      children: user?.emailAddress
    },
    {
      label: $t('Phone Number'),
      key: 'phoneNumber',
      children: user?.phoneNumber
    },
    {
      label: $t('Fax Number'),
      key: 'faxNumber',
      children: user?.faxNumber
    },
    {
      label: $t('Location'),
      key: 'location',
      children: user?.location
    },
    {
      label: $t('Position'),
      key: 'position',
      children: user?.position
    },
    {
      label: $t('Rank'),
      key: 'rank',
      children: user?.rank
    },
    {
      label: $t('Substantive Rank'),
      key: 'substantiveRank',
      children: user?.substantiveRank
    },
    {
      label: $t('Title'),
      key: 'title',
      children: user?.title
    },
    {
      label: $t('Unit'),
      key: 'unit',
      children: user?.unit
    },
    {
      label: $t('Tenant Name'),
      key: 'tenantName',
      children: user?.tenantNameLabel
    },
    {
      label: $t('User Status'),
      key: 'userStatus',
      children: (
        <ProFormSelect
          name="userStatus"
          initialValue={user?.userStatus}
          width="sm"
          disabled={user?.userStatus === 'PENDING'}
          placeholder={$t('Please Select User Status')}
          options={translationAllLabel(userStatusOpts)}
          rules={[
            {
              required: true,
              message: $t('Please Select User Status')
            }
          ]}
        />
      )
    },
    {
      label: $t('Account Status'),
      key: 'accountStatus',
      children: (
        <ProFormSelect
          name="accountStatus"
          initialValue={user?.accountStatus}
          width="sm"
          disabled={user?.userStatus === 'PENDING'}
          placeholder={$t('Please Select Account Status')}
          options={translationAllLabel(accountStatusOpts)}
          rules={[
            {
              required: true,
              message: $t('Please Select Account Status')
            }
          ]}
        />
      )
    }
  ];

  const handleSubmitConfirm = async () => {
    const result = await submitSMAUser({
      id: user.id,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      phoneNumber: user.phoneNumber,
      faxNumber: user.faxNumber,
      location: user.location,
      position: user.position,
      rank: user.rank,
      substantiveRank: user.substantiveRank,
      title: user.title,
      unit: user.unit,
      tenantName: user.tenantName,
      ...form.getFieldsValue()
    });
    if (result.status.code === 0) {
      notification.success({
        message: $t('Save successfully')
      });
      navigate(-1);
    }
  };

  const getUserStatusOpts = (): void => {
    getCommonOptions({
      mstType: 'USER_STATUS'
    }).then((options) => {
      if (user?.userStatus === 'ENABLE') {
        setUserStatusOpts(
          options.filter((option) => option.value !== 'PENDING')
        );
      } else if (user?.userStatus === 'DISABLE') {
        setUserStatusOpts(
          options.filter((option) => option.value !== 'ENABLE')
        );
      } else {
        setUserStatusOpts(options);
      }
    });
  };

  const getAccountStatusOpts = (): void => {
    getCommonOptions({
      mstType: 'ACCT_STATUS'
    }).then((options) => {
      setAccountStatusOpts(options);
    });
  };

  const getUserRoles = (): void => {
    getUserRoleOptions().then((options) => {
      setUserRoleOptions(options);
    });
  };

  useEffect(() => {
    getUserStatusOpts();
    getAccountStatusOpts();
    getUserRoles();
  }, []);

  return (
    <>
      <Favorites code="FD-S-USR-001" label={$t('Maintain User Account')} />
      <Card style={{ flex: 1 }}>
        <Flex justify="space-between" style={{ marginBottom: '16px' }}>
          <Title level={4}>{$t('User Account Profile')}</Title>
          <Space>
            <Button type="primary" ghost onClick={() => navigate(-1)}>
              <Icon type="LeftOutlined" />
              {$t('Back')}
            </Button>
            <ResetPassword email={user?.emailAddress} />
          </Space>
        </Flex>
        <ProForm
          form={form}
          submitter={{
            render(props) {
              return (
                <Flex gap="small" style={{ justifyContent: 'end' }}>
                  <CustomFormButton
                    disabled={user?.userStatus === 'PENDING'}
                    formInstance={props.form}
                    onConfirm={handleSubmitConfirm}
                  >
                    {$t('Save')}
                  </CustomFormButton>
                </Flex>
              );
            }
          }}
        >
          <ProDescriptions layout="vertical" columns={columns} />
          <Card style={{ marginBottom: '24px' }}>
            <Meta
              title={$t('Select User Role')}
              style={{ marginBottom: '12px' }}
            />
            <ProFormCheckbox.Group
              rules={[
                {
                  required: true,
                  message: $t('Please Select User Role')
                }
              ]}
              disabled={user?.userStatus === 'PENDING'}
              initialValue={user?.userRole}
              name="userRole"
              options={userRoleOptions}
            />
          </Card>
        </ProForm>
      </Card>
    </>
  );
};
export default SearchBook;
