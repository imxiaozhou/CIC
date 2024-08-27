import { Card, Flex, Space, Typography } from 'antd';
import { CustomFormButton, CustomModal } from '@/components/proComponents';
import { useNavigate } from 'react-router-dom';
import { Favorites } from '@/components/business';
import { NotificationTemplateItem } from './type';
import {
  addNotificationTemplateApi,
  isUniqueTemplateNameApi,
  updateNotificationTemplateApi
} from '@/services/notification-management';
import { getCommonOptions, getSelectSearchableApi } from '@/services/common';
import { translationAllLabel } from '@/utils';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components';
import { AddNotificationTemplateParams } from '@/services/notification-management/maintain-notification-templates/type';
import CustomCancelButton from '@/components/proComponents/CustomCancelButton';

const { Title } = Typography;
interface SearchKey {
  keywords: string;
}
export default function EditNotificationTemplate() {
  const navigate = useNavigate();
  const store = useStorage();
  const state = store.get('FIRST_LEVEL_STORAGE');

  const [successVisible, setSuccessVisible] = useState(false);
  const [templateTypeOptions, setTemplateTypeOptions] = useState<LabelValue[]>(
    []
  );
  const [form] = ProForm.useForm<NotificationTemplateItem>();

  const [isEdit, setIsEdit] = useState(false);
  const [tenantDisable, setTenantDisable] = useState(false);
  const associatedRules = [
    {
      required: true,
      message: $t('Please Select Associated Tenant')
    }
  ];
  const [associatedTenantRules, setAssociatedTenantRules] =
    useState(associatedRules);

  const [uniqueWarningVisible, setUniqueWarningVisible] = useState(false);

  const getOptions = async (): Promise<void> => {
    const data = await getCommonOptions({
      mstType: 'NOTIFICATION_TEMPLATE_TYPE'
    });
    setTemplateTypeOptions(data);
  };

  useEffect(() => {
    getOptions();
    setIsEdit(state.isEdit);
    if (state.record) {
      form.setFieldValue('type', state.record.type);
      form.setFieldValue('templateName', state.record.templateName);
      form.setFieldValue('associatedTenant', state.record.tntId);
      form.setFieldValue('content', state.record.content);
      setAssociatedTenantRules(
        state.record.type === 'TENANT' ? associatedRules : []
      );
    }
  }, []);

  const handleSave = async (): Promise<void> => {
    form?.validateFields().then((values) => {
      isEdit ? handleSaveEdit(values) : handleSaveCreate(values);
    });
  };

  const handleSaveEdit = (values: AddNotificationTemplateParams) => {
    updateNotificationTemplateApi({
      ...values,
      id: state.record.id
    }).then((res) => {
      if (res.status.code === 0) setSuccessVisible(true);
    });
  };

  const handleSaveCreate = (values: AddNotificationTemplateParams) => {
    isUniqueTemplateNameApi({ templateName: values.templateName }).then(
      (result) => {
        if (result.data.unique) {
          addNotificationTemplateApi(values).then((res) => {
            if (res.status.code === 0) setSuccessVisible(true);
          });
        } else {
          setUniqueWarningVisible(true);
        }
      }
    );
  };

  const typeRules = [
    {
      required: true,
      message: $t('Please Select Type')
    }
  ];
  const templateNameRules = [
    {
      required: true,
      message: $t('Please Enter Template Name')
    }
  ];
  const contentRules = [
    {
      required: true,
      message: $t(
        'Please enter content, content cannot exceed 200 characters!'
      ),
      max: 200
    }
  ];

  async function fetchUserList({ keywords }: SearchKey): Promise<LabelValue[]> {
    return getSelectSearchableApi('sma-adm/api/common/search-tenant-name', {
      keyword: keywords
    }).then((res) => {
      return res.data;
    });
  }

  const typeFieldProps = {
    onChange(value: string) {
      form.setFieldValue('type', value);
      if (value === 'SYSTEM') {
        setTenantDisable(true);
        form.setFieldValue('associatedTenant', '');
        setAssociatedTenantRules([]);
      } else {
        setTenantDisable(false);
        setAssociatedTenantRules(associatedRules);
      }
    }
  };

  return (
    <>
      <Favorites
        code="FD-S-NTM-002"
        label={$t('Maintain Notification Templates')}
      />
      <Card>
        <Title level={4}>{$t('Notification Template')}</Title>

        <ProForm submitter={false} form={form} grid={true}>
          <ProForm.Group>
            <ProFormSelect
              label={$t('Type')}
              options={translationAllLabel(templateTypeOptions)}
              name="type"
              rules={typeRules}
              colProps={{ xl: 8 }}
              disabled={isEdit}
              fieldProps={typeFieldProps}
            />
            <ProFormText
              name="templateName"
              rules={templateNameRules}
              label={$t('Template Name')}
              colProps={{ xl: 8 }}
              disabled={isEdit}
              fieldProps={{
                maxLength: 100
              }}
            />
            <ProFormSelect
              name="associatedTenant"
              rules={associatedTenantRules}
              label={$t('Associated Tenant')}
              colProps={{ xl: 8 }}
              showSearch
              request={fetchUserList}
              disabled={isEdit || tenantDisable}
            />
          </ProForm.Group>
          <ProFormTextArea
            name="content"
            rules={contentRules}
            label={$t('Content')}
            colProps={{ span: 24 }}
            fieldProps={{
              showCount: true,
              maxLength: 200
            }}
          />
        </ProForm>

        <Flex justify="flex-end">
          <Space>
            <CustomCancelButton
              title={$t('Are you sure to discard this notification template?')}
            >
              {$t('Cancel')}
            </CustomCancelButton>
            <CustomFormButton
              formInstance={form}
              type="primary"
              onConfirm={handleSave}
            >
              {$t('Save')}
            </CustomFormButton>
          </Space>
        </Flex>
      </Card>

      <CustomModal
        open={successVisible}
        title={$t('Notification Template is saved successfully')}
        type="info"
        okText={$t('Ok')}
        onOk={() => navigate(-1)}
      />

      <CustomModal
        open={uniqueWarningVisible}
        title={$t('The template name already exists')}
        type="warning"
        okText={$t('Ok')}
        onOk={() => setUniqueWarningVisible(false)}
        onCancel={() => setUniqueWarningVisible(false)}
      />
    </>
  );
}
