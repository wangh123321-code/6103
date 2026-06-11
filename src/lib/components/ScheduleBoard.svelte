<script lang="ts">
	import { scheduleStore } from '../stores/schedule.svelte';
	import { DAYS, DAY_LABELS } from '../types';
	import type { DayOfWeek, DragData, Course } from '../types';
	import { handleDrop } from '../utils/drag';
	import { formatHour, getHourRange } from '../utils/time';
	import CoachRow from './CoachRow.svelte';
	import AvailabilityPanel from './AvailabilityPanel.svelte';
	import ConflictModal from './ConflictModal.svelte';
	import OverLimitModal from './OverLimitModal.svelte';
	import CourseDetailModal from './CourseDetailModal.svelte';

	let hours = $derived(getHourRange());
	let isDraggable = $derived(scheduleStore.viewRole === 'manager' || scheduleStore.viewRole === 'coach');
	let panelOpen = $state(true);

	async function onDrop(dragData: DragData, targetDay: DayOfWeek, targetHour: number) {
		await handleDrop(dragData, targetDay, targetHour, scheduleStore);
	}

	function handleConflictConfirm() {
		scheduleStore.showConflictModal = null;
		scheduleStore.pendingDropData = null;
	}

	function handleOverLimitConfirm() {
		if (scheduleStore.pendingDropData) {
			const { dragData, targetDay, targetStartHour } = scheduleStore.pendingDropData;
			const duration = dragData.sourceEndHour - dragData.sourceStartHour;
			const targetEndHour = targetStartHour + duration;

			// 必须在删除之前读取学员数据
			const existingStudentIds = dragData.isExistingCourse && dragData.courseId
				? (scheduleStore.courses.find(c => c.id === dragData.courseId)?.studentIds ?? [])
				: [];

			if (dragData.isExistingCourse && dragData.courseId) {
				scheduleStore.removeCourse(dragData.courseId);
			}

			const newCourse: Course = {
				id: dragData.isExistingCourse && dragData.courseId ? dragData.courseId : `course-${Date.now()}`,
				coachId: dragData.coachId,
				studentIds: existingStudentIds,
				type: dragData.courseType,
				dayOfWeek: targetDay,
				startHour: targetStartHour,
				endHour: targetEndHour,
			};

			scheduleStore.addCourse(newCourse);
		}
		scheduleStore.showOverLimitModal = null;
		scheduleStore.pendingDropData = null;
	}

	function handleOverLimitCancel() {
		scheduleStore.showOverLimitModal = null;
		scheduleStore.pendingDropData = null;
	}

	function handleCourseClick(course: Course) {
		scheduleStore.showCourseDetail = course;
	}

	let overLimitCoachName = $derived(
		scheduleStore.pendingDropData
			? scheduleStore.coaches.find(c => c.id === scheduleStore.pendingDropData!.dragData.coachId)?.name ?? ''
			: ''
	);
</script>

<div class="flex h-full relative">
	<div class="flex-1 overflow-auto schedule-grid-area">
		<div class="flex sticky top-0 z-10 bg-white">
			<div class="w-[140px] flex-shrink-0 border-r border-b border-gray-200 bg-gray-50"></div>
			{#each hours as hour (hour)}
				<div class="schedule-hour-header w-[80px] flex-shrink-0 text-center text-xs text-gray-500 border-b border-r border-gray-200 py-2 bg-gray-50">
					{formatHour(hour)}
				</div>
			{/each}
		</div>

		{#each scheduleStore.coaches as coach (coach.id)}
			<CoachRow
				{coach}
				dayOfWeek={scheduleStore.currentDay}
				courses={scheduleStore.getCoursesForCoachOnDay(coach.id, scheduleStore.currentDay)}
				{isDraggable}
				{onDrop}
				onCourseClick={handleCourseClick}
			/>
		{/each}
	</div>

	<button
		class="panel-toggle-btn absolute top-2 right-2 z-20 md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow-md border border-gray-200 text-gray-600 hover:text-[#F77F00] transition-colors"
		onclick={() => panelOpen = !panelOpen}
		aria-label={panelOpen ? '收起面板' : '展开面板'}
	>
		<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			{#if panelOpen}
				<path stroke-linecap="round" stroke-linejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
			{:else}
				<path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
			{/if}
		</svg>
	</button>

	{#if panelOpen}
		<div class="schedule-panel-wrapper">
			<AvailabilityPanel
				coaches={scheduleStore.coaches}
				dayOfWeek={scheduleStore.currentDay}
				courses={scheduleStore.courses}
				onSelectSlot={() => {}}
			/>
		</div>
	{/if}
</div>

{#if scheduleStore.showConflictModal}
	<ConflictModal
		conflict={scheduleStore.showConflictModal}
		onConfirm={handleConflictConfirm}
	/>
{/if}

{#if scheduleStore.showOverLimitModal}
	<OverLimitModal
		overLimit={scheduleStore.showOverLimitModal}
		coachName={overLimitCoachName}
		onConfirm={handleOverLimitConfirm}
		onCancel={handleOverLimitCancel}
	/>
{/if}

{#if scheduleStore.showCourseDetail}
	<CourseDetailModal
		course={scheduleStore.showCourseDetail!}
		coaches={scheduleStore.coaches}
		students={scheduleStore.students}
		onClose={() => scheduleStore.showCourseDetail = null}
	/>
{/if}

<style>
	.schedule-panel-wrapper {
		width: 320px;
		flex-shrink: 0;
	}

	@media (max-width: 1024px) {
		.schedule-panel-wrapper {
			position: fixed;
			top: 0;
			right: 0;
			height: 100vh;
			z-index: 30;
			box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
		}
	}

	@media (max-width: 640px) {
		.schedule-hour-header {
			width: 60px !important;
		}
	}
</style>
