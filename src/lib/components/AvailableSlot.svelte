<script lang="ts">
	import type { DayOfWeek, DragData } from '../types';
	import { createDragData, serializeDragData } from '../utils/drag';
	import { formatHour } from '../utils/time';

	let { coachId, dayOfWeek, startHour, endHour, coachColor, isDraggable }: {
		coachId: string;
		dayOfWeek: DayOfWeek;
		startHour: number;
		endHour: number;
		coachColor: string;
		isDraggable: boolean;
	} = $props();

	let timeRange = $derived(`${formatHour(startHour)}-${formatHour(endHour)}`);

	function handleDragStart(e: DragEvent) {
		if (!isDraggable) return;
		const data = createDragData(
			coachId,
			dayOfWeek,
			startHour,
			endHour,
			'private',
			false
		);
		e.dataTransfer!.setData('text/plain', serializeDragData(data));
		e.dataTransfer!.effectAllowed = 'copy';
	}
</script>

<div
	class="h-full w-full flex flex-col items-center justify-center"
	style="background-color: {coachColor}15; border-left: 3px solid {coachColor}; cursor: {isDraggable ? 'grab' : 'default'};"
	draggable={isDraggable ? 'true' : undefined}
	ondragstart={isDraggable ? handleDragStart : undefined}
>
	<span class="text-[10px] text-gray-500">可授课</span>
	<span class="text-[10px] text-gray-400">{timeRange}</span>
</div>
