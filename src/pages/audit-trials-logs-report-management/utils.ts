import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

export const montageUnitKB = (data: string, fixed = 2): string => {
  const result = (Number(data) / 1024).toFixed(fixed);
  return data ? `${result} KB` : '-';
};
export const montageUnitGB = (data: string): string => {
  const result = (Number(data) / (1024 * 1024 * 1024)).toFixed(2);
  return `${result} GB`;
};

export const montageUnitS = (data: string): string => {
  const result = (Number(data) / 1000).toFixed(1);
  return data ? `${result} s` : '-';
};

export const getRecentThreeMonth = () => {
  // 获取今天的日期
  const today = dayjs();

  // 计算3个月前的日期
  const threeMonthsAgo = today.subtract(3, 'month');

  // 获取3个月前的月份的第一天
  const startOfMonthThreeMonthsAgo = threeMonthsAgo.startOf('month');

  // 获取今天的月份的最后一天
  const endOfMonthToday = today.endOf('month');

  return [startOfMonthThreeMonthsAgo, endOfMonthToday];
};

export const getCompleteTimePeriod = (monthsArray: string[]) => {
  const convertedArray = monthsArray.map((monthString, index) => {
    const month = dayjs(monthString);
    if (index === 0) {
      // 开始日期，设置为该月的第一天
      return month.startOf('month');
    } else {
      // 结束日期，设置为该月的最后一天
      return month.endOf('month');
    }
  });
  return convertedArray;
};
