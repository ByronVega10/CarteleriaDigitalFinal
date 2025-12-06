const User = require('../models/User');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ msg: "Usuario no encontrado" });

    if (user.password !== password)
      return res.status(401).json({ msg: "Contraseña incorrecta" });

    res.json({ msg: "Login exitoso" });

  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
