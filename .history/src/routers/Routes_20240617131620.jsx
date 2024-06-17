import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeContext } from "../App";
import Login from "../Pages/Login";
import TipoArticulos from "../Pages/TipoArticulo";
import TipoUbicaciones from "../Pages/TipoUbicacion";
import Ubicaciones from "../Pages/Ubicacion";
import Estantes from "../Pages/Estante";
import Procesos from "../Pages/Proceso";
import Productos from "../Pages/Producto";
import MateriasPrimas from "../Pages/MateriaPrima";
import UbicacionArticulos from "../Pages/UbicacionArticulo";
import Roles from "../Pages/Rol";

const PrivateRoute = ({ element, authenticated, ...rest }) => {
  return authenticated ? (
    <Route {...rest} element={element} />
  ) : (
    <Navigate to="/login" replace />
  );
};

const MyRoutes = ({ authenticated }) => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <PrivateRoute
        path="/tipo-articulo"
        element={<TipoArticulos />}
        authenticated={authenticated}
      />
      <PrivateRoute
        path="/tipo-ubicacion"
        element={<TipoUbicaciones />}
        authenticated={authenticated}
      />
      <PrivateRoute
        path="/ubicacion"
        element={<Ubicaciones />}
        authenticated={authenticated}
      />
      <PrivateRoute
        path="/estante"
        element={<Estantes />}
        authenticated={authenticated}
      />
      <PrivateRoute
        path="/proceso"
        element={<Procesos />}
        authenticated={authenticated}
      />
      <PrivateRoute
        path="/producto"
        element={<Productos />}
        authenticated={authenticated}
      />
      <PrivateRoute
        path="/materia-prima"
        element={<MateriasPrimas />}
        authenticated={authenticated}
      />
      <PrivateRoute
        path="/ubicacion-articulo"
        element={<UbicacionArticulos />}
        authenticated={authenticated}
      />
      <PrivateRoute
        path="/rol"
        element={<Roles />}
        authenticated={authenticated}
      />
    </Routes>
  );
};

export default MyRoutes;
