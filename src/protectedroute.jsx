import { Navigate, Outlet, useParams } from 'react-router-dom';

const ProtectRoute = () => {
  const storedUser = JSON.parse(localStorage.getItem('demologged-user'));
  const { Orgcode: urlOrg } = useParams();
  const orgCode = storedUser?.orgShortCode || urlOrg || 'Org01';

  if (storedUser?.username) {
    return <Outlet />;
  }

  return <Navigate to={`/AgentPro/`} replace />;
};

export default ProtectRoute;
