<script lang="ts">
	import type { DayOfWeek, Course, Coach, DragData } from '../types';
	import { getHourRange, formatHour } from '../utils/time';
	import { MAX_DAILY_HOURS, START_HOUR, END_HOUR, COURSE_TYPE_LABELS, COURSE_TYPE_COLORS } from '../types';
	import { createDragData, serializeDragData, deserializeDragData } from '../utils/drag';
	import { scheduleStore } from '../stores/schedule.svelte';

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

	// ============================================================
	// 全局共享拖拽状态：从 store 读取，跨所有 CoachRow 组件同步
	// ============================================================
	let activeDragData = $derived(scheduleStore.activeDragData);
	let dropHour = $state<number | null>(null);
	let slotsArea: HTMLDivElement | null = null;

	// ============================================================
	// 问题 3 修复：整时段范围可用性检查
	// ============================================================
	function isRangeAvailable(startHour: number, endHour: number): boolean {
		for (let h = startHour; h < endHour; h++) {
			const inSlot = coach.availableSlots
				.filter(s => s.dayOfWeek === dayOfWeek)
				.some(s => h >= s.startHour && h < s.endHour);
			if (!inSlot) return false;
		}
		return true;
	}

	// 问题 4 修复：支持排除自身课程
	function isRangeOccupied(startHour: number, endHour: number, excludeCourseId?: string): boolean {
		for (let h = startHour; h < endHour; h++) {
			const occupied = courses.some(c => {
				if (excludeCourseId && c.id === excludeCourseId) return false;
				return h >= c.startHour && h < c.endHour;
			});
			if (occupied) return true;
		}
		return false;
	}

	// 仅用于 slot-cell 背景色（单小时）
	function isHourAvailable(hour: number): boolean {
		return coach.availableSlots
			.filter(s => s.dayOfWeek === dayOfWeek)
			.some(s => hour >= s.startHour && hour < s.endHour);
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

	// ============================================================
	// 完整的放置验证：范围检查 + 排除自身
	// ============================================================
	function validateDrop(targetStartHour: number): { valid: boolean; reason?: string } {
		if (!activeDragData) return { valid: false, reason: 'no-drag-data' };
		if (activeDragData.coachId !== coach.id) return { valid: false, reason: 'wrong-coach' };

		const duration = activeDragData.sourceEndHour - activeDragData.sourceStartHour;
		const targetEndHour = targetStartHour + duration;

		if (targetEndHour > END_HOUR) return { valid: false, reason: 'out-of-bounds' };
		if (!isRangeAvailable(targetStartHour, targetEndHour)) return { valid: false, reason: 'not-available' };

		const excludeId = activeDragData.isExistingCourse ? activeDragData.courseId : undefined;
		if (isRangeOccupied(targetStartHour, targetEndHour, excludeId)) return { valid: false, reason: 'occupied' };

		return { valid: true };
	}

	// ============================================================
	// 问题 1、4、5 修复：dragover 使用共享状态，无效时清除 dropHour
	// ============================================================
	function handleAreaDragOver(e: DragEvent) {
		e.preventDefault();
		if (!isDraggable || !activeDragData || activeDragData.coachId !== coach.id) {
			dropHour = null;
			if (e.dataTransfer) e.dataTransfer.dropEffect = 'none';
			return;
		}

		const targetHour = computeTargetHour(e);
		const validation = validateDrop(targetHour);

		// 问题 5 修复：只有有效目标才显示虚线框
		if (validation.valid) {
			dropHour = targetHour;
			if (e.dataTransfer) {
				e.dataTransfer.dropEffect = activeDragData.isExistingCourse ? 'move' : 'copy';
			}
		} else {
			dropHour = null;
			if (e.dataTransfer) e.dataTransfer.dropEffect = 'none';
		}
	}

	function handleAreaDragLeave(e: DragEvent) {
		if (slotsArea && e.relatedTarget instanceof Node && !slotsArea.contains(e.relatedTarget)) {
			dropHour = null;
		}
	}

	function handleGlobalDragEnd() {
		scheduleStore.activeDragData = null;
		dropHour = null;
	}

	// ============================================================
	// 问题 1、2 修复：drop 时调用 onDrop
	// ============================================================
	function handleAreaDrop(e: DragEvent) {
		e.preventDefault();
		const wasActive = !!activeDragData && activeDragData.coachId === coach.id;
		dropHour = null;
		scheduleStore.activeDragData = null;

		if (!isDraggable || !wasActive) return;

		const targetHour = computeTargetHour(e);
		const validation = validateDrop(targetHour);
		if (!validation.valid) return;

		const json = e.dataTransfer?.getData('text/plain');
		if (!json) return;

		try {
			const dragData = deserializeDragData(json);
			onDrop(dragData, dayOfWeek, targetHour);
		} catch (err) {
			console.error('Failed to parse drag data:', err);
		}
	}

	// ============================================================
	// 问题 1 修复：课程拖拽开始时写入 store，所有行共享
	// ============================================================
	function handleCourseDragStart(e: DragEvent, course: Course) {
		if (!isDraggable) { e.preventDefault(); return; }
		const data = createDragData(coach.id, dayOfWeek, course.startHour, course.endHour, course.type, true, course.id);
		scheduleStore.activeDragData = data;
		e.dataTransfer!.setData('text/plain', serializeDragData(data));
		e.dataTransfer!.effectAllowed = 'move';
	}

	// ============================================================
	// 问题 2 修复：可授课块拖拽开始时写入 store，创建新课
	// ============================================================
	function handleSlotDragStart(e: DragEvent, slot: { startHour: number; endHour: number }) {
		if (!isDraggable) { e.preventDefault(); return; }
		// 新创建的课程默认 1 小时时长，店长后续可编辑
		const data = createDragData(coach.id, dayOfWeek, slot.startHour, slot.startHour + 1, 'group', false);
		scheduleStore.activeDragData = data;
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

	// 问题 3 修复：高亮整个拖拽覆盖的小时范围（多小时）
	function isInDropRange(hour: number): boolean {
		if (dropHour === null || !activeDragData) return false;
		const duration = activeDragData.sourceEndHour - activeDragData.sourceStartHour;
		return hour >= dropHour && hour < dropHour + duration;
	}
</script>

<svelte:window ondragend={handleGlobalDragEnd} />

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
				class="slot-cell absolute top-0 h-full border-r border-b border-gray-200 {isHourAvailable(hour) ? 'bg-gray-50' : 'bg-white'} {isInDropRange(hour) ? 'drag-over-valid' : ''}"
				style={cellSlotStyle(hour)}
				tabindex={-1}
			></div>
		{/each}

		{#each freeSlotBlocks as slot (`free-${slot.startHour}-${slot.endHour}`)}
			<div
				role="button"
				tabindex={isDraggable ? 0 : undefined}
				class="absolute top-0 z-[1] flex flex-col items-center justify-center rounded border-l-[3px] pointer-events-auto"
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
				class="course-block absolute top-0 z-[5] flex flex-col items-center justify-center rounded pointer-events-auto {isOverLimit ? 'over-limit' : ''}"
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
