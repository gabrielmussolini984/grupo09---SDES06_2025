export const stripUndefined = <T>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== undefined && value !== ""
    )
  ) as Partial<T>;
};
