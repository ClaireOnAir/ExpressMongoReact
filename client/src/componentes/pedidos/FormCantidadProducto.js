import React from "react";

function FormCantidadProducto({
  producto,
  guardarProductos,
  productos,
  guardarTotal,
}) {
  const actualizarCantidad = (nuevaCantidad) => {
    const productosActualizados = productos.map((productoState) =>
      productoState._id === producto._id
        ? { ...productoState, cantidad: nuevaCantidad }
        : productoState
    );

    guardarProductos(productosActualizados);
    actualizarTotal(productosActualizados); // Llamar a actualizarTotal con los productos actualizados
  };

  const incrementarCantidad = () => {
    const nuevaCantidad = producto.cantidad + 1;
    actualizarCantidad(nuevaCantidad);
  };

  const decrementarCantidad = () => {
    if (producto.cantidad > 0) {
      const nuevaCantidad = producto.cantidad - 1;
      actualizarCantidad(nuevaCantidad);
    }
  };

  const eliminarProducto = () => {
    const productosActualizados = productos.filter(
      (productoState) => productoState._id !== producto._id
    );

    guardarProductos(productosActualizados);
    actualizarTotal(productosActualizados); // Llamar a actualizarTotal con los productos actualizados
  };

  // Actualizar el total a pagar
  const actualizarTotal = (productosActualizados) => {
    // si el arreglo de productos es igual 0 : el total es 0
    if (productosActualizados.length === 0) {
      guardarTotal(0);
      return;
    }
    // calcular el nuevo total
    let nuevoTotal = 0;
    // Recorrer todos los productos, sus cantidades y precios
    productosActualizados.forEach(
      (producto) => (nuevoTotal += producto.cantidad * producto.precio)
    );

    // Almacenar el total
    guardarTotal(nuevoTotal);
  };

  return (
    <li>
      <div className="texto-producto">
        <p className="nombre">{producto.nombre}</p>
        <p className="precio">${producto.precio}</p>
      </div>
      <div className="acciones">
        <div className="contenedor-cantidad">
          <i className="fas fa-minus" onClick={decrementarCantidad}></i>
          <p>{producto.cantidad}</p>
          <i className="fas fa-plus" onClick={incrementarCantidad}></i>
        </div>
        <button
          type="button"
          className="btn btn-rojo"
          onClick={eliminarProducto}
        >
          <i className="fas fa-minus-circle"></i>
          Eliminar Producto
        </button>
      </div>
    </li>
  );
}

export default FormCantidadProducto;
