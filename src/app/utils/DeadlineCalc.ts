export const deadLineCalc = (deadLine: string): number => {
  let monthlyDays = [
    { month: "January", days: 31 },
    { month: "February", days: 28 },
    { month: "March", days: 31 },
    { month: "April", days: 30 },
    { month: "May", days: 31 },
    { month: "June", days: 30 },
    { month: "July", days: 31 },
    { month: "August", days: 31 },
    { month: "September", days: 30 },
    { month: "October", days: 31 },
    { month: "November", days: 30 },
    { month: "December", days: 31 },
  ];
  let deadStr = deadLine.toString();
  let yearOut = Number(deadStr.slice(0, 4));
  let monthOut = Number(deadStr.slice(5, 7));
  let dayOut = Number(deadStr.slice(8, 10));
  let currDate = new Date();
  let currDay = currDate.getDate();
  let currMonth = currDate.getMonth();
  let currYear = currDate.getFullYear();
  if (yearOut < currYear) {
    // console.log("Deadline passed");
    return 0;
  }
  if (yearOut == currYear) {
    if (monthOut < currMonth + 1) {
      // console.log("Deadline passed");
      return 0;
    }
    if (monthOut == currMonth + 1 && dayOut < currDay) {
      // console.log("Deadline passed");
      return 0;
    }
    if (monthOut == currMonth + 1 && dayOut >= currDay) {
      // console.log(`Curr month is ${currMonth} & monthOut is : ${monthOut}`);
      return dayOut - currDay;
    }
    let totalDays = monthlyDays[currMonth].days - currDay;
    if (monthOut == currMonth + 1 && dayOut > currDay) {
      //console.log(`Curr month is ${currMonth} & monthOut is : ${monthOut}`);
      return totalDays;
    }
    let additionalDays = 0;
    for (let i = currMonth + 1; i < monthOut - 1; i++) {
      additionalDays += monthlyDays[i].days;
      // console.log(
      //   monthlyDays[i].month + " has " + monthlyDays[i].days + " days",
      // );
    }
    totalDays = totalDays + additionalDays + dayOut;
    // console.log("Result :", totalDays);
    return totalDays;
  } else {
    let totalDays = dayOut + (monthlyDays[currMonth].days - currDay);
    // console.log("Initially total days : ", totalDays);
    let tempCurrYear = currYear;
    let firstVisit = true;
    let additionalDays = 0;
    while (tempCurrYear != yearOut) {
      if (firstVisit) {
        for (let i = currMonth + 1; i < 12; i++) {
          additionalDays += monthlyDays[i].days;
          // console.log(monthlyDays[i].month + " has " + monthlyDays[i].days + " days.");
          if (i == 11) {
            tempCurrYear++;
            // console.log("Year switched to:", tempCurrYear);
          }
        }
        firstVisit = false;
      } else {
        for (let i = 0; i < 12; i++) {
          additionalDays += monthlyDays[i].days;
          // console.log(monthlyDays[i].month + " has " + monthlyDays[i].days + " days.");
          if (i == 11) {
            tempCurrYear++;
            // console.log("Year switched to:", tempCurrYear);
          }
        }
      }
    }
    // console.log("Now year is : ", tempCurrYear);
    // console.log("And the additional days till now are : ", additionalDays);
    for (let i = 0; i < monthOut - 1; i++) {
      additionalDays += monthlyDays[i].days;
      // console.log(monthlyDays[i].month + " has " + monthlyDays[i].days + " days.");
    }
    totalDays += additionalDays;
    // console.log("Final result : ", totalDays);
    return totalDays;
  }
};
