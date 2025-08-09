import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./sidebar";
import Topbar from './topbar';
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";


const Dashboard = () => {
    const { Orgcode } = useParams();
    const user = useSelector((state) => state.loggeduser);
    const loggeduserdata = user ?? {};
    const correctOrg = loggeduserdata?.user?.orgShortCode;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // initial false for closed
    const checkboxRef = useRef();

    // Sync checkbox (peer) and state
    useEffect(() => {
        if (checkboxRef.current) {
            checkboxRef.current.checked = isSidebarOpen;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                checkboxRef.current.checked = false; // uncheck it
                setIsSidebarOpen(false);
            }
        };

        if (isSidebarOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

    }, [isSidebarOpen]);

    if (Orgcode !== correctOrg) {
        return <Navigate to={`/dashboard/${correctOrg}`} replace />;
    }

    return (
        <div className="flex h-screen overflow-hidden relative">
            <Helmet>
                <title>Agent Pro</title>
                <link rel="icon" type="image/jpeg" href="/images/logo.jpeg" />
            </Helmet>
            {/* Hidden peer checkbox for tailwind peer support */}
            <input
                type="checkbox"
                className="hidden peer"
                id="menu-toggle"
                name="menu-toggle"
                ref={checkboxRef}
                onChange={(e) => setIsSidebarOpen(e.target.checked)}
            />

            {/* Main content */}
            <div className="flex flex-col w-full overflow-y-auto transition-all duration-500">
                <div className="p-1 w-full bg-blue-400 text-white">
                    <Topbar />
                </div>

                <div
                    className={`fixed top-16 max-md:top-26 left-0 right-0 bottom-0 ${isSidebarOpen ? 'visible' : 'hidden'}`}
                    style={{
                        background: "rgba(0, 0, 0, 0.2)",
                        backdropFilter: "blur(8px)",
                        zIndex: 40,
                    }}
                ></div>


                <div className="relative flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </div>


            {/* Sidebar */}
            <div className="fixed inset-y-0 max-md:top-26 top-16 left-0 z-50 w-[350px] transform -translate-x-full transition-transform duration-500 peer-checked:translate-x-0">
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            </div>


        </div>
    );
};

export default Dashboard;
