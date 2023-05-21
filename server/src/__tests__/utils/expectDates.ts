type TDates = (Date | string)[];


export default function expectDates(...dates: TDates) {
  return {
    toBeEqual: toBeEqual.bind({ dates }),
    notToBeEqual: notToBeEqual.bind({ dates })
  }
}


function toBeEqual(this: { dates: TDates }) {
  const { dates } = this;
  const firstDateInMs = getFirstDateInMs(dates);

  for (let i = 1; i < dates.length; i++) {
    const dateInMs = new Date(dates[i]).getTime();
    expect(dateInMs).toBe(firstDateInMs);
  }
}


function notToBeEqual(this: { dates: TDates }) {
  const { dates } = this;
  const firstDateInMs = getFirstDateInMs(dates);

  for (let i = 1; i < dates.length; i++) {
    const dateInMs = new Date(dates[i]).getTime();
    expect(dateInMs).not.toBe(firstDateInMs);
  }
}


function getFirstDateInMs(dates: TDates) {
  return new Date(dates[0]).getTime();
}
