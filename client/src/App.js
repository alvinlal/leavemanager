import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/userContext';
import RequireAuth from './helpers/RequireAuth';
import AdminRoute from './helpers/AdminRoute';
import TeacherOrStaffRoute from './helpers/TeacherOrStaffRoute';
import Home from './components/Home';
import Base from './components/Base';
import Login from './components/Login';
import Departments from './components/Departments';
import Teachers from './components/Teachers';
import Staffs from './components/Staffs';
import Reports from './components/Reports';
import Leaves from './components/Leaves';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Base>
          <Routes>
            <Route path='login' element={<Login />} />
            <Route
              path='/'
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route
              path='departments'
              element={
                <RequireAuth>
                  <AdminRoute>
                    <Departments />
                  </AdminRoute>
                </RequireAuth>
              }
            />
            <Route
              path='teachers'
              element={
                <RequireAuth>
                  <AdminRoute>
                    <Teachers />
                  </AdminRoute>
                </RequireAuth>
              }
            />
            <Route
              path='staffs'
              element={
                <RequireAuth>
                  <AdminRoute>
                    <Staffs />
                  </AdminRoute>
                </RequireAuth>
              }
            />
            <Route
              path='reports'
              element={
                <RequireAuth>
                  <AdminRoute>
                    <Reports />
                  </AdminRoute>
                </RequireAuth>
              }
            />
            <Route
              path='leaves'
              element={
                <RequireAuth>
                  <TeacherOrStaffRoute>
                    <Leaves />
                  </TeacherOrStaffRoute>
                </RequireAuth>
              }
            />
          </Routes>
        </Base>
      </Router>
    </UserProvider>
  );
};
export default App;
