export function getRandomDateBetweenYears(
  year1: number,
  year2: number,
  startMonth: number,
): Date {
  if (year1 > year2) {
    [year1, year2] = [year2, year1];
  }

  startMonth = Math.max(0, Math.min(11, startMonth));

  const start = new Date(year1, startMonth, 1);
  const end = new Date(year2, 11, 31);
  const randomTimestamp =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());

  return new Date(randomTimestamp);
}
