<script lang="ts">
import { DAY_LABELS, COURSE_TYPE_LABELS } from '../types';
import type { ConflictResult } from '../types';

let { conflict, onConfirm }: {
	conflict: ConflictResult;
	onConfirm: () => void;
} = $props();

let timeRange = $derived(
	conflict.conflictingCourse
		? `${DAY_LABELS[conflict.conflictingCourse.dayOfWeek]} ${conflict.conflictingCourse.startHour}:00-${conflict.conflictingCourse.endHour}:00`
		: ''
);
</script>

<div class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50" role="dialog" aria-modal="true" onclick={onConfirm} onkeydown={(e) => { if (e.key === 'Escape') onConfirm(); }}>
	<div class="modal-content bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6" onclick={(e) => e.stopPropagation()}>
		<div class="flex flex-col items-center text-center gap-4">
			<span class="text-5xl">⚠️</span>
			<h2 class="text-xl font-bold text-gray-900">时段冲突</h2>

			{#if conflict.conflictingCourse}
				<div class="text-gray-600 space-y-1">
					<p>教练已有课程占用此时段</p>
					<p>课程类型：{COURSE_TYPE_LABELS[conflict.conflictingCourse.type]}</p>
					<p>时段：{timeRange}</p>
				</div>
			{/if}

			<button
				class="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
				onclick={onConfirm}
			>
				确定
			</button>
		</div>
	</div>
</div>
