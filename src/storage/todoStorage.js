// ============================================================================
// todoStorage.js - Persistencia de datos
// ============================================================================

import { CONFIG, debounce } from '../utils/utils.js';

export function TodoStorage(model) {

    const debouncedSave = debounce(() => {
        try {
            const data = JSON.stringify(model.getTodoList());
            localStorage.setItem(CONFIG.STORAGE_KEY, data);
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }, 300);

    function save() {
        debouncedSave();
    }

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

    function clear() {
        try {
            localStorage.removeItem(CONFIG.STORAGE_KEY);
        } catch (error) {
            console.error('Error al limpiar localStorage:', error);
        }
    }

    function init() {
        model.addObserver(save);
        load();
    }

    return {
        init,
        save,
        load,
        clear
    };
}