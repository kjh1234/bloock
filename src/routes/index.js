import Dashboard from '../views/dashboard.svelte'
import Bundle from '../views/bundle.svelte'
import Launcher from '../views/launcher.svelte'

const routes = [
    {
        name: '/',
        component: Dashboard
    },
    {
        name: 'bundle/:bundleId',
        component: Bundle,
        nestedRoutes: [{
            name: 'launcher/:lancherId',
            component: Launcher,
        }]
    }
]

export { routes }