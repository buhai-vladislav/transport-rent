export const getDateDiffInMinutes = (
  startDate: Date,
  endDate: Date,
): number => {
  const diff = endDate.getTime() - startDate.getTime();
  return diff / (1000 * 60);
};
