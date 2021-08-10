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
  todolist.push(item);
}

/**
 * *Mostrar tareas dentro de la lista 
 */
function displayTodos(){
  //obtenemos la lista desordenada
  const ul = document.querySelector('ul');
  //por cada elemento...
  todolist.forEach((item) => {
    //creamos un item html de la lista
    const li = document.createElement('li');
    //al item le damos la descripcion de la tarea
    li.innerText = item.descripcion;
    //agregamos a la lista el item
    ul.appendChild(li);
  });
}