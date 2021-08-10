/**
 * *El publicador (sujeto) con estado sera lalista de tareas (ul)
 * *Los observadores seran los interesados en el estado del sujeto
 */
let todolist = []; //publicador
let observers = [] ; //observadores

/**
 * *Obtenemos el formulario
 */
const formulario = document.getElementById('formulario');

/**
 * *El formulario obtenido responde al evento submit, capturando la tarea ingresada
 * y creando un objeto item, el cual sera agregado a la lista de tareas
 */
formulario.addEventListener('submit', (e) => {
  //evitamos el comportamiento por defecto
  e.preventDefault();
  //obtenemos el input del formulario
  const input = formulario.elements[0];
  //creamos un objeto de la lista de tareas, un item
  const item = {
    //id del item, debe ser unico, usaremos la fecha
    id: Date.now(),
    descripcion: input.value,
  };
  //agregar el item a la lista de tareas
  addTodo(item);
  //despejamos el input del formulario
  input.value = '';
});

/**
 * *Agregar item a la lista de tareas
 * @param {*} item 
 */
function addTodo(item){
  //agregamos a la lista un item
  todolist.push(item);
  //notificamos a los observadores, ya que el publicador tiene cambios
  notifyObservers();
}

/**
 * *Mostrar tareas dentro de la lista 
 */
function displayTodos(){
  //obtenemos la lista desordenada
  const ul = document.querySelector('ul');
  //limpiar constante ul
  ul.innerHTML = '';
  //por cada elemento...
  todolist.forEach((item) => {
    //creamos un item html de la lista
    const li = document.createElement('li');
    //al item le damos la descripcion de la tarea
    li.innerText = item.descripcion;
    //crear un boton de eliminar, y agregar este a cada li
    const button = document.createElement('button');
    button.innerText = 'Quitar';
    //evento para quitar item de la lista
    button.addEventListener('click', ()=>{
      removeTodo(item.id);
    });
    li.appendChild(button);
    //agregamos a la lista el item
    ul.appendChild(li);
  });
}

/**
 * *Agregar una funcion a la lista de observadores
 * La funcion agregada como parametro sera un observador
 * @param {*} observer 
 */
function addObserver(observer){
  //agregar funcion a la lista de observadores
  observers.push(observer);
}
addObserver(displayTodos);

/**
 * *Notificar a cada observador
 */
function notifyObservers(){
  observers.forEach((observer)=>observer());
}

/**
 * *Filtrar la lista de tareas para quitar la deseada
 * @param {*} id 
 */
function removeTodo(id){
  //uso de filter
  todolist = todolist.filter((todo)=> todo.id !== id);
  //notificar observadores
  notifyObservers();
}

