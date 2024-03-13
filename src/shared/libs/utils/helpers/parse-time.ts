import { DateTimeUnit, TimeAndUnit } from 'src/shared/libs/types';

export function parseTime(time: string): TimeAndUnit {
  const regex = /^(\d+)([shdmy])/;
  const match = regex.exec(time);
  if (!match) {
    throw new Error(`[parseTime] Bad time string: ${time}`);
  }
  const [, valueRaw, unitRaw] = match;
  const value = parseInt(valueRaw, 10);
  const unit = unitRaw as DateTimeUnit;
  if (isNaN(value)) {
    throw new Error(`[parseTime] Can't pars value count. Result is NaN.`);
  }
  return { value, unit };
}
