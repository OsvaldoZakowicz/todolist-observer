// ============================================================================
// utils.js - Utilidades generales
// ============================================================================

export const CONFIG = {
    STORAGE_KEY: 'saved-todos',
    SELECTORS: {
        form: '#form', // id del fomulario
        formModal: '#modal', // id del modal form
        notesList: '#notes' // id del contenedor de notas
    },
    TEXTS: {
        emptyStateTitle: 'No hay notas pendientes',
        emptyStateSubtext: '¡Agrega una nueva nota para comenzar!',
        deadlinePreText: 'Fecha límite:',
        noDeadlineText: 'no',
        noDescriptionText: 'sin descripción',
    },
    BUTTONS: {
        delete: 'borrar',
        done: 'listo',
    }
};

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function sanitizeHtml(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

export function htmlStringToDom(htmlString) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = htmlString;
    return html.body.children[0];
}