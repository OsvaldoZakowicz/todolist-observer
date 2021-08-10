//objeto publicador
function Publisher() {
  
  /**
   * *El publicador (Publisher) con estado sera la lista de tareas (ul)
   * *Los observadores seran los interesados en el estado del sujeto
   */
  let todolist = []; //tareas del publicador
  let observers = [] ; //observadores

  /**
   * *Agregar una funcion a la lista de observadores
   * La funcion agregada como parametro sera un observador
   * @param {*} observer 
   */
  function addObserver(observer){
    observers.push(observer);
  }

  /**
   * *Notificar a cada observador
   */
  function notifyObservers(){
    observers.forEach((observer)=>observer());
  }

  /**
   * *Agregar item a la lista de tareas
   * @param {*} item 
   */
  function addTodo(item){
    todolist.push(item);
    notifyObservers();
  }

  /**
   * *Filtrar la lista de tareas para quitar la deseada
   * @param {*} id 
   */
  function removeTodo(id){
    todolist = todolist.filter((todo)=> todo.id !== id);
    notifyObservers();
  }

  /**
   * *Cargar datos provenientes de local storage en el array de tareas
   * @param {*} savedData 
   */
  function loadTodos(savedData){
    todolist = savedData;
    notifyObservers();
  }

  function getTodoList(){
    return todolist;
  }

  return {
    addObserver,
    notifyObservers,
    addTodo,
    removeTodo,
    loadTodos,
    getTodoList
  }
}

//creamos un objeto publicador
const publisher = Publisher();

//Obtenemos el formulario
const formulario = document.getElementById('formulario');

/**
 * *El formulario obtenido responde al evento submit, capturando la tarea ingresada
 * y creando un objeto item, el cual sera agregado a la lista de tareas
 */
formulario.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = formulario.elements[0];
  //objeto item, es decir, una tarea
  const item = {
    id: Date.now(),
    descripcion: input.value,
  };
  publisher.addTodo(item);
  input.value = '';
});


/**
 * *Mostrar tareas dentro de la lista
 * Esta funcion es un observador
 */
function displayTodos(){
  const ul = document.querySelector('ul');
  ul.innerHTML = '';
  publisher.getTodoList().forEach((item) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.innerText = item.descripcion;
    li.appendChild(span);
    const button = document.createElement('button');
    button.innerText = 'listo';
    button.addEventListener('click', ()=>{
      publisher.removeTodo(item.id);
    });
    li.appendChild(button);
    ul.appendChild(li);
  });
}

publisher.addObserver(displayTodos);

/**
 * *Usamos local storage para persistir la lista de tareas
 * Esta funcion es un observador
 */
function persistTodos(){
  localStorage.setItem("saved-todos", JSON.stringify(publisher.getTodoList()));
}

publisher.addObserver(persistTodos);

/**
 * *Evento on load, al cargar, recargar pagina, se restauran el contenido del
 * array de tareas a local storage
 */
window.addEventListener('load', ()=>{
  const savedData = localStorage.getItem("saved-todos");
  if (savedData) {
    publisher.loadTodos(JSON.parse(savedData));
  }
});