import { Rate, Space, Button, Typography } from 'antd';
import Icon from '@/components/Icons';
import { FavoritesType } from '@/types/business';
import { getFavoritesApi, toggleFavoritesApi } from '@/services/dashboard';

const { Text } = Typography;

const Favorites = ({ code = '', label }: FavoritesType) => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectUserInfo);
  const layoutMode = useAppSelector(selectLayoutMode);
  const [count, setCount] = useState(0);
  const collapsed = useAppSelector(selectCollapsed);

  const handleChange = async (value: number) => {
    const result = await toggleFavoritesApi({
      userId: userInfo.userId,
      functionCode: code,
      status: value
    });
    if (result.status.code === 0) {
      setCount(value);
      notification.success({
        message: value ? 'Add Successfully' : 'Cancel Successfully'
      });
    }
  };

  const getFavorites = async () => {
    const res = await getFavoritesApi({
      userId: userInfo.userId,
      functionCode: code
    });
    setCount(res?.data?.status);
  };

  useEffect(() => {
    getFavorites();
  }, []);

  return (
    <Space style={{ height: '32px', margin: '-6px 0 4px' }}>
      {layoutMode === 'sidemenu' && (
        <Button
          type="text"
          icon={<Icon type="MenuOutlined" />}
          onClick={() => dispatch(setCollapsed(!collapsed))}
        />
      )}

      {code ? (
        <>
          <Rate count={1} onChange={handleChange} value={count} />
          <Text className="text-secondary">{code}:</Text>
          <Text>{label}</Text>
        </>
      ) : (
        <Text>{label}</Text>
      )}
    </Space>
  );
};

export default Favorites;
