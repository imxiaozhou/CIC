import { useNavigate } from 'react-router-dom';
import { Favorites } from '@/components/business';
import { MessageStorageQuotaItem } from '@/types/business';
import {
  adjustMessageStorageQuota,
  getMessageStorageDef
} from '@/services/system-configurations';
import { Spin } from 'antd';
import { MaintainUserSettingItem } from '../type';
import { CustomModal } from '@/components/proComponents';
import AdjustMailboxStorageQuota from './AdjustMailboxStorageQuota';

const AdjustUserMessageStorageQuota = () => {
  const store = useStorage();
  const state = store.get('FIRST_LEVEL_STORAGE');
  const navigate = useNavigate();
  const [adjustMessageData, setAdjustMessageData] =
    useState<MessageStorageQuotaItem>();
  const [successVisible, setSuccessVisible] = useState(false);
  const handleUpdate = async (fields: MessageStorageQuotaItem) => {
    const userIds = fields.selectedGroup?.map((item) => item.value);
    const { number: number1, unit: unit1 } = fields.warningLevel;
    const { number: number2, unit: unit2 } = fields.cannotSendLimit;
    const { number: number3, unit: unit3 } = fields.cannotReceiveLimit;
    const param = {
      userIds,
      warningLevel: { [number1]: unit1 },
      sendLimit: { [number2]: unit2 },
      receiveLimit: { [number3]: unit3 }
    };
    await adjustMessageStorageQuota(param).then((res) => {
      if (res.status.code === 0) setSuccessVisible(true);
    });
  };

  const initData = async () => {
    const selectedGroup = state?.map((item: MaintainUserSettingItem) => {
      return { label: item.displayName, value: item.userId };
    });
    // detail数据：选一个的话state从table带过去，选多个调详情接口查默认值
    if (state?.length === 1) {
      const item = state[0];
      const warningLevel = item.warningLevel?.slice(0, -2);
      const sendLimit = item.sendLimit?.slice(0, -2);
      const receiveLimit = item.receiveLimit?.slice(0, -2);
      const getInitData = {
        selectedGroup,
        warningLevel: { number: Number(warningLevel), unit: 'GB' },
        cannotSendLimit: { number: Number(sendLimit), unit: 'GB' },
        cannotReceiveLimit: { number: Number(receiveLimit), unit: 'GB' }
      };
      setAdjustMessageData(getInitData);
    } else {
      const param = state?.map((item: MaintainUserSettingItem) => item.userId);
      const res = await getMessageStorageDef(param);
      const { warningLevel, sendLimit, receiveLimit } = res.data;
      const getInitData = {
        selectedGroup,
        warningLevel: { number: Number(warningLevel), unit: 'GB' },
        cannotSendLimit: { number: Number(sendLimit), unit: 'GB' },
        cannotReceiveLimit: { number: Number(receiveLimit), unit: 'GB' }
      };
      setAdjustMessageData(getInitData);
    }
  };

  useEffect(() => {
    initData();
  }, []);
  $t('Adjust Mailbox Storage Quota');
  return (
    <>
      <Favorites
        code="FD-S-SYS-002"
        label={$t('Maintain User Setting of Mailbox Storage Quota')}
      />
      {adjustMessageData ? (
        <AdjustMailboxStorageQuota
          data={adjustMessageData}
          onUpdate={handleUpdate}
        />
      ) : (
        <Spin spinning={!adjustMessageData} />
      )}

      <CustomModal
        open={successVisible}
        title={$t('Mailbox Storage Quota is updated successfully')}
        type="info"
        okText={$t('Ok')}
        onOk={() => navigate(-1)}
        onCancel={() => setSuccessVisible(false)}
      />
    </>
  );
};

export default AdjustUserMessageStorageQuota;
