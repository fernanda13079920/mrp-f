// Routes.js
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import Sidebar from "../components/Sidebar"; // Asegúrate de que la ruta sea correcta según tu estructura
import PrivateRoute from "./PrivateRoute"; // Asegúrate de que la ruta sea correcta según tu estructura

const MyRoutes = () => {
  const { authenticated } = useContext(ThemeContext);

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
      {/* Ruta por defecto si no coincide ninguna */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default MyRoutes;
