import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/userContext';
import Home from './components/Home';
import Base from './components/Base';
import Login from './components/Login';
import Departments from './components/Departments';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Base>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='departments' element={<Departments />} />
          </Routes>
        </Base>
      </Router>
    </UserProvider>
  );
};
export default App;
