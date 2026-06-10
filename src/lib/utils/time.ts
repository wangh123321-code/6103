import { START_HOUR, END_HOUR } from '../types';

// 将小时数格式化为时间字符串，如 8 -> "8:00"，14 -> "14:00"
export function formatHour(hour: number): string {
  return `${hour}:00`;
}

// 返回课程时间范围内的小时列表 [8, 9, 10, ..., 20]
export function getHourRange(): number[] {
  const hours: number[] = [];
  for (let h = START_HOUR; h < END_HOUR; h++) {
    hours.push(h);
  }
  return hours;
}

// 判断某个时段是否在指定范围内（用于检查课程是否在可用时段内）
export function isSlotInRange(
  startHour: number,
  endHour: number,
  slotStart: number,
  slotEnd: number
): boolean {
  return startHour >= slotStart && endHour <= slotEnd;
}
