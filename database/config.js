const { default: mongoose } = require("mongoose")


const dbConnection = async() => {

    try {
        await mongoose.connect(`mongodb://${process.env.DATA_BASE_HOST}/${process.env.DATA_BASE_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('Conexion a MongoDB exitosa');

    } catch (error) {
        console.log('Error al conectar a MongoDB:', error);
    }

}

module.exports = dbConnection;