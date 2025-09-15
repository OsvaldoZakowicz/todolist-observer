// ============================================================================
// * todoView.js - Lógica de presentación y DOM
// ============================================================================

import { CONFIG, sanitizeHtml, htmlStringToDom } from '../utils/utils.js';

export function TodoView(model) {

    const subtitleNotes = document.querySelector('#subtitle-notes');
    const notesList = document.querySelector(CONFIG.SELECTORS.notesList);


    if (!notesList) {
        throw new Error(`Elemento ${CONFIG.SELECTORS.notesList} no encontrado`);
    }

    /**
     * * template del encabezado de nota
     * 
     * genera html del encabezado aplicando clase 'note-done' 
     * si la tarea está completada y sanitiza el contenido
     * 
     * @param {string} title - titulo de la nota
     * @param {string} deadline - fecha limite (opcional)
     * @param {boolean} isDone - estado de completado
     * @returns {string} html del encabezado con estilos y contenido sanitizado
     */
    function noteHeaderTemplate(title, deadline, isDone) {
        return `<header class="note__header ${isDone ? ' note-done' : ''}">
                    <p class="note__title">${sanitizeHtml(title)}</p>
                    <p class="note__deadline">${CONFIG.TEXTS.deadlinePreText} ${sanitizeHtml(deadline || CONFIG.TEXTS.noDeadlineText)}</p>
                </header>`
    }

    /**
     * * template del contenido principal de la nota
     * 
     * genera html del cuerpo aplicando clase 'note-done' 
     * si la tarea está completada y sanitiza el contenido
     * 
     * @param {string} text texto de la nota
     * @param {boolean} isDone estado de completado
     * @returns {string} html del cuerpo con estilos y contenido sanitizado
     */
    function noteBodyTemplate(text, isDone) {
        return `<main class="note__body ${isDone ? ' note-done' : ''}">
                    <p class="note__text">${sanitizeHtml(text || CONFIG.TEXTS.noDescriptionText)}</p>
                </main>`
    }

    /**
     * * template del footer y controles de la nota
     * * NOTA: es escencial el data-action="" y data-id="" para eventos
     * 
     * @param {number} itemId id de la nueva nota
     * @param {boolean} isDone estado de completado
     * @returns {string} html del pie de nota con estilos
     */
    function noteControlsTemplate(itemId, isDone) {
        return `<footer class="note__controls">
              <button type="button" class="btn btn--delete" data-action="delete" data-id="${itemId}">${CONFIG.BUTTONS.delete}</button>
              <button type="button" class="btn btn--done ${isDone ? ' note__controls--hidden' : ''}" data-action="done" data-id="${itemId}">${CONFIG.BUTTONS.done}</button>
            </footer>`;
    }

    /**
     * * template para el estado vacio
     * 
     * cuando no hay notas que mostrar
     * @returns {string} html con subtitulo y texto
     */
    function emptyStateTemplate() {
        return `<p class="subtitle">${CONFIG.TEXTS.emptyStateTitle}</p>
                <p class="text-base">${CONFIG.TEXTS.emptyStateSubtext}</p>`;
    }

    /**
     * 
     * @param {Object} item - una tarea
     * @param {string} item.title - titulo de la tarea (requerido)
     * @param {string} [item.deadline] - fecha límite opcional
     * @param {string} [item.text] - descripcion opcional
     * @param {number} [item.id] - id de nota
     * @returns {HTMLElement} elemento html de una nota completa
     */
    function createTodoElement(item) {
        //article principal
        const article = document.createElement('article');
        article.classList.add('note');

        //header
        const noteHeaderHtml = noteHeaderTemplate(item.title, item.deadline, item.isDone);
        const noteHeaderElement = htmlStringToDom(noteHeaderHtml);
        article.appendChild(noteHeaderElement);

        //main
        const noteBodyHtml = noteBodyTemplate(item.text, item.isDone);
        const noteBodyElement = htmlStringToDom(noteBodyHtml);
        article.appendChild(noteBodyElement);

        // footer
        const noteControlsHtml = noteControlsTemplate(item.id, item.isDone);
        const noteControlsElement = htmlStringToDom(noteControlsHtml);
        article.appendChild(noteControlsElement);

        return article;
    }

    /**
     * * renderizar todas las tareas en el frontend
     * 
     * 1. Usuario hace acción (agregar/eliminar tarea)
     * 2. Controller llama model.addTodo() o model.removeTodo()
     * 3. Model actualiza su estado interno
     * 4. Model ejecuta notifyObservers()
     * 5. render() se ejecuta automáticamente
     * 6. render() reconstruye TODA la UI desde cero
     * 7. Una sola operación DOM actualiza la vista
     * 
     */
    function render() {

        /**
         * * document fragment para performance
         * ¿Qué hace?
         * Crea un contenedor temporal en memoria (no en el DOM)
         * Es como un "borrador" donde construimos todo antes de mostrarlo
         * 
         * ¿Por qué?
         * 1 sola manipulación del DOM vs múltiples
         * Sin fragment: cada appendChild() = 1 repaint/reflow
         * Con fragment: solo 1 repaint/reflow al final
         */
        const fragment = document.createDocumentFragment();

        // desde todoModel.js
        // NOTA: retorna copia defensiva del listado de items
        const todos = model.getTodoList();

        // limpiar contenido actual
        // NOTA: Virtual DOM approach: recrear desde cero es más simple
        notesList.innerHTML = '';

        if (todos.length === 0) {

            // no hay tareas que mostrar
            // NOTA: Empty State es una practica UX esencial
            const emptyState = document.createElement('div');
            emptyState.innerHTML = emptyStateTemplate();

            subtitleNotes.classList.add('hidden');
            fragment.appendChild(emptyState);

        } else {

            subtitleNotes.classList.remove('hidden');
            todos.forEach(item => {
                const todoElement = createTodoElement(item);
                fragment.appendChild(todoElement);
            });

        }

        /**
         * 1 sola manipulacon del DOM para agregar notas
         * el fragment se "vacía" automaticamente despues de esto
         * finalmente todos los elementos pasan del fragment al DOM de una vez
         */
        notesList.appendChild(fragment);
    }

    /**
     * * configurar delegacion de eventos para los botones
     * 
     * En lugar de agregar listeners a cada botón individual,
     * ponemos UN SOLO listener en el contenedor padre y
     * "delegamos" el manejo de eventos.
     * 
     * Al realizarse click en el boton borrar o terminar
     * el evento "burbujea" por el dom hacia arriba en la estructura de nota
     * hasta encontrar el elemento pade (toda la seccion de notas) que maneja evento click
     * luego closest() identifica el boton y con el el action a manejar y el id de nota involucrado
     */
    function setupEventDelegation() {
        notesList.addEventListener('click', (event) => {

            /**
             * Busca hacia arriba en el DOM desde el elemento clickeado
             * Encuentra el primer elemento que tenga data-action
             * Devuelve null si no encuentra nada.
             * 
             */
            const button = event.target.closest('[data-action]');
            if (!button) return;

            const action = button.dataset.action;
            const id = parseInt(button.dataset.id);
            if (!id) return;

            switch (action) {
                case 'delete':
                    if (confirm('¿Estás seguro de que quieres borrar esta tarea?')) {
                        model.removeTodo(id);
                    }
                    break;

                case 'done':
                    if (confirm('¿Terminaste esta tarea?')) {
                        model.doneTodo(id);
                    }
                    break;

                default:
                    console.warn(`Acción no reconocida: ${action}`);
                    break;
            }
        })
    }

    /**
     * * inicializar el componente
     */
    function init() {
        setupEventDelegation();

        // registrar como observador del modelo
        model.addObserver(render);

        // ejecutar un primer render
        render();

        console.log('TodoView inicializado');
    }

    /**
     * * limpiar event listeners y observers
     */
    function destroy() {
        // aqui podria limpiar listeners si fuera necesario
        console.log('TodoView destruido');
    }

    return {
        init,
        render,
        destroy
    };
}