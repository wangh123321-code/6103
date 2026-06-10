import type { Coach, Student, Course, DayOfWeek, ViewRole, ConflictResult, OverLimitResult, DragData } from '../types';
import { MAX_DAILY_HOURS } from '../types';
import { mockCoaches, mockStudents, mockCourses } from '../mock/data';

// 课表状态管理（Svelte 5 runes）
function createScheduleStore() {
  // 基础状态
  let coaches = $state<Coach[]>([...mockCoaches]);
  let students = $state<Student[]>([...mockStudents]);
  let courses = $state<Course[]>([...mockCourses]);
  let currentDay = $state<DayOfWeek>('MON');
  let currentWeekOffset = $state<number>(0);
  let viewRole = $state<ViewRole>('manager');
  let selectedStudentId = $state<string | null>(null);
  let showCourseDetail = $state<Course | null>(null);
  let showConflictModal = $state<ConflictResult | null>(null);
  let showOverLimitModal = $state<OverLimitResult | null>(null);
  let pendingDropData = $state<{ dragData: DragData; targetDay: DayOfWeek; targetStartHour: number } | null>(null);

  // 派生：当前选中日期的课程
  let coursesForDay = $derived(
    courses.filter(c => c.dayOfWeek === currentDay)
  );

  // 派生：当前选中日期有课程的教练
  let coachesForDay = $derived(
    coaches.filter(coach =>
      coursesForDay.some(c => c.coachId === coach.id)
    )
  );

  // 添加课程
  function addCourse(course: Course) {
    courses = [...courses, course];
  }

  // 删除课程
  function removeCourse(courseId: string) {
    courses = courses.filter(c => c.id !== courseId);
  }

  // 获取某教练在某天的所有课程
  function getCoursesForCoachOnDay(coachId: string, day: DayOfWeek): Course[] {
    return courses.filter(c => c.coachId === coachId && c.dayOfWeek === day);
  }

  // 获取某教练在某天的可用时段
  function getAvailableSlotsForCoachOnDay(coachId: string, day: DayOfWeek) {
    const coach = coaches.find(c => c.id === coachId);
    if (!coach) return [];
    return coach.availableSlots.filter(s => s.dayOfWeek === day);
  }

  // 获取某教练在某天的总课时数
  function getCoachDailyHours(coachId: string, day: DayOfWeek): number {
    return getCoursesForCoachOnDay(coachId, day).reduce(
      (sum, c) => sum + (c.endHour - c.startHour), 0
    );
  }

  // 获取某学生的所有课程
  function getStudentCourses(studentId: string): Course[] {
    return courses.filter(c => c.studentIds.includes(studentId));
  }

  return {
    // 状态访问器
    get coaches() { return coaches; },
    set coaches(value: Coach[]) { coaches = value; },
    get students() { return students; },
    set students(value: Student[]) { students = value; },
    get courses() { return courses; },
    set courses(value: Course[]) { courses = value; },
    get currentDay() { return currentDay; },
    set currentDay(value: DayOfWeek) { currentDay = value; },
    get currentWeekOffset() { return currentWeekOffset; },
    set currentWeekOffset(value: number) { currentWeekOffset = value; },
    get viewRole() { return viewRole; },
    set viewRole(value: ViewRole) { viewRole = value; },
    get selectedStudentId() { return selectedStudentId; },
    set selectedStudentId(value: string | null) { selectedStudentId = value; },
    get showCourseDetail() { return showCourseDetail; },
    set showCourseDetail(value: Course | null) { showCourseDetail = value; },
    get showConflictModal() { return showConflictModal; },
    set showConflictModal(value: ConflictResult | null) { showConflictModal = value; },
    get showOverLimitModal() { return showOverLimitModal; },
    set showOverLimitModal(value: OverLimitResult | null) { showOverLimitModal = value; },
    get pendingDropData() { return pendingDropData; },
    set pendingDropData(value: { dragData: DragData; targetDay: DayOfWeek; targetStartHour: number } | null) { pendingDropData = value; },

    // 派生状态
    get coursesForDay() { return coursesForDay; },
    get coachesForDay() { return coachesForDay; },

    // 方法
    addCourse,
    removeCourse,
    getCoursesForCoachOnDay,
    getAvailableSlotsForCoachOnDay,
    getCoachDailyHours,
    getStudentCourses
  };
}

// 导出单例
export const scheduleStore = createScheduleStore();
