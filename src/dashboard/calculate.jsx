import React, { useRef, useState, useEffect } from "react";
import axiosInstance from "../../axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { setfinalmasterrecord } from "../../store/slices/mastercommonrecord";
import { useParams } from "react-router-dom";


const Calculate = () => {
  const loggeduser = useSelector((state) => state.loggeduser.user);
  const dispatch = useDispatch();
  const Orgcode = 'Org01';

  const customernameRef = useRef();
  const commitionRef = useRef();
  const nseRef = useRef();
  const optionRef = useRef();
  const mcxRef = useRef();
  const comexRef = useRef(null);
  const iconRef = useRef(null);
  const idvalRef = useRef(null);
  const amountRef = useRef();

  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState("");
  const [clientname, setclientname] = useState("VT");
  const [checkeditadd, setcheckeditadd] = useState(true);
  const [agentname, setagentname] = useState("UG50");
  const [commition, setcommition] = useState('');
  const [buysell, setbuysell] = useState('BUY');
  const [trade, settrade] = useState('RETAIL');
  const [clientnamefilter, setclientnamefilter] = useState("VT");
  const [agentnamefilter, setagentnamefilter] = useState("UG50");
  const [iponamefilter, setiponamefilter] = useState("");
  const [saudafilter, setsaudafilter] = useState('');
  const [buysellfilter, setbuysellfilter] = useState('');
  const [tradefilter, settradefilter] = useState('');
  const [allipos, setallipos] = useState([]);
  const [edituserid, setedituserid] = useState(0);
  const [mcx, setmcx] = useState("");
  const [nse, setnse] = useState("");
  const [option, setoption] = useState("");
  const [comex, setcomex] = useState("");
  const [idval, setidval] = useState('');
  const [requiredmess, setrequiredmess] = useState("");
  const [allclients, setallclients] = useState([]);
  const [anymessage, setanymessage] = useState(null);
  const [filterbutton, setfilterbutton] = useState(false);
  const [searchvalue, setsearchvalue] = useState('');
  const [commisionmess, setcommisionmess] = useState('');
  const [mcxmess, setmcxmess] = useState('');
  const [idmess, setidmess] = useState('');
  const [nsemess, setnsemess] = useState('');
  const [optionerr, setoptionerr] = useState('');
  const [comexerr, setcomexerr] = useState('');

  var [existingUsers, setexistingUsers] = useState(JSON.parse(localStorage.getItem(`agents-${Orgcode}`)));
  const [sortedUsers, setSortedUsers] = useState([]);

  const [allUsers, setAllUsers] = useState([]);

  //Pagination
  const [records_per_Page, setRecordsperpage] = useState(5);
  const [allrecords, setallrecords] = useState(0);
  const [totalpages, settotalpages] = useState(0);
  const [checkpaginationbutton, setcheckpaginationbutton] = useState(false);
  const [currentpage, setcurrentpage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const startindex = (currentpage - 1) * records_per_Page;


  // console.log(loggeduser)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setModalType('');
      }
    };

    if (modalType) {
      window.addEventListener('keydown', handleKeyDown);
    }

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalType]);

  useEffect(() => {
    if (!existingUsers) {
      setSortedUsers([]);
      return;
    }

    const sorted = [...existingUsers].sort((a, b) => new Date(b.updatedDate) - new Date(a.updatedDate));
    setSortedUsers(sorted);
  }, [existingUsers]);

  useEffect(() => {
    if (anymessage?.error) {
      const timer = setTimeout(() => {
        setanymessage(null); // or setanymessage({})
      }, 5000); // 5000ms = 5 seconds

      return () => clearTimeout(timer); // Cleanup on unmount or change
    }
  }, [anymessage]);


  useEffect(() => {
    setallrecords(existingUsers?.length);
    settotalpages(existingUsers?.length / records_per_Page);
  }, [currentpage])

  useEffect(() => {
    if (modalType) {
      document.body.style.overflow = "hidden"; // Disable scroll
    } else {
      document.body.style.overflow = "auto";   // Re-enable scroll
    }

    // Clean up on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalType]);

  const handleChange = (e) => {
    const newLimit = Number(e.target.value);
    setRecordsperpage(newLimit);
    setcurrentpage(1); // or 0 if your pagination is 0-indexed
  };

  const prevbutton = () => {
    setcurrentpage(prev => (prev > 1 ? prev - 1 : prev));
  };

  const nextbutton = () => {
    const totalItems = searchvalue === '' ? sortedUsers.length : filteredUsers.length;
    const totalPages = Math.ceil(totalItems / Number(records_per_Page));

    setcurrentpage(prev => (prev < totalPages ? prev + 1 : prev));
  };

  const search = (e) => {
    const searchvalue = e.target.value;
    setsearchvalue(searchvalue);
    if (searchvalue) {
      const filteredUsers = sortedUsers.filter(data =>
      (
        data.customerName.toLowerCase().includes(searchvalue.toLowerCase()) ||
        data.agentName.toLowerCase().includes(searchvalue.toLowerCase())
      )
      );

      setSortedUsers(filteredUsers);
      setcurrentpage(1);
      setallrecords(filteredUsers.length);
    } else {
      setSortedUsers(existingUsers);
    }
  };


  const sortuser = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';

    const sortedData = [...existingUsers].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      // Use string comparison always except for specific numeric keys
      const numericKeys = ['id', 'commision', 'mcx', 'nse', 'options', 'comex']; // add more if needed
      const isNumeric = numericKeys.includes(key);

      if (isNumeric) {
        const numA = parseFloat(aVal) || 0;
        const numB = parseFloat(bVal) || 0;
        return direction === 'asc' ? numA - numB : numB - numA;
      } else {
        const strA = (aVal || '').toString().toLowerCase();
        const strB = (bVal || '').toString().toLowerCase();
        if (strA < strB) return direction === 'asc' ? -1 : 1;
        if (strA > strB) return direction === 'asc' ? 1 : -1;
        return 0;
      }
    });

    setSortConfig({ key, direction });
    setSortedUsers(sortedData);
  };

  const edituserform = (element, modalTypee) => {
    if (modalTypee == 'edit') {
      setModalType("edit");
      setedituserid(element);
      const edituserdata = existingUsers.find(data => data.id == element);

      setclientname(edituserdata?.customerName);
      setagentname(edituserdata?.agentName);
      setcommition(edituserdata?.commision);
      setmcx(edituserdata?.mcx);
      setnse(edituserdata?.nse);
      setoption(edituserdata?.options);
      setcomex(edituserdata?.comex);
      setidval(edituserdata?.id)
    } else {
      setModalType("add");
      setclientname('VT');
      setagentname('UG50');
      setidval('');
      setcommition('');
      setmcx('');
      setnse('');
      setoption('');
      setcomex('');
    }
  }

  function applyFilters() {
    const raw = JSON.parse(localStorage.getItem(`agents-${Orgcode}`));

    const total = raw.filter(item => {
      const customerMatch = !clientnamefilter || item.customerName === clientnamefilter;
      const agentMatch = !agentnamefilter || item.agentName === agentnamefilter;
      return customerMatch && agentMatch;
    });
    setfilterbutton(true);
    setexistingUsers(total);
    setSortedUsers(total);
    setallrecords(total.length)
  }

  function removeFilters() {
    const raw = JSON.parse(localStorage.getItem(`agents-${Orgcode}`));
    setfilterbutton(false);
    setexistingUsers(raw);
    setSortedUsers(raw);
    setclientnamefilter('VT');
    setagentnamefilter('UG50');
    setallrecords(raw.length);
  }


  const downloadexcel = () => {
    const finalData = existingUsers.map((element) => ({
      clientShortCode: element.clientShortCode,
      ipoId: element.ipoName,
      saudaType: element.saudaType,
      transactionType: element.transactionType,
      appType: element.appType,
      quantity: element.quantity,
      price: element.price
    }));

    const worksheet = utils.json_to_sheet(finalData);
    const workbook = utils.book_new();

    utils.book_append_sheet(workbook, worksheet, "Allotment");

    writeFile(workbook, "TransactionData.xlsx");
  }

  function refresh(e) {
    setLoading(true);
    setsearchvalue('');
    setclientname('VT');
    setagentname('UG50');
    setidval('');
    setcommition('');
    setmcx('');
    setnse('');
    setoption('');
    setcomex('');

    setidmess('');
    setcommisionmess('');
    setmcxmess('');
    setnsemess('');
    setoptionerr('');
    setcomexerr('');

    setTimeout(() => setLoading(false), 100); // <- Keep this short


  }

  function handleSubmit(e, inlinecheck) {
    e.preventDefault();
    let hasError = false;

    if (!idval) {
      setidmess('This field is required');
      hasError = true;
    }

    if (!commition) {
      setcommisionmess('This field is required');
      hasError = true;
    }

    if (!mcx) {
      setmcxmess('This field is required');
      hasError = true;
    }

    if (!nse) {
      setnsemess('This field is required');
      hasError = true;
    }

    if (!option) {
      setoptionerr('This field is required');
      hasError = true;
    }

    if (!comex) {
      setcomexerr('This field is required');
      hasError = true;
    }

    if (hasError) return false;


    const action = checkeditadd // detect clicked button

    const dateTime = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    let existingData = [];

    try {
      const raw = localStorage.getItem(`agents-${Orgcode}`);
      existingData = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
    } catch (err) {
      existingData = [];
    }

    if (action === true) {
      const nextId =
        existingData.length > 0
          ? Math.max(...existingData.map((entry) => entry.id || 0)) + 1
          : 1;

      const newEntry = {
        id: idval,
        customerName: clientname,
        agentName: agentname,
        commision: commition,
        mcx: mcx,
        nse: nse,
        options: option,
        comex: comex,
        createdDate: dateTime,
        updatedDate: dateTime,
      };

      existingData.push(newEntry);
      setclientname('VT');
      setidval('');
      setagentname('UG50');
      setcommition('');
      setmcx('');
      setnse('');
      setoption('');
      setcomex('');
    } else if (action === false) {
      existingData = existingData.map((item) => {
        if (item.id === edituserid) {
          return {
            ...item,
            id: idval,
            customerName: clientname,
            agentName: agentname,
            commision: commition,
            mcx: mcx,
            nse: nse,
            options: option,
            comex: comex,
            updatedDate: dateTime,
          };
        }
        return item;
      });
      setclientname('VT');
      setagentname('UG50');
      setcommition('');
      setmcx('');
      setidval('');
      setnse('');
      setoption('');
      setcomex('');
    }
    localStorage.setItem(`agents-${Orgcode}`, JSON.stringify(existingData));
    const matched = existingData.filter((item) => item.customerName === clientname);
    const highestSeer = matched.length > 0
      ? matched.reduce((maxItem, currentItem) => {
        return currentItem.commision > maxItem.commision ? currentItem : maxItem;
      })
      : null;

    dispatch(setfinalmasterrecord(highestSeer))
    setcommisionmess('');
    setmcxmess('');
    setidmess('');
    setnsemess('');
    setoptionerr('');
    setcomexerr('');
    setexistingUsers(existingData);
    setSortedUsers(existingData);
    setallrecords(existingData.length);
    setanymessage({ 'error': (action ? 'add' + ' ' + 'successfully' : 'update' + ' ' + 'successfully').toUpperCase() });
  }

  function deletetransaction(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");

    if (!confirmDelete) return;

    const updatedUsers = existingUsers.filter(item => item.id !== id);

    localStorage.setItem(`agents-${Orgcode}`, JSON.stringify(updatedUsers));
    setexistingUsers(updatedUsers);
  }


  return (
    <div>
      {/* <div className={`fixed inset-0 ${(modalType == 'add' || modalType == 'edit') ? 'visible' : 'hidden'}`}
        style={{
          background: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(8px)",
          zIndex: 40,
        }}
      ></div>
      {modalType && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center">
          <div
            className="
        relative
        bg-white rounded-xl shadow-2xl 
        w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto 
        transition-all duration-500 ease-in-out p-6
        animate-fadeIn
      "
          >
           
            <button
              onClick={() => {
                setModalType("");
                setanymessage("");
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
            >
              <img
                className="w-5 h-5"
                src="https://cdn-icons-png.flaticon.com/128/9916/9916878.png"
                alt="Close"
              />
            </button>
            <form className="mt-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col w-full">
                  <label htmlFor="name">Customer Name</label>
                  <select
                    value={clientname}
                    id="name"
                    className="border p-2 rounded bg-white"
                    onChange={(e) => setclientname(e.target.value)}
                    ref={customernameRef}
                  >
                    <option value="SANJU">SANJU</option>
                    <option value="DELHI">DELHI</option>
                    <option value="LEGO">LEGO</option>
                    <option value="ANKUSH">ANKUSH</option>
                    <option value="RAJA">RAJA</option>
                    <option value="NAVIN">NAVIN</option>
                    <option value="KAMAL">KAMAL</option>
                    <option value="JIVAN">JIVAN</option>
                    <option value="HITRAT">HITRAT</option>
                    <option value="GURU">GURU</option>
                    <option value="DARASINGH">DARASINGH</option>
                    <option value="CHIRAG">CHIRAG</option>
                    <option value="CHANDRA">CHANDRA</option>
                    <option value="ANURAG">ANURAG</option>
                    <option value="ABHAY">ABHAY</option>
                    <option value="AADI">AADI</option>
                    <option value="SANJAY">SANJAY</option>
                    <option value="RAJESH">RAJESH</option>
                    <option value="SHIVANI">SHIVANI</option>
                    <option value="SH">SH</option>
                    <option value="VT">VT</option>
                    <option value="VIMLESH">VIMLESH</option>
                    <option value="VIKAS">VIKAS</option>
                    <option value="VD">VD</option>
                    <option value="VARUN">VARUN</option>
                    <option value="SUNIL">SUNIL</option>
                    <option value="SS">SS</option>
                    <option value="SONY">SONY</option>

                  </select>
                </div>

                <div className="flex flex-col w-full">
                  <label htmlFor="ipo">Agent Name</label>
                  <select
                    value={agentname}
                    id="agent"
                    className="border p-2 rounded bg-white"
                    onChange={(e) => setagentname(e.target.value)}
                  >

                    <option value="UG50">UG50</option>
                    <option value="VG">VG</option>
                    <option value="RSA">RSA</option>
                    <option value="RITESH">RITESH</option>
                    <option value="SHARES">SHARES</option>
                    <option value="VT">VT</option>
                    <option value="RITESH">RITESH</option>
                    <option value="GB">GB</option>
                    <option value="AYT">AYT</option>
                    <option value="DB">DB</option>

                  </select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col w-full">
                  <label htmlFor="sauda">Commision</label>
                  <div className="flex gap-5 items-center">
                    <input
                      value={commition}
                      onChange={(e) => setcommition(e.target.value)}
                      ref={commitionRef}
                      type="number"
                      id="commition"
                      className="border p-2 rounded bg-white"
                    />
                    <span>%</span>
                  </div>
                  {commisionmess && <p className="text-red-500 text-sm">{commisionmess}</p>}
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col w-full">
                  <label htmlFor="quan">MCX</label>
                  <input
                    value={mcx}
                    onChange={(e) => setmcx(e.target.value)}
                    ref={mcxRef}
                    type="number"
                    id="mcx"
                    className="border p-2 rounded bg-white"
                  />
                  {mcxmess && <p className="text-red-500 text-sm">{mcxmess}</p>}
                </div>

                <div className="flex flex-col w-full">
                  <label htmlFor="price">NSE</label>
                  <input
                    value={nse}
                    onChange={(e) => setnse(e.target.value)}
                    ref={nseRef}
                    type="number"
                    id="nse"
                    className="border p-2 rounded bg-white"
                  />
                  {nsemess && <p className="text-red-500 text-sm">{nsemess}</p>}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col w-full">
                  <label htmlFor="quan">OPTIONS</label>
                  <input
                    value={option}
                    onChange={(e) => setoption(e.target.value)}
                    ref={optionRef}
                    type="number"
                    id="options"
                    className="border p-2 rounded bg-white"
                  />
                  {optionerr && <p className="text-red-500 text-sm">{optionerr}</p>}
                </div>

                <div className="flex flex-col w-full">
                  <label htmlFor="price">COMEX</label>
                  <input
                    value={comex}
                    onChange={(e) => setcomex(e.target.value)}
                    ref={comexRef}
                    type="number"
                    id="comex"
                    className="border p-2 rounded bg-white"
                  />
                  {comexerr && <p className="text-red-500 text-sm">{comexerr}</p>}
                </div>
              </div>

              <div className="border-t  border-gray-300 mt-6 pt-4 flex justify-end gap-4">
                <button
                  onClick={() => {
                    setModalType("");
                    setanymessage("");
                  }}
                  className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 rounded"
                >
                  ❌ Close
                </button>

                <button
                  onClick={(e) => handleSubmit(e)}
                  value={modalType === 'add' ? 'submit' : 'update'}
                  className="px-4 py-2 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  {modalType === 'add' ? 'Save Transaction' : 'Update Transaction'}
                </button>
              </div>

              {anymessage?.error && (
                <div className={`mt-3 text-center text-${anymessage?.type === 'success' ? 'green' : 'red'}-600`}>
                  {anymessage?.error}
                </div>
              )}
            </form>
          </div>
        </div>
      )} */}
      <details className="bg-white border border-gray-300 rounded-xl p-3 shadow-sm m-2">
        <summary className="text-sm font-semibold text-gray-800 cursor-pointer select-none outline-none">
          Apply Filter
        </summary>
        <hr className="mt-2 border-gray-200"></hr>
        {/* Filter Content */}
        <div className="pt-4">
          {/* Filter Fields */}
          <div className="flex flex-wrap gap-6">
            {/* Customer Name */}
            {loggeduser?.payload?.role !== 'CLIENT' && (
              <div className="flex flex-col min-w-[160px] max-w-[200px] w-full">
                <label className="text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <select
                  value={clientnamefilter}
                  id="name"
                  className="bg-white border p-2 rounded text-[12px] h-[35px]"
                  onChange={(e) => setclientnamefilter(e.target.value)}
                >
                  <option value="VT">VT</option>
                  <option value="VIMLESH">VIMLESH</option>
                  <option value="VIKAS">VIKAS</option>
                  <option value="VD">VD</option>
                  <option value="VARUN">VARUN</option>
                  <option value="SUNIL">SUNIL</option>
                  <option value="SS">SS</option>
                  <option value="SONY">SONY</option>
                </select>
              </div>
            )}
            <div className="flex flex-col min-w-[160px] max-w-[200px] w-full">
              <label className="text-sm font-medium text-gray-700 mb-1">Agent Name</label>
              <select
                value={agentnamefilter}
                id="name"
                className="bg-white border p-2 rounded text-[12px] h-[35px]"
                onChange={(e) => setagentnamefilter(e.target.value)}
              >
                <option value="UG50">UG50</option>
                <option value="RSA">RSA</option>
                <option value="RITESH">RITESH</option>
                <option value="SHARES">SHARES</option>
                <option value="VT">VT</option>
                <option value="RITESH">RITESH</option>
                <option value="GB">GB</option>
                <option value="AYT">AYT</option>
                <option value="DB">DB</option>
              </select>
            </div>
            {/* Buttons */}
            <div className="flex gap-3 items-end min-w-[160px] max-w-[200px] w-full">
              <button
                onClick={applyFilters}
                className="h-[35px] text-[12px] text-white px-4 rounded-md shadow transition cursor-pointer"
                style={{ backgroundColor: 'oklch(0.73 0.14 20.23)' }}
              >
                Add Filter
              </button>

              <button
                onClick={removeFilters}
                className="h-[35px] text-[12px] text-white px-4 rounded-md shadow transition cursor-pointer"
                style={{ backgroundColor: 'oklch(0.73 0.14 20.23)' }}
              >
                Remove Filter
              </button>
            </div>
          </div>
        </div>
      </details>
        {/* Search & Add User */}
        <div className="bg-gray-100 rounded-2xl py-2 px-4 overflow-auto">

          {/* Fixed-height message container to avoid layout shift */}
          <div className="min-h-[24px] mb-1 transition-opacity duration-300">
            {anymessage?.error && (
              <div className="text-green-600 font-semibold">
                {anymessage.error}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-5 items-center mb-2 justify-end">
            <div className="flex gap-3 justify-end w-full">
              <div className="flex items-center cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  ref={iconRef}
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  onClick={(e) => refresh(e)}
                  className={`size-4 ${loading ? 'animate-spin' : ''}`}
                >
                  <path d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.932.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-1.242l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.241l-.84-.84v1.371a.75.75 0 0 1-1.5 0V9.591a.75.75 0 0 1 .75-.75H5.35a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.932.75.75 0 0 1 1.025-.273Z" />
                </svg>
              </div>
            </div>
        </div>

        <div className="space-y-2">
          {/* 🔹 Table 1: Form Entry Table */}
          <div className="overflow-x-auto rounded-t-xl border shadow">
            <table className="min-w-[1200px] w-full text-sm text-center bg-white border border-gray-300">
              <thead className="text-white uppercase bg-[#a9a9a9]">
                <tr>
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Client Name</th>
                  <th className="border p-2">Agent Name</th>
                  <th className="border p-2">Commission</th>
                  <th className="border p-2">MCX</th>
                  <th className="border p-2">NSE</th>
                  <th className="border p-2">OPTION</th>
                  <th className="border p-2">COMMEX</th>
                  <th colSpan="2" className="border p-2">Action</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="border p-2">
                    <div className="flex flex-col items-center gap-1">
                      <input
                        value={idval}
                        onChange={(e) => setidval(e.target.value)}
                        ref={idvalRef}
                        placeholder="Enter ID"
                        type="number"
                        id="id"
                        className="border p-2 rounded bg-white"
                      />
                      {idmess && <p className="text-red-500 text-sm">{idmess}</p>}

                    </div>
                  </td>

                  {/* Client Name Dropdown */}
                  <td className="border p-2">
                    <select
                      value={clientname}
                      id="name"
                      className="border p-2 rounded bg-white"
                      onChange={(e) => setclientname(e.target.value)}
                      ref={customernameRef}
                    >
                      <option value="SANJU">SANJU</option>
                      <option value="DELHI">DELHI</option>
                      <option value="LEGO">LEGO</option>
                      <option value="ANKUSH">ANKUSH</option>
                      <option value="RAJA">RAJA</option>
                      <option value="NAVIN">NAVIN</option>
                      <option value="KAMAL">KAMAL</option>
                      <option value="JIVAN">JIVAN</option>
                      <option value="HITRAT">HITRAT</option>
                      <option value="GURU">GURU</option>
                      <option value="DARASINGH">DARASINGH</option>
                      <option value="CHIRAG">CHIRAG</option>
                      <option value="CHANDRA">CHANDRA</option>
                      <option value="ANURAG">ANURAG</option>
                      <option value="ABHAY">ABHAY</option>
                      <option value="AADI">AADI</option>
                      <option value="SANJAY">SANJAY</option>
                      <option value="RAJESH">RAJESH</option>
                      <option value="SHIVANI">SHIVANI</option>
                      <option value="SH">SH</option>
                      <option value="VT">VT</option>
                      <option value="VIMLESH">VIMLESH</option>
                      <option value="VIKAS">VIKAS</option>
                      <option value="VD">VD</option>
                      <option value="VARUN">VARUN</option>
                      <option value="SUNIL">SUNIL</option>
                      <option value="SS">SS</option>
                      <option value="SONY">SONY</option>

                    </select>
                  </td>

                  {/* Amount Input */}
                  <td className="border p-2">
                    <div className="flex flex-col items-center gap-1">
                      <select
                        value={agentname}
                        id="agent"
                        className="border p-2 rounded bg-white"
                        onChange={(e) => setagentname(e.target.value)}
                      >

                        <option value="UG50">UG50</option>
                        <option value="VG">VG</option>
                        <option value="RSA">RSA</option>
                        <option value="RITESH">RITESH</option>
                        <option value="SHARES">SHARES</option>
                        <option value="VT">VT</option>
                        <option value="RITESH">RITESH</option>
                        <option value="GB">GB</option>
                        <option value="AYT">AYT</option>
                        <option value="DB">DB</option>

                      </select>
                    </div>
                  </td>

                  {/* Gross Inputs */}

                  <td className="border p-2">
                    <div className="flex flex-col items-center gap-1">
                      <input
                        value={commition}
                        onChange={(e) => setcommition(e.target.value)}
                        ref={commitionRef}
                        placeholder="Enter Commision value"
                        type="number"
                        id="commition"
                        className="border p-2 rounded bg-white"
                      />
                      {commisionmess && <p className="text-red-500 text-sm">{commisionmess}</p>}

                    </div>
                  </td>


                  <td className="border p-2">
                    <div className="flex flex-col items-center gap-1">
                      <input
                        value={mcx}
                        onChange={(e) => setmcx(e.target.value)}
                        ref={mcxRef}
                        placeholder="Enter MCX value"
                        type="number"
                        id="mcx"
                        className="border p-2 rounded bg-white"
                      />
                      {mcxmess && <p className="text-red-500 text-sm">{mcxmess}</p>}

                    </div>
                  </td>


                  <td className="border p-2">
                    <div className="flex flex-col items-center gap-1">
                      <input
                        value={nse}
                        onChange={(e) => setnse(e.target.value)}
                        ref={nseRef}
                        placeholder="Enter NSE value"
                        type="number"
                        id="nse"
                        className="border p-2 rounded bg-white"
                      />
                      {nsemess && <p className="text-red-500 text-sm">{nsemess}</p>}

                    </div>
                  </td>


                  <td className="border p-2">
                    <div className="flex flex-col items-center gap-1">
                      <input
                        value={option}
                        onChange={(e) => setoption(e.target.value)}
                        ref={optionRef}
                        placeholder="Enter OPTION value"
                        type="number"
                        id="options"
                        className="border p-2 rounded bg-white"
                      />
                      {optionerr && <p className="text-red-500 text-sm">{optionerr}</p>}

                    </div>
                  </td>


                  <td className="border p-2">
                    <div className="flex flex-col items-center gap-1">
                      <input
                        value={comex}
                        onChange={(e) => setcomex(e.target.value)}
                        ref={comexRef}
                        type="number"
                        placeholder="Enter COMEX value"
                        id="comex"
                        className="border p-2 rounded bg-white"
                      />
                      {comexerr && <p className="text-red-500 text-sm">{comexerr}</p>}

                    </div>
                  </td>
                  {/* Submit Button */}
                  <td colSpan="2" className="border p-2">
                    <button
                      onClick={(e) => { handleSubmit(e, 'submit'); setcheckeditadd(true) }}
                      value={'submit'}
                      className="bg-gray-600 text-white px-3 py-2 rounded text-xs"
                    >
                      <div className="flex gap-1 items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table 2 */}
          <div className="flex justify-start mt-20">
            <input
              type="search"
              value={searchvalue}
              placeholder={`Search by ${loggeduser?.payload?.role === 'CLIENT' ? '' : 'customer,'} IPO , type...`}
              onChange={(e) => search(e)}
              className="max-sm:w-[40vw] w-[30vw] px-4 py-2 border border-gray-600 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200"
            />
          </div>
          <div className="overflow-x-auto rounded-md border shadow">
            <table className="min-w-[1200px] w-full text-sm text-center bg-white border border-gray-400 table-fixed">
              <thead className="bg-[#d9e1f2]">
                <tr>
                  <th className="border p-2 select-none">ID</th>
                  <th
                    className="border p-2 cursor-pointer select-none"
                    onClick={() => sortuser('customerName')}
                  >
                    Customer Name
                    <span className="ml-1">
                      {sortConfig.key === 'customerName' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '⇅'}
                    </span>
                  </th>
                  <th
                    className="border p-2 select-none"
                    onClick={() => sortuser('agentName')}
                  >
                    Agent Name
                    <span className="ml-1">
                      {sortConfig.key === 'agentName' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '⇅'}
                    </span>
                  </th>
                  <th
                    className="border p-2 select-none"
                    onClick={() => sortuser('commision')}
                  >
                    Commision
                    <span className="ml-1">
                      {sortConfig.key === 'commision' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '⇅'}
                    </span>
                  </th>
                  <th
                    className="border p-2 select-none"
                    onClick={() => sortuser('mcx')}
                  >
                    MCX
                    <span className="ml-1">
                      {sortConfig.key === 'mcx' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '⇅'}
                    </span>
                  </th>
                  <th
                    className="border p-2 select-none"
                    onClick={() => sortuser('nse')}
                  >
                    NSE
                    <span className="ml-1">
                      {sortConfig.key === 'nse' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '⇅'}
                    </span>
                  </th>
                  <th
                    className="border p-2 select-none"
                    onClick={() => sortuser('options')}
                  >
                    Options
                    <span className="ml-1">
                      {sortConfig.key === 'options' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '⇅'}
                    </span>
                  </th>
                  <th
                    className="border p-2 cursor-pointer select-none"
                    onClick={() => sortuser('comex')}
                  >
                    Comex
                    <span className="ml-1">
                      {sortConfig.key === 'comex' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '⇅'}
                    </span>
                  </th>
                  {loggeduser?.payload?.role !== 'CLIENT' && (
                    <th className="border p-2 cursor-pointer">Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {sortedUsers && sortedUsers.length > 0 ? (
                  sortedUsers
                    .slice(startindex, startindex + Number(records_per_Page))
                    .map((element, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50"
                      >
                        <td className="border p-2">
                          {element?.id}
                        </td>
                        <td className="border p-2">{element?.customerName}</td>
                        <td className="border p-2">{element?.agentName}</td>
                        <td className="border p-2">{element?.commision}</td>
                        <td className="border p-2">{element?.mcx}</td>
                        <td className="border p-2">{element?.nse}</td>
                        <td className="border p-2">{element?.options}</td>
                        <td className="border p-2">{element?.comex}</td>
                        {loggeduser?.payload?.role !== 'client' && (
                          <td className="border p-2">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => { edituserform(element.id, 'edit'); setcheckeditadd(false) }}
                                className="cursor-pointer px-3 py-2 text-white rounded-md text-xs"
                                style={{ backgroundColor: '#696969' }}
                              >
                                <div className="flex gap-2 justify-center items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="size-4"
                                  >
                                    <path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                  </svg>
                                </div>
                              </button>
                              <button
                                onClick={() => deletetransaction(element.id)}
                                className="cursor-pointer px-3 py-1 bg-[#dc3545] text-white rounded-md text-xs"
                              >
                                <div className="flex gap-2 justify-center items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="size-4"
                                  >
                                    <path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="10" className="border p-6 text-center text-gray-500">No data found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* 🔽 Pagination section outside table but styled to match */}
        <div className="w-full bg-white rounded-b-xl shadow px-4 py-3 flex flex-wrap justify-end items-center gap-4">
          <select
            onChange={(e) => handleChange(e)}
            className="border border-gray-300 focus:border-blue-500 py-2 px-4 rounded-md shadow-sm text-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>

          <button
            onClick={prevbutton}
            disabled={currentpage === 1}
            className={`cursor-pointer text-xl px-3 py-1 rounded-md shadow-sm 
              ${checkpaginationbutton ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-200 cursor-not-allowed'}
            `}
          >
            &#60;
          </button>

          <span className="text-sm text-gray-600">
            {allrecords === 0
              ? '0'
              : `${currentpage === 1 ? 1 : ((currentpage - 1) * (records_per_Page)) + 1} - 
                 ${(currentpage * records_per_Page) > allrecords ? allrecords :
                (currentpage * records_per_Page)} of ${allrecords}`}
          </span>

          <button
            onClick={nextbutton}
            disabled={currentpage === totalpages}
            className={`cursor-pointer text-xl px-3 py-1 rounded-md shadow-sm 
              ${checkpaginationbutton ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-200 cursor-not-allowed'}
            `}
          >
            &#62;
          </button>
        </div>

      </div>

    </div >

  )
}

export default Calculate