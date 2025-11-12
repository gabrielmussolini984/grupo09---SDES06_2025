export const stripUndefined = <T>(obj: T): Partial<T> => {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== undefined && value !== ""
    )
  ) as Partial<T>;
};
