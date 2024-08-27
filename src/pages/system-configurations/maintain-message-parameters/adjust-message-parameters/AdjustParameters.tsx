import { useState } from 'react';
import { Button, Card, Flex, Space, Typography } from 'antd';
import { ProForm } from '@ant-design/pro-components';
import { useForm } from 'antd/es/form/Form';
import { validateDeep } from '@/utils';
import { TagMultiple, CustomModal } from '@/components/proComponents';
import { CounterButton } from '@/components/business';
import { MessageParametersItem } from '.';
import CustomCancelButton from '@/components/proComponents/CustomCancelButton';
const { Title } = Typography;

export interface MessageParametersProp {
  selectedTitle: string;
  data: MessageParametersItem;
  onUpdate: (fields: MessageParametersItem) => Promise<void> | void;
}
const AdjustParameters = ({
  selectedTitle,
  data,
  onUpdate
}: MessageParametersProp) => {
  const selectedGroupRules = [
    { required: true, message: `${$t('Please Select')} ${$t(selectedTitle)}` }
  ];
  const maxRecipientsNumRules = [
    {
      required: true,
      message: $t('Please Enter Maximum Email Addresses Supported Per Message')
    }
  ];

  const predefinedPeriodNumRules = [
    {
      required: true,
      message: $t('Please Enter Predefined Period(Minutes)')
    }
  ];

  const maxEmailNumRules = [
    {
      required: true,
      message: $t(
        'Please Enter No.of messages that can be sent within the predefined period'
      )
    }
  ];
  const [saveOpen, setSaveOpen] = useState(false);
  const [fields, setFields] = useState<MessageParametersItem>(data);
  const [form] = useForm();

  const handleUpdate = (): void => {
    setSaveOpen(false);
    onUpdate(fields);
  };

  return (
    <>
      <Card>
        <ProForm submitter={false} form={form}>
          <Title level={4}>{$t('Adjust Message Parameters')}</Title>
          <ProForm.Group>
            <ProForm.Item
              label={`${$t(selectedTitle)} (${
                fields.selectedGroup?.length || 0
              })`}
              name="selectedGroup"
              rules={selectedGroupRules}
            >
              {fields.selectedGroup.length > 0 ? (
                <TagMultiple
                  items={fields.selectedGroup}
                  onChange={(tags) =>
                    setFields((prevFields) => ({
                      ...prevFields,
                      selectedGroup: tags
                    }))
                  }
                />
              ) : null}
            </ProForm.Item>
          </ProForm.Group>

          <ProForm.Group style={{ marginTop: '10px' }}>
            <ProForm.Item
              name="maxRecipientsNum"
              rules={maxRecipientsNumRules}
              label={$t('Maximum Email Addresses Supported Per Message')}
            >
              <CounterButton
                precision={0}
                value={fields.maxRecipients as number}
                onChange={(value: number | null) =>
                  setFields((prevFields) => ({
                    ...prevFields,
                    maxRecipients: value as number
                  }))
                }
              />
            </ProForm.Item>
          </ProForm.Group>
          <ProForm.Group style={{ marginTop: '10px' }}>
            <ProForm.Item
              name="predefinedPeriodNum"
              rules={predefinedPeriodNumRules}
              label={$t('Predefined Period(Minutes)')}
            >
              <CounterButton
                precision={0}
                value={fields.predefinedPeriod as number}
                onChange={(value: number | null) =>
                  setFields((prevFields) => ({
                    ...prevFields,
                    predefinedPeriod: value as number
                  }))
                }
              />
            </ProForm.Item>
          </ProForm.Group>

          <ProForm.Group style={{ marginTop: '10px' }}>
            <ProForm.Item
              name="maxEmailNum"
              rules={maxEmailNumRules}
              label={$t(
                'No.of messages that can be sent within the predefined period'
              )}
            >
              <CounterButton
                precision={0}
                value={fields.maxEmail as number}
                onChange={(value: number | null) =>
                  setFields((prevFields) => ({
                    ...prevFields,
                    maxEmail: value as number
                  }))
                }
              />
            </ProForm.Item>
          </ProForm.Group>

          <Flex justify="flex-end">
            <Space>
              <CustomCancelButton>{$t('Cancel')}</CustomCancelButton>
              <Button
                type="primary"
                onClick={() => {
                  if (validateDeep(fields)) setSaveOpen(true);
                }}
              >
                {$t('Update')}
              </Button>
            </Space>
          </Flex>
        </ProForm>
      </Card>

      <CustomModal
        title={$t('Are you sure to update?')}
        open={saveOpen}
        type="warning"
        onOk={handleUpdate}
        onCancel={() => setSaveOpen(false)}
      />
    </>
  );
};

export default AdjustParameters;
