import Icon from '@/components/Icons';
import { Dropdown, Typography, Flex } from 'antd';
import { setLanguage, selectLanguage } from '@/store/reducer/langSlice';
import i18n from '@/locales';

const { Text } = Typography;

const items = [
  {
    key: 'cn',
    label: '简体中文'
  },
  {
    key: 'hk',
    label: '繁體中文'
  },
  {
    key: 'en',
    label: 'English'
  }
];

const LanguageSetting = () => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(selectLanguage);
  const langLabel = items.find((item) => item?.key === lang)?.label;

  return (
    <Dropdown
      arrow
      placement="bottomRight"
      menu={{
        items,
        selectable: true,
        defaultSelectedKeys: [lang],
        onClick: (e) => {
          const { key } = e;
          dispatch(setLanguage(key));
          i18n.changeLanguage(key);
        }
      }}
    >
      <Flex style={{ userSelect: 'none' }}>
        <Icon
          type="TranslationOutlined"
          style={{ fontSize: 18, margin: '0 8px' }}
        />
        <Text>{langLabel}</Text>
      </Flex>
    </Dropdown>
  );
};
export default memo(LanguageSetting);
