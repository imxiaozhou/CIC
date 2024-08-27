import { Favorites, AdjustMessageStorageQuota } from '@/components/business';
import { MessageStorageQuotaItem } from '@/types/business';
import {
  adjustMessageStorageQuotaGroupApi,
  messageStorageQuotaGroupDetailApi
} from '@/services/system-configurations';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { CustomModal } from '@/components/proComponents';
import { EmailGroupItem } from '../type';

const AdjustGroupMessageParameters = () => {
  const navigate = useNavigate();
  const store = useStorage();
  const state = store.get('FIRST_LEVEL_STORAGE');

  const userInfo = useAppSelector(selectUserInfo);
  const [successVisible, setSuccessVisible] = useState(false);
  const [adjustMessageData, setAdjustMessageData] =
    useState<MessageStorageQuotaItem>();
  // reject(new Error('Failed to update message storage quota'))
  const handleUpdate = (fields: MessageStorageQuotaItem) => {
    const selectdGroup = fields.selectedGroup.map((item: LabelValue) => {
      return { id: item.value };
    });
    const param = {
      selectdGroup,
      warningLevel: fields?.warningLevel,
      cannotReceiveLimit: fields?.cannotReceiveLimit,
      cannotSendLimit: fields?.cannotSendLimit,
      userId: userInfo.id
    };
    adjustMessageStorageQuotaGroupApi(param).then((res) => {
      if (res.status.code === 0) setSuccessVisible(true);
    });
  };

  const initData = async () => {
    const selectedGroup = state?.map((item: EmailGroupItem) => {
      return { label: item.emailGroupName, value: item.id };
    });
    if (state?.length === 1) {
      const item = state[0];
      const warningLevel = item.warningLevel?.slice(0, -2);
      const cannotSendLimit = item.cannotSendLimit?.slice(0, -2);
      const cannotReceiveLimit = item.cannotReceiveLimit?.slice(0, -2);
      const getInitData = {
        selectedGroup,
        warningLevel: { number: Number(warningLevel), unit: 'GB' },
        cannotSendLimit: { number: Number(cannotSendLimit), unit: 'GB' },
        cannotReceiveLimit: { number: Number(cannotReceiveLimit), unit: 'GB' }
      };
      setAdjustMessageData(getInitData);
    } else {
      const param = state?.map((item: any) => item.id);
      const res = await messageStorageQuotaGroupDetailApi(param);
      const { warningLevel, cannotSendLimit, cannotReceiveLimit } = res.data;
      const getInitData = {
        selectedGroup,
        warningLevel: { number: Number(warningLevel.number), unit: 'GB' },
        cannotSendLimit: { number: Number(cannotSendLimit.number), unit: 'GB' },
        cannotReceiveLimit: {
          number: Number(cannotReceiveLimit.number),
          unit: 'GB'
        }
      };
      setAdjustMessageData(getInitData);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  return (
    <>
      <Favorites
        code="FD-S-SYS-003"
        label={$t('Maintain Group Setting of Mailbox Storage Quota')}
      />
      {adjustMessageData ? (
        <AdjustMessageStorageQuota
          selectedTitle="Email Group"
          data={adjustMessageData}
          onUpdate={handleUpdate}
        />
      ) : (
        <Spin spinning={!adjustMessageData} />
      )}

      <CustomModal
        open={successVisible}
        title={$t('Message Storage Quota is updated successfully')}
        type="info"
        okText={$t('Ok')}
        onOk={() => navigate(-1)}
        onCancel={() => setSuccessVisible(false)}
      />
    </>
  );
};

export default AdjustGroupMessageParameters;
