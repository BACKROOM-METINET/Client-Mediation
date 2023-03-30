import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Complexity } from '../client/types/business'

const KEY_HOLISTIC_COMPLEXITY = 'holystic-complexity'

export const useSettingStore = defineStore('setting', () => {
	// States

	const holisticComplexityRef = ref<Complexity>(
		Number.parseInt(
			localStorage.getItem(KEY_HOLISTIC_COMPLEXITY) ?? '1'
		) as Complexity
	)

	// Getters

	const holisticComplexity = computed(() => holisticComplexityRef)

	// Actions

	function setHolysticComplexity(complexity: Complexity) {
		localStorage.setItem(KEY_HOLISTIC_COMPLEXITY, complexity.toString())
		holisticComplexityRef.value = complexity
	}

	return { holisticComplexity, setHolysticComplexity }
})
