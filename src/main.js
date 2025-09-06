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
            // inicializar modelo
            // NOTA: es ademas el Publicador
            this.model = TodoModel();

            // inicializar componentes
            this.view = TodoView(this.model); //manipular vista
            this.storage = TodoStorage(this.model); // manipular local storage
            this.controller = TodoController(this.model); // controlar formulario

            // inicializar todos los componentes
            // ejecutar el init de cada componente
            this.storage.init(); // primero cargar datos
            this.view.init();
            this.controller.init();

            console.log('Todo App inicializada correctamente');
        } catch (error) {
            console.error('Error al inicializar la aplicación:', error);
        }
    }

    destroy() {
        // limpiar observers y event listeners si es necesario
        if (this.model) {
            this.model.clearAll();
        }
    }
}

// inicializar cuando el DOM este listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new TodoApp();
    app.init();

    // hacer disponible globalmente para debugging
    // window.todoApp = app;
});