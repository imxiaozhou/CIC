type StorageProps = {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
  remove: (key: string) => void;
  clearExcept: (key: string) => void;
  clearAll: () => void;
};

type FnStorage = ($storage?: Storage) => StorageProps;

export const useStorage: FnStorage = ($storage = sessionStorage) => {
  /**
   * 根据 key 值获取储存在 storage 中的值
   * @param key storage key
   */
  const get = (key: string) => {
    let value = $storage.getItem(key);
    try {
      value = JSON.parse(value as string);
      return value;
    } catch {
      return value;
    }
  };

  /**
   * 根据 key 值向 storage 中储存值
   * @param key storage key
   * @param value 需要储存在 storage 中的值
   */
  const set = (key: string, value: any) =>
    $storage.setItem(key, value ? JSON.stringify(value) : value);

  /**
   * 根据 key 值移除储存在 storage 中的值
   * @param key storage key
   */
  const remove = (key: string) => $storage.removeItem(key);

  /**
   * 移除除了 key 之外的所有储存在 storage 中的值
   * @param key storage key
   */
  const clearExcept = (key: string) => {
    for (let i = 0; i < $storage.length; i++) {
      const itemKey: string | null = $storage.key(i);
      if (itemKey && itemKey !== key) {
        $storage.removeItem(itemKey);
      }
    }
  };

  /**
   * 移除所有储存在 storage 中的值
   */
  const clearAll = () => $storage.clear();

  return {
    get,
    set,
    remove,
    clearExcept,
    clearAll
  };
};

export default useStorage;
