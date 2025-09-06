import { CONFIG } from '../utils/utils.js';

export function TodoController(model) {

    const modal = document.querySelector(CONFIG.SELECTORS.formModal);
    const form = document.querySelector(CONFIG.SELECTORS.form);

    if (!form) {
        throw new Error(`Formulario ${CONFIG.SELECTORS.form} no encontrado`);
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const title = formData.get('title')?.trim();
        const deadline = formData.get('deadline') || '';
        const text = formData.get('text')?.trim() || '';

        if (!title) {
            alert('El título es requerido');
            return;
        }

        try {
            const note = {
                title,
                deadline,
                text
            };

            model.addTodo(note);
            form.reset();
            modal.classList.add('form--hidden');

        } catch (error) {
            console.error('Error al agregar tarea:', error);
            alert('Error al agregar la tarea');
        }
    }

    function setupFormValidation() {
        const titleInput = form.querySelector('[name="title"]');
        if (titleInput) {
            titleInput.addEventListener('blur', (e) => {
                if (!e.target.value.trim()) {
                    e.target.setCustomValidity('El título es requerido');
                } else {
                    e.target.setCustomValidity('');
                }
            });
        }
    }

    function init() {
        form.addEventListener('submit', handleFormSubmit);
        setupFormValidation();
    }

    return {
        init
    };
}