# ToDo

ToDo es una aplicación web JAMstack para gestión eficiente de tareas, diseñada con arquitectura moderna y enfoque en la experiencia del usuario. Implementa el patrón observador para ofrecer una interfaz reactiva y fluida.

La aplicación sigue principios de código limpio con separación clara de responsabilidades: módulos independientes para el modelo de datos, gestión de localStorage, manipulación del DOM y manejo de formularios. Su diseño mobile-first asegura una experiencia óptima en cualquier dispositivo, mientras que el almacenamiento local permite trabajar sin conexión a internet.

[Prueba la app!! :D](https://osvaldozakowicz.github.io/todolist-observer/)

## Estructura del proyecto

```
├── assets/
├── css/
├── src/
│   ├── controller/
│   │   └── todoController.js    # controlador principal
│   ├── models/
│   │   └── todoModel.js         # modelo de datos y patrón observer
│   ├── storage/
│   │   └── todoStorage.js       # gestión de localstorage
│   ├── utils/
│   │   └── utils.js             # funciones utilitarias
│   └── views/
│       └── todoView.js          # manipulación del dom
├── main.js
├── index.html
├── LICENSE
└── README.md
```

## Patrón de diseño observer

También llamado observador o publicación - suscripción, es un patrón de comportamiento que en palabras simples permite definir una forma de *comunicación desacoplada* entre objetos interesados en ciertos eventos y un objeto observado. Cuando el objeto observado (publicador) realiza una acción de interés notifica a los objetos interesados (suscriptores) para que actúen en consecuencia.

[Ver teoría detallada y ejemplos del patrón](https://refactoring.guru/es/design-patterns/observer)

## Aplicación del patrón al proyecto

En el proyecto el publicador es el modelo ToDo, el archivo `todoModel.js`, se encarga de dos tareas importantes, mantener un listado de la lista de tareas y las tareas, y mantener un listado de los observadores (suscriptores). Cada vez que el publicador realiza una operación de CRUD (crear, listar, actualizar o eliminar) en la lista de tareas notifica a los observadores (funciones) que deben actuar en consecuencia.

Los observadores deben ejecutarse, de esta forma se les 'notifica', existen dos observadores registrados, la función `render()` de `todoView.js` encargada de renderizar la lista de tareas cuando esta cambia y la función `save()` de `todoStorage.js` encargada de guardar la lista en el local storage cuando la lista cambia.

> Observación: para una implementación pequeña como este ejercicio se notifica a todos los observadores, para implementaciones más grandes el patrón de diseño establece que se deben notificar solo a los observadores interesados en un evento específico.