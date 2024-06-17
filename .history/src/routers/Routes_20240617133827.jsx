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

const PrivateRoute = ({ element, ...rest }) => {
  const { authenticated } = useContext(ThemeContext);

  return authenticated ? (
    <Route {...rest} element={element} />
  ) : (
    <Navigate to="/login" replace />
  );
};

const MyRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <PrivateRoute path="/tipo-articulo" element={<TipoArticulos />} />
      <PrivateRoute path="/tipo-ubicacion" element={<TipoUbicaciones />} />
      <PrivateRoute path="/ubicacion" element={<Ubicaciones />} />
      <PrivateRoute path="/estante" element={<Estantes />} />
      <PrivateRoute path="/proceso" element={<Procesos />} />
      <PrivateRoute path="/producto" element={<Productos />} />
      <PrivateRoute path="/materia-prima" element={<MateriasPrimas />} />
      <PrivateRoute path="/ubicacion-articulo" element={<UbicacionArticulos />} />
      <PrivateRoute path="/rol" element={<Roles />} />
    </Routes>
  );
};

export default MyRoutes;
