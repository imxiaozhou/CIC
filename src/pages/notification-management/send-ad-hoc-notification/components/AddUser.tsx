import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Typography, Modal, Flex } from 'antd';
import Icon from '@/components/Icons';
import { UserInfo } from '../type';
import { CustomProTable, SelectSearchable } from '@/components/proComponents';
import { showMultipleLabel } from '@/utils';
import { getUserRoleOptions } from '@/services/common';
import { searchSMAUser } from '@/services/user-management';

const { Title, Text } = Typography;

const getUserDataSource = async (params: any) => {
  const param = {
    ...params,
    pageNum: params.current,
    pageSize: params.pageSize,
    sortField: params.columnKey,
    sortOrder: params.order
  };
  const { data, total } = await searchSMAUser(param);

  return {
    data,
    success: true,
    total
  };
};
interface ILookProps {
  handleSelectUser: (user: LabelValue[]) => void;
}

const AddUser = (props: ILookProps) => {
  const actionRef = useRef<ActionType>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [record, setRecord] = useState<UserInfo[]>([]);
  const userInfo = useAppSelector(selectUserInfo);
  const [userRoleOptions, setUserRoleOptions] = useState<LabelValue[]>([]);

  const getUserRoles = async (): Promise<void> => {
    const options = await getUserRoleOptions();
    setUserRoleOptions(options);
  };

  useEffect(() => {
    getUserRoles();
  }, []);

  const columns: ProColumns<UserInfo>[] = [
    {
      title: $t('Display Name'),
      dataIndex: 'displayName',
      sorter: true
    },
    {
      title: $t('User Role'),
      dataIndex: 'userRole',
      sorter: true,
      render: (_, record) => showMultipleLabel(record.userRoleLabel),
      valueType: 'select',
      fieldProps: {
        options: userRoleOptions
      }
    },
    {
      title: $t('User Email'),
      dataIndex: 'emailAddress',
      ellipsis: true,
      sorter: true
    },
    {
      title: $t('Tenant Name'),
      dataIndex: 'tenantName',
      sorter: true,
      order: 1,
      initialValue: userInfo.tenantName,
      renderFormItem(schema, config, form) {
        return (
          <SelectSearchable
            defaultValue={[
              {
                label: userInfo.tenantNameLabel,
                value: userInfo.tenantName
              }
            ]}
            disabled={!userInfo.userRole!.includes('SUPER_ADM')}
            onValueChange={(newValue: LabelValue[]) => {
              form.setFieldsValue({
                tenantName: newValue[0]?.value
              });
            }}
          />
        );
      },

      render: (_, record) => <Text>{record.tenantNameLabel}</Text>
    }
  ];

  const handleChange = (_: any, selectedRows: UserInfo[]) => {
    setRecord(selectedRows);
  };

  const handleSave = () => {
    if (record.length > 0) {
      props.handleSelectUser(
        record.map((i) => ({ label: i.displayName, value: i.id }))
      );
      setIsModalOpen(false);
      setRecord([]);
    }
  };

  return (
    <>
      <Button
        ghost
        type="primary"
        onClick={() => {
          setIsModalOpen((isModalOpen) => !isModalOpen);
        }}
      >
        <Icon type="UserAddOutlined" />
        {$t('Add User')}
      </Button>

      {isModalOpen && (
        <Modal
          width={1012}
          footer={false}
          maskClosable={false}
          open={isModalOpen}
          styles={{
            body: {
              margin: '20px 24px 40px'
            }
          }}
          onCancel={() => setIsModalOpen(false)}
        >
          <Title
            level={4}
            className="text-center"
            style={{ paddingTop: '16px' }}
          >
            {$t('Add User to send Ad-hoc Notification')}
          </Title>
          <CustomProTable
            columns={columns}
            headerTitle={$t('Search Result')}
            searchTitle={$t('Search User')}
            actionRef={actionRef}
            cardBordered={false}
            rowKey="id"
            rowSelection={{
              type: 'checkbox',
              onChange: handleChange
            }}
            request={getUserDataSource}
          />
          <Flex justify="flex-end" style={{ marginTop: '5px' }}>
            <Button type="primary" onClick={handleSave}>
              {$t('Save')}
            </Button>
          </Flex>
        </Modal>
      )}
    </>
  );
};
export default AddUser;
