import { useState } from 'react';
import type { MessageStorageQuotaItem } from '@/types/business';

import { Button, Card, Flex, Space, Typography } from 'antd';
import { ProForm } from '@ant-design/pro-components';
import { TagMultiple, CustomModal } from '@/components/proComponents';
import { useForm } from 'antd/es/form/Form';
import { validateDeep } from '@/utils';
import { getCommonOptions } from '@/services/common';
import { CounterButton, UnitSelect } from '@/components/business';
import CustomCancelButton from '@/components/proComponents/CustomCancelButton';

interface AdjustMailboxStorageQuotaProp {
  data: MessageStorageQuotaItem;
  onUpdate: (fields: MessageStorageQuotaItem) => Promise<void> | void;
}

const { Title } = Typography;

const AdjustMessageStorageQuota = ({
  data,
  onUpdate
}: AdjustMailboxStorageQuotaProp) => {
  const [unitOptions, setUnitOptions] = useState<LabelValue[]>([]);

  const getUintOptions = () => {
    getCommonOptions({
      mstType: 'STORAGE_UNIT'
    }).then((options) => setUnitOptions(options));
  };

  useEffect(() => {
    getUintOptions();
  }, []);
  const selectedGroupRules = [
    {
      required: true,
      message: $t('Please Select User')
    }
  ];
  const warningLevelNumberRules = [
    {
      required: true,
      message: $t('Please Enter Warning Level')
    }
  ];

  const cannotSendLimitNumberRules = [
    {
      required: true,
      message: $t('Please Enter Send Restriction')
    }
  ];

  const cannotReceiveLimitNumberRules = [
    {
      required: true,
      message: $t('Please Enter Receive Restriction')
    }
  ];
  const [saveOpen, setSaveOpen] = useState(false);
  const [fields, setFields] = useState<MessageStorageQuotaItem>(data);

  const handleInputChange = (
    key: keyof MessageStorageQuotaItem,
    value: any
  ) => {
    setFields((prevFields) => ({
      ...prevFields,
      [key]: value
    }));
  };

  const [form] = useForm();

  return (
    <>
      <Card>
        <ProForm submitter={false} form={form}>
          <Title level={4}>{$t('Adjust Mailbox Storage Quota')}</Title>
          <ProForm.Group>
            <ProForm.Item
              label={`${$t('Selected User')} (${
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

          <ProForm.Group>
            <ProForm.Item
              label={$t('Warning Level')}
              name="warningLevelNumber"
              rules={warningLevelNumberRules}
            >
              <CounterButton
                value={fields.warningLevel?.number}
                onChange={(value: number | null) =>
                  handleInputChange('warningLevel', {
                    ...fields.warningLevel,
                    number: value
                  })
                }
              />
            </ProForm.Item>
            <ProForm.Item label="   " name="warningLevelUnit">
              <UnitSelect
                value={fields.warningLevel?.unit}
                keyId="warningLevelUnit"
                unitOptions={unitOptions}
                onChange={(value: string) =>
                  handleInputChange('warningLevel', {
                    ...fields.warningLevel,
                    unit: value
                  })
                }
              />
            </ProForm.Item>
          </ProForm.Group>

          <ProForm.Group>
            <ProForm.Item
              label={$t('Send Restriction')}
              name="cannotSendNumber"
              rules={cannotSendLimitNumberRules}
            >
              <CounterButton
                value={fields.cannotSendLimit?.number}
                onChange={(value: number | null) =>
                  handleInputChange('cannotSendLimit', {
                    ...fields.cannotSendLimit,
                    number: value
                  })
                }
              />
            </ProForm.Item>
            <ProForm.Item label="  " name="cannotSendUnit">
              <UnitSelect
                value={fields.cannotSendLimit?.unit}
                keyId="cannotSendUnit"
                unitOptions={unitOptions}
                onChange={(value: string) =>
                  handleInputChange('cannotSendLimit', {
                    ...fields.cannotSendLimit,
                    unit: value
                  })
                }
              />
            </ProForm.Item>
          </ProForm.Group>
          <ProForm.Group>
            <ProForm.Item
              label={$t('Receive Restriction')}
              name="cannotReceiveNumber"
              rules={cannotReceiveLimitNumberRules}
            >
              <CounterButton
                value={fields.cannotReceiveLimit?.number}
                onChange={(value: number | null) =>
                  handleInputChange('cannotReceiveLimit', {
                    ...fields.cannotReceiveLimit,
                    number: value
                  })
                }
              />
            </ProForm.Item>
            <ProForm.Item label="  " name="cannotReceiveUnit">
              <UnitSelect
                value={fields.cannotReceiveLimit?.unit}
                keyId="cannotReceiveUnit"
                unitOptions={unitOptions}
                onChange={(value: string) =>
                  handleInputChange('cannotReceiveLimit', {
                    ...fields.cannotReceiveLimit,
                    unit: value
                  })
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
        title={$t('Are you sure to save?')}
        open={saveOpen}
        type="warning"
        onOk={() => onUpdate(fields)}
        onCancel={() => setSaveOpen(false)}
      />
    </>
  );
};

export default AdjustMessageStorageQuota;
