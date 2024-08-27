import { FilterIconProps } from '../type';
import Icon from '@/components/Icons';

export const FilterIcon = ({ filtered }: Readonly<FilterIconProps>) => {
  const themeColor = useAppSelector(selectThemeColor);

  return (
    <Icon
      type="SearchOutlined"
      style={{ color: filtered ? themeColor : undefined }}
    />
  );
};
