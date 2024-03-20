export const updateArray = <T>(array: T[], element: T) =>
  array.includes(element)
    ? array.filter((value) => value !== element)
    : array.concat(element);
