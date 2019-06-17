// nuestra app tendra dos entornos uno de desarollo y uno de produccion
// en dichos entornos hay muchas varibles que van a cambiar dependiendo del servidor o si estamos en nuestra pc
// un ejemplo el puerto en donde esta corriendo nuestro servidor web
// en este caso estamos asignando el valor del puerto en esta variable, si process tiene un valor que se lo asigne a process
// y si no que le asigne 3000 por defecto,
process.env.PORT = process.env.PORT || 3000;