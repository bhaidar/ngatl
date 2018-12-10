export function getDaysLeft(
  startDate: Date,
  endDate: Date,
): number {
  endDate.setHours( 0, 0, 0 );
  startDate.setHours( 0, 0, 0 );
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round( ( endDate.getTime() - startDate.getTime() ) / oneDay );
}

export function getShortDate( dateIsoString: string ): string {
  const match = /\d{4}-\d{2}-\d{2}/.exec( dateIsoString );
  return match ? match[0] : dateIsoString;
}

export function getWeekDay( index: number ) {
  const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  return weekDays[index];
}

export function getMonth( index: number ) {
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  return months[index];
}

export function getYear(date: string): number {
  if (!date) {
    return;
  }
  const year = (new Date(date)).getFullYear();
  return year;
}

export function dateIsValid(date: Date) {
  if (date) {
    return date instanceof Date && !isNaN(date.valueOf());
  }
  return false;
}
