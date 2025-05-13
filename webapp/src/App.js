import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/authContext';
import { ThemeProvider } from './hooks/themeContext';
import GlobalStyle from './assets/styles/globalStyles';
import Header from './components/header';
import Footer from './components/footer';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { userId } = useAuth();

  if (!userId) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="App tektur">
          <GlobalStyle />
          <Header />

          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>

          <Footer />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
