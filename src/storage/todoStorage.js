// ============================================================================
// * todoStorage.js - Persistencia de datos
// ============================================================================

import { CONFIG, debounce } from '../utils/utils.js';

export function TodoStorage(model) {

    /**
     * funcion debounceada que guarda el estado actual del modelo en local storage.
     * espera 300ms después de la última llamada antes de realizar el guardado,
     * optimizando así las operaciones de escritura frecuentes.
     * 
     * @type {Function}
     * @private
     */
    const debouncedSave = debounce(() => {
        try {
            const data = JSON.stringify(model.getTodoList());
            localStorage.setItem(CONFIG.STORAGE_KEY, data);
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }, 300);

    /**
     * * llama a un guardado con un debounce
     */
    function save() {
        debouncedSave();
    }

    /**
     * * cargar las tareas desde local storage al modelo
     * 
     * @returns {boolean} true si se cargaron las tareas
     */
    function load() {
        try {
            const savedData = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                model.loadTodos(parsedData);
                return true;
            }
        } catch (error) {
            console.error('Error al cargar desde localStorage:', error);
        }
        return false;
    }

    /**
     * * elimina todo el local storage
     */
    function clear() {
        try {
            localStorage.removeItem(CONFIG.STORAGE_KEY);
        } catch (error) {
            console.error('Error al limpiar localStorage:', error);
        }
    }

    /**
     * * inicializacion
     */
    function init() {

        // registrar como observador del modelo
        model.addObserver(save);

        // carga inicial
        load();
    }

    return {
        init,
        save,
        load,
        clear
    };
}