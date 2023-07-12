export const convertType = (type: Set<string> | undefined) => {
  return type
    ? Array.from(type as unknown as Set<string>)[0].split('#')[0]
    : undefined;
};
