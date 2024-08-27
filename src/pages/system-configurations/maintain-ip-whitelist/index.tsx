import { Button, Flex, Space, Typography, Form } from 'antd';
import { ActionType, ProColumns, ModalForm } from '@ant-design/pro-components';
import { modalProps } from '@/config/common';
import {
  CustomModal,
  CustomProTable,
  CustomProTableTheme,
  TagStatus
} from '@/components/proComponents';
import { Favorites } from '@/components/business';
import {
  getMaintainIpWhiteList,
  updateMaintainIpWhiteList,
  delMaintainIpWhiteList
} from '@/services/system-configurations/maintain-ip-whitelist';
import Icon from '@/components/Icons';
import {
  MaintainIpWhiteResponse,
  MaintainIpWhiteUpdateParams
} from '@/services/system-configurations/maintain-ip-whitelist/type';
import AddIPWhitelistForm from './components/AddIpWhiteList';

const { Title } = Typography;

const redButtonStyle = {
  color: 'red',
  border: 'none'
};

const getDataSource = async (params: any) => {
  const { data, total } = await getMaintainIpWhiteList({
    pageNum: params.current,
    pageSize: params.pageSize,
    sortField: params.columnKey,
    sortOrder: params.order
  });

  return {
    data,
    success: true,
    total
  };
};

const MaintainIPWhitelist: React.FC = () => {
  const [form] = Form.useForm<MaintainIpWhiteUpdateParams>();
  const actionRef = useRef<ActionType>();
  const userInfo = useAppSelector(selectUserInfo);
  const [actionType, setActionType] = useState<'Add' | 'Update' | null>(null);
  const [updateIsOpen, setUpdateIsOpen] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<MaintainIpWhiteResponse>();
  const [delId, setDelId] = useState<string>('');
  const $t = useTranslations();

  const columns: ProColumns<MaintainIpWhiteResponse>[] = [
    {
      title: $t('IP Address'),
      dataIndex: 'ipAddress',
      sorter: true,
      search: false
    },
    {
      title: $t('Remark'),
      dataIndex: 'remark',
      sorter: true,
      search: false
    },
    {
      title: $t('Status'),
      dataIndex: 'status',
      sorter: true,
      search: false,
      render: (_, record) => (
        <TagStatus status={record.status as string}>
          {record.statusLabel}
        </TagStatus>
      )
    },
    {
      title: $t('Action'),
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      fixed: 'right',
      render: (_, record) => [
        <Space key="actionBtn">
          <Button type="link" onClick={() => handleUpdate(record)}>
            {$t('Update')}
          </Button>
          <Button
            style={redButtonStyle}
            type="link"
            onClick={() => handleDelete(record.id)}
          >
            {$t('Delete')}
          </Button>
        </Space>
      ]
    }
  ];

  const handleAddIpWhiteList = (): void => {
    setActionType('Add');
    setUpdateIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    setVisible(true);
    setDelId(id);
  };

  const onDelData = async () => {
    const result = await delMaintainIpWhiteList({
      id: delId,
      userId: userInfo?.userId as string
    });
    if (result.status.code === 0) {
      setVisible(false);
      notification.success({
        message: $t('Deleted Successfully')
      });
      actionRef?.current?.reload();
    }
  };

  const handleUpdate = (record: MaintainIpWhiteResponse): void => {
    setActionType('Update');
    setUpdateIsOpen(true);
    form.setFieldsValue({
      ...record,
      status: record.status === 'ACTIVE'
    });
    setCurrentRecord(record);
  };

  const handleSubmitConfirm = async () => {
    const values = form.getFieldsValue();
    const result = await updateMaintainIpWhiteList({
      ...values,
      id: actionType === 'Update' ? currentRecord?.id : undefined,
      status: values.status ? 'ACTIVE' : 'DISABLE',
      userId: userInfo?.userId
    });

    if (result.status.code === 0) {
      setUpdateIsOpen(false);
      notification.success({
        message: `${
          actionType === 'Add'
            ? $t('Added Successfully')
            : $t('Updated Successfully')
        }`
      });
      actionRef?.current?.reload();
    }
  };

  const handleCloseConfirm = () => {
    setUpdateIsOpen(false);
    form.resetFields();
  };

  return (
    <>
      <CustomProTableTheme>
        <Favorites code="FD-S-SYS-006" label={$t('Maintain IP Whitelist')} />
        <CustomProTable
          actionRef={actionRef}
          columns={columns}
          headerTitle={$t('Maintain IP Whitelist for Admin Portal')}
          search={false}
          rowKey="id"
          rowSelection={false}
          toolBarRender={() => [
            <Button
              type="primary"
              icon={<Icon type="PlusOutlined" />}
              onClick={handleAddIpWhiteList}
              key="addIpWhitelist"
            >
              {$t('Add IP Whitelist')}
            </Button>
          ]}
          request={getDataSource}
        />
      </CustomProTableTheme>

      <ModalForm
        form={form}
        open={updateIsOpen}
        width={550}
        validateTrigger={['onFinish', 'onChange']}
        title={
          <Title level={4} style={{ textAlign: 'center' }}>
            {actionType === 'Add'
              ? $t('Add IP Whitelist')
              : $t('Update IP Whitelist')}
          </Title>
        }
        onFinish={handleSubmitConfirm}
        modalProps={{
          ...modalProps,
          onCancel: () => setUpdateIsOpen(false)
        }}
        submitter={{
          render: (props) => {
            return (
              <Flex gap="small" style={{ justifyContent: 'end' }}>
                <Button onClick={handleCloseConfirm}>{$t('Cancel')}</Button>
                <Button type="primary" onClick={() => props.form?.submit?.()}>
                  {$t('Save')}
                </Button>
              </Flex>
            );
          }
        }}
      >
        <AddIPWhitelistForm />
      </ModalForm>
      <CustomModal
        title={$t('Are you sure to Delete?')}
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={() => onDelData()}
        type="warning"
        okText={$t('Delete')}
      />
    </>
  );
};

export default MaintainIPWhitelist;
