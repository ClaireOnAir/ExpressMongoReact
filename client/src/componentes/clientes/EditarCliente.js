import React, { Fragment, useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import { CRMContext } from "../../context/CRMContext";

function EditarCliente() {
  // Obtener el ID
  const { id } = useParams();

  // cliente = state, datosCliente = funcion para guardar el state
  const [cliente, datosCliente] = useState({
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
  });

  // Navegación para la redirección
  let navigate = useNavigate();

  // utilizar valores del context
  const [auth, guardarAuth] = useContext(CRMContext);

  // Query a la API y verificar autenticación
  useEffect(() => {
    const consultarAPI = async () => {
      try {
        const clienteConsulta = await clienteAxios.get(`/clientes/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        datosCliente(clienteConsulta.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/iniciar-sesion");
        }
      }
    };

    // Verificar si el usuario está autenticado
    if (!auth.auth || localStorage.getItem("token") !== auth.token) {
      navigate("/iniciar-sesion");
    } else {
      consultarAPI();
    }
  }, [id, auth, navigate]);

  // Leer los datos del formulario
  const actualizarState = (e) => {
    datosCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  // Enviar una petición por axios para actualizar el cliente
  const actualizarCliente = (e) => {
    e.preventDefault();

    // Enviar por Axios
    clienteAxios
      .put(`/clientes/${cliente._id}`, cliente, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        Swal.fire({
          title: "Se modificó los datos del Cliente",
          text: res.data.mensaje,
          icon: "success",
        });

        // Redireccionar
        navigate("/", { replace: true });
      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          Swal.fire({
            type: "error",
            title: "Hubo un error",
            text: "Ese cliente ya está registrado",
            icon: "error",
          });
        } else {
          Swal.fire({
            type: "error",
            title: "Hubo un error",
            text: "Ocurrió un error al actualizar el cliente",
            icon: "error",
          });
        }
      });
  };

  // Validar formulario
  const validarCliente = () => {
    const { nombre, apellido, email, empresa, telefono } = cliente;
    let valido =
      !nombre.length ||
      !apellido.length ||
      !email.length ||
      !empresa.length ||
      !telefono.length;
    return valido;
  };

  return (
    <Fragment>
      <h2>Editar Cliente</h2>
      <form onSubmit={actualizarCliente}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Cliente"
            name="nombre"
            onChange={actualizarState}
            value={cliente.nombre}
          />
        </div>

        <div className="campo">
          <label>Apellido:</label>
          <input
            type="text"
            placeholder="Apellido Cliente"
            name="apellido"
            onChange={actualizarState}
            value={cliente.apellido}
          />
        </div>

        <div className="campo">
          <label>Empresa:</label>
          <input
            type="text"
            placeholder="Empresa Cliente"
            name="empresa"
            onChange={actualizarState}
            value={cliente.empresa}
          />
        </div>

        <div className="campo">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email Cliente"
            name="email"
            onChange={actualizarState}
            value={cliente.email}
          />
        </div>

        <div className="campo">
          <label>Teléfono:</label>
          <input
            type="tel"
            placeholder="Teléfono Cliente"
            name="telefono"
            onChange={actualizarState}
            value={cliente.telefono}
          />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Guardar Cambios"
            disabled={validarCliente()}
          />
        </div>
      </form>
    </Fragment>
  );
}

export default EditarCliente;
