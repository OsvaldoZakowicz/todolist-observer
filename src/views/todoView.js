// ============================================================================
// todoView.js - Lógica de presentación y DOM
// ============================================================================

import { CONFIG, sanitizeHtml, htmlStringToDom } from '../utils/utils.js';

export function TodoView(model) {

    const notesList = document.querySelector(CONFIG.SELECTORS.notesList);
    console.log(notesList);
    

    if (!notesList) {
        throw new Error(`Elemento ${CONFIG.SELECTORS.notesList} no encontrado`);
    }

    // template del encabezado de nota
    function noteHeaderTemplate(title, deadline) {
        return `<header class="note__header">
                    <p class="note__title">${sanitizeHtml(title)}</p>
                    <p class="note__deadline">${sanitizeHtml(deadline || 'sin fecha limite')}</p>
                </header>`
    }

    // template del contenido principal de la nota
    function noteBodyTemplate(text) {
        return `<main class="note__body">
                    <p class="note__text">${sanitizeHtml(text || 'sin texto')}</p>
                </main>`
    }

    // template del footer y controles de la nota
    // NOTA: es escencial el data-action="" y data-id="" para eventos
    function noteControlsTemplate(itemId) {
        return `<footer class="note__controls">
              <button type="button" class="btn btn--delete" data-action="delete" data-id="${itemId}">borrar</button>
              <button type="button" class="btn btn--done" data-action="done" data-id="${itemId}">listo!</button>
            </footer>`;
    }


    function createTodoElement(item) {
        //article principal
        const article = document.createElement('article');
        article.classList.add('note');
        //article.id.add(item.id);

        //header
        const noteHeaderHtml = noteHeaderTemplate(item.title, item.deadline);
        const noteHeaderElement = htmlStringToDom(noteHeaderHtml);
        article.appendChild(noteHeaderElement);

        //main
        const noteBodyHtml = noteBodyTemplate(item.text);
        const noteBodyElement = htmlStringToDom(noteBodyHtml);
        article.appendChild(noteBodyElement);

        // footer
        const noteControlsHtml = noteControlsTemplate(item.id);
        const noteControlsElement = htmlStringToDom(noteControlsHtml);
        article.appendChild(noteControlsElement);

        return article;
    }

    /**
     * * renderizar todas las tareas en el frontend
     * 1. Usuario hace acción (agregar/eliminar tarea)
     * 2. Controller llama model.addTodo() o model.removeTodo()
     * 3. Model actualiza su estado interno
     * 4. Model ejecuta notifyObservers()
     * 5. render() se ejecuta automáticamente
     * 6. render() reconstruye TODA la UI desde cero
     * 7. Una sola operación DOM actualiza la vista
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
        console.log('tareas desde model: ', todos);
        
        // limpiar contenido actual
        // NOTA: Virtual DOM approach: recrear desde cero es más simple
        notesList.innerHTML = '';

        if (todos.length === 0) {
            console.log("tareas: " , todos.length);
            
            // no hay tareas que mostrar
            // NOTA: Empty State es una practica UX esencial
            const emptyMessage = document.createElement('div');
            emptyMessage.classList.add('subtitle');
            emptyMessage.innerHTML = `
                <p>No hay tareas pendientes</p>
                <small>¡Agrega una nueva tarea para comenzar!</small>
            `;

            fragment.appendChild(emptyMessage);
        } else {
            console.log("tareas: " , todos.length);

            todos.forEach(item => {
                console.log(item);
                
                const todoElement = createTodoElement(item);
                fragment.appendChild(todoElement);
            });
        }

        /**
         * 1 sola manipulacon del DOM real
         * el fragment se "vacía" automaticamente despues de esto
         * finalmente todos los elementos pasan del fragment al DOM de una vez
         */
        notesList.appendChild(fragment);
    }

    /**
     * * configurar delegacion de eventos para los botones
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
                    // logica para terminar una tarea
                    break;

                default:
                    console.warn(`Acción no reconocida: ${action}`);
                    break;
            }
        })
    }

    /**
     * Inicializar el componente
     */
    function init() {
        setupEventDelegation();

        // Registrar como observador del modelo
        model.addObserver(render);
        render();

        console.log('TodoView inicializado');
    }

    /**
     * Limpiar event listeners y observers
     */
    function destroy() {
        // Aqui podria limpiar listeners si fuera necesario
        console.log('TodoView destruido');
    }

    // API publica del modulo
    return {
        init,
        render,
        destroy
    };
}