export const deadlineStatus = (deadDays: number, required: number): string => {
  if (required >= 0.85 * deadDays) {
    return `Critical`;
  } else if (required >= 0.65 * deadDays) {
    return `Approaching`;
  } else if (required >= 0.45 * deadDays) {
    return `Enough`;
  } else if (required >= 0.25 * deadDays) {
    return `More than enough`;
  } else return `Plenty`;
};
