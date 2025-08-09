import React, { useState, useRef, useEffect } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedUser } from "../../store/slices/loggeduser";
import { Helmet } from "react-helmet";

const Login = () => {
    const { Orgcode } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [showpassword, setseen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passworderror, setPasswordErrors] = useState('');
    const [usernameerror, setUsernameErrors] = useState('');
    const [errormsg, setErrorMessage] = useState('');
    const usernameInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    const logindetails = [
        {
            'id':1,
            'username':'abhi',
            'password':'12345678',
            'orgShortCode':'Org01',
            'role':'admin'
        },
        {
            'id':2,
            'username':'aniket',
            'password':'12345678',
            'orgShortCode':'Org01',
            'role':'admin'
        },
        {
            'id':3,
            'username':'GB',
            'password':'12345678',
            'orgShortCode':'Org01',
            'role':'client'
        },
        {
            'id':4,
            'username':'db',
            'password':'12345678',
            'orgShortCode':'Org01',
            'role':'client'
        },
        {
            'id':5,
            'username':'VT',
            'password':'12345678',
            'orgShortCode':'Org01',
            'role':'client'
        },
        {
            'id':6,
            'username':'aniket',
            'password':'12345678',
            'orgShortCode':'Org02',
            'role':'admin'
        },
        {
            'id':7,
            'username':'GB',
            'password':'12345678',
            'orgShortCode':'Org02',
            'role':'client'
        },
        {
            'id':8,
            'username':'VT',
            'password':'12345678',
            'orgShortCode':'Org02',
            'role':'client'
        },
        {
            'id':8,
            'username':'UG50',
            'password':'12345678',
            'orgShortCode':'Org01',
            'role':'client'
        },
         {
            'id':8,
            'username':'UG50',
            'password':'12345678',
            'orgShortCode':'Org02',
            'role':'client'
        }
    ]

    const unseen = () => setseen((prev) => !prev);

    // ✅ Get logged-in user from Redux
    const user = useSelector((state) => state.loggeduser?.user);
    useEffect(() => {
        if (user?.orgShortCode) {
            navigate(`/dashboard/${Orgcode}`, { replace: true });
        }
    }, [user, Orgcode, navigate]);


    useEffect(() => {
        if (location.state?.message) {
            setErrorMessage(location.state.message);

            // Optionally clear message after showing it for a few seconds
            const timer = setTimeout(() => setErrorMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [location.state]);

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        validatePassword(value);
    };

    const handleUsername = (e) => {
        const value = e.target.value;
        setUsername(value);
        validateUsername(value);
    }

    const validatePassword = (value) => {
        if (!value.trim()) {
            setPasswordErrors("❌ Password is required");
            return false;
        } else {
            setPasswordErrors("");
            return true;
        }
    }

    const validateUsername = (value) => {
        if (!value.trim()) {
            setUsernameErrors("❌ Username is required");
            return false;
        } else {
            setUsernameErrors("");
            return true;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isPasswordValid = validatePassword(password);
        const isUsernameValid = validateUsername(username);

        if (!isUsernameValid) {
            usernameInputRef.current.focus();
            return;
        }

        if (!isPasswordValid) {
            passwordInputRef.current.focus();
            return;
        }

        // const getallusers = JSON.parse(localStorage.getItem('allusers'));

        const matchedUser = logindetails.find(
            (item) =>
                item?.username?.toLowerCase() === username?.toLowerCase() &&
                item?.password?.toLowerCase() === password?.toLowerCase() &&
                item?.orgShortCode?.toLowerCase() === Orgcode?.toLowerCase()
        );

        if (matchedUser) {
            localStorage.setItem('demologged-user', JSON.stringify(matchedUser));

            // ✅ Defer side effects to avoid React concurrent render error
            setTimeout(() => {
                dispatch(setLoggedUser(matchedUser));
                navigate(`/dashboard/${Orgcode}`);
            }, 0);

        } else {
            setErrorMessage("Invalid Credentials");
            setTimeout(() => setErrorMessage(""), 5000);
        }
    }

    return (
        <div className="grid grid-cols-1 min-h-screen">
            <Helmet>
                <title>Agent Pro</title>
                <link rel="icon" type="image/jpeg" href="/images/logo.jpeg" />
            </Helmet>
            <div className="flex flex-col items-center justify-center p-6 lg:p-12">
                <img className="pl-6 pt-6 w-[140px]" src="/images/logo.jpeg" alt="Logo" />
                <h2 className="text-3xl sm:text-4xl font-semibold mb-2 text-center">Welcome</h2>
                <p className="mb-4 text-center">Login to your account</p>

                {errormsg && <p className="text-white p-3 mb-4 bg-red-600 rounded w-full max-w-md text-center">{errormsg}</p>}

                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
                    <div>
                        <label htmlFor="username" className="block mb-1 text-sm font-medium">Username</label>
                        <input
                            value={username}
                            onChange={handleUsername}
                            ref={usernameInputRef}
                            placeholder="Enter your username"
                            id="username"
                            type="text"
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#696cff]"
                        />
                        {usernameerror && <p className="text-red-600 mt-1">{usernameerror}</p>}
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block mb-1 text-sm font-medium">Password</label>
                        <input
                            value={password}
                            onChange={handlePasswordChange}
                            ref={passwordInputRef}
                            type={showpassword ? "text" : "password"}
                            placeholder="*************"
                            id="password"
                            className="w-full border border-gray-300 rounded px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#696cff]"
                        />
                        <img
                            width="20"
                            onClick={unseen}
                            className={`absolute top-[36px] right-3 cursor-pointer ${showpassword ? "hidden" : "block"}`}
                            src="https://cdn-icons-png.flaticon.com/128/2952/2952139.png"
                            alt="Show password"
                        />
                        <img
                            width="20"
                            onClick={unseen}
                            className={`absolute top-[36px] right-3 cursor-pointer ${showpassword ? "block" : "hidden"}`}
                            src="https://cdn-icons-png.flaticon.com/128/18445/18445167.png"
                            alt="Hide password"
                        />
                        {passworderror && <p className="text-red-600 mt-1">{passworderror}</p>}
                    </div>

                    <button
                        type="submit"
                        className="bg-[#696cff] cursor-pointer hover:bg-[#5858e0] text-white w-full py-2 rounded-md transition"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
