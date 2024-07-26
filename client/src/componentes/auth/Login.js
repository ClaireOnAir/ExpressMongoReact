import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import { useNavigate } from "react-router-dom";

// context
import { CRMContext } from "../../context/CRMContext";

function Login() {
  // Auth y token
  const [auth, guardarAuth] = useContext(CRMContext);

  // state con los datos del formulario
  const [credenciales, guardarCredenciales] = useState({});
  let navigate = useNavigate();

  // Iniciar sesión el el servidor
  const iniciarSesion = async (e) => {
    e.preventDefault();

    // autenticar al usuario
    try {
      const respuesta = await clienteAxios.post(
        "/iniciar-sesion",
        credenciales
      );
      // extraer el token y colocarlo en localstorage
      const { token } = respuesta.data;
      localStorage.setItem("token", token);

      // colocarlo en el state
      guardarAuth({
        token,
        auth: true,
      });

      // alerta si inicias sesion
      Swal.fire("Login Correcto", "Has iniciado Sesión", "success");
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Hubo un error",
        text: error.response.data.mensaje,
      });
    }
  };

  // Almacenar lo que el usuario escribe en el state
  const leerDatos = (e) => {
    guardarCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login">
      <h2>Iniciar Sesión</h2>

      <div className="contenedor-formulario">
        <form onSubmit={iniciarSesion}>
          <div className="campo">
            <label>Email</label>
            <input
              type="text"
              name="email"
              placeholder="Email para Iniciar Sesión"
              required
              onChange={leerDatos}
            />
          </div>

          <div className="campo">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password para Iniciar Sesión"
              required
              onChange={leerDatos}
            />
          </div>
          <input
            type="submit"
            value="Iniciar Sesión"
            className="btn btn-verde btn-block"
          />
        </form>
      </div>
    </div>
  );
}

export default Login;
