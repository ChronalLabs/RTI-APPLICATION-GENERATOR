import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GeneratorWorkspace from './pages/GeneratorWorkspace';
import TemplatesPage from './pages/Templates';
import GraphPage from './pages/Graph';
import Header from './components/layout/Header';

// Layout component that conditionally renders Header
function Layout({ children }) {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <>
      {/* Show Header on all pages except landing */}
      {!isLandingPage && <Header />}
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/generate" element={<GeneratorWorkspace />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/graph" element={<GraphPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
