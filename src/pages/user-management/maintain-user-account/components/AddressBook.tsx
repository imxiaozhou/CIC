import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Typography, Modal } from 'antd';
import { omit } from 'lodash-es';
import Icon from '@/components/Icons';
import { CustomProTable, SelectSearchable } from '@/components/proComponents';
import { AddressBookItem, AddressBookProps } from '../type';
import { modalProps } from '@/config/common';
import { searchAddressBook, addAddressBook } from '@/services/user-management';

const { Title } = Typography;

const AddressBook = ({ onAdd }: AddressBookProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const userInfo = useAppSelector(selectUserInfo);

  const getDataSource = async (params: any) => {
    const { data, total } = await searchAddressBook({
      displayName: params?.displayName?.trim(),
      firstName: params?.firstName?.trim(),
      lastName: params?.lastName?.trim(),
      emailAddress: params?.emailAddress?.trim(),
      phoneNumber: params?.phoneNumber?.trim(),
      faxNumber: params?.faxNumber?.trim(),
      location: params?.location?.trim(),
      position: params?.position?.trim(),
      rank: params?.rank?.trim(),
      substantiveRank: params?.substantiveRank?.trim(),
      title: params?.title?.trim(),
      unit: params?.unit?.trim(),
      tenantName: params?.tenantName,
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

  const handleAddUser = async (record: AddressBookItem) => {
    const isAddExist = await addAddressBook(record.emailAddress);
    if (isAddExist) {
      notification.error({
        message: $t('The user is already a SMA user. Please check.')
      });
    } else {
      setIsModalOpen(false);
      onAdd(omit(record, 'id'));
    }
  };

  const columns: ProColumns<AddressBookItem>[] = [
    {
      title: $t('Display Name'),
      dataIndex: 'displayName',
      width: 140,
      fixed: 'left',
      sorter: true
    },
    {
      title: $t('First Name'),
      dataIndex: 'firstName',
      sorter: true
    },
    {
      title: $t('Last Name'),
      dataIndex: 'lastName',
      sorter: true
    },
    {
      title: $t('Email Address'),
      dataIndex: 'emailAddress',
      sorter: true
    },
    {
      title: $t('Phone Number'),
      dataIndex: 'phoneNumber',
      sorter: true
    },
    {
      title: $t('Fax Number'),
      dataIndex: 'faxNumber',
      sorter: true
    },
    {
      title: $t('Location'),
      dataIndex: 'location',
      sorter: true
    },
    {
      title: $t('Position'),
      dataIndex: 'position',
      sorter: true
    },
    {
      title: $t('Rank'),
      dataIndex: 'rank',
      sorter: true
    },
    {
      title: $t('Substantive Rank'),
      dataIndex: 'substantiveRank',
      sorter: true
    },
    {
      title: $t('Title'),
      dataIndex: 'title',
      sorter: true
    },
    {
      title: $t('Unit'),
      dataIndex: 'unit',
      sorter: true
    },
    {
      title: $t('Tenant Name'),
      dataIndex: 'tenantName',
      initialValue: userInfo.tenantName,
      order: 1,
      sorter: true,
      renderFormItem(schema, config, form, action) {
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
      }
    },
    {
      title: $t('Action'),
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 80,
      render: (_, record) => [
        <Button key="add" type="link" onClick={() => handleAddUser(record)}>
          {$t('Add')}
        </Button>
      ]
    }
  ];

  return (
    <>
      <Button type="primary" ghost onClick={() => setIsModalOpen(true)}>
        <Icon type="FileSearchOutlined" />
        {$t('Search From Address Book')}
      </Button>
      {isModalOpen && (
        <Modal
          {...modalProps}
          width="80%"
          footer={false}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
        >
          <Title
            level={4}
            className="text-center"
            style={{ paddingTop: '16px' }}
          >
            {$t('Address Book')}
          </Title>
          <CustomProTable
            columns={columns}
            rowSelection={false}
            headerTitle={$t('Search Result')}
            searchTitle={$t('Search User')}
            actionRef={actionRef}
            rowKey="id"
            request={getDataSource}
          />
        </Modal>
      )}
    </>
  );
};
export default AddressBook;
