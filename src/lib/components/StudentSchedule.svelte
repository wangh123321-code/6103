<script lang="ts">
	import { scheduleStore } from '../stores/schedule.svelte';
	import { DAYS, DAY_LABELS, COURSE_TYPE_LABELS, COURSE_TYPE_COLORS } from '../types';
	import type { Course, DayOfWeek } from '../types';
	import { formatHour } from '../utils/time';
	import WeekSelector from './WeekSelector.svelte';

	let studentCourses = $derived(
		scheduleStore.selectedStudentId
			? scheduleStore.getStudentCourses(scheduleStore.selectedStudentId)
			: []
	);

	function getCoursesForDay(day: DayOfWeek): Course[] {
		return studentCourses.filter(c => c.dayOfWeek === day);
	}

	function getCoachName(coachId: string): string {
		return scheduleStore.coaches.find(c => c.id === coachId)?.name ?? '未知教练';
	}
</script>

<div class="flex flex-col h-full bg-gray-50">
	<div class="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
		<select
			class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F77F00]"
			value={scheduleStore.selectedStudentId ?? ''}
			onchange={(e) => {
				scheduleStore.selectedStudentId = (e.target as HTMLSelectElement).value || null;
			}}
		>
			<option value="">请选择学员</option>
			{#each scheduleStore.students as student (student.id)}
				<option value={student.id}>{student.name}</option>
			{/each}
		</select>

		<WeekSelector
			weekOffset={scheduleStore.currentWeekOffset}
			onChange={(offset) => scheduleStore.currentWeekOffset = offset}
		/>
	</div>

	{#if !scheduleStore.selectedStudentId}
		<div class="flex-1 flex items-center justify-center">
			<p class="text-gray-400 text-lg">请选择学员</p>
		</div>
	{:else}
		<div class="flex-1 overflow-auto p-4">
			<div class="grid grid-cols-7 gap-3 min-h-full">
				{#each DAYS as day (day)}
					<div class="flex flex-col">
						<div class="text-center text-sm font-medium text-gray-600 mb-3 py-2 bg-white rounded-lg">
							{DAY_LABELS[day]}
						</div>

						<div class="flex flex-col gap-2 flex-1">
							{#each getCoursesForDay(day) as course (course.id)}
								<div class="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
									<span
										class="inline-block px-2 py-0.5 rounded text-xs font-medium text-white mb-2"
										style="background-color: {COURSE_TYPE_COLORS[course.type]}"
									>
										{COURSE_TYPE_LABELS[course.type]}
									</span>
									<p class="text-sm text-gray-800 font-medium">{getCoachName(course.coachId)}</p>
									<p class="text-xs text-gray-500 mt-1">{formatHour(course.startHour)} - {formatHour(course.endHour)}</p>
								</div>
							{/each}

							{#if getCoursesForDay(day).length === 0}
								<div class="flex-1 flex items-center justify-center">
									<span class="text-xs text-gray-300">无课程</span>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
