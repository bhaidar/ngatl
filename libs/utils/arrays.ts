export function flatten<T>(list: Array<Array<T>>): Array<T> {
  return list.reduce((
    a,
    b,
  ) => a.concat(Array.isArray(b) ? flatten(<any>b) : b), []);
}

export function sortAlpha(a, b) {
  if (a.name.toLowerCase() < b.name.toLowerCase())
    return -1;
  if (a.name.toLowerCase() > b.name.toLowerCase())
    return 1;
  return 0;
}