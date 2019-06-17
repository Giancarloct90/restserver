require('./config/config');
const express = require('express')
const app = express()
const bodyParser = require('body-parser');


// parser application/x-www-form-urlencoded
// estos son middleware que cada vez que ejecute el codigo se ejecutara esto
// cada vez que se ejecute el una peticion va a pasar por aqui
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


// estos son los midleware que estamos usando para que maneje nuestra apliacion
// las peticiones que manjean nuestra app
app.get('/usuario', function (req, res) {
    res.json('get usuario')
})

app.post('/usuario', function (req, res) {
    //esta es la variable body que es resultado del bodyparser
    // con este bodyparser lo que obtenemos son los valores del form de donde nos esten mandando la peticion
    //  ejemplo mandan una peticion con un form lleno de datos con el body parser estamo obteniendo esos datos de ese form
    // y lo estamos almacenando en la varible body en forma de json y asi obtenemos la datos que vienen del form de esa pagina
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: `el nombre es necesario`
        });
    } else {
        res.json({
            body
        });
    }
})


app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    })
})


app.delete('/usuario', function (req, res) {
    res.json('delete usuario')
})

// aqui estamos utilizando la var que creamos en config.js
app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto 3000");
});