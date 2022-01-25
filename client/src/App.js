import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/userContext';
import Home from './components/Home';
import Header from './components/Header';
import Login from './components/Login';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='login' element={<Login />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};
export default App;
