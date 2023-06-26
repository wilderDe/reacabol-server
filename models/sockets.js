

class Sockets {

    constructor( io ) {
        this.io = io;

        this.socketEvents();

    }

    socketEvents() { 
        this.io.on( 'connection', ( socket ) => {

            // * Usuario conectado
            console.log("Cliente conectado!");

            
            // * Usuario de desconecta            
            socket.on('disconnect', () => {
                console.log('Cliente desconectado!')


            })

            

        } )
    }
}

module.exports = Sockets;



