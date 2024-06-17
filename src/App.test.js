import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListaTipoArticulo from './componentes/TipoArticulo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/tipoarticulos" element={<ListaTipoArticulo />} />
      </Routes>
    </Router>
  );
}

export default App;
