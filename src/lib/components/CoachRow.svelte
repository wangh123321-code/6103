<script lang="ts">
	import type { DayOfWeek, Course, Coach, DragData } from '../types';
	import { getHourRange, formatHour } from '../utils/time';
	import { MAX_DAILY_HOURS, START_HOUR, END_HOUR, COURSE_TYPE_LABELS, COURSE_TYPE_COLORS } from '../types';
	import { createDragData, serializeDragData, deserializeDragData } from '../utils/drag';

	let { coach, dayOfWeek, courses, isDraggable, onDrop, onCourseClick }: {
		coach: Coach;
		dayOfWeek: DayOfWeek;
		courses: Course[];
		isDraggable: boolean;
		onDrop: (dragData: DragData, targetDay: DayOfWeek, targetHour: number) => void;
		onCourseClick: (course: Course) => void;
	} = $props();

	let hours = $derived(getHourRange());
	let dailyHours = $derived(courses.reduce((sum, c) => sum + (c.endHour - c.startHour), 0));
	let isOverLimit = $derived(dailyHours > MAX_DAILY_HOURS);
	let totalSlots = $derived(END_HOUR - START_HOUR);

	function isHourAvailable(hour: number): boolean {
		return coach.availableSlots
			.filter(s => s.dayOfWeek === dayOfWeek)
			.some(s => hour >= s.startHour && hour < s.endHour);
	}

	function isHourOccupied(hour: number): boolean {
		return courses.some(c => hour >= c.startHour && hour < c.endHour);
	}

	let freeSlotBlocks = $derived.by(() => {
		const daySlots = coach.availableSlots.filter(s => s.dayOfWeek === dayOfWeek);
		const result: { startHour: number; endHour: number }[] = [];
		for (const slot of daySlots) {
			let intervals = [{ startHour: slot.startHour, endHour: slot.endHour }];
			for (const course of courses) {
				const next: { startHour: number; endHour: number }[] = [];
				for (const iv of intervals) {
					if (course.endHour <= iv.startHour || course.startHour >= iv.endHour) {
						next.push(iv);
					} else {
						if (course.startHour > iv.startHour) next.push({ startHour: iv.startHour, endHour: course.startHour });
						if (course.endHour < iv.endHour) next.push({ startHour: course.endHour, endHour: iv.endHour });
					}
				}
				intervals = next;
			}
			result.push(...intervals);
		}
		return result;
	});

	let slotsArea: HTMLDivElement | null = null;
	let dropHour = $state<number | null>(null);

	function getSlotWidth(): number {
		if (!slotsArea) return 80;
		const rect = slotsArea.getBoundingClientRect();
		return rect.width / totalSlots;
	}

	function computeTargetHour(e: DragEvent | MouseEvent): number {
		if (!slotsArea) return START_HOUR;
		const rect = slotsArea.getBoundingClientRect();
		const slotWidth = rect.width / totalSlots;
		const relativeX = e.clientX - rect.left;
		const hourIndex = Math.floor(relativeX / slotWidth);
		return Math.max(START_HOUR, Math.min(END_HOUR - 1, START_HOUR + hourIndex));
	}

	function handleAreaDragOver(e: DragEvent) {
		e.preventDefault();
		if (!isDraggable) return;
		const targetHour = computeTargetHour(e);
		if (isHourAvailable(targetHour) && !isHourOccupied(targetHour)) {
			dropHour = targetHour;
			if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
		} else {
			dropHour = targetHour;
			if (e.dataTransfer) e.dataTransfer.dropEffect = 'none';
		}
	}

	function handleAreaDragLeave(e: DragEvent) {
		if (slotsArea && e.relatedTarget instanceof Node && !slotsArea.contains(e.relatedTarget)) {
			dropHour = null;
		}
	}

	function handleAreaDrop(e: DragEvent) {
		e.preventDefault();
		if (!isDraggable) {
			dropHour = null;
			return;
		}
		const targetHour = computeTargetHour(e);
		dropHour = null;

		const json = e.dataTransfer?.getData('text/plain');
		if (!json) return;
		try {
			const dragData = deserializeDragData(json);
			onDrop(dragData, dayOfWeek, targetHour);
		} catch (err) {
			console.error('Failed to parse drag data:', err);
		}
	}

	function handleCourseDragStart(e: DragEvent, course: Course) {
		if (!isDraggable) { e.preventDefault(); return; }
		const data = createDragData(coach.id, dayOfWeek, course.startHour, course.endHour, course.type, true, course.id);
		e.dataTransfer!.setData('text/plain', serializeDragData(data));
		e.dataTransfer!.effectAllowed = 'move';
	}

	function handleSlotDragStart(e: DragEvent, slot: { startHour: number; endHour: number }) {
		if (!isDraggable) { e.preventDefault(); return; }
		const data = createDragData(coach.id, dayOfWeek, slot.startHour, slot.endHour, 'private', false);
		e.dataTransfer!.setData('text/plain', serializeDragData(data));
		e.dataTransfer!.effectAllowed = 'copy';
	}

	function cellSlotStyle(hour: number) {
		const sw = getSlotWidth();
		return `left: ${(hour - START_HOUR) * sw}px; width: ${sw}px;`;
	}

	function blockStyle(startHour: number, endHour: number) {
		const sw = getSlotWidth();
		const w = (endHour - startHour) * sw;
		return `left: ${(startHour - START_HOUR) * sw}px; width: ${w}px;`;
	}
</script>

<div class="flex relative coach-row-container">
	<div class="coach-label w-[100px] sm:w-[140px] flex-shrink-0 flex flex-col items-center justify-center border-r border-b border-gray-200 bg-white px-1 sm:px-2">
		<div class="flex items-center gap-1 sm:gap-2">
			<span class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0" style="background-color: {coach.color};"></span>
			<span class="text-xs sm:text-sm font-medium text-gray-800 truncate max-w-[60px] sm:max-w-[90px]">{coach.name}</span>
		</div>
		<span class="text-[10px] sm:text-xs mt-1 {isOverLimit ? 'text-red-500 font-bold' : 'text-gray-400'}">
			{dailyHours}/{MAX_DAILY_HOURS}h
		</span>
	</div>

	<div
		class="flex relative coach-slots-area"
		bind:this={slotsArea}
		style="height: 60px;"
		ondragover={handleAreaDragOver}
		ondragleave={handleAreaDragLeave}
		ondrop={handleAreaDrop}
	>
		{#each hours as hour (hour)}
			<div
				role="gridcell"
				class="slot-cell absolute top-0 h-full border-r border-b border-gray-200 {isHourAvailable(hour) ? 'bg-gray-50' : 'bg-white'} {dropHour === hour && isHourAvailable(hour) && !isHourOccupied(hour) ? 'drag-over-valid' : ''} {dropHour === hour && (!isHourAvailable(hour) || isHourOccupied(hour)) ? 'drag-over-invalid' : ''}"
				style={cellSlotStyle(hour)}
				tabindex={-1}
			></div>
		{/each}

		{#each freeSlotBlocks as slot (`free-${slot.startHour}-${slot.endHour}`)}
			<div
				role="button"
				tabindex={isDraggable ? 0 : undefined}
				class="absolute top-0 z-[1] flex flex-col items-center justify-center rounded border-l-[3px]"
				style="{blockStyle(slot.startHour, slot.endHour)} height: 60px; background-color: {coach.color}15; border-left-color: {coach.color}; cursor: {isDraggable ? 'grab' : 'default'};"
				draggable={isDraggable ? 'true' : undefined}
				ondragstart={(e) => handleSlotDragStart(e, slot)}
			>
				<span class="text-[10px] text-gray-500 pointer-events-none select-none">可授课</span>
				<span class="text-[10px] text-gray-400 pointer-events-none select-none">{formatHour(slot.startHour)}-{formatHour(slot.endHour)}</span>
			</div>
		{/each}

		{#each courses as course (course.id)}
			<div
				class="course-block absolute top-0 z-[5] flex flex-col items-center justify-center rounded {isOverLimit ? 'over-limit' : ''}"
				style="{blockStyle(course.startHour, course.endHour)} height: 60px; background-color: {COURSE_TYPE_COLORS[course.type]}; cursor: {isDraggable ? 'grab' : 'pointer'};"
				draggable={isDraggable ? 'true' : undefined}
				ondragstart={(e) => handleCourseDragStart(e, course)}
				onclick={() => onCourseClick(course)}
				role="button"
				tabindex={0}
				onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') onCourseClick(course); }}
			>
				<span class="font-bold text-xs text-white drop-shadow-sm pointer-events-none select-none">{COURSE_TYPE_LABELS[course.type]}</span>
				<span class="text-[10px] text-white/80 pointer-events-none select-none">{formatHour(course.startHour)}-{formatHour(course.endHour)}</span>
			</div>
		{/each}
	</div>
</div>
