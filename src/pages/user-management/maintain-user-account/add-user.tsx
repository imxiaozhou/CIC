import { Card, Flex, Button, Image, Form, Typography, Space } from 'antd';
import {
  ProForm,
  ProFormCheckbox,
  ProDescriptions
} from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { Favorites } from '@/components/business';
import { CustomFormButton } from '@/components/proComponents';
import Icon from '@/components/Icons';
import AddressBook from './components/AddressBook';
import { AddressBookItem, AddUserForm } from './type';
import { submitSMAUser } from '@/services/user-management';
import { getUserRoleOptions } from '@/services/common';

const { Title, Text } = Typography;
const { Meta } = Card;

const SearchBook = () => {
  const [form] = Form.useForm<AddUserForm>();
  const [user, setUser] = useState<AddressBookItem>();
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
      children: user?.tenantName
    }
  ];

  const getUserRoles = (): void => {
    getUserRoleOptions().then((options) => {
      setUserRoleOptions(options);
    });
  };

  useEffect(() => {
    getUserRoles();
  }, []);

  const handleAddUser = (record: AddressBookItem) => {
    setUser(record);
  };

  const handleSubmitConfirm = async () => {
    const result = await submitSMAUser({
      ...(user as AddressBookItem),
      ...form.getFieldsValue()
    });
    if (result.status.code === 0) {
      notification.success({
        message: $t('Submit Successfully'),
        description: `${$t('Pending to approve')}...`
      });
      navigate(-1);
    }
  };

  return (
    <>
      <Favorites code="FD-S-USR-001" label={$t('Maintain User Account')} />
      <Card style={{ flex: 1 }}>
        <Flex justify="space-between" style={{ marginBottom: '16px' }}>
          <Title level={4}>{$t('Add User')}</Title>
          <Space>
            <Button type="primary" ghost onClick={() => navigate(-1)}>
              <Icon type="LeftOutlined" />
              {$t('Back')}
            </Button>
            <AddressBook onAdd={handleAddUser} />
          </Space>
        </Flex>
        {user ? (
          <>
            <ProDescriptions layout="vertical" columns={columns} />
            <ProForm
              form={form}
              submitter={{
                render(props) {
                  return (
                    <Flex gap="small" style={{ justifyContent: 'end' }}>
                      <CustomFormButton
                        formInstance={props.form}
                        onConfirm={handleSubmitConfirm}
                      >
                        {$t('Submit')}
                      </CustomFormButton>
                    </Flex>
                  );
                }
              }}
            >
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
                  name="userRole"
                  options={userRoleOptions}
                />
              </Card>
            </ProForm>
          </>
        ) : (
          <Flex vertical align="center" style={{ paddingTop: '64px' }}>
            <Image
              src={`${import.meta.env.BASE_URL}search_book.png`}
              preview={false}
              width={320}
            />
            <Text>
              {$t('Please click “Search From Address Book” to add user.')}
            </Text>
          </Flex>
        )}
      </Card>
    </>
  );
};
export default SearchBook;
