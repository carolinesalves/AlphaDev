const jwt = require ('jsonwebtoken');

class SessionController {

  async store(req, res){
    // const { usuario }= req.body;

    const authConfig = {
      secret: '5e20efab7420d13cd3ccb5e2bf4a1bce',
      expiresIn: '12h'
    }
    const {usuario} = req.body
    const dataUser ={
      usuario: usuario,
    }

    const token = jwt.sign(dataUser, authConfig.secret,{
      expiresIn: authConfig.expiresIn,
    });
    res.set('x-access-token', token);
    return res.json({
      token: token,
    })
  }

}
module.exports = new SessionController;