// App.js
import React, { useState } from "react";
import styled from "styled-components";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./components/Sidebar"; // Asegúrate de que la ruta sea correcta según tu estructura
import { Light, Dark } from "./styles/Themes";
import { ThemeProvider } from "styled-components";
import Login from "./Pages/Login";
import MyRoutes from "./routers/Routes"; // Asegúrate de que la ruta sea correcta según tu estructura

export const ThemeContext = React.createContext(null);

function App() {
  const [theme, setTheme] = useState("light");
  const themeStyle = theme === "light" ? Light : Dark;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);

  const handleLogout = () => {
    setAuthenticated(false);
  };

  return (
    <ThemeContext.Provider value={{ setTheme, theme }}>
      <ThemeProvider theme={themeStyle}>
        <BrowserRouter>
          {isAuthenticated ? (
            <Container className={sidebarOpen ? "sidebarState active" : ""}>
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                handleLogout={handleLogout}
              />
              <MainContent>
                <MyRoutes />
              </MainContent>
            </Container>
          ) : (
            <Login setAuthenticated={setAuthenticated} />
          )}
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
