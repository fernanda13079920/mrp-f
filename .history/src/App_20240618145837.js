import React, { useState, createContext } from "react";
import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { Light, Dark } from "./styles/Themes";
import { AuthProvider } from './context/authContext';
import Login from "./Pages/Login";
import TipoArticulos from './Pages/TipoArticulo';
import TipoUbicaciones from './Pages/TipoUbicacion';
import Ubicaciones from './Pages/Ubicacion';
import Estantes from './Pages/Estante';
import Procesos from './Pages/Proceso';
import Productos from './Pages/Producto';
import MateriasPrimas from './Pages/MateriaPrima';
import UbicacionArticulos from './Pages/UbicacionArticulo';
import Roles from './Pages/Rol';


export const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState("light");
  const themeStyle = theme === "light" ? Light : Dark;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);

 

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
                  handleLogout={handleLogout}
                  handleLogout
                />
                <MainContent>
                  <Routes>
                    <Route path="/tipo-articulo" element={<TipoArticulos />} />
                    <Route path="/tipo-ubicacion" element={<TipoUbicaciones />} />
                    <Route path="/ubicacion" element={<Ubicaciones />} />
                    <Route path="/estante" element={<Estantes />} />
                    <Route path="/proceso" element={<Procesos />} />
                    <Route path="/producto" element={<Productos />} />
                    <Route path="/materia-prima" element={<MateriasPrimas />} />
                    <Route path="/ubicacion-articulo" element={<UbicacionArticulos />} />
                    <Route path="/rol" element={<Roles />} />
                  </Routes>
                </MainContent>
              </Container>
            ) : (
              <Login setAuthenticated={setAuthenticated} />
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
