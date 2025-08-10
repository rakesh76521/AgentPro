import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider, useSelector } from 'react-redux';
import Store from '../store/store.js';
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

// Define AdminRoute, ClientRoute, DashboardIndexRedirect as before
// but make sure Navigate targets exclude the `/AgentPro` prefix.

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<NavigateToCorrectOrg />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<ProtectRoute />} >
      <Route element={<Dashboard />}>
        <Route index element={<DashboardIndexRedirect />} />
        <Route path="calculate" element={<AdminRoute><Calculate /></AdminRoute>} />
        <Route path="transaction" element={<AdminRoute><Transaction /></AdminRoute>} />
        <Route path="view-report" element={<ClientRoute><ViewReport /></ClientRoute>} />
        <Route path="forbidden" element={<Forbidden />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

root.render(
  <Provider store={Store}>
    <HashRouter>
      <AppRouter />
    </HashRouter>
  </Provider>
);
