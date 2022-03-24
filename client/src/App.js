import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/userContext';
import Categories from './components/Categories';
import RequireAuth from './helpers/RequireAuth';
import AdminRoute from './helpers/AdminRoute';
import HodRoute from './helpers/HodRoute';
import TeacherOrStaffRoute from './helpers/TeacherOrStaffRoute';
import Home from './components/Home';
import Base from './components/Base';
import Login from './components/Login';
import Departments from './components/Departments';
import Teachers from './components/Teachers';
import Staffs from './components/Staffs';
import Leaves from './components/Leaves';
import Approvals from './components/Approvals';
import Details from './components/Details';
import Security from './components/Security';

const Reports = lazy(() => import('./components/Reports'));

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Base>
          <Suspense fallback={<div>Loading...</div>}>
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
                path='categories'
                element={
                  <RequireAuth>
                    <AdminRoute>
                      <Categories />
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
              <Route
                path='approvals'
                element={
                  <RequireAuth>
                    <HodRoute>
                      <Approvals />
                    </HodRoute>
                  </RequireAuth>
                }
              />
              <Route
                path='details'
                element={
                  <RequireAuth>
                    <TeacherOrStaffRoute>
                      <Details />
                    </TeacherOrStaffRoute>
                  </RequireAuth>
                }
              />
              <Route
                path='security'
                element={
                  <RequireAuth>
                    <Security />
                  </RequireAuth>
                }
              />
            </Routes>
          </Suspense>
        </Base>
      </Router>
    </UserProvider>
  );
};
export default App;
