import { useTranslation } from 'react-i18next';
import crc32 from 'crc/crc32';

export const useTranslations = () => {
  const { t } = useTranslation();
  const $t = (key: string, params?: any[]): string => {
    const hashKey = `K${crc32(key).toString(16)}`; // 将中文转换成crc32格式去匹配对应的json语言包
    let words = t(hashKey);
    if (words === hashKey) {
      words = key;
    }

    if (Array.isArray(params)) {
      const reg = /\((\d)\)/g;
      words = words.replace(reg, (a: string, b: number) => {
        return params[b];
      });
    }
    return words;
  };

  return $t;
};
