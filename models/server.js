const express   = require('express');
const http      = require('http');
const socketio  = require('socket.io');
const path      = require('path');
const cors      = require('cors');
const Sockets = require('./sockets');
const dbConnection = require('../database/config');

class Server {

    constructor() {
        //* creamos nuestra variable para trabajar con express peticiones http
        this.app = express();
        //* consumimos la variable de entorno para el puerto de ejecucion
        this.port = process.env.PORT;

        ///*conectarse a la base de datos
        this.conectarDB();

        //Http server para la comunicacion sockets
        this.server = http.createServer( this.app );

        //Configuraciones de sockets
        this.io = socketio( this.server, { /* Configuraciones  */ } )

    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares() {
        //Desplegar el directorio publico
        this.app.use( express.static( path.resolve(__dirname, '../public') ) );

        //habilitamos los cors publico
        this.app.use( cors() );

        //parseo del body transaccion en formato JSON
        this.app.use( express.json() );

        //Enpoints rutas de consumo de la API REST
        this.app.use('/api/empleado', require('../router/auth'));
        this.app.use('/api/sucursal', require('../router/sucursal'));
        this.app.use('/api/rol', require('../router/rol'));
        this.app.use('/api/cliente', require('../router/cliente'));
        this.app.use('/api/tipo_trabajo', require('../router/tipo_trabajo'))
        this.app.use('/api/nota_orden', require('../router/nota_orden'))
        this.app.use('/api/neumatico', require('../router/neumatico'));

        this.app.use('/api/operario', require('../router/operario'))
        this.app.use('/api/material', require('../router/material'))
        this.app.use('/api/deposito', require('../router/deposito'))
    }
    
    configurarSockets(){
        //Isntancia de sockets
        new Sockets( this.io );
    }

    execute(){
        //Iniciar los middlewares
        this.middlewares();

        //Iniciar los sockets
        this.configurarSockets();

        //Inicializar server
        this.server.listen( this.port, () => {
            console.log('Server corriendo en el puerto:', this.port);
        });

    }


}

module.exports = Server;