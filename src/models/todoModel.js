// ============================================================================
// todoModel.js - Logica de datos y patron Observer
// ============================================================================

export function TodoModel() {

    let todoList = [];
    let observers = [];

    function addObserver(observer) {
        if (typeof observer !== 'function') {
            throw new Error('El observador debe ser una funcion');
        }

        observers.push(observer);
    }

    function removeObserver(observer) {
        observers = observer.filter(obs => obs !== observer);
    }

    //? notificar consiste en ejecutar al observador?
    function notifyObservers() {
       observers.forEach((observer, index) => {
            try {
            console.log(`Ejecutando observer ${index}:`, observer.name || 'función anónima');
            observer();
            console.log(`✅ Observer ${index} ejecutado correctamente`);
            } catch (error) {
            console.error(`❌ Error en observer ${index}:`, error);
            console.error('Observer problemático:', observer);
            }
        });
    }

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

    function doneTodo(id) {
        
        const todo = getTodoById(id);
        if (!todo) return;

        todoList = todoList.map(todo =>
            todo.id === id ? {...todo, isDone: true} : todo
        );

        notifyObservers();
        return todoList;
    }

    function removeTodo(id) {
        const initialLength = todoList.length;
        todoList = todoList.filter(todo => todo.id !== id)

        if (todoList.length < initialLength) {
            notifyObservers();
            return true
        }

        return false;
    }

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
     * obtener copia defensiva de lista de tareas
     * ordenada con notas finalizadas al final
     * @returns array
     */
    function getTodoList() {
        return [...todoList].sort((a, b) => a.isDone - b.isDone); // copia defensiva
    }

    function getTodoById(id) {
        return todoList.find(todo => todo.id === id);
    }

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