import {
  CustomFormButton,
  CustomModal,
  CustomProTable,
  CustomProTableTheme
} from '@/components/proComponents';
import { type ProColumns, type Key } from '@ant-design/pro-components';
import { Flex, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { OptInAndOutColumns } from '../types';
import { difference, omit, union } from 'lodash-es';
import './protable.less';
import { InOrOut } from '../utils';
import { Favorites } from '@/components/business';
import {
  editsearchOptInOut,
  searchOptInOut
} from '@/services/notification-management';
import { sortFun } from '@/utils';
import { ItemProps } from '@/services/notification-management/opt-in-out-notification/type';
import CustomCancelButton from '@/components/proComponents/CustomCancelButton';

const EditDeviceOptIn = () => {
  const { Text } = Typography;
  const navigate = useNavigate();
  const store = useStorage();
  const state = store.get('FIRST_LEVEL_STORAGE');

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [keyState, setKeyState] = useState<any>({});
  const [dataSource, setDataSource] = useState<OptInAndOutColumns[]>([]);
  const [successVisible, setSuccessVisible] = useState(false);
  const columns: ProColumns<any>[] = [
    {
      title: $t('Device Opt-in'),
      dataIndex: 'deviceOptin',
      sorter: {
        compare: (a, b) => sortFun(a, b, 'deviceOptin')
      },
      render: () => null
    },
    {
      title: $t('Tenant Name'),
      dataIndex: 'tenantName',
      sorter: {
        compare: (a, b) => sortFun(a, b, 'tenantName')
      }
    },
    {
      title: $t('User Name'),
      dataIndex: 'userName',
      sorter: {
        compare: (a, b) => sortFun(a, b, 'userName')
      }
    },
    {
      title: $t('Email Group'),
      dataIndex: 'emailGroup',
      sorter: {
        compare: (a, b) => sortFun(a, b, 'emailGroup')
      }
    },
    {
      title: $t('Email'),
      dataIndex: 'email',
      sorter: {
        compare: (a, b) => sortFun(a, b, 'email')
      }
    },
    {
      title: $t('Device ID'),
      dataIndex: 'deviceID',
      sorter: {
        compare: (a, b) => sortFun(a, b, 'deviceID')
      }
    },
    {
      title: $t('Model'),
      dataIndex: 'model',
      sorter: {
        compare: (a, b) => sortFun(a, b, 'model')
      }
    },
    {
      title: $t('Version'),
      dataIndex: 'version',
      sorter: {
        compare: (a, b) => sortFun(a, b, 'version')
      }
    }
  ];

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleSave = () => {
    const param = dataSource.map((item) => {
      let obj = {};
      if (selectedRowKeys.includes(item.key)) {
        obj = { key: Number(item.key), deviceOptin: 'Y' };
      } else {
        obj = { key: Number(item.key), deviceOptin: 'N' };
      }
      return obj as ItemProps;
    });
    editsearchOptInOut(param).then(() => setSuccessVisible(true));
  };
  const inAndOutLength = () => {
    const aIn: Key[] = [];
    const aOut: Key[] = [];
    for (const key in keyState) {
      if (selectedRowKeys.includes(Number(key))) {
        aIn.push(key);
      } else {
        aOut.push(key);
      }
    }
    return { aIn, aOut };
  };
  const tableAlertRender = () => {
    const { aIn, aOut } = inAndOutLength();
    return (
      <Space>
        <Text>{$t('(0) Items Opt-in', [aIn.length])}</Text>
        <Text>|</Text>
        <Text>{$t('(0) Items Opt-out', [aOut.length])}</Text>
      </Space>
    );
  };

  const actionsBtn = [
    <Flex key="footer" justify="flex-end">
      <CustomCancelButton style={{ marginRight: '8px' }}>
        {$t('Cancel')}
      </CustomCancelButton>
      <CustomFormButton onConfirm={handleSave} title={$t('Confirm to save?')}>
        {$t('Save')}
      </CustomFormButton>
    </Flex>
  ];

  const handleSelect = (
    inorout: string,
    allFlag: boolean,
    changeableRowKeys: Key[]
  ) => {
    const keysData = allFlag
      ? Object.keys(keyState).map((v) => Number(v))
      : [...changeableRowKeys];
    let copySelectedRowKeys = [...selectedRowKeys];
    let newSelectedRowKeys = [];
    newSelectedRowKeys = keysData.filter((_) => inorout === InOrOut.in);
    let arr: Key[] = [];
    if (allFlag) {
      arr = newSelectedRowKeys;
    } else {
      // 当前页选中处理
      arr =
        inorout === InOrOut.in
          ? union(copySelectedRowKeys, newSelectedRowKeys)
          : difference(copySelectedRowKeys, changeableRowKeys);
    }
    setSelectedRowKeys(arr);
  };

  // 不传对应参数，一次获取所有数据，前端分页sort
  const getDataSource = async () => {
    const param = {
      ...omit(state, ['current', 'pageSize']),
      userName: state.userName?.trim(),
      emailGroup: state.emailGroup?.trim()
    };
    const { data } = await searchOptInOut(param);
    const oKey: any = {};
    const defaultSelectKey: string[] = [];
    data.forEach((item: any) => {
      oKey[item.key] = item.deviceOptin;
      if (item.deviceOptin === 'Y') {
        defaultSelectKey.push(item.key);
      }
    });
    setKeyState(oKey);
    setDataSource(data);
    setSelectedRowKeys(defaultSelectKey);
  };

  useEffect(() => {
    getDataSource();
  }, []);

  return (
    <CustomProTableTheme>
      <Favorites
        code="FD-S-NTM-004"
        label={$t('Opt-in/Opt-out Notification')}
      />
      <CustomProTable
        className="protable-card-actions"
        columns={columns}
        headerTitle={$t('Edit Device Opt-in')}
        rowKey="key"
        rowSelection={{
          selections: [
            {
              key: 'select_opt_in',
              text: $t('Opt-in All on this Page'),
              onSelect: (changeableRowKeys: any) =>
                handleSelect(InOrOut.in, false, changeableRowKeys)
            },
            {
              key: 'select_opt_out',
              text: $t('Opt-out All on this Page'),
              onSelect: (changeableRowKeys: any) =>
                handleSelect(InOrOut.out, false, changeableRowKeys)
            },
            {
              key: 'select_opt_all_in',
              text: $t('Opt-in All Pages'),
              onSelect: () => handleSelect(InOrOut.in, true, [])
            },
            {
              key: 'select_opt_all_out',
              text: $t('Opt-out All Pages'),
              onSelect: () => handleSelect(InOrOut.out, true, [])
            }
          ],
          selectedRowKeys,
          alwaysShowAlert: true,
          onChange: onSelectChange
        }}
        tableAlertOptionRender={false}
        tableAlertRender={tableAlertRender}
        cardProps={{ actions: actionsBtn }}
        dataSource={dataSource}
        search={false}
      />
      <CustomModal
        open={successVisible}
        title={$t('Edit Device Opt-in saved successfully.')}
        type="info"
        okText={$t('Ok')}
        onOk={() => navigate(-1)}
      />
    </CustomProTableTheme>
  );
};

export default EditDeviceOptIn;
