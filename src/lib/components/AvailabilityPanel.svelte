<script lang="ts">
	import type { Coach, Course, DayOfWeek } from '../types';
	import { DAY_LABELS } from '../types';
	import { formatHour } from '../utils/time';

	let { coaches, dayOfWeek, courses, onSelectSlot }: {
		coaches: Coach[];
		dayOfWeek: DayOfWeek;
		courses: Course[];
		onSelectSlot: (coachId: string, dayOfWeek: DayOfWeek, startHour: number, endHour: number) => void;
	} = $props();

	let expandedCoaches = $state<Record<string, boolean>>({});

	function toggleCoach(coachId: string) {
		expandedCoaches[coachId] = !expandedCoaches[coachId];
	}

	function computeFreeSlots(coach: Coach, day: DayOfWeek, allCourses: Course[]) {
		const daySlots = coach.availableSlots.filter(s => s.dayOfWeek === day);
		const dayCourses = allCourses.filter(c => c.coachId === coach.id && c.dayOfWeek === day);

		const freeSlots: { startHour: number; endHour: number }[] = [];

		for (const slot of daySlots) {
			let intervals = [{ startHour: slot.startHour, endHour: slot.endHour }];

			for (const course of dayCourses) {
				const newIntervals: { startHour: number; endHour: number }[] = [];
				for (const interval of intervals) {
					if (course.endHour <= interval.startHour || course.startHour >= interval.endHour) {
						newIntervals.push(interval);
					} else {
						if (course.startHour > interval.startHour) {
							newIntervals.push({ startHour: interval.startHour, endHour: course.startHour });
						}
						if (course.endHour < interval.endHour) {
							newIntervals.push({ startHour: course.endHour, endHour: interval.endHour });
						}
					}
				}
				intervals = newIntervals;
			}

			freeSlots.push(...intervals);
		}

		return freeSlots;
	}

	let coachesWithSlots = $derived(
		coaches
			.map(coach => ({
				coach,
				freeSlots: computeFreeSlots(coach, dayOfWeek, courses)
			}))
			.filter(({ freeSlots }) => freeSlots.length > 0)
	);
</script>

<div class="w-[320px] flex-shrink-0 border-l border-gray-200 bg-white h-full overflow-y-auto">
	<div class="p-4 border-b border-gray-200">
		<h2 class="text-base font-bold text-gray-900">空闲时段汇总</h2>
		<p class="text-sm text-gray-500 mt-1">{DAY_LABELS[dayOfWeek]}</p>
	</div>

	<div class="divide-y divide-gray-100">
		{#each coachesWithSlots as { coach, freeSlots } (coach.id)}
			<div>
				<button
					class="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors"
					onclick={() => toggleCoach(coach.id)}
				>
					<span class="w-3 h-3 rounded-full flex-shrink-0" style="background-color: {coach.color};"></span>
					<span class="text-sm font-medium text-gray-800 flex-1 text-left">{coach.name}</span>
					<svg
						class="w-4 h-4 text-gray-400 transition-transform {expandedCoaches[coach.id] ? 'rotate-180' : ''}"
						fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
					</svg>
				</button>

				{#if expandedCoaches[coach.id]}
					<div class="px-4 pb-3 space-y-2">
						{#each freeSlots as slot (`${slot.startHour}-${slot.endHour}`)}
							<div class="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
								<span class="text-sm text-gray-700">
									{formatHour(slot.startHour)} - {formatHour(slot.endHour)}
								</span>
								<button
									class="px-3 py-1 text-xs font-medium text-white bg-[#F77F00] hover:bg-[#e67300] rounded-md transition-colors"
									onclick={() => onSelectSlot(coach.id, dayOfWeek, slot.startHour, slot.endHour)}
								>
									插班
								</button>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
