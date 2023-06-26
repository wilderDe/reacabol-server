const jwt = require("jsonwebtoken")


const validarJWT = (req,res ,next)=> {

    try {
        const token = req.header('x-token')

        if(!token){
            return res.json({
                ok: false,
                msg: 'No hay token de peticion'
            })
        }

        const payload = jwt.verify(token, process.env.JWT_KEY);
        req.uid = payload.uid;
    
        next()


    } catch (error) {
        
        return res.json({
            ok: false,
            msg:'Token no valido'
        })

    }

}

module.exports = {
    validarJWT
}