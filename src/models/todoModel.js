// ============================================================================
// * todoModel.js - logica de datos y patron observador
// ============================================================================

export function TodoModel() {

    let todoList = [];
    let observers = [];

    /**
     * * agrega un nuevo observador a notificar
     * 
     * valida que el parametro observador sea de tipo function
     * @param {Function} observer 
     */
    function addObserver(observer) {
        if (typeof observer !== 'function') {
            throw new Error('El observador debe ser una funcion');
        }

        observers.push(observer);
    }

    /**
     * * remueve un observador de la lista
     * 
     * valida que el parametro observador sea de tipo function
     * @param {Function} observer 
     */
    function removeObserver(observer) {
        if (typeof observer !== 'function') {
            throw new Error('El observador debe ser una funcion');
        }

        observers = observers.filter(obs => obs !== observer);
    }

    /**
     * * notifica a los observadores
     */
    function notifyObservers() {
        observers.forEach((observer, index) => {
            try {
                observer();
            } catch (error) {
                console.error(`Error en observer ${index}:`, error);
                console.error('Observer problemático:', observer);
            }
        });
    }

    /**
     * * crea un todo y lo agrega a la lista,
     * notifica a los observadores
     * 
     * @param {Object} item - datos para una nueva tarea
     * @param {string} item.title - título de la tarea (requerido)
     * @param {string} [item.deadline] - fecha límite opcional
     * @param {string} [item.text] - descripción opcional
     * @param {number} [item.id] - id opcional, se genera automaticamente
     * @returns {Object} newTodo - la tarea creada
     */
    function addTodo(item) {
        if (!item || !item.title?.trim()) {
            throw new Error('Item invalido, se requiere un titulo.');
        }

        const newTodo = {
            id: item.id || Date.now(),
            title: item.title || '',
            deadline: item.deadline || '',
            text: item.text?.trim() || '',
            isDone: false,
        }

        todoList = [newTodo, ...todoList];
        notifyObservers();
        return newTodo;
    }

    /**
     * * actualiza el estado de una tarea,
     * notifica a los observadores
     * 
     * @param {*} id id de una tarea
     * @returns {Array} lista de tareas actualizada
     */
    function doneTodo(id) {

        const todo = getTodoById(id);
        if (!todo) return;

        todoList = todoList.map(todo =>
            todo.id === id ? { ...todo, isDone: true } : todo
        );

        notifyObservers();
        return todoList;
    }

    /**
     * * elimina una tarea,
     * notifica a los observadores
     * 
     * @param {*} id de una tarea
     * @returns {boolean} true si se elimino
     */
    function removeTodo(id) {
        const initialLength = todoList.length;
        todoList = todoList.filter(todo => todo.id !== id)

        if (todoList.length < initialLength) {
            notifyObservers();
            return true
        }

        return false;
    }

    /**
     * * carga tareas a la lista desde local storage,
     * notifica a observadores
     * 
     * @param {*} savedData datos JSON obtenidos desde local storage
     * @returns 
     */
    function loadTodos(savedData) {
        if (!Array.isArray(savedData)) {
            console.warn('Datos invalidos para cargar tareas.');
            return;
        }

        todoList = savedData.map(item => ({
            id: item.id,
            title: item.title || '',
            deadline: item.deadline || '',
            text: item.text || '',
            isDone: item.isDone || false,
        }))
            .sort((a, b) => a.isDone - b.isDone);

        notifyObservers();
    }

    /**
     * * obtiene una copia defensiva de lista de tareas
     * ordenada con notas finalizadas al final.
     * 
     * @returns {Array}
     */
    function getTodoList() {
        return [...todoList].sort((a, b) => a.isDone - b.isDone); // copia defensiva
    }

    /**
     * * obtiene una tarea buscando por id
     * 
     * @param {*} id de tarea
     * @returns {Object} una tarea
     */
    function getTodoById(id) {
        return todoList.find(todo => todo.id === id);
    }

    /**
     * * elimina todas las tareas
     * sin importar su estado
     */
    function clearAll() {
        todoList = [];
        notifyObservers();
    }

    return {
        addObserver,
        removeObserver,
        notifyObservers,
        addTodo,
        doneTodo,
        removeTodo,
        loadTodos,
        getTodoList,
        getTodoById,
        clearAll
    };

}