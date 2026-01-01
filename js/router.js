// Basic Router Implementation for Tools SPA

const routes = {
    '': 'home',
    '#home': 'home',
    '#tool-password': 'tool-password',
    '#tool-uuid': 'tool-uuid',
    '#tool-slug': 'tool-slug',
    '#tool-laravel': 'tool-laravel',
    '#tool-base64': 'tool-base64',
    '#tool-json': 'tool-json',
    '#tool-timestamp': 'tool-timestamp',
    '#tool-lorem': 'tool-lorem'
};

function handleRoute() {
    const hash = window.location.hash || '#home';
    const viewId = routes[hash] || 'home';

    // Hide all views
    document.querySelectorAll('.page-view').forEach(view => {
        view.classList.add('hidden');
    });

    // Show current view
    const currentView = document.getElementById(`view-${viewId}`);
    if (currentView) {
        currentView.classList.remove('hidden');
        window.scrollTo(0, 0);
    }
}

// Initialize Router
window.addEventListener('hashchange', handleRoute);
document.addEventListener('DOMContentLoaded', handleRoute);
