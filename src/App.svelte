<script lang="ts">
	import { scheduleStore } from './lib/stores/schedule.svelte';
	import type { DayOfWeek, ViewRole } from './lib/types';
	import Header from './lib/components/Header.svelte';
	import ScheduleBoard from './lib/components/ScheduleBoard.svelte';
	import StudentSchedule from './lib/components/StudentSchedule.svelte';

	let currentView = $derived(
		scheduleStore.viewRole === 'student' ? 'student' : 'board'
	);
</script>

<div class="flex flex-col h-screen">
	<Header
		currentDay={scheduleStore.currentDay}
		viewRole={scheduleStore.viewRole}
		onDayChange={(day: DayOfWeek) => scheduleStore.currentDay = day}
		onRoleChange={(role: ViewRole) => scheduleStore.viewRole = role}
	/>

	<div class="flex-1 overflow-hidden">
		{#if currentView === 'student'}
			<StudentSchedule />
		{:else}
			<ScheduleBoard />
		{/if}
	</div>
</div>
