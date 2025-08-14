import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, NavLink, useLocation, useParams, useNavigate } from "react-router-dom";
import { clearUser } from "../../store/slices/loggeduser";

const Topbar = () => {
    const location = useLocation();
    const lastParam = location.pathname.split("/").filter(Boolean).pop(); // Get last segment
    const user = useSelector((state) => state.loggeduser?.user);
    const loggeduserdata = user ?? {};
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(prev => !prev);
    const dropdownRef = useRef(null);
    const Orgcode  = 'Org01';

    // Close dropdown if click happens outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // Add listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    async function logout() {
        setTimeout(() => {
            navigate(`/AgentPro/`);
        }, 0);
        
        localStorage.removeItem('demologged-user');

        // ✅ Clear Redux user state
        dispatch(clearUser());
    }

    return (
        <div className="p-1 flex justify-between items-center mx-5 max-md:flex-col  max-md:relative max-md:gap-4">
            <div className="visible z-8 max-md:absolute left-0 top-16">
                <label className="relative" htmlFor="menu-toggle">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6 cursor-pointer"
                    >
                        <path d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                    </svg>
                </label>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex gap-5 items-center">
                    <div className="flex items-center gap-5 flex-wrap justify-center">
                        <h2 className="text-1xl font-bold">{loggeduserdata?.orgShortCode.toUpperCase()}</h2>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 shadow-md rounded-full p-1">
                    <img className="w-[40px] h-[40px] rounded-full object-cover" src="/AgentPro/images/logo.jpg" alt="Logo" />
                </div>
                <div className="text-lg font-semibold text-white">Agent Pro</div>
            </div>
            <div className="flex gap-5 items-center">
                <div className="relative" ref={dropdownRef}>
                    {/* Avatar Circle */}
                    <div
                        onClick={toggleDropdown}
                        className="cursor-pointer flex justify-center items-center text-white text-[16px] font-bold"
                    >
                        {loggeduserdata?.nameid?.toUpperCase()}
                    </div>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50">
                            <ul className="text-sm text-gray-700">


                                <NavLink
                                    to={`/dashboard/${Orgcode}/changeprofile`}
                                >
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                        Change Profile
                                    </li>
                                </NavLink>

                            </ul>
                        </div>
                    )}
                </div>
                <div>
                    <img className="cursor-pointer w-[30px] h-[30px]" onClick={logout} src="https://cdn-icons-png.flaticon.com/128/4436/4436954.png"></img>
                </div>
            </div>
        </div>
    )
}

export default Topbar