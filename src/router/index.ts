import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
			children: [
				{
					path: '/',
					name: 'visio',
					component: () => import('../components/Visio/Visio.vue'),
				},
				{
					path: '/mediation',
					name: 'mediation',
					component: () => import('../components/Mediation/Mediation.vue'),
				},
			],
		},
	],
})

export default router
