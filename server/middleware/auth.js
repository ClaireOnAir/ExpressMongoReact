const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Autorización por el header
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    const error = new Error("No autenticado, no hay JWT");
    error.statusCode = 401;
    throw error;
  }

  // Obtener el token y verificarlo
  const token = authHeader.split(" ")[1];
  let revisarToken;
  try {
    revisarToken = jwt.verify(token, "LLAVESECRETA");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  // Si es un token válido pero hay algún error
  if (!revisarToken) {
    const error = new Error("No autenticado");
    error.statusCode = 401;
    throw error;
  }

  next();
};
