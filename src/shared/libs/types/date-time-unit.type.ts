export type DateTimeUnit = 's' | 'h' | 'd' | 'm' | 'y';

export type TimeAndUnit = {
  value: number;
  unit: DateTimeUnit;
};
