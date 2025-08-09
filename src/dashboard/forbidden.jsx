import React from 'react';
import { useNavigate,useParams } from 'react-router-dom';

const Forbidden = () => {
  const navigate = useNavigate();
  const { Orgcode } = 'Org01';
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Access Forbidden</h2>
      <p className="text-gray-600 text-center max-w-md mb-6">
        You don't have permission to access this page. Please contact the administrator if you believe this is a mistake.
      </p>
      <button
        onClick={() => navigate(`/${Orgcode}`)}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow-md transition"
      >
        Go to Home
      </button>
    </div>
  );
};

export default Forbidden;
