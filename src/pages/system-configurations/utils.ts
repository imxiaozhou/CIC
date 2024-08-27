import { keys } from 'lodash-es';

const enumsGB = [
  'warningLevel',
  'cannotReceiveLimit',
  'cannotSendLimit',
  'sendLimit',
  'receiveLimit'
];
export const formatAddBG = (data = []) => {
  const list = data?.map((item: any) => {
    keys(item).forEach((k) => {
      item[k] && enumsGB.includes(k) && (item[k] = item[k] + 'GB');
    });
    return item;
  });
  return list;
};
