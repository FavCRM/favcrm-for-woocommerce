import dayjs from 'dayjs'

function getDayByMonth(month) {
  try {
    const days = dayjs(`${new Date().getUTCFullYear()}-${month ?? 'Jan'}-01`, `yyyy-MMM-dd`).daysInMonth();
    return Array(days).fill(0).map((_, index) => String(index + 1).padStart(2, '0'));
  } catch (e) {
    return [];
  }
}

function getMonths() {
  return Array(12).fill(0).map((_, index) => dayjs().month(index).format('MMM'));
}

export { getDayByMonth, getMonths }
