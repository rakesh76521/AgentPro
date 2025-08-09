/**
 * Sidebar with nested submenu support
 */
import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const { Orgcode } = useParams();
  const lastSegment = location.pathname.split('/').filter(Boolean).pop();
  const segments = location.pathname.split('/').filter(Boolean);
  const secondLastSegment = segments[segments.length - 2];
  const user = useSelector((state) => state.loggeduser?.user);
  const loggeduserdata = user ?? {};


  // console.log(loggeduserdata);
  const adminmenus = [
  ...(loggeduserdata?.role === 'admin'
    ? [
        {
          name: 'Calculate',
          id: 'calculate',
          link: `/dashboard/${Orgcode}/calculate`,
        },
        {
          name: 'Transaction',
          id: 'transaction',
          link: `/dashboard/${Orgcode}/transaction`,
        },
      ]
    : [
        {
          name: 'View Report',
          id: 'view-report',
          link: `/dashboard/${Orgcode}/view-report`,
        },
      ]
  )
];

  function toggleMenu(id) {
    document.querySelectorAll('input[name="admin_menu"]').forEach(input => {
      if (input.id !== id) input.checked = false;
    });
  }

  useEffect(() => {
    adminmenus.forEach(item => {
      item?.submenus?.forEach(sub => {
        if (lastSegment === sub.id) {
          const input = document.getElementById(item.id);
          if (input) input.checked = true;
        }
        sub?.submenus?.forEach(subsub => {
          if (lastSegment === subsub.id) {
            const inputParent = document.getElementById(item.id);
            const inputSub = document.getElementById(`subsubmenu_${sub.id}`);
            if (inputParent) inputParent.checked = true;
            if (inputSub) inputSub.checked = true;
          }
        });
      });
    });
  }, [lastSegment]);

  const isActiveClass = (menuClass) => {
    if (Array.isArray(menuClass)) {
      return menuClass.includes(lastSegment) || (lastSegment === Orgcode && menuClass.includes(secondLastSegment));
    } else {
      return menuClass === lastSegment || (lastSegment === Orgcode && menuClass === secondLastSegment);
    }
  };

  return (
    <div className="w-full h-full" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="bg-blue-400 w-full h-full text-white flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <ul className="text-1xl px-4">
            {adminmenus.map((element, index) => (
              <li key={index + 1} className="my-2">
                <div className="flex flex-col">
                  {element.submenus && element.submenus.length > 0 ? (
                    <>
                      <input
                        type="checkbox"
                        onClick={() => toggleMenu(element.id)}
                        className="hidden peer"
                        name="admin_menu"
                        id={element.id}
                      />
                      <label
                        htmlFor={element.id}
                        className={`${isActiveClass(element.class) ? 'bg-slate-100 text-slate-900' : ''} group transition-all duration-300 hover:bg-slate-100 hover:text-slate-900 p-2 flex justify-between items-center cursor-pointer rounded-md hover:shadow-md`}
                      >
                        <span className="flex items-center gap-3">
                          {element.image && <img width="30" src={element.image} alt={element.name} />}
                          <p>{element.name}</p>
                        </span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </label>
                      <div className="max-h-0 peer-checked:max-h-[500px] overflow-y-auto transition-all duration-500 custom-scrollbar-submenu">
                        <ul className="pl-5 flex flex-col mr-3">
                          {element.submenus.map((submenu) => (
                            <div key={submenu.id} className="flex flex-col">
                              {submenu.submenus ? (
                                <>
                                  <input
                                    type="checkbox"
                                    className="hidden peer"
                                    id={`subsubmenu_${submenu.id}`}
                                    name="admin_menu"
                                  />
                                  <label
                                    htmlFor={`subsubmenu_${submenu.id}`}
                                    className={`flex justify-between items-center ${lastSegment === submenu.id ? 'bg-slate-100 text-slate-900' : ''} w-full transition-all duration-300 hover:bg-slate-100 hover:text-slate-900 p-2 gap-7 cursor-pointer rounded-md hover:shadow-md`}
                                  >
                                    <span>{submenu.name}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </label>
                                  <div className="max-h-0 peer-checked:max-h-[100vh] overflow-y-auto transition-all duration-500 custom-scrollbar-submenu">
                                    <ul className="pl-5 flex flex-col mr-3 gap-1">
                                      {submenu.submenus.map((subsubmenu, index) => (
                                        <NavLink
                                          key={index + 1}
                                          to={subsubmenu.link}
                                          onClick={() => setIsSidebarOpen(false)}
                                          className={`${lastSegment === subsubmenu.id ? 'bg-slate-100 text-slate-900' : ''} w-full transition-all duration-300 hover:bg-slate-100 hover:text-slate-900 p-2 flex gap-7 items-center cursor-pointer rounded-md hover:shadow-md`}
                                        >
                                          <li className="open-submenu" id={subsubmenu.id}>{subsubmenu.name}</li>
                                        </NavLink>
                                      ))}
                                    </ul>
                                  </div>
                                </>
                              ) : (
                                <NavLink
                                  to={submenu.link}
                                  className={`${lastSegment === submenu.id ? 'bg-slate-100 text-slate-900' : ''} w-full transition-all duration-300 hover:bg-slate-100 hover:text-slate-900 p-2 flex gap-7 items-center cursor-pointer rounded-md hover:shadow-md`}
                                  onClick={() => setIsSidebarOpen(false)}
                                >
                                  <li className="open-submenu" id={submenu.id}>{submenu.name}</li>
                                </NavLink>
                              )}
                            </div>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <NavLink
                      to={element.link}
                      className={`${isActiveClass(element.id) ? 'bg-slate-100 text-slate-900' : ''} transition-all duration-300 hover:bg-slate-100 hover:text-slate-900 p-2 flex gap-3 items-center cursor-pointer rounded-md hover:shadow-md`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      {element.image && <img width="30" src={element.image} alt={element.name} />}
                      <p>{element.name}</p>
                    </NavLink>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;