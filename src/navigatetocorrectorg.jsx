// components/NavigateToCorrectOrg.jsx
import { Navigate } from 'react-router-dom';

const NavigateToCorrectOrg = () => {
  const rawUser = localStorage.getItem('demologged-user');
  let orgCode = 'Org01'; // fallback if nothing found
  //console.log('hellllllllllllllllllllllllllllllllllllllllllllllllllllllll')
  try {
    const user = JSON.parse(rawUser);
    if (user?.orgShortCode) {
      orgCode = user.orgShortCode;
  
      // ✅ Logged in → redirect to dashboard
      return <Navigate to={`/AgentPro/dashboard`} replace />;
    }
  } catch (err) {
    console.warn('Error reading user from storage:', err);
  }

  // ❌ Not logged in → redirect to login
  return <Navigate to={`/AgentPro/`} replace />;
};

export default NavigateToCorrectOrg;
