import { TodoModel } from './models/todoModel.js';
import { TodoView } from './views/todoView.js';
import { TodoStorage } from './storage/todoStorage.js';
import { TodoController } from './controller/todoController.js';

class TodoApp {
    constructor() {
        this.model = null;
        this.view = null;
        this.storage = null;
        this.controller = null;
    }

    init() {
        try {
            // Inicializar modelo
            this.model = TodoModel();

            // Inicializar componentes
            this.view = TodoView(this.model);
            this.storage = TodoStorage(this.model);
            this.controller = TodoController(this.model);

            // Inicializar todos los componentes
            this.storage.init(); // Primero cargar datos
            this.view.init();
            this.controller.init();

            console.log('Todo App inicializada correctamente');
        } catch (error) {
            console.error('Error al inicializar la aplicación:', error);
        }
    }

    destroy() {
        // Limpiar observers y event listeners si es necesario
        if (this.model) {
            this.model.clearAll();
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new TodoApp();
    app.init();

    // Hacer disponible globalmente para debugging
    window.todoApp = app;
});