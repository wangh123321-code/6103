import type { DragData, DayOfWeek, CourseType, Course, Coach } from '../types';
import { checkConflict, checkOverLimit, isWithinAvailableSlots } from './conflict';

// 拖拽调度核心逻辑

// 创建拖拽数据对象
export function createDragData(
  coachId: string,
  day: DayOfWeek,
  startHour: number,
  endHour: number,
  courseType: CourseType,
  isExisting: boolean,
  courseId?: string
): DragData {
  return {
    coachId,
    sourceDay: day,
    sourceStartHour: startHour,
    sourceEndHour: endHour,
    courseType,
    courseId,
    isExistingCourse: isExisting
  };
}

// 序列化拖拽数据（用于 dataTransfer）
export function serializeDragData(data: DragData): string {
  return JSON.stringify(data);
}

// 反序列化拖拽数据
export function deserializeDragData(json: string): DragData {
  return JSON.parse(json) as DragData;
}

// 处理放置操作：编排冲突检测、超时检测和课程创建
// store 参数为 scheduleStore 的接口子集，便于解耦
interface ScheduleStoreLike {
  courses: Course[];
  coaches: Coach[];
  addCourse(course: Course): void;
  removeCourse(courseId: string): void;
  showConflictModal: { hasConflict: boolean; conflictingCourse?: Course } | null;
  showOverLimitModal: { isOverLimit: boolean; currentHours: number; newHours: number; maxHours: number } | null;
  pendingDropData: { dragData: DragData; targetDay: DayOfWeek; targetStartHour: number } | null;
}

export async function handleDrop(
  dragData: DragData,
  targetDay: DayOfWeek,
  targetStartHour: number,
  store: ScheduleStoreLike
): Promise<boolean> {
  const duration = dragData.sourceEndHour - dragData.sourceStartHour;
  const targetEndHour = targetStartHour + duration;

  // 检查可用时段
  if (!isWithinAvailableSlots(dragData.coachId, targetDay, targetStartHour, targetEndHour, store.coaches)) {
    return false;
  }

  // 检查时间冲突（如果是已有课程移动，排除自身）
  const conflict = checkConflict(
    dragData.coachId,
    targetDay,
    targetStartHour,
    targetEndHour,
    store.courses,
    dragData.isExistingCourse ? dragData.courseId : undefined
  );

  if (conflict.hasConflict) {
    store.showConflictModal = conflict;
    store.pendingDropData = { dragData, targetDay, targetStartHour };
    return false;
  }

  // 检查超时限制
  const overLimit = checkOverLimit(
    dragData.coachId,
    targetDay,
    targetStartHour,
    targetEndHour,
    dragData.isExistingCourse
      ? store.courses.filter(c => c.id !== dragData.courseId)
      : store.courses
  );

  if (overLimit.isOverLimit) {
    store.showOverLimitModal = overLimit;
    store.pendingDropData = { dragData, targetDay, targetStartHour };
    return false;
  }

  // 如果是已有课程移动，先删除原课程
  if (dragData.isExistingCourse && dragData.courseId) {
    store.removeCourse(dragData.courseId);
  }

  // 创建新课程
  const newCourse: Course = {
    id: dragData.isExistingCourse && dragData.courseId
      ? dragData.courseId
      : `course-${Date.now()}`,
    coachId: dragData.coachId,
    studentIds: dragData.isExistingCourse
      ? (store.courses.find(c => c.id === dragData.courseId)?.studentIds ?? [])
      : [],
    type: dragData.courseType,
    dayOfWeek: targetDay,
    startHour: targetStartHour,
    endHour: targetEndHour
  };

  store.addCourse(newCourse);
  return true;
}
