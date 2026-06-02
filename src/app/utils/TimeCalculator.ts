export let timeCalc = (miliseconds: number) => {
  let currMs = Date.now();
  let difference = currMs - miliseconds;
  if (difference >= 946080000000) {
    let yearsDiff = Math.ceil(difference / 946080000000);
    return `${yearsDiff} years ago`;
  }
  if (difference >= 2592000000) {
    let monthsDiff = Math.ceil(difference / 2592000000);
    return `${monthsDiff} months ago`;
  }
  if (difference >= 86400000) {
    let daysDiff = Math.ceil(difference / 86400000);
    return `${daysDiff} days ago`;
  }
  if (difference >= 3600000) {
    let hoursDiff = Math.ceil(difference / 3600000);
    return `${hoursDiff} hours ago`;
  }
  if (difference >= 60000) {
    let minutesDiff = Math.ceil(difference / 60000);
    return `${minutesDiff} minutes ago`;
  }
  if (difference >= 1000) {
    let secondsDiff = Math.ceil(difference / 1000);
    return `${secondsDiff} seconds ago`;
  }
  if (difference >= 0) {
    return `0 seconds ago`;
  }
};
