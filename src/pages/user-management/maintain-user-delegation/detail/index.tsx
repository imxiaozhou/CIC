import type { ProDescriptionsItemProps } from '@ant-design/pro-components';
import { Card, Flex, Typography, Space, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  ProForm,
  ProFormDateRangePicker,
  ProFormTextArea,
  ProFormSelect,
  ProDescriptions
} from '@ant-design/pro-components';
import { Favorites, LookupUser } from '@/components/business';
import { CustomFormButton, CustomModal } from '@/components/proComponents';
import { ILookup } from '@/types/business';
import {
  userDelegationDetail,
  submitUserDelegationData
} from '@/services/user-management';
import { UserDelegation } from '../type';
import { getCommonOptions } from '@/services/common';
import { translationAllLabel } from '@/utils';
import CustomCancelButton from '@/components/proComponents/CustomCancelButton';

const { Title, Text } = Typography;

const CreateUserDelegation = () => {
  const navigator = useNavigate();
  const store = useStorage();
  const { isCreate, id } = store.get('FIRST_LEVEL_STORAGE');
  const [form] = Form.useForm<any>();
  const [user, setUser] = useState<UserDelegation>({
    id
  } as UserDelegation);
  const [createVisible, setCreateVisible] = useState<boolean>(false);

  const handleAddUser = (record: ILookup, type: string) => {
    let obj =
      type === 'delegate'
        ? {
            delegateUserId: record.uid,
            delegateUserName: record.userName,
            delegateUserEmail: record.userEmail,
            delegateUserTenant: record.userTenant
          }
        : { ...record, userId: record.uid };
    setUser({ ...user, ...obj });
  };

  const items: ProDescriptionsItemProps[] = [
    {
      label: $t('User Name'),
      children: (
        <Space>
          <Text>{user?.userName ?? '-'}</Text>
          <LookupUser onAdd={handleAddUser} />
        </Space>
      )
    },
    {
      label: $t('User Tenant'),
      children: user?.userTenant
    },
    {
      label: $t('User Email'),
      children: user?.userEmail
    },
    {
      label: $t('Delegate User Name'),
      children: (
        <Space>
          <Text>{user?.delegateUserName ?? '-'}</Text>
          <LookupUser onAdd={handleAddUser} type="delegate" />
        </Space>
      )
    },
    {
      label: $t('Delegate User Tenant'),
      children: user?.delegateUserTenant
    },
    {
      label: $t('Delegate User Email'),
      children: user?.delegateUserEmail
    },
    {
      label: $t('Delegate Date'),
      children: (
        <ProFormDateRangePicker
          name="delegateDate"
          rules={[
            {
              required: true,
              message: $t('Please Select Delegate Date')
            }
          ]}
        />
      )
    },
    {
      label: $t('Delegate Status'),
      children: (
        <ProFormSelect
          name="delegateStatus"
          request={async (params) => {
            const res = await getCommonOptions({
              mstType: 'DELEGATE_STATUS'
            });
            return translationAllLabel(res);
          }}
          rules={[
            {
              required: true,
              message: $t('Please Select Delegate Status')
            }
          ]}
        />
      )
    },
    {
      children: <></>
    },
    {
      label: $t('Delegate Remark'),
      children: (
        <ProFormTextArea
          style={{ width: '100%' }}
          name="remark"
          allowClear
          rules={[
            {
              required: true,
              message: 'Please Enter Delegate Remark'
            }
          ]}
          fieldProps={{ autoSize: { minRows: 3, maxRows: 5 } }}
        />
      ),
      span: 2
    }
  ];

  const handleSubmitConfirm = async () => {
    const values = form.getFieldsValue();
    values.id = isCreate ? undefined : user?.id;
    const delegateDate = [
      dayjs(values.delegateDate[0]).format('YYYY-MM-DD'),
      dayjs(values.delegateDate[1]).format('YYYY-MM-DD')
    ];
    const result = await submitUserDelegationData({
      ...user,
      ...values,
      delegateDate,
      delegateFrom: dayjs(user?.delegateFrom).format('YYYY-MM-DD'),
      delegateTo: dayjs(user?.delegateTo).format('YYYY-MM-DD'),
      effectFrom: dayjs(user?.effectFrom).format('YYYY-MM-DD'),
      delegateStatus: values.delegateStatus,
      remark: values.remark
    });
    if (result.status.code === 0) {
      notification.success({
        message: $t('Save successfully')
      });
      navigator(-1);
    }
  };

  return (
    <>
      <Favorites code="FD-S-USR-007" label={$t('Maintain User Delegation')} />
      <Card style={{ flex: 1 }}>
        <Title level={4}>{$t('User Delegation')}</Title>
        <ProForm
          form={form}
          submitter={{
            render(props) {
              return (
                <Flex gap="small" style={{ justifyContent: 'end' }}>
                  <CustomCancelButton>{$t('Cancel')}</CustomCancelButton>
                  <CustomFormButton
                    formInstance={props.form}
                    onConfirm={handleSubmitConfirm}
                    disabled={user.userEmail === user.delegateUserEmail}
                  >
                    {isCreate ? $t('Create') : $t('Save')}
                  </CustomFormButton>
                </Flex>
              );
            }
          }}
          request={async () => {
            if (!isCreate) {
              const { data } = await userDelegationDetail({
                id: user.id as string
              });
              setUser(data);
              return {
                ...data,
                delegateDate: [
                  dayjs(data.delegateFrom).format('YYYY-MM-DD'),
                  dayjs(data.delegateTo).format('YYYY-MM-DD')
                ]
              };
            } else {
              return {};
            }
          }}
        >
          <ProDescriptions layout="vertical" columns={items} />
        </ProForm>
      </Card>

      <CustomModal
        title={$t('New User Delegation is created successfully')}
        open={createVisible}
        onCancel={() => setCreateVisible(false)}
        onOk={() => navigator(-1)}
        type="info"
      />
    </>
  );
};

export default CreateUserDelegation;
