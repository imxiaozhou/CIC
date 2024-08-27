import { CustomFormButton, CustomProTable } from '@/components/proComponents';
import {
  ActionType,
  ProFormSelect,
  type ProColumns
} from '@ant-design/pro-components';
import { Button, Select, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/Icons';
import {
  deleteNotificationTemplateApi,
  searchNotificationTemplateApi
} from '@/services/notification-management/maintain-notification-templates';
import { omit } from 'lodash-es';
import { getCommonOptions, getSelectSearchableApi } from '@/services/common';
import { showMultipleLabel, translationAllLabel } from '@/utils';
import { NotificationTemplateItem } from '../type';
import { SearchNotificationTemplateParams } from '@/services/notification-management/maintain-notification-templates/type';
const sessionKey = 'NOTIFICATION_TEMPLATES_SUPER';

export default function ForSuperAdmin() {
  const store = useStorage();
  const storage = store.get(sessionKey);
  const actionRef = useRef<ActionType>();
  const navigate = useNavigate();
  const [options, setOptions] = useState<LabelValue[]>([]);
  const [type, setType] = useState(storage?.type ?? '');
  const [typeOptions, setTypeOptions] = useState<LabelValue[]>([]);
  const getTypeOptions = async () => {
    const data = await getCommonOptions({
      mstType: 'NOTIFICATION_TEMPLATE_TYPE'
    });
    setTypeOptions(data);
  };

  async function fetchUserList(keyword = '') {
    const res = await getSelectSearchableApi(
      'sma-adm/api/common/search-tenant-name',
      { keyword }
    );
    setOptions(res.data);
  }

  useEffect(() => {
    getTypeOptions();
    fetchUserList();
  }, []);

  const columns: ProColumns<NotificationTemplateItem>[] = [
    {
      title: $t('Type'),
      dataIndex: 'type',
      key: 'type',
      sorter: true,
      initialValue: storage?.type,
      render: (_, record: NotificationTemplateItem) => $t(record.typeLabel),
      renderFormItem: (schema, config, form) => (
        <ProFormSelect
          options={translationAllLabel(typeOptions)}
          onChange={(value: string) => {
            form.setFieldValue('type', value);
            setType(value);
            if (value === 'SYSTEM') {
              form.setFieldValue('associatedTenant', undefined);
            }
          }}
        />
      )
    },
    {
      title: $t('Template Name'),
      dataIndex: 'templateName',
      key: 'templateName',
      sorter: true
    },
    {
      title: $t('Associated Tenant'),
      dataIndex: 'associatedTenant',
      key: 'associatedTenant',
      sorter: true,
      initialValue: storage?.associatedTenant,
      render: (_, record: NotificationTemplateItem) =>
        showMultipleLabel(record.associatedTenantLabel),
      renderFormItem: (schema, config, form) => (
        <Select
          showSearch
          disabled={type === 'SYSTEM'}
          optionFilterProp="label"
          placeholder={$t('Please search')}
          onChange={(value) => form.setFieldValue('associatedTenant', value)}
          options={options}
        />
      )
    },
    {
      title: $t('Action'),
      dataIndex: 'action',
      fixed: 'right',
      valueType: 'option',
      render: (_, record: NotificationTemplateItem) => [
        <Space key="action">
          <Button
            key="edit"
            type="link"
            onClick={() => {
              navigate('./edit-notification-template');
              store.set('FIRST_LEVEL_STORAGE', { record, isEdit: true });
            }}
          >
            {$t('Edit')}
          </Button>
          {record.type !== 'SYSTEM' && (
            <CustomFormButton
              key="delete"
              type="link"
              danger
              title={$t('Are you sure to delete a notification template?')}
              onConfirm={() => handleDelete(record.id)}
            >
              {$t('Delete')}
            </CustomFormButton>
          )}
        </Space>
      ]
    }
  ];

  const handleDelete = (id: string): void => {
    deleteNotificationTemplateApi({ id }).then(() => {
      actionRef.current?.reload();
    });
  };

  const getNotificationTemplateData = async (params: any) => {
    const param: SearchNotificationTemplateParams = {
      ...omit(params, ['current']),
      pageNum: params.current,
      pageSize: params.pageSize,
      sortField: params.columnKey,
      sortOrder: params.order,
      templateName: params.templateName?.trim()
    };
    const result = await searchNotificationTemplateApi(param);
    store.set(sessionKey, { ...param });
    return {
      data: result.data,
      success: true,
      total: result.total
    };
  };

  const onResetCallback = () => {
    store.set(sessionKey, {
      ...storage,
      associatedTenant: undefined,
      type: undefined
    });
  };

  return (
    <CustomProTable
      headerTitle={$t('Notification Template List')}
      searchTitle={$t('Search Notification Template')}
      columns={columns}
      actionRef={actionRef}
      request={getNotificationTemplateData}
      rowKey="id"
      rowSelection={false}
      pagination={{ current: storage?.pageNum, pageSize: storage?.pageSize }}
      sorter={{ columnKey: storage?.sortField, order: storage?.sortOrder }}
      initParams={[
        { name: 'associatedTenant', value: undefined as unknown as string }
      ]}
      onResetCallback={onResetCallback}
      toolBarRender={() => [
        <Button
          onClick={() => {
            navigate('./edit-notification-template');
            store.set('FIRST_LEVEL_STORAGE', { isEdit: false });
          }}
          key="createTemplate"
          type="primary"
        >
          <Icon type="PlusOutlined" />
          {$t('Create Template')}
        </Button>
      ]}
    />
  );
}
