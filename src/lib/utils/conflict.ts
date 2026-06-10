import type { Course, DayOfWeek, Coach, ConflictResult, OverLimitResult } from '../types';
import { MAX_DAILY_HOURS } from '../types';
import { isSlotInRange } from './time';

// 检查教练在某天某时段是否存在课程冲突
// 两个时段重叠条件：startA < endB && startB < endA
export function checkConflict(
  coachId: string,
  dayOfWeek: DayOfWeek,
  startHour: number,
  endHour: number,
  courses: Course[],
  excludeCourseId?: string
): ConflictResult {
  const conflicting = courses.find(c => {
    if (c.coachId !== coachId) return false;
    if (c.dayOfWeek !== dayOfWeek) return false;
    if (excludeCourseId && c.id === excludeCourseId) return false;
    return startHour < c.endHour && c.startHour < endHour;
  });

  if (conflicting) {
    return { hasConflict: true, conflictingCourse: conflicting };
  }
  return { hasConflict: false };
}

// 检查教练在某天加入新课程后是否超出每日最大课时限制
export function checkOverLimit(
  coachId: string,
  dayOfWeek: DayOfWeek,
  newStartHour: number,
  newEndHour: number,
  courses: Course[],
  maxHours: number = MAX_DAILY_HOURS
): OverLimitResult {
  const currentHours = courses
    .filter(c => c.coachId === coachId && c.dayOfWeek === dayOfWeek)
    .reduce((sum, c) => sum + (c.endHour - c.startHour), 0);

  const newHours = currentHours + (newEndHour - newStartHour);

  return {
    isOverLimit: newHours > maxHours,
    currentHours,
    newHours,
    maxHours
  };
}

// 检查课程时段是否在教练的可用时段范围内
export function isWithinAvailableSlots(
  coachId: string,
  dayOfWeek: DayOfWeek,
  startHour: number,
  endHour: number,
  coaches: Coach[]
): boolean {
  const coach = coaches.find(c => c.id === coachId);
  if (!coach) return false;

  return coach.availableSlots
    .filter(s => s.dayOfWeek === dayOfWeek)
    .some(slot => isSlotInRange(startHour, endHour, slot.startHour, slot.endHour));
}
