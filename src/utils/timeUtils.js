// check whether current time is past 9am or not
export const isLate = (now) => {
  const compare = new Date();
  compare.setHours(9, 0, 0, 0);
  return now > compare;
};

// calculating the minutes late based on time arrived vs 9am
export const getMinutesLate = (now) => {
  const nine = new Date();
  nine.setHours(9, 0, 0, 0);
  const diff = (now - nine) / (1000 * 60);
  return Math.max(0, Math.floor(diff));
};

// date-only string utility, if need to query by date
export const getTodayDate = () => {
  const now = new Date();
  return now.toISOString().split("T")[0];
};
