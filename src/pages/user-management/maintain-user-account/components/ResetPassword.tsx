import { Button, Flex, Form } from 'antd';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { modalProps } from '@/config/common';
import { PasswordTips } from '@/components/business';
import { CustomFormButton, CustomModal } from '@/components/proComponents';
import {
  userResetPassword,
  getPasswordPolicyRegex,
  type ResetPasswordParams
} from '@/services/user-management';

const ResetPassword = ({ email }: { email: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVisit, setModalVisit] = useState(false);
  const [passwordPolicyRegex, setPasswordPolicyRegex] = useState<string>('');
  const [form] = Form.useForm<ResetPasswordParams>();

  const handleOk = () => {
    setIsModalOpen(false);
    setModalVisit(false);
  };

  const getRegex = async () => {
    const { data } = await getPasswordPolicyRegex();
    setPasswordPolicyRegex(data?.regex);
  };

  const handleSubmitConfirm = async () => {
    const { status } = await userResetPassword({
      ...form.getFieldsValue(),
      email
    });
    if (status?.code === 0) {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    getRegex();
  }, []);

  return (
    <>
      <ModalForm
        title={$t('Reset Password')}
        form={form}
        modalProps={{ ...modalProps, width: 620 }}
        trigger={
          <Button type="primary" ghost key="resetPassword">
            {$t('Reset Password')}
          </Button>
        }
        autoFocusFirstInput
        open={modalVisit}
        onOpenChange={setModalVisit}
        submitter={{
          render(props, dom) {
            return (
              <Flex gap="small" style={{ justifyContent: 'end' }}>
                {dom[0]}
                <CustomFormButton
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
        <ProFormText.Password
          width="md"
          name="newPassword"
          label={$t('New Password')}
          placeholder={$t('Please Enter New Password')}
          rules={[
            {
              required: true,
              message: $t('Please Enter New Password')
            },
            () => ({
              validator(_, value) {
                if (!value) {
                  return Promise.resolve();
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
          width="md"
          name="confirmNewPassword"
          dependencies={['newPassword']}
          label={$t('Confirm New Password')}
          placeholder={$t('Please Enter Confirm New Password')}
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
                      $t('New Password and Confirm New Password does not match')
                    )
                  );
                }
                return Promise.resolve();
              }
            })
          ]}
        />
      </ModalForm>
      <CustomModal
        open={isModalOpen}
        title={$t('Reset Password is successful')}
        type="info"
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
};
export default ResetPassword;
