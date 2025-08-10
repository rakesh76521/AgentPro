import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider, useSelector } from 'react-redux';
import Store from '../store/store.js';
// import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { HashRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';

import Login from './login/login.jsx';
import Dashboard from './dashboard/dashboard.jsx';
import Forbidden from './dashboard/forbidden.jsx';
import ProtectRoute from './protectedroute.jsx';
import NavigateToCorrectOrg from './navigatetocorrectorg.jsx';
import Calculate from './dashboard/calculate.jsx';
import Transaction from './dashboard/transaction.jsx';
import ViewReport from './dashboard/viewreport.jsx';

const root = createRoot(document.getElementById('root'));
// Admin only route wrapper
const AdminRoute = ({ children }) => {
  const user = useSelector((state) => state.loggeduser.user);
  const { Orgcode } = useParams();

  if (user?.role !== 'admin') {
    return <Navigate to={`/AgentPro/dashboard/forbidden`} replace />;
  }
  return children;
};

// Client only route wrapper
const ClientRoute = ({ children }) => {
  const user = useSelector((state) => state.loggeduser.user);
  const { Orgcode } = useParams();

  if (user?.role !== 'client') {
    return <Navigate to={`/AgentPro/dashboard/forbidden`} replace />;
  }
  return children;
};

// Redirect component for dashboard index based on role
const DashboardIndexRedirect = () => {
  const user = useSelector((state) => state.loggeduser.user);
  const { Orgcode } = useParams();

  if (!user) {
    // If no user, redirect to login or root
    return <Navigate to={`/AgentPro/}`} replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to={`/AgentPro/dashboard/calculate`} replace />;
  } else if (user.role === 'client') {
    return <Navigate to={`/AgentPro/dashboard/view-report`} replace />;
  } else {
    return <Navigate to={`/AgentPro/dashboard/forbidden`} replace />;
  }
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<NavigateToCorrectOrg />} />
      <Route path="/AgentPro/" element={<Login />} />

      {/* Protected dashboard routes */}
      <Route path="/AgentPro/dashboard/" element={<ProtectRoute />}>
        <Route element={<Dashboard />}>
          {/* Index route: redirect based on role */}
          <Route index element={<DashboardIndexRedirect />} />

          {/* Admin-only routes */}
          <Route
            path="calculate"
            element={
              <AdminRoute>
                <Calculate />
              </AdminRoute>
            }
          />
          <Route
            path="transaction"
            element={
              <AdminRoute>
                <Transaction />
              </AdminRoute>
            }
          />

          {/* Client-only route */}
          <Route
            path="view-report"
            element={
              <ClientRoute>
                <ViewReport />
              </ClientRoute>
            }
          />

          {/* Forbidden page */}
          <Route path="forbidden" element={<Forbidden />} />
        </Route>
      </Route>

      {/* Catch all redirect */}
      <Route path="*" element={<Navigate to="/AgentPro/" />} />
    </Routes>
  );
};

root.render(
  <Provider store={Store}>
    <HashRouter>
      <AppRouter />
    </HashRouter>
  </Provider>
);
