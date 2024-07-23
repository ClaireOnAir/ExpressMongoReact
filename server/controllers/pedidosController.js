const { json } = require("express");
const Pedidos = require("../models/Pedidos");

// Nuevo pedido
exports.nuevoPedido = async (req, res, next) => {
  const pedido = new Pedidos(req.body);
  try {
    await pedido.save();
    res.json({ mensaje: "Se agregó nuevo pedido" });
  } catch (error) {
    console.log(error);
    next();
  }
};

// Muestra todos los pedidods
exports.mostrarPedidos = async (req, res, next) => {
  try {
    const pedidos = await Pedidos.find({}).populate("cliente").populate({
      path: "pedido.producto",
      model: "Productos",
    });
    res.json(pedidos);
  } catch (error) {
    console.log(error);
    next();
  }
};

// Muestra un pedido por su ID
exports.mostrarPedido = async (req, res, next) => {
  const pedido = await Pedidos.findById(req.params.idPedido)
    .populate("cliente")
    .populate({
      path: "pedido.producto",
      model: "Productos",
    });

  if (!pedido) {
    res.json({ mensaje: "Ese pedido no existe" });
    return next();
  }

  // Mostrar pedido
  res.json(pedido);
};

// Actualizar un pedido por su ID
exports.actualizarPedido = async (req, res, next) => {
  try {
    let pedido = await Pedidos.findOneAndUpdate(
      { _id: req.prams.idPedido },
      req.body,
      {
        new: true,
      }
    )
      .populate("cliente")
      .populate({
        path: "pedido.producto",
        model: "Productos",
      });

    res.json(pedido);
  } catch (error) {
    console.log(error);
    next();
  }
};

// Eliminar un pedido
exports.eliminarPedido = async (req, res, next) => {
  try {
    const pedido = await Pedidos.findOneAndDelete({ _id: req.params.idPedido });
    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }
    res.json({ mensaje: "El pedido se ha eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error al eliminar el pedido" });
    next();
  }
};
