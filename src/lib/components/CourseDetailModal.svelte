<script lang="ts">
import { DAY_LABELS, COURSE_TYPE_LABELS, COURSE_TYPE_COLORS } from '../types';
import type { Course, Coach, Student } from '../types';

let { course, coaches, students, onClose }: {
	course: Course;
	coaches: Coach[];
	students: Student[];
	onClose: () => void;
} = $props();

let coachName = $derived(coaches.find((c) => c.id === course.coachId)?.name ?? '未知教练');

let courseStudents = $derived(
	students.filter((s) => course.studentIds.includes(s.id))
);

let timeRange = $derived(
	`${DAY_LABELS[course.dayOfWeek]} ${course.startHour}:00-${course.endHour}:00`
);

let typeColor = $derived(COURSE_TYPE_COLORS[course.type]);
</script>

<div class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50" role="dialog" aria-modal="true" onclick={onClose} onkeydown={(e) => { if (e.key === 'Escape') onClose(); }}>
	<div class="modal-content bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6" onclick={(e) => e.stopPropagation()}>
		<div class="flex flex-col gap-5">
			<h2 class="text-xl font-bold text-gray-900 text-center">课程详情</h2>

			<div class="flex items-center gap-2">
				<span
					class="px-3 py-1 rounded-full text-sm font-medium text-white"
					style="background-color: {typeColor}"
				>
					{COURSE_TYPE_LABELS[course.type]}
				</span>
			</div>

			<div class="space-y-3 text-gray-700">
				<div class="flex items-center gap-2">
					<span class="text-gray-500">教练：</span>
					<span class="font-medium text-gray-900">{coachName}</span>
				</div>

				<div class="flex items-center gap-2">
					<span class="text-gray-500">时段：</span>
					<span class="font-medium text-gray-900">{timeRange}</span>
				</div>

				<div>
					<span class="text-gray-500">学员名单：</span>
					{#if courseStudents.length > 0}
						<ul class="mt-2 space-y-1">
							{#each courseStudents as student}
								<li class="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
									<span class="text-gray-900">{student.name}</span>
									<span class="text-gray-400 text-sm">{student.phone}</span>
								</li>
							{/each}
						</ul>
					{:else}
						<span class="text-gray-400 text-sm ml-1">暂无学员</span>
					{/if}
				</div>
			</div>

			<button
				class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors"
				onclick={onClose}
			>
				关闭
			</button>
		</div>
	</div>
</div>
