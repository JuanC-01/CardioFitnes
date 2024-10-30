import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Conteiner from './components/conteiner';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Home" />} />
        <Route path="/*" element={<Conteiner />} />
      </Routes>
    </Router>
  );
}

export default App;


