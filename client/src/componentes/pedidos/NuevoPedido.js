import React, { useState, useEffect, Fragment, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import clienteAxios from "../../config/axios";
import FormBuscarProducto from "./FormBuscarProducto";
import FormCantidadProducto from "./FormCantidadProducto";
import Swal from "sweetalert2";
import { CRMContext } from "../../context/CRMContext";

function NuevoPedido() {
  // Extraer ID de cliente
  const { id } = useParams();
  const navigate = useNavigate(); // Añadir esto

  // state
  const [cliente, guardarCliente] = useState({});
  const [busqueda, guardarBusqueda] = useState("");
  const [productos, guardarProductos] = useState([]);
  const [total, guardarTotal] = useState(0);

  // utilizar valores del context
  const [auth, guardarAuth] = useContext(CRMContext);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!auth.auth || localStorage.getItem("token") !== auth.token) {
      navigate("/iniciar-sesion");
      return;
    }

    // obtener el cliente
    const consultarAPI = async () => {
      try {
        // consultar el cliente actual
        const resultado = await clienteAxios.get(`/clientes/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        guardarCliente(resultado.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al obtener los datos del cliente",
        });
      }
    };

    // llamar a la api
    consultarAPI();
  }, [id, auth, navigate]);

  const buscarProducto = async (e) => {
    e.preventDefault();

    // Verificar si el campo de búsqueda está vacío
    if (busqueda.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Campo de búsqueda vacío",
        text: "Por favor, ingrese un término de búsqueda",
      });
      return; // Salir de la función si el campo está vacío
    }

    try {
      // obtener los productos de la búsqueda
      const resultadoBusqueda = await clienteAxios.post(
        `/productos/busqueda/${busqueda}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      // si no hay resultados, mostrar una alerta; caso contrario, agregarlo al state
      if (resultadoBusqueda.data[0]) {
        let productoResultado = {
          ...resultadoBusqueda.data[0],
          cantidad: 0,
        };

        // Verificar si el producto ya está en la lista
        const productoExistente = productos.find(
          (producto) => producto._id === productoResultado._id
        );

        if (!productoExistente) {
          // ponerlo en el state
          guardarProductos([...productos, productoResultado]);
        } else {
          Swal.fire({
            icon: "error",
            title: "Producto Duplicado",
            text: "El producto ya está en la lista",
          });
        }
      } else {
        // no hay resultados
        Swal.fire({
          icon: "error",
          title: "No resultados",
          text: "No hay resultados",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al realizar la búsqueda",
      });
    }
  };

  // almacenar una búsqueda en el state
  const leerDatosBusqueda = (e) => {
    guardarBusqueda(e.target.value);
  };

  // Almacena el pedido a la base de datos
  const realizarPedido = async (e) => {
    e.preventDefault();

    // construir el objeto
    const pedido = {
      cliente: id,
      pedido: productos,
      total: total,
    };
    try {
      // almacenarlo a la base de datos
      const resultado = await clienteAxios.post(
        `/pedidos/nuevo/${id}`,
        pedido,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      // leer resultado
      if (resultado.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Correcto",
          text: resultado.data.mensaje,
        }).then(() => {
          navigate("/pedidos"); // Redireccionar después de la confirmación
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Hubo un error",
          text: "Vuelva a intentarlo",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al realizar el pedido",
      });
    }
  };

  return (
    <Fragment>
      <div className="ficha-cliente">
        <h3>Datos de Cliente</h3>
        <p>
          Nombre: {cliente.nombre} {cliente.apellido}
        </p>
        <p>Telefono: {cliente.telefono}</p>
      </div>

      <FormBuscarProducto
        buscarProducto={buscarProducto}
        leerDatosBusqueda={leerDatosBusqueda}
      />

      <ul className="resumen">
        {productos.map((producto) => (
          <FormCantidadProducto
            key={producto._id} // Ensure this key is unique
            producto={producto}
            guardarProductos={guardarProductos}
            productos={productos}
            guardarTotal={guardarTotal} // Pasar la función guardarTotal como prop
          />
        ))}
      </ul>
      <p className="total">
        {" "}
        Total a pagar: <span>${total}</span>
      </p>
      {total > 0 ? (
        <form onSubmit={realizarPedido}>
          <input
            type="submit"
            className="btn btn-verde btn-block"
            value=" Realizar Pedido"
          />
        </form>
      ) : null}
    </Fragment>
  );
}

export default NuevoPedido;
