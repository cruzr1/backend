const BOOLEAN_DELIMITER = 0.5;

export function generateRandomValue(
  min: number,
  max: number,
  numAfterDigit = 0,
) {
  return +(Math.random() * (max - min) + min).toFixed(numAfterDigit);
}

export function getRandomItems<T>(items: T[], count: number): T[] {
  const startPosition = generateRandomValue(0, items.length - 1);
  return items.slice(startPosition, startPosition + count);
}

export function getRandomItem<T>(items: T[]): T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function getRandomBoolean() {
  return Math.random() >= BOOLEAN_DELIMITER;
}

export function getRandomDate(from: Date, to: Date) {
  return new Date(
    from.getTime() + Math.random() * (to.getTime() - from.getTime()),
  );
}
