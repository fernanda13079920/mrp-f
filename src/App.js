import React, { useState, createContext, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { Light, Dark } from "./styles/Themes";
import { AuthProvider } from './context/authContext';

import Login from "./Pages/Login";
import Roles from './Pages/Rol';
import Usuarios from './Pages/Usuario';
import TipoUbicaciones from './Pages/TipoUbicacion';
import Ubicaciones from './Pages/Ubicacion';
import Productos from './Pages/Producto';
import MateriasPrimas from './Pages/MateriaPrima';
import Procesos from './Pages/Proceso';
import ListaProcesos from './Pages/ListaProceso';
import Estantes from './Pages/Estante';
import UbicacionArticulos from './Pages/UbicacionArticulo';
import Proveedores from './Pages/Proveedor';
import Perfil from './Pages/Perfil';
import OrdenProduccion from "./Pages/OrdenProduccion";
import OrdenCompra from "./Pages/OrdenCompra";
import Ejecutivo from "./Pages/Ejecutivo";

import axios from 'axios';

export const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState("light");
  const themeStyle = theme === "light" ? Light : Dark;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Variable de estado para controlar la carga
  const [error, setError] = useState(null); // Variable de estado para manejar errores

  // Función para verificar la autenticación al cargar la aplicación
  const checkAuthStatus = async () => {
    setLoading(true); // Iniciar la carga
    setError(null); // Limpiar errores anteriores

    try {
      const authData = JSON.parse(localStorage.getItem('authData'));
      if (authData) {
        // Realizar cualquier verificación adicional aquí si es necesario
        setAuthenticated(true); // Marcar al usuario como autenticado
      } else {
        setAuthenticated(false); // Marcar al usuario como no autenticado si no hay datos de autenticación
      }
    } catch (err) {
      console.error('Error checking authentication:', err);
      setAuthenticated(false); // Marcar al usuario como no autenticado en caso de error
    } finally {
      setLoading(false); // Finalizar la carga, independientemente del resultado
    }
  };

  useEffect(() => {
    checkAuthStatus(); // Verificar la autenticación al cargar la aplicación
  }, []);

  const handleLogout = async () => {
    setLoading(true); // Iniciar la carga
    setError(null); // Limpiar errores anteriores
  
    try {
      const authData = JSON.parse(localStorage.getItem('authData'));
      if (!authData) {
        throw new Error('No auth data found');
      }
  
      const response = await axios.post('http://3.147.242.40/api/logout', {
        id: authData.id,
        rol_id: authData.rol_id,
        persona_id: authData.persona_id,
        username: authData.username,
      });
  
      const { success, message, data } = response.data;
  
      if (success) {
        localStorage.removeItem('authData'); // Limpiar datos de autenticación
        setAuthenticated(false); // Marcar al usuario como no autenticado
        // Otras operaciones de limpieza según sea necesario
      } else {
        setError(message); // Capturar mensaje de error si no tiene éxito
      }
    } catch (err) {
      setError('An error occurred. Please try again.'); // Capturar errores generales
    } finally {
      setLoading(false); // Finalizar la carga, independientemente del resultado
    }
  };

  // Mostrar el componente de carga mientras se verifica la autenticación
  if (loading) {
    return <div>Loading...</div>;
  }

  // Mostrar la aplicación principal una vez que se ha determinado la autenticación
  return (
    <ThemeContext.Provider value={{ setTheme, theme, authenticated: isAuthenticated }}>
      <ThemeProvider theme={themeStyle}>
        <BrowserRouter>
          <AuthProvider>
            {isAuthenticated ? (
              <Container className={sidebarOpen ? "sidebarState active" : ""}>
                <Sidebar
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                  handleLogout={handleLogout} // Pasar handleLogout a Sidebar
                />
                <MainContent>
                  <Routes>
                    <Route path="/" element={<Navigate to="/perfil" />} /> {/* Redirigir a la página de perfil después del inicio de sesión */}
                    <Route path="/perfil" element={<Perfil />} />
                    <Route path="/rol" element={<Roles />} />
                    <Route path="/usuario" element={<Usuarios />} />
                    <Route path="/tipo-ubicacion" element={<TipoUbicaciones />} />
                    <Route path="/ubicacion" element={<Ubicaciones />} />
                    <Route path="/producto" element={<Productos />} />
                    <Route path="/materia-prima" element={<MateriasPrimas />} />
                    <Route path="/proceso" element={<Procesos />} />
                    <Route path="/lista-proceso" element={<ListaProcesos />} />
                    <Route path="/estante" element={<Estantes />} />
                    <Route path="/ubicacion-articulo" element={<UbicacionArticulos />} />
                    <Route path="/proveedor" element={<Proveedores />} />
                    <Route path="/orden-produccion" element={<OrdenProduccion />} />
                    <Route path="/orden-compra" element={<OrdenCompra/>} />
                    <Route path="/ejecutivo" element={<Ejecutivo />} />
                  </Routes>
                </MainContent>
              </Container>
            ) : (
              <Login setAuthenticated={setAuthenticated} /> // Mostrar el componente de inicio de sesión si no está autenticado
            )}
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 90px auto;
  background: ${({ theme }) => theme.bgtotal};
  transition: all 0.3s;
  &.active {
    grid-template-columns: 300px auto;
  }
  color: ${({ theme }) => theme.text};
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export default App;
