export const montageUnitMB = (data: string): string => {
  const result = (Number(data) / (1024 * 1024)).toFixed(2);
  return `${result} MB`;
};
