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

// 获取当前年份,(例如：2024)
export const currentYear = () => {
  return new Date().getFullYear();
};

// 获取当前年份的第一天（例如：2024-01-01）
export const startOfYear = () => {
  const date = new Date(currentYear(), 0, 1); // 获取当前年份的第一天
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 获取月份，确保为2位
  const day = String(date.getDate()).padStart(2, "0"); // 获取日期，确保为2位
  return `${year}-${month}-${day}`; // 格式化为 "YYYY-MM-DD"
};

// 获取当前年份的最后一天（例如：2024-12-31）
export const endOfYear = () => {
  const date = new Date(currentYear(), 11, 31); // 获取当前年份的最后一天
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 获取月份，确保为2位 const day = String(date.getDate()).padStart(2, "0"); // 获取日期，确保为2位 return `${year}-${month}-${day}`; // 格式化为 "YYYY-MM-DD"
  const day = String(date.getDate()).padStart(2, "0"); // 获取日期，确保为2位
  return `${year}-${month}-${day}`; // 格式化为 "YYYY-MM-DD"
};

// 获取去年的第一天（例如：2023-01-01）
export const startOfLastYear = () => {
  const date = new Date(currentYear(), 0, 1); // 获取当前年份的第一天
  const year = date.getFullYear() - 1;
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 获取月份，确保为2位
  const day = String(date.getDate()).padStart(2, "0"); // 获取日期，确保为2位
  return `${year}-${month}-${day}`; // 格式化为 "YYYY-MM-DD"
};

// 获取去年的最后一天（例如：2023-12-31）
export const endOfLastYear = () => {
  const date = new Date(currentYear(), 11, 31); // 获取当前年份的最后一天
  const year = date.getFullYear() - 1;
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 获取月份，确保为2位 const day = String(date.getDate()).padStart(2, "0"); // 获取日期，确保为2位 return `${year}-${month}-${day}`; // 格式化为 "YYYY-MM-DD"
  const day = String(date.getDate()).padStart(2, "0"); // 获取日期，确保为2位
  return `${year}-${month}-${day}`; // 格式化为 "YYYY-MM-DD"
};
