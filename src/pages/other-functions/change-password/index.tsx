import { Card, Flex, Form, Typography } from 'antd';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { CustomFormButton, CustomModal } from '@/components/proComponents';
import { PasswordTips, Favorites } from '@/components/business';
import {
  userChangePassword,
  getPasswordPolicyRegex,
  type ChangePasswordParams
} from '@/services/user-management';

const { Title } = Typography;

const formItemLayout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 }
};

export default function ChangePassword() {
  const [successVisible, setSuccessVisible] = useState<boolean>(false);
  const [passwordPolicyRegex, setPasswordPolicyRegex] = useState<string>('');
  const [form] = Form.useForm<ChangePasswordParams>();
  const $t = useTranslations();

  const handleSubmitConfirm = async () => {
    const { status } = await userChangePassword({
      ...form.getFieldsValue()
    });
    if (status.code === 0) {
      setSuccessVisible(true);
    }
  };

  const getRegex = async () => {
    const { data } = await getPasswordPolicyRegex();
    setPasswordPolicyRegex(data?.regex);
  };

  useEffect(() => {
    getRegex();
  }, []);

  return (
    <>
      <Favorites code="FD-S-USR-003" label={$t('Change Password')} />
      <Card style={{ flex: 1 }} bordered={false}>
        <Title level={4}>{$t('Change Password')}</Title>
        <ProForm
          {...formItemLayout}
          layout="vertical"
          form={form}
          submitter={{
            searchConfig: {
              resetText: $t('Cancel')
            },
            render(props, dom) {
              return (
                <Flex gap="small" style={{ justifyContent: 'end' }}>
                  {dom[0]}
                  <CustomFormButton
                    formInstance={props.form}
                    onConfirm={handleSubmitConfirm}
                  >
                    {$t('Confirm')}
                  </CustomFormButton>
                </Flex>
              );
            }
          }}
        >
          <ProFormText.Password
            label={$t('Current Password')}
            placeholder={$t('Please Enter Current Password')}
            name="currentPassword"
            rules={[
              {
                required: true,
                message: $t('Please Enter Current Password')
              }
            ]}
          />
          <ProFormText.Password
            label={$t('New Password')}
            placeholder={$t('Please Enter New Password')}
            name="newPassword"
            rules={[
              {
                required: true,
                message: $t('Please Enter New Password')
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.resolve();
                  }
                  // 检查新密码是否与旧密码相同
                  if (value && getFieldValue('currentPassword') === value) {
                    return Promise.reject(
                      new Error(
                        $t('Your new password cannot be same as old password')
                      )
                    );
                  }
                  // 检查密码强度
                  const passwordRule = new RegExp(passwordPolicyRegex);
                  const isSecure = passwordRule.test(value);
                  if (!isSecure) {
                    return Promise.reject(
                      new Error(
                        $t(
                          'This password is not secure. Try a different password'
                        )
                      )
                    );
                  }
                  return Promise.resolve();
                }
              })
            ]}
          />
          <PasswordTips />
          <ProFormText.Password
            dependencies={['newPassword']}
            label={$t('Confirm New Password')}
            placeholder={$t('Please Enter Confirm New Password')}
            name="confirmNewPassword"
            rules={[
              {
                required: true,
                message: $t('Please Enter Confirm New Password')
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value) {
                    const passwordRule = new RegExp(passwordPolicyRegex);
                    const isSecure = passwordRule.test(value);
                    if (!isSecure) {
                      return Promise.reject(
                        new Error(
                          $t(
                            'This password is not secure. Try a different password'
                          )
                        )
                      );
                    }

                    // 检查新密码和确认新密码是否匹配
                    if (getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        $t(
                          'New Password and Confirm New Password does not match'
                        )
                      )
                    );
                  }
                  return Promise.resolve();
                }
              })
            ]}
          />
        </ProForm>
      </Card>
      <CustomModal
        open={successVisible}
        title={$t('Password change successfully')}
        type="info"
        onOk={() => setSuccessVisible(false)}
        onCancel={() => setSuccessVisible(false)}
      />
    </>
  );
}
