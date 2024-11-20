// 返回当年日期
export const getDateOfOneYear = (givenYear?: string) => {
  let year = givenYear;
  if (!year) {
    year = new Date().getFullYear().toString();
  }
  // 根据年份判断是否是闰年
  const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };
  const dateArr = [];
  for (let i = 1; i <= 12; i++) {
    const days = isLeapYear(+year) ? 29 : 28;
    const month = i < 10 ? `0${i}` : i;
    for (let j = 1; j <= days; j++) {
      const day = j < 10 ? `0${j}` : j;
      dateArr.push(`${month}-${day}`);
    }
  }
  return dateArr;
};

// 返回近30天日期
export const getDateOfOneMonth = (givenDate: string) => {
  // const date = new Date();
  let date = new Date(givenDate);
  // 倒算30天
  date.setDate(date.getDate() - 30);
  const dateArr = [];
  for (let i = 0; i < 30; i++) {
    date.setDate(date.getDate() + 1);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    dateArr.push(`${month}-${day}`);
  }
  return dateArr;
};

// 返回近7天日期
export const getDateOfOneWeek = (givenDate: string) => {
  let date = new Date(givenDate);
  date.setDate(date.getDate() - 7);
  const dateArr = [];
  for (let i = 0; i < 7; i++) {
    date.setDate(date.getDate() + 1);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    dateArr.push(`${month}-${day}`);
  }
  return dateArr;
};

// 验证是否是日期格式
export const isValidDate = (date: string) => {
  return !isNaN(new Date(date).getTime());
};
