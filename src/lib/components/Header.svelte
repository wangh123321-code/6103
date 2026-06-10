<script lang="ts">
import { DAYS, DAY_LABELS } from '../types';
import type { DayOfWeek, ViewRole } from '../types';
import WeekSelector from './WeekSelector.svelte';

let { currentDay, viewRole, onDayChange, onRoleChange }: {
	currentDay: DayOfWeek;
	viewRole: ViewRole;
	onDayChange: (day: DayOfWeek) => void;
	onRoleChange: (role: ViewRole) => void;
} = $props();

const ROLE_OPTIONS: { value: ViewRole; label: string }[] = [
	{ value: 'manager', label: '店长' },
	{ value: 'coach', label: '教练' },
	{ value: 'student', label: '学员' }
];

let mobileMenuOpen = $state(false);

function handleDayClick(day: DayOfWeek) {
	onDayChange(day);
	mobileMenuOpen = false;
}
</script>

<header class="bg-[#1B4332] text-white">
	<div class="flex items-center justify-between px-4 md:px-6 py-3">
		<h1 class="text-base md:text-lg font-bold whitespace-nowrap flex items-center gap-2">
			<span class="text-xl">🏓</span>
			<span class="hidden sm:inline">乒乓球俱乐部排课看板</span>
			<span class="sm:hidden">排课看板</span>
		</h1>

		<nav class="hidden md:flex items-center gap-1">
			{#each DAYS as day}
				<button
					class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors {currentDay === day
						? 'bg-[#F77F00] text-white'
						: 'text-white/70 hover:bg-white/10'}"
					onclick={() => onDayChange(day)}
				>
					{DAY_LABELS[day]}
				</button>
			{/each}
		</nav>

		<div class="flex items-center gap-3">
			<select
				class="bg-white/10 border border-white/20 rounded-lg px-2 md:px-3 py-1.5 text-sm text-white outline-none"
				value={viewRole}
				onchange={(e) => onRoleChange((e.target as HTMLSelectElement).value as ViewRole)}
			>
				{#each ROLE_OPTIONS as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>

			<button
				class="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:bg-white/10 transition-colors"
				onclick={() => mobileMenuOpen = !mobileMenuOpen}
				aria-label="切换日期"
			>
				<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
		</div>
	</div>

	{#if mobileMenuOpen}
		<nav class="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto">
			{#each DAYS as day}
				<button
					class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap {currentDay === day
						? 'bg-[#F77F00] text-white'
						: 'text-white/70 hover:bg-white/10'}"
					onclick={() => handleDayClick(day)}
				>
					{DAY_LABELS[day]}
				</button>
			{/each}
		</nav>
	{/if}
</header>
