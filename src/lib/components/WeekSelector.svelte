<script lang="ts">
	let { weekOffset, onChange }: {
		weekOffset: number;
		onChange: (offset: number) => void;
	} = $props();

	function getWeekRange(offset: number): string {
		const now = new Date();
		const currentDay = now.getDay();
		const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
		const monday = new Date(now);
		monday.setDate(now.getDate() + mondayOffset + offset * 7);
		const sunday = new Date(monday);
		sunday.setDate(monday.getDate() + 6);
		return `${monday.getMonth() + 1}/${monday.getDate()} - ${sunday.getMonth() + 1}/${sunday.getDate()}`;
	}

	function getWeekLabel(offset: number): string {
		if (offset === 0) return '本周';
		if (offset === -1) return '上周';
		if (offset === 1) return '下周';
		if (offset < 0) return `${Math.abs(offset)}周前`;
		return `${offset}周后`;
	}

	let weekRange = $derived(getWeekRange(weekOffset));
	let weekLabel = $derived(getWeekLabel(weekOffset));
</script>

<div class="flex items-center gap-3">
	<button
		aria-label="上一周"
		class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
		onclick={() => onChange(weekOffset - 1)}
	>
		<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
		</svg>
	</button>

	<div class="text-center min-w-[120px]">
		<div class="text-sm font-medium text-gray-900">{weekLabel}</div>
		<div class="text-xs text-gray-500">{weekRange}</div>
	</div>

	<button
		aria-label="下一周"
		class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
		onclick={() => onChange(weekOffset + 1)}
	>
		<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
		</svg>
	</button>
</div>
