import type { Coach, Student, Course, AvailableSlot } from '../types';

// 12 位教练颜色
const COACH_COLORS = [
  '#E63946', '#457B9D', '#2A9D8F', '#E9C46A', '#F4A261', '#264653',
  '#A8DADC', '#6A4C93', '#1982C4', '#8AC926', '#FF595E', '#FFCA3A'
];

// 生成教练的可用时段
function makeSlots(slots: [string, number, number][]): AvailableSlot[] {
  return slots.map(([day, start, end]) => ({
    dayOfWeek: day as AvailableSlot['dayOfWeek'],
    startHour: start,
    endHour: end
  }));
}

// 12 位教练数据
export const mockCoaches: Coach[] = [
  {
    id: 'coach-1',
    name: '王教练',
    color: COACH_COLORS[0],
    availableSlots: makeSlots([
      ['MON', 8, 12], ['TUE', 8, 12], ['WED', 8, 12],
      ['THU', 8, 12], ['FRI', 8, 12], ['SAT', 9, 17], ['SUN', 9, 17]
    ])
  },
  {
    id: 'coach-2',
    name: '李教练',
    color: COACH_COLORS[1],
    availableSlots: makeSlots([
      ['MON', 14, 21], ['TUE', 14, 21], ['WED', 14, 21],
      ['THU', 14, 21], ['FRI', 14, 21], ['SAT', 10, 18]
    ])
  },
  {
    id: 'coach-3',
    name: '张教练',
    color: COACH_COLORS[2],
    availableSlots: makeSlots([
      ['MON', 9, 17], ['TUE', 9, 17], ['WED', 9, 17],
      ['THU', 9, 17], ['FRI', 9, 17], ['SAT', 9, 15], ['SUN', 9, 15]
    ])
  },
  {
    id: 'coach-4',
    name: '刘教练',
    color: COACH_COLORS[3],
    availableSlots: makeSlots([
      ['MON', 8, 11], ['WED', 8, 11], ['FRI', 8, 11],
      ['SAT', 8, 20], ['SUN', 8, 20]
    ])
  },
  {
    id: 'coach-5',
    name: '陈教练',
    color: COACH_COLORS[4],
    availableSlots: makeSlots([
      ['TUE', 14, 21], ['THU', 14, 21], ['SAT', 14, 21], ['SUN', 14, 21]
    ])
  },
  {
    id: 'coach-6',
    name: '杨教练',
    color: COACH_COLORS[5],
    availableSlots: makeSlots([
      ['MON', 9, 18], ['TUE', 9, 18], ['WED', 9, 18],
      ['THU', 9, 18], ['FRI', 9, 18]
    ])
  },
  {
    id: 'coach-7',
    name: '赵教练',
    color: COACH_COLORS[6],
    availableSlots: makeSlots([
      ['MON', 10, 14], ['WED', 10, 14], ['FRI', 10, 14],
      ['SAT', 10, 20], ['SUN', 10, 20]
    ])
  },
  {
    id: 'coach-8',
    name: '黄教练',
    color: COACH_COLORS[7],
    availableSlots: makeSlots([
      ['TUE', 8, 12], ['THU', 8, 12], ['SAT', 9, 18], ['SUN', 9, 18]
    ])
  },
  {
    id: 'coach-9',
    name: '周教练',
    color: COACH_COLORS[8],
    availableSlots: makeSlots([
      ['MON', 15, 21], ['TUE', 15, 21], ['WED', 15, 21],
      ['THU', 15, 21], ['FRI', 15, 21], ['SAT', 10, 16]
    ])
  },
  {
    id: 'coach-10',
    name: '吴教练',
    color: COACH_COLORS[9],
    availableSlots: makeSlots([
      ['MON', 8, 16], ['WED', 8, 16], ['FRI', 8, 16],
      ['SAT', 8, 16], ['SUN', 8, 16]
    ])
  },
  {
    id: 'coach-11',
    name: '徐教练',
    color: COACH_COLORS[10],
    availableSlots: makeSlots([
      ['TUE', 10, 18], ['THU', 10, 18], ['SAT', 10, 20], ['SUN', 10, 20]
    ])
  },
  {
    id: 'coach-12',
    name: '孙教练',
    color: COACH_COLORS[11],
    availableSlots: makeSlots([
      ['MON', 9, 13], ['TUE', 9, 13], ['WED', 9, 13],
      ['THU', 9, 13], ['FRI', 9, 13], ['SAT', 9, 21], ['SUN', 9, 21]
    ])
  }
];

// 约 30 名学生
export const mockStudents: Student[] = [
  { id: 'stu-1', name: '张伟', phone: '13800001001' },
  { id: 'stu-2', name: '李娜', phone: '13800001002' },
  { id: 'stu-3', name: '王芳', phone: '13800001003' },
  { id: 'stu-4', name: '刘洋', phone: '13800001004' },
  { id: 'stu-5', name: '陈晨', phone: '13800001005' },
  { id: 'stu-6', name: '杨帆', phone: '13800001006' },
  { id: 'stu-7', name: '赵磊', phone: '13800001007' },
  { id: 'stu-8', name: '黄丽', phone: '13800001008' },
  { id: 'stu-9', name: '周杰', phone: '13800001009' },
  { id: 'stu-10', name: '吴敏', phone: '13800001010' },
  { id: 'stu-11', name: '徐静', phone: '13800001011' },
  { id: 'stu-12', name: '孙强', phone: '13800001012' },
  { id: 'stu-13', name: '马超', phone: '13800001013' },
  { id: 'stu-14', name: '朱婷', phone: '13800001014' },
  { id: 'stu-15', name: '胡明', phone: '13800001015' },
  { id: 'stu-16', name: '林峰', phone: '13800001016' },
  { id: 'stu-17', name: '何雨', phone: '13800001017' },
  { id: 'stu-18', name: '郭鑫', phone: '13800001018' },
  { id: 'stu-19', name: '罗文', phone: '13800001019' },
  { id: 'stu-20', name: '梁慧', phone: '13800001020' },
  { id: 'stu-21', name: '宋雪', phone: '13800001021' },
  { id: 'stu-22', name: '唐辉', phone: '13800001022' },
  { id: 'stu-23', name: '韩冰', phone: '13800001023' },
  { id: 'stu-24', name: '冯兰', phone: '13800001024' },
  { id: 'stu-25', name: '董鹏', phone: '13800001025' },
  { id: 'stu-26', name: '程瑶', phone: '13800001026' },
  { id: 'stu-27', name: '曹阳', phone: '13800001027' },
  { id: 'stu-28', name: '袁媛', phone: '13800001028' },
  { id: 'stu-29', name: '邓亮', phone: '13800001029' },
  { id: 'stu-30', name: '许婷', phone: '13800001030' }
];

// 约 18 节已排课程，分布在一周各天
export const mockCourses: Course[] = [
  // 周一
  { id: 'course-1', coachId: 'coach-1', studentIds: ['stu-1', 'stu-2', 'stu-3', 'stu-4', 'stu-5'], type: 'group', dayOfWeek: 'MON', startHour: 8, endHour: 10 },
  { id: 'course-2', coachId: 'coach-3', studentIds: ['stu-6', 'stu-7'], type: 'small', dayOfWeek: 'MON', startHour: 9, endHour: 11 },
  { id: 'course-3', coachId: 'coach-9', studentIds: ['stu-8'], type: 'private', dayOfWeek: 'MON', startHour: 16, endHour: 17 },
  // 周二
  { id: 'course-4', coachId: 'coach-2', studentIds: ['stu-9', 'stu-10', 'stu-11'], type: 'small', dayOfWeek: 'TUE', startHour: 15, endHour: 17 },
  { id: 'course-5', coachId: 'coach-8', studentIds: ['stu-12'], type: 'private', dayOfWeek: 'TUE', startHour: 9, endHour: 10 },
  { id: 'course-6', coachId: 'coach-11', studentIds: ['stu-13', 'stu-14', 'stu-15', 'stu-16', 'stu-17'], type: 'group', dayOfWeek: 'TUE', startHour: 14, endHour: 16 },
  // 周三
  { id: 'course-7', coachId: 'coach-1', studentIds: ['stu-18'], type: 'private', dayOfWeek: 'WED', startHour: 10, endHour: 11 },
  { id: 'course-8', coachId: 'coach-4', studentIds: ['stu-19', 'stu-20'], type: 'small', dayOfWeek: 'WED', startHour: 9, endHour: 10 },
  // 周四
  { id: 'course-9', coachId: 'coach-5', studentIds: ['stu-21', 'stu-22', 'stu-23'], type: 'small', dayOfWeek: 'THU', startHour: 16, endHour: 18 },
  { id: 'course-10', coachId: 'coach-2', studentIds: ['stu-1', 'stu-4', 'stu-7', 'stu-10', 'stu-13'], type: 'group', dayOfWeek: 'THU', startHour: 14, endHour: 16 },
  // 周五
  { id: 'course-11', coachId: 'coach-6', studentIds: ['stu-24'], type: 'private', dayOfWeek: 'FRI', startHour: 9, endHour: 10 },
  { id: 'course-12', coachId: 'coach-10', studentIds: ['stu-2', 'stu-5', 'stu-8', 'stu-11', 'stu-14'], type: 'group', dayOfWeek: 'FRI', startHour: 10, endHour: 12 },
  // 周六
  { id: 'course-13', coachId: 'coach-1', studentIds: ['stu-15', 'stu-16'], type: 'small', dayOfWeek: 'SAT', startHour: 10, endHour: 12 },
  { id: 'course-14', coachId: 'coach-4', studentIds: ['stu-25', 'stu-26', 'stu-27', 'stu-28'], type: 'group', dayOfWeek: 'SAT', startHour: 13, endHour: 15 },
  { id: 'course-15', coachId: 'coach-12', studentIds: ['stu-29'], type: 'private', dayOfWeek: 'SAT', startHour: 14, endHour: 15 },
  // 周日
  { id: 'course-16', coachId: 'coach-7', studentIds: ['stu-3', 'stu-6', 'stu-9', 'stu-12'], type: 'group', dayOfWeek: 'SUN', startHour: 11, endHour: 13 },
  { id: 'course-17', coachId: 'coach-9', studentIds: ['stu-30', 'stu-20'], type: 'small', dayOfWeek: 'SUN', startHour: 11, endHour: 13 },
  { id: 'course-18', coachId: 'coach-11', studentIds: ['stu-22'], type: 'private', dayOfWeek: 'SUN', startHour: 15, endHour: 16 }
];
