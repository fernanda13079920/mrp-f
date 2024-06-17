import { BrowserRouter, Routes, Route } from "react-router-dom";

import TipoArticulos from '../Pages/TipoArticulo';
import TipoUbicaciones from "../Pages/TipoUbicacion";
import Ubicaciones from "../Pages/Ubicacion";
import Estantes from "../Pages/Estante";
import Procesos from "../Pages/Proceso";
import Productos from "../Pages/Producto";
import MateriasPrimas from "../Pages/MateriaPrima";
import UbicacionArticulos from "../Pages/UbicacionArticulo";
import Roles from "../Pages/Rol";
import Login from "../Pages/Login";
export function MyRoutes() {
  return (
   
     
      <Routes>
        <Route path="/tipo-articulo" element={<TipoArticulos/>} />
        <Route path="/tipo-ubicacion" element={<TipoUbicaciones />} />
        <Route path="/ubicacion" element= {<Ubicaciones />} />
        <Route path="/estante" element= {<Estantes />} />
        <Route path="/proceso" element= {<Procesos />} />
        <Route path="/producto" element= {<Productos />} />
        <Route path="/materia-prima" element= {<MateriasPrimas />} />
        <Route path="/ubicacion-articulo" element= {<UbicacionArticulos />} />
        <Route path="/rol" element= {<Roles />} />
      </Routes>
    
  );
}