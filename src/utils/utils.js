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
        emptyStateTitle: 'No hay tareas pendientes',
        emptyStateSubtext: '¡Agrega una nueva para comenzar!',
        deadlinePreText: 'Fecha límite:',
        noDeadlineText: 'no',
        noDescriptionText: 'sin descripción',
    },
    BUTTONS: {
        delete: 'borrar',
        done: 'listo',
    }
};

/**
 * * crea una versión "debounceada" de una funcion que retrasa su ejecucion hasta que haya
 * transcurrido un tiempo especifico sin ser llamada nuevamente.
 * 
 * @param {Function} func - La funcion a la que se aplicara el debounce
 * @param {number} wait - Tiempo de espera en milisegundos antes de ejecutar la funcion
 * @returns {Function} Una nueva funcion que implementa el comportamiento de debounce
 */
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

/**
 * * sanitiza una cadena de texto para prevenir inyeccion de HTML malicioso
 * convirtiendo caracteres especiales en sus equivalentes HTML seguros.
 * 
 * @param {string} str - cadena de texto a sanitizar
 * @returns {string} cadena de texto sanitizada
 * 
 * @example
 * // Entrada potencialmente maliciosa
 * const userInput = '<script>alert("malicious")</script>';
 * const safe = sanitizeHtml(userInput);
 * // Resultado: &lt;script&gt;alert(&quot;malicious&quot;)&lt;/script&gt;
 */
export function sanitizeHtml(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

/**
 * * convierte una cadena HTML en un elemento DOM y lo retorna
 * 
 * @param {string} htmlString - cadena HTML a convertir
 * @returns {Element} primer elemento hijo del HTML parseado
 * 
 * @example
 * // Crear un elemento desde una cadena HTML
 * const html = '<div class="todo-item"><p>Tarea nueva</p></div>';
 * const element = htmlStringToDom(html);
 * document.body.appendChild(element);
 */
export function htmlStringToDom(htmlString) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = htmlString;
    return html.body.children[0];
}