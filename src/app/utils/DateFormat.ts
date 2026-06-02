export const getRealDate = (doc: string) => {
  let docString = doc.toString();
  let year = docString.slice(0, 4);

  let allMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month: number = Number(docString.slice(5, 7));
  let day = docString.slice(8, 10);
  let realMonth = allMonths[month - 1];
  return `${day}/${realMonth}/${year}`;
};
