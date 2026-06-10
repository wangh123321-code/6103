<script lang="ts">
import type { OverLimitResult } from '../types';

let { overLimit, coachName, onConfirm, onCancel }: {
	overLimit: OverLimitResult;
	coachName: string;
	onConfirm: () => void;
	onCancel: () => void;
} = $props();
</script>

<div class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50" role="dialog" aria-modal="true" onclick={onCancel} onkeydown={(e) => { if (e.key === 'Escape') onCancel(); }}>
	<div class="modal-content bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6" onclick={(e) => e.stopPropagation()}>
		<div class="flex flex-col items-center text-center gap-4">
			<span class="text-5xl">⚡</span>
			<h2 class="text-xl font-bold text-gray-900">课时超限提醒</h2>

			<div class="text-gray-600 space-y-1">
				<p>教练：<span class="font-medium text-gray-900">{coachName}</span></p>
				<p>当前已排：<span class="font-medium text-gray-900">{overLimit.currentHours} 小时</span></p>
				<p>安排后将达：<span class="font-medium text-red-500">{overLimit.newHours} 小时</span></p>
				<p>每日上限：<span class="font-medium text-gray-900">{overLimit.maxHours} 小时</span></p>
			</div>

			<div class="flex gap-3 w-full">
				<button
					class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors"
					onclick={onCancel}
				>
					取消
				</button>
				<button
					class="flex-1 bg-[#F77F00] hover:bg-[#e67300] text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
					onclick={onConfirm}
				>
					强制安排
				</button>
			</div>
		</div>
	</div>
</div>
