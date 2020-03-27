# Formación en Angular

En este proyecto se verán varios aspectos de la programación en Angular basada al consumo de API's.
Se trataran conceptos básicos:
    - Generación de componentes
        - Constructor
        - OnInit
        - Alimentar la vista
    - Consumos de servicios
        - Peticiones REST
        - Dominio e interfaces
        - Suscribe
    - Navegación entre vistas
        - Navegación simple
        - Navegación con parámetros

Con esta base podremos tratar los siguientes temas:
    - Navegación con resolvers
    - Generación de dialogs
    - Consumo de BBDD en navegador
    - Gestión de errores

## Basics

## 1. Generación de componentes

Para generar un nuevo componente es 'tan sencillo' como lanzar este comando en la cosola de node (a nivel de proyecto)
    ´ng generate component my-component´
Podremos observar que este nuevo componente ha sido generado en el proyecto, dentro del directorio 'app'.

Este componente tiene 4 ficheros, .html, .css y dos .ts.
Solo nos interesan el .html, .css y el .ts (que no tiene el nombre *.spec.ts).

    - El .html es donde pondremos las etiquetas html (preferentemente de material o bootstrap, aunque admite html plano).
    - El .css será estilos que solo afectan al html de este componente.
    - En el fichero .ts observamos que se han generado lineas de código.
        - Cabecera de la clase, nada importante a destacar más que el ´implements OnInit´.
        - constructor. Este método, al igual que en otros lenguajes, define los parámetros necesarios para construir la instancia del componente. Generalmente, se declaran los servicios a consumir en este componente.
        - OnInit. Este método es el primero (tras el constructor) en ejecutarse en el componente. Aqui nos encargaremos de recoger las variables que necesitemos para alimentar la vista.

Para alimentar la vista, una vez que el método OnInit a recogido la información necesaria, la nombraremos en la vista (fichero .html).
Aquí podemos hacer varias cosas. Servirlo en texto plano, o alimentando una etiqueta y que se genere de manera dinámica.
    - Texto plano. Para hacer esto, enmarcamos entre llaves el nombre de la variable o de una propiedad de la misma. Por ejemplo: ´{{persona.nombre}}´ esto mostraría el nombre de una variable persona, que hemos definido en el .ts
    - Alimentando una etiqueta. Aquí podemos usar distintas directivas. For, if, tiposForm y algunos más. Vemos los más importantes.
        - For. En una etiqueta de html, ubicamos esta directiva: ´*ngFor="let i of someArray"´. De este modo, se recorre un array 'someArray', declarado en el .ts.
        - If. De nuevo, en una etiqueta html, emplazamos: ´*ngIf="booleanVar"´. Así, si la variable 'booleanVar' es ´true´, escribirá dicha etiqueta.
        - Objeto Form. Aquí entramos en el uso de una etiqueta 'sobrealimentada' por Angular. Hablamos de la etiqueta de html 'imput'. Esta etiqueta, en su definición es: ´<input type="text" value="" id="inputTag" />´. Si a esta definición le añadimos: ´matInput´, se transforma en una etiqueta con muchas propiedades que son nutridas por Angular.
            - FormControl. Esta directiva, da la posibilidad de vincular a la etiqueta input una variable (definida en el componente .ts) del tipo FormControl. Este tipo de variable permite hacer validaciones, ya definidas o customizadas programaticamente. Así como, en caso de editar, asignarle el valor a editar para mostrarlo en la vista. Para más información sobre FormControl: 'https://angular.io/api/forms/FormControl'
            - Type. Como su nombre indica, nos permite asignar el tipo a ese input, de una forma programatica. Imagina un campo que según uno anterior, puede ser un campo de texto, un select deplegable o un RadioButton. 
            - Con estas dos directivas, podemos construir formularios dinámicos, por ejemplo: ´<input matInput [formControl]="pass" [type]="showPass? 'text' : 'password'" />´. Este ejemplo muestra el cambio del tipo del input 'pass' según el valor de la variable 'showPass'.

## 2. Consumo de servicios

Definimos un fichero servicio: 'formacion.service.ts', dentro del directorio servicio.

La primeria peculiaridad es la necesidad de añadir la anotacion ´@Injectable({providedIn:'root'})´ justo antes de hacer la exportación de la clase, de esta forma: ´export class FormacionService´. Esto permitirá consumir el servicio desde toda la aplicación.

Ahora debemos definir un metodo 'constructor', para indicar que el servicio 'HttpClient' será consumido, de este modo: ´constructor(private httpService: HttpClient)´

*Peticion REST*
Una vez hecho esto, podemos definir un método para hacer una petición http.
    - ´getUser(): Oservable<any>´ esta es la cabecera del método, destacamos dos cosas:
        - 'any': indica un 'tipo' de Angular que representa cualquier cosa. Esto da la libertad de esperar cualquier respuesta y analizarla.
        - Observable: refleja el tipo de respuesta de la petición. Ojo, es una petición asincrona, por lo que este tipo de respuesta permite trabajar con ella aún si estar resuelta dicha petición.
        - Observable<any>: expresa que el método devolverá un respuesta asíncrona del tipo any.
    - ´return this.httpService.get<any>("/api/user/1");´
        - 'this.httpService': clara referencia al servicio definido en el servicio
        - '.get<any>': indica que la petición será de tipo get y espera un tipo 'any'.
        - '("/api/user/1")': url a la que se hace la petición.
    - Adicionalmente, añadimos como parámetro de la petición, una cabecera personalizada, para añadir, por ejemplo, url de retorno o parámetros de autenticación.
        - headers: {someHeaders}
    - Para más información sobre 'HttpClient': 'https://angular.io/guide/http'

*Dominio*
Dentro del directorio 'Domains' generamos un fichero 'example.domain.ts'

Dentro del fichero, podemos declarar una interfaz del siguiente modo: ´export interface EjemploDto{}´
Aqui dento podemos definir las propiedades necesarias. Solo destacar que se deben usar los tipos de angular (empiezan por minuscula) y que si se quiere poner un parámetro opcional, sería: ´id?: number´

*Suscribe*
Hemos llegado al punto de consumir la respuesta asincrona que nos devuelve el servicio.

Dentro del .ts, en metodo constructor, declaramos el servicio a consumir.
En el método OnInit, lo llamamos:
    - ´this.exampleService.getUser()´: así obtenermos la respuesta asincrona.
    - ´.suscribe()´: asi pedimo que cuando se resuelva la petición nos 'avise'.
    - Dentro del suscribe añadimos lo siguiente.
        - ´suscribe((objecto: any) =>{});´. En esta parte, definimos el objeto que devuelve la petición asincrona.
        - ´{gestión del objeto, como asignarlo}´

## 3. Navegación entre vistas

Ahora veremos como acceder a la vista que gemos generado.

En el fichero 'app-routing.module.ts', debemos declarar dentro de la variable roures, una nueva entrada, con la ruta a la que navegar.

Desde el 'app.component.html', añadimos una etiqueta para acceder: ´<p (click)="navigateTo('nombreRuta')">Mi nueva vista</p>´. Donde 'nombreRuta' es el nombre que se ha declarado en 'app-routing.module.ts'.

*Navegación Simple*
En el fichero 'app.component.ts' debe estar definido el método 'navigateTo()', donde redirigirá a nuestra nueva vista.

*Navegacion con Parámetros*
Debemos redefinir el el método ´(click)´ para que apunte a un nuevo método: ´navigateToMyPage()´.

En el fichero 'app.component.ts' definimos el método navigateToMyPage(), que llevara:
    - this.router.navigate(['myRouteToPage], {queryParams: {id: 2341}});: así navegaremos a nuestra página, donde en OnInit podremos adquirir ese id.

En nuestro '.ts' definimos dentro del OnInit:
    - ´if(param.id != undefined)´: comprobamos que existe el parámetro. Y podemos asignarlo.

## Advanced

*Soon*