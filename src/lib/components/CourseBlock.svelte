<script lang="ts">
	import { COURSE_TYPE_LABELS, COURSE_TYPE_COLORS } from '../types';
	import type { Course, Coach, DragData } from '../types';
	import { createDragData, serializeDragData } from '../utils/drag';
	import { formatHour } from '../utils/time';

	let { course, coach, isOverLimit, isDraggable, onClick }: {
		course: Course;
		coach: Coach;
		isOverLimit: boolean;
		isDraggable: boolean;
		onClick: () => void;
	} = $props();

	let bgColor = $derived(COURSE_TYPE_COLORS[course.type]);
	let label = $derived(COURSE_TYPE_LABELS[course.type]);
	let timeRange = $derived(`${formatHour(course.startHour)}-${formatHour(course.endHour)}`);

	let duration = $derived(course.endHour - course.startHour);
	let blockWidth = $derived(duration * 80);
	let blockHeight = $derived(duration * 60);

	function handleDragStart(e: DragEvent) {
		if (!isDraggable) return;
		const data = createDragData(
			course.coachId,
			course.dayOfWeek,
			course.startHour,
			course.endHour,
			course.type,
			true,
			course.id
		);
		e.dataTransfer!.setData('text/plain', serializeDragData(data));
		e.dataTransfer!.effectAllowed = 'move';
	}
</script>

<div
	class="course-block absolute top-0 left-0 z-10 flex flex-col items-center justify-center rounded px-1 {isOverLimit ? 'over-limit' : ''}"
	style="background-color: {bgColor}; cursor: {isDraggable ? 'grab' : 'default'}; width: {blockWidth}px; height: {blockHeight}px;"
	draggable={isDraggable ? 'true' : undefined}
	ondragstart={isDraggable ? handleDragStart : undefined}
	onclick={onClick}
	role="button"
	tabindex={0}
	onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
>
	<span class="font-bold text-xs text-white drop-shadow-sm">{label}</span>
	<span class="text-[10px] text-white/80">{timeRange}</span>
</div>
