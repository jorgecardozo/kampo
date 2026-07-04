- [1. Mock Node Prendarios - Aplicación de Mock para Desarrollo y Testing](#1-mock-node-prendarios---aplicación-de-mock-para-desarrollo-y-testing)
  - [1.1. Características principales](#11-características-principales)
  - [1.2. Instalación](#12-instalación)
  - [1.3. Uso y configuración:](#13-uso-y-configuración)
  - [1.4. Ejecución:](#14-ejecución)
- [2. Comandos adicionales](#2-comandos-adicionales)
- [3. Personalización y expansión](#3-personalización-y-expansión)
- [4. TO-DO](#4-to-do)

# 1. Mock Node Prendarios - Aplicación de Mock para Desarrollo y Testing

Mock Node es una aplicación de servidor Node.js diseñada para facilitar el desarrollo y el testing frontend al proporcionar mocks de API y servicios. Esta aplicación te permite simular respuestas de API y definir comportamientos personalizados para rutas específicas a través de un entorno visual intuitivo.

## 1.1. Características principales

- Crea fácilmente mocks de API para tus endpoints y rutas.
- Define respuestas personalizadas para cada ruta o endpoint.
- Simula diferentes comportamientos, como retrasos en la respuesta o errores.
- Soporta múltiples stubs por endpoint para una mayor flexibilidad.
- Permite stubs dinámicos que se pueden evaluar en tiempo de ejecución.
- Interactúa con el mock a través de un entorno visual para actualizar, modificar, crear y eliminar stubs.
- Capacidad de modificar el código para casos concretos, como la prueba de un login con token o persistencia de datos, sin afectar otros endpoints.

## 1.2. Instalación

- Asegúrate de tener Node.js instalado en tu máquina.
- Abre una terminal en el directorio raíz del proyecto.
- Ejecuta el comando `npm install` para instalar las dependencias.

## 1.3. Uso y configuración:

1. Abre el entorno visual de Mock Node en tu navegador. La URL predeterminada de la api es http://localhost:8080.
2. Utiliza la interfaz visual para agregar, modificar o eliminar endpoints y stubs. Puedes definir las respuestas, comportamientos y reglas específicas para cada endpoint.
3. El entorno visual estará disponible en http://localhost:8080/mocknode
4. Se puede checkear que funciona correctamente la api realizando la siguiente consulta en la consola del navegador:
   ` fetch("http://localhost:8080/test").then(res=>res.json()).then(data=>console.log(data))`

## 1.4. Ejecución:

- En la terminal, ejecuta el comando `npm start` para iniciar el servidor de Mock Node.
- El servidor se ejecutará en el puerto predeterminado (o el puerto especificado en el archivo de configuración).
- Apunta tus aplicaciones frontend a la URL del servidor de Mock Node y utiliza los endpoints y rutas definidos en tus mocks.
- Mock Node interceptará las solicitudes y responderá con las respuestas y comportamientos configurados en tus stubs.
- Utiliza el entorno visual para realizar cambios dinámicos en los stubs y observa los efectos en tiempo real en tus aplicaciones frontend.
- **Ten en cuenta que si se crea un stub desde el entorno visual el nombre del stub definirá el tipo de archivo a retornar**, si creo un stub `respuesta_ok` el retorno será un archivo sin extensión descargable del mismo nombre. En caso de querer retornar un json, html u otro archivo asegurarse que debe ser creado con la misma extensión en el nombre, por ejemplo `respuesta_ok.json`.

# 2. Comandos adicionales

Además de la funcionalidad principal descrita anteriormente, Mock Node también ofrece algunos comandos adicionales para facilitar tu flujo de trabajo:

- `npm run export`: Exporta la configuración actual de Mock Node en un archivo mocknode-config.tar para respaldos o compartir con otros miembros del equipo.
- `npm run import`: Importa una configuración previamente exportada desde un archivo .tar para restaurar o compartir configuraciones.

# 3. Personalización y expansión

Si deseas personalizar o expandir la funcionalidad de Mock Node, puedes modificar el código según tus necesidades específicas. Ten en cuenta los siguientes aspectos:

- Asegúrate de no afectar el funcionamiento de otros endpoints y stubs al realizar modificaciones en el código.
- Considera mantener la interfaz visual intacta y funcional, ya que es una parte importante de la experiencia de uso de Mock Node.

# 4. TO-DO

- Cambiar el front-end desarrollado por el equipo de OBP y utilizar uno propio que no esté minificado y uglificado, lo que facilitará la lectura y la realización de modificaciones específicas en el código y simplificará el añadir funcionalidades pudiendo ofrecer un entorno visual.
- Adaptar el backend para otros casos de uso sin necesidad de modificar/añadir código.
- Bugfixing de ciertos casos de uso/eliminacion/actualización de archivos
