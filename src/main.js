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
const form = document.getElementById('form');

/**
 * *El formulario obtenido responde al evento submit, capturando la tarea ingresada
 * y creando un objeto "note", el cual sera agregado a la lista de tareas
 */
form.addEventListener('submit', (e) => {
  e.preventDefault();
  //title
  const noteTitle = form.elements[0];
  //deadline date
  const noteDateDeadLine = form.elements[1];
  //text
  const noteText = form.elements[2];
  //object note
  const note = {
    id: Date.now(),
    title: noteTitle.value,
    deadline: noteDateDeadLine.value,
    text: noteText.value
  };
  //save note
  publisher.addTodo(note);
  //clear inputs
  noteTitle.value = "";
  noteDateDeadLine.value = "";
  noteText.value = "";
});

/**
 * *Generar el template html string de una nota
 * @param {*} title titulo de la nota 
 * @param {*} deadline fecha limite
 * @param {*} text cuerpo de la nota
 * @returns template
 */
function noteBodyTemplate(deadline, text) {
  return `<div class="note__body">
            <div class="note__section note__section--status">
              <span class="note__subtitle">fecha limite: ${deadline}</span>
            </div>
            <div class="note__section note__section--text">
              <p class="note__text">${text}</p>
            </div>
          </div>`;
}

/**
 * * Transformar htmlString a un nodo DOM correcto
 * @param {*} htmlString 
 * @returns 
 */
function htmlStringToDom(htmlString) {
  //HTMLString debe convertirse a html, para ello primero crearemos un marco html
  const html = document.implementation.createHTMLDocument();
  //para convertir HTMLString a html sintáctico, hacemos que html incluya a HTMLString
  html.body.innerHTML = htmlString;
  //ahora simplemente retornamos el htmlString (template de nota)
  //como un nodo DOM correcto
  return html.body.children[0];
}

/**
 * *Mostrar tareas dentro de la lista
 * Esta funcion es un observador, mostrara la lista de
 * tareas, creando el HTML necesario para visualizar cada
 * una
 */
function displayTodos(){
  //the ul element
  const ul = document.getElementById('notes');
  //first, clear the view of all notes
  ul.innerHTML = '';
  //for each note "Object" in the list, create a html li
  publisher.getTodoList().forEach((item) => {
    //li (note)
    const li = document.createElement('li');
    li.classList.add('note');
    //div (title and link container)
    const div = document.createElement('div');
    div.classList.add('note__section','note__section--header');
    //span title
    const span = document.createElement('span');
    span.classList.add('note__title');
    span.innerText = item.title;
    //button
    const button = document.createElement('button');
    button.classList.add('note__button');
    button.innerText = 'listo'
    button.addEventListener('click', () => {
      publisher.removeTodo(item.id);
    });
    //note heading
    div.appendChild(span);
    div.appendChild(button);
    li.appendChild(div);
    //note body
    const noteBody = noteBodyTemplate(item.deadline, item.text);
    const noteBodyToDom = htmlStringToDom(noteBody);
    li.append(noteBodyToDom);
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