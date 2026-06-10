// 课程类型：大班课、小班课、一对一
export type CourseType = 'group' | 'small' | 'private';

// 星期枚举
export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

// 教练
export interface Coach {
  id: string;
  name: string;
  color: string;
  availableSlots: AvailableSlot[];
}

// 学生
export interface Student {
  id: string;
  name: string;
  phone: string;
}

// 课程
export interface Course {
  id: string;
  coachId: string;
  studentIds: string[];
  type: CourseType;
  dayOfWeek: DayOfWeek;
  startHour: number;
  endHour: number;
}

// 可用时段
export interface AvailableSlot {
  dayOfWeek: DayOfWeek;
  startHour: number;
  endHour: number;
}

// 拖拽数据
export interface DragData {
  coachId: string;
  sourceDay: DayOfWeek;
  sourceStartHour: number;
  sourceEndHour: number;
  courseType: CourseType;
  courseId?: string;
  isExistingCourse: boolean;
}

// 冲突检测结果
export interface ConflictResult {
  hasConflict: boolean;
  conflictingCourse?: Course;
}

// 超时检测结果
export interface OverLimitResult {
  isOverLimit: boolean;
  currentHours: number;
  newHours: number;
  maxHours: number;
}

// 视图角色
export type ViewRole = 'manager' | 'coach' | 'student';

// 星期常量
export const DAYS: DayOfWeek[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

// 星期中文标签
export const DAY_LABELS: Record<DayOfWeek, string> = {
  MON: '周一', TUE: '周二', WED: '周三', THU: '周四', FRI: '周五', SAT: '周六', SUN: '周日'
};

// 课程时间范围
export const START_HOUR = 8;
export const END_HOUR = 21;

// 教练每日最大课时
export const MAX_DAILY_HOURS = 6;

// 课程类型中文标签
export const COURSE_TYPE_LABELS: Record<CourseType, string> = {
  group: '大班课',
  small: '小班课',
  private: '一对一'
};

// 课程类型颜色
export const COURSE_TYPE_COLORS: Record<CourseType, string> = {
  group: '#4CC9F0',
  small: '#06D6A0',
  private: '#FFD166'
};
