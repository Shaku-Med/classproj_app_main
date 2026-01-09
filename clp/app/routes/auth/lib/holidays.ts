/**
 * Holiday definitions with dates
 */
export interface Holiday {
  name: string;
  date: Date;
  greeting: string;
}

/**
 * Get all possible holidays for the current year
 */
function getAllHolidays(year: number): Holiday[] {
  const holidays: Holiday[] = [];

  // Fixed date holidays
  holidays.push({
    name: "New Year's Day",
    date: new Date(year, 0, 1),
    greeting: "Happy New Year! 🎉"
  });

  holidays.push({
    name: "Valentine's Day",
    date: new Date(year, 1, 14),
    greeting: "Happy Valentine's Day! 💝"
  });

  holidays.push({
    name: "St. Patrick's Day",
    date: new Date(year, 2, 17),
    greeting: "Happy St. Patrick's Day! ☘️"
  });

  holidays.push({
    name: "April Fool's Day",
    date: new Date(year, 3, 1),
    greeting: "Happy April Fool's Day! 😄"
  });

  holidays.push({
    name: "Earth Day",
    date: new Date(year, 3, 22),
    greeting: "Happy Earth Day! 🌍"
  });

  holidays.push({
    name: "Mother's Day",
    date: getNthSundayOfMonth(year, 4, 2), // Second Sunday of May
    greeting: "Happy Mother's Day! 💐"
  });

  holidays.push({
    name: "Memorial Day",
    date: getLastMondayOfMonth(year, 4), // Last Monday of May
    greeting: "Memorial Day - Remembering those who served 🇺🇸"
  });

  holidays.push({
    name: "Father's Day",
    date: getNthSundayOfMonth(year, 5, 3), // Third Sunday of June
    greeting: "Happy Father's Day! 👔"
  });

  holidays.push({
    name: "Independence Day",
    date: new Date(year, 6, 4),
    greeting: "Happy Independence Day! 🇺🇸"
  });

  holidays.push({
    name: "Labor Day",
    date: getFirstMondayOfMonth(year, 8), // First Monday of September
    greeting: "Happy Labor Day! 👷"
  });

  holidays.push({
    name: "Halloween",
    date: new Date(year, 9, 31),
    greeting: "Happy Halloween! 🎃"
  });

  holidays.push({
    name: "Veterans Day",
    date: new Date(year, 10, 11),
    greeting: "Happy Veterans Day! Thank you for your service 🇺🇸"
  });

  holidays.push({
    name: "Thanksgiving",
    date: getNthThursdayOfMonth(year, 10, 4), // Fourth Thursday of November
    greeting: "Happy Thanksgiving! 🦃"
  });

  holidays.push({
    name: "Christmas Eve",
    date: new Date(year, 11, 24),
    greeting: "Merry Christmas Eve! 🎄"
  });

  holidays.push({
    name: "Christmas",
    date: new Date(year, 11, 25),
    greeting: "Merry Christmas! 🎄"
  });

  holidays.push({
    name: "New Year's Eve",
    date: new Date(year, 11, 31),
    greeting: "Happy New Year's Eve! 🎊"
  });

  // Additional holidays
  holidays.push({
    name: "Martin Luther King Jr. Day",
    date: getNthMondayOfMonth(year, 0, 3), // Third Monday of January
    greeting: "Honoring Martin Luther King Jr. Day ✊"
  });

  holidays.push({
    name: "Presidents' Day",
    date: getNthMondayOfMonth(year, 1, 3), // Third Monday of February
    greeting: "Happy Presidents' Day! 🇺🇸"
  });

  holidays.push({
    name: "Easter",
    date: calculateEaster(year),
    greeting: "Happy Easter! 🐰"
  });

  holidays.push({
    name: "Cinco de Mayo",
    date: new Date(year, 4, 5),
    greeting: "Happy Cinco de Mayo! 🇲🇽"
  });

  holidays.push({
    name: "Juneteenth",
    date: new Date(year, 5, 19),
    greeting: "Happy Juneteenth! ✊"
  });

  holidays.push({
    name: "Columbus Day",
    date: getNthMondayOfMonth(year, 9, 2), // Second Monday of October
    greeting: "Happy Columbus Day! 🚢"
  });

  holidays.push({
    name: "Hanukkah",
    date: calculateHanukkah(year),
    greeting: "Happy Hanukkah! 🕎"
  });

  holidays.push({
    name: "Kwanzaa",
    date: new Date(year, 11, 26),
    greeting: "Happy Kwanzaa! 🕯️"
  });

  return holidays;
}

/**
 * Get today's holiday if any
 */
export function getTodayHoliday(): Holiday | null {
  const today = new Date();
  const year = today.getFullYear();
  const holidays = getAllHolidays(year);
  
  // Also check next year's holidays for New Year's
  const nextYearHolidays = getAllHolidays(year + 1);
  const allHolidays = [...holidays, ...nextYearHolidays];

  const todayString = today.toDateString();
  
  for (const holiday of allHolidays) {
    if (holiday.date.toDateString() === todayString) {
      return holiday;
    }
  }
  
  return null;
}

// Helper functions for calculating variable date holidays

function getNthMondayOfMonth(year: number, month: number, n: number): Date {
  const firstDay = new Date(year, month, 1);
  const firstMonday = (8 - firstDay.getDay()) % 7 || 7;
  const date = firstMonday + (n - 1) * 7;
  return new Date(year, month, date);
}

function getNthSundayOfMonth(year: number, month: number, n: number): Date {
  const firstDay = new Date(year, month, 1);
  const firstSunday = (7 - firstDay.getDay()) % 7 || 7;
  const date = firstSunday + (n - 1) * 7;
  return new Date(year, month, date);
}

function getNthThursdayOfMonth(year: number, month: number, n: number): Date {
  const firstDay = new Date(year, month, 1);
  const firstThursday = (4 - firstDay.getDay() + 7) % 7 || 7;
  const date = firstThursday + (n - 1) * 7;
  return new Date(year, month, date);
}

function getFirstMondayOfMonth(year: number, month: number): Date {
  return getNthMondayOfMonth(year, month, 1);
}

function getLastMondayOfMonth(year: number, month: number): Date {
  const lastDay = new Date(year, month + 1, 0);
  const dayOfWeek = lastDay.getDay();
  const daysToSubtract = (dayOfWeek === 1 ? 0 : (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  return new Date(year, month, lastDay.getDate() - daysToSubtract);
}

function calculateEaster(year: number): Date {
  // Anonymous Gregorian algorithm
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function calculateHanukkah(year: number): Date {
  // Hanukkah starts on the 25th of Kislev (approximately late November to late December)
  // This is a simplified calculation - actual dates vary by Hebrew calendar
  // For simplicity, we'll use December 1st as an approximation
  // In a production app, you'd want to use a proper Hebrew calendar library
  return new Date(year, 11, 1);
}
