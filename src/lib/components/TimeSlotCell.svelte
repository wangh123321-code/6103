<script lang="ts">
	import type { DayOfWeek, Course, Coach, DragData } from '../types';
	import { deserializeDragData } from '../utils/drag';
	import CourseBlock from './CourseBlock.svelte';
	import AvailableSlot from './AvailableSlot.svelte';

	let { coachId, dayOfWeek, hour, isAvailable, courses, coach, isDraggable, isOverLimit, onDrop, onCourseClick }: {
		coachId: string;
		dayOfWeek: DayOfWeek;
		hour: number;
		isAvailable: boolean;
		courses: Course[];
		coach: Coach;
		isDraggable: boolean;
		isOverLimit: boolean;
		onDrop: (dragData: DragData, targetDay: DayOfWeek, targetHour: number) => void;
		onCourseClick: (course: Course) => void;
	} = $props();

	let dragOver = $state(false);

	let cellClass = $derived(
		`h-[60px] w-[80px] border-r border-b border-gray-200 relative flex-shrink-0 ` +
		(isAvailable ? 'bg-gray-50' : 'bg-white') +
		(dragOver && isAvailable ? ' drag-over-valid' : '') +
		(dragOver && !isAvailable ? ' drag-over-invalid' : '')
	);

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		const json = e.dataTransfer!.getData('text/plain');
		if (!json) return;
		const dragData = deserializeDragData(json);
		onDrop(dragData, dayOfWeek, hour);
	}

	let matchingSlot = $derived(
		coach.availableSlots.find(s => s.dayOfWeek === dayOfWeek && s.startHour === hour)
	);
</script>

<div
	class={cellClass}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
>
	{#each courses as course (course.id)}
		<CourseBlock
			{course}
			{coach}
			{isOverLimit}
			{isDraggable}
			onClick={() => onCourseClick(course)}
		/>
	{/each}
	{#if matchingSlot && courses.length === 0}
		<AvailableSlot
			{coachId}
			{dayOfWeek}
			startHour={matchingSlot.startHour}
			endHour={matchingSlot.endHour}
			coachColor={coach.color}
			{isDraggable}
		/>
	{/if}
</div>
