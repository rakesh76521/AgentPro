import React, { useRef, useState, useEffect } from "react";
import axiosInstance from "../../axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { setfinalmasterrecord } from "../../store/slices/mastercommonrecord";
import { useParams } from "react-router-dom";


const Transaction = () => {
    const loggeduser = useSelector((state) => state.loggeduser.user);
    const masterrecord = useSelector((state) => state.mastercommonrecord.mastercommonrec);
    const dispatch = useDispatch();
    const { Orgcode } = useParams();
    const [editinline, seteditinline] = useState(false);
    const iconRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [modalType, setModalType] = useState("");
    const [clientname, setclientname] = useState("VT");
    const [amount, setamount] = useState("");
    const [seermess, setseermess] = useState('');
    const [clientnamefilter, setclientnamefilter] = useState("");
    const [edituserid, setedituserid] = useState(0);
    const [netamount, setnetamount] = useState("");
    const [grossmcx, setgrossmcx] = useState("");
    const [grossnse, setgrossnse] = useState("");
    const [grossoption, setgrossoption] = useState("");
    const [grosscomex, setgrosscomex] = useState("");
    const [grosstotal, setgrosstotal] = useState("");
    const [netmcx, setnetmcx] = useState("");
    const [netnse, setnetnse] = useState("");
    const [netoption, setnetoption] = useState("");
    const [netcomex, setnetcomex] = useState("");
    const [brokagemcx, setbrokagemcx] = useState("");
    const [brokagense, setbrokagense] = useState("");
    const [brokageoption, setbrokageoption] = useState("");
    const [brokagecomex, setbrokagecomex] = useState("");
    const [comm, setcomm] = useState('');
    const [isUserEditing, setIsUserEditing] = useState(false);


    const [anymessage, setanymessage] = useState(null);
    const [filterbutton, setfilterbutton] = useState(false);
    const [searchvalue, setsearchvalue] = useState('');
    const [seer, setseer] = useState('');
    const [editRowId, setEditRowId] = useState(null);


    const [netamountmess, setnetamountmess] = useState('');
    const [nsemess, setnsemess] = useState('');
    const [grossmcxmess, setgrossmcxmess] = useState('');
    const [grossnsemess, setgrossnsemess] = useState('');
    const [grossoptionmess, setgrossoptionmess] = useState('');
    const [grosscomexmess, setgrosscomexmess] = useState('');
    const [netmcxmess, setnetmcxmess] = useState('');
    const [netnsemess, setnetnsemess] = useState('');
    const [netoptionmess, setnetoptionmess] = useState('');
    const [netcomexmess, setnetcomexmess] = useState('');
    const [brokagemcxmess, setbrokagemcxmess] = useState('');
    const [brokagensemess, setbrokagensemess] = useState('');
    const [brokageoptionmess, setbrokageoptionmess] = useState('');
    const [brokagecomexmess, setbrokagecomexmess] = useState('');
    const [amountmess, setamountmess] = useState('');

    var [existingUsers, setexistingUsers] = useState(JSON.parse(localStorage.getItem(`transaction-${Orgcode}`)));
    const [sortedUsers, setSortedUsers] = useState([]);

    //Pagination
    const [records_per_Page, setRecordsperpage] = useState(5);
    const [allrecords, setallrecords] = useState(0);
    const [totalpages, settotalpages] = useState(0);
    const [checkpaginationbutton, setcheckpaginationbutton] = useState(false);
    const [currentpage, setcurrentpage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const startindex = (currentpage - 1) * records_per_Page;

    useEffect(() => {
        const storedAgents = JSON.parse(localStorage.getItem(`agents-${Orgcode}`)) || [];
        const matched = storedAgents.filter((item) => item.customerName === clientname);
        const highestSeer = matched.length > 0
            ? matched.reduce((maxItem, currentItem) => {
                return Number(currentItem.commision) > Number(maxItem.commision) ? currentItem : maxItem;
            })
            : null;

        if (highestSeer) {
            dispatch(setfinalmasterrecord(highestSeer))
            setseer(highestSeer.commision);
        } else {
            setseer('');
        }
    }, [clientname]);
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


    useEffect(() => {
        if (isUserEditing) return;
        console.log('hereeeeeeeeeeeee3')
        const result = (Number(seer) / 100) * Number(amount);
        setnetamount(result.toFixed(2));
    }, [seer, amount]);


    useEffect(() => {
        if (isUserEditing) return;
        const total =
            Number(grossmcx) +
            Number(grossnse) +
            Number(grossoption) +
            Number(grosscomex);

            console.log('hereeeeeee22222222')

        setgrosstotal(total.toFixed(2));
    }, [grossmcx, grossnse, grossoption, grosscomex]);

    useEffect(() => {
        if (isUserEditing) return;
        const netmcxtotal = isFinite((grossmcx / brokagemcx) * (brokagemcx - masterrecord.mcx))
            ? ((grossmcx / brokagemcx) * (brokagemcx - masterrecord.mcx)).toFixed(2)
            : '';

        const netnsetotal = isFinite((grossnse / brokagense) * (brokagense - masterrecord.nse))
            ? ((grossnse / brokagense) * (brokagense - masterrecord.nse)).toFixed(2)
            : ''

        const netoptiontotal = isFinite((grossoption / brokageoption) * (brokageoption - masterrecord.options))
            ? ((grossoption / brokageoption) * (brokageoption - masterrecord.options)).toFixed(2)
            : ''

        const netcomextotal = isFinite((grosscomex / brokagecomex) * (brokagecomex - masterrecord.comex))
            ? ((grosscomex / brokagecomex) * (brokagecomex - masterrecord.comex)).toFixed(2)
            : ''

        setnetmcx(netmcxtotal);
        setnetnse(netnsetotal);
        setnetoption(netoptiontotal);
        setnetcomex(netcomextotal);

        console.log('hereeeeeeeeeee')
        const total = ((Number(netmcxtotal) + Number(netnsetotal) + Number(netoptiontotal) + Number(netcomextotal)) * seer);
        setcomm((total / 100).toFixed(2));


    }, [brokagemcx, brokagense, brokageoption, brokagecomex]);


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
                data.customerName.toLowerCase().includes(searchvalue.toLowerCase())
                // data.agentName.toLowerCase().includes(searchvalue.toLowerCase())
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
        setIsUserEditing(true);
        if (modalTypee == 'edit') {
            setModalType("edit");
            setedituserid(element);
            const edituserdata = existingUsers.find(data => data.id == element);
            console.log(edituserdata)
            setclientname(edituserdata?.customerName);
            setamount(edituserdata?.amount);
            setseer(edituserdata?.seer);
            setnetamount(edituserdata?.netamount);
            setgrossmcx(edituserdata?.gross?.mcx);
            setgrossnse(edituserdata?.gross?.nse);
            setgrossoption(edituserdata?.gross?.option);
            setgrosscomex(edituserdata?.gross?.comex);
            setgrosstotal(edituserdata?.grosstotal);
            setnetmcx(edituserdata?.netcommision?.mcx);
            setnetnse(edituserdata?.netcommision?.nse);
            setnetoption(edituserdata?.netcommision?.option);
            setnetcomex(edituserdata?.netcommision?.comex);
            setbrokagemcx(edituserdata?.brokage?.mcx);
            setbrokagense(edituserdata?.brokage?.nse);
            setbrokageoption(edituserdata?.brokage?.option);
            setbrokagecomex(edituserdata?.brokage?.comex);
            setcomm(edituserdata?.comm);

            setTimeout(() => setIsUserEditing(false), 200); 
        } 
        else {
            setModalType("add");
            setclientname('VT');
            setamount('');
            setseer(seer);
            setgrossmcx('');
            setgrossnse('');
            setgrossoption('');
            setgrosscomex('');
            setbrokagemcx('');
            setbrokagense('');
            setbrokageoption('');
            setbrokagecomex('');
            setcomm('');
        }
    }

    function applyFilters() {
        const raw = JSON.parse(localStorage.getItem(`transaction-${Orgcode}`));

        const total = raw.filter(item => item.customerName === clientnamefilter);
        setfilterbutton(true);
        setexistingUsers(total);
        setSortedUsers(total);
        setallrecords(total.length)

    }

    function removeFilters() {
        const raw = JSON.parse(localStorage.getItem(`transaction-${Orgcode}`));
        setfilterbutton(false);
        setexistingUsers(raw);
        setSortedUsers(raw);
        setclientnamefilter('VT');
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

        if (iconRef.current) {
            iconRef.current.classList.add('spin');
        }

        setLoading(true);
        fetchalltransaction();

    }

    function handleSubmit(e, inlinecheck) {
        e.preventDefault();
        let hasError = false;
        if (inlinecheck !== 'update') {
            if (!seer) {
                setseermess('This field is required');
                hasError = true;
            } else {
                setseermess('');
            }

            if (!amount) {
                setamountmess('This field is required');
                hasError = true;
            } else {
                setamountmess('');
            }

            if (!grossmcx) {
                setgrossmcxmess('This field is required');
                hasError = true;
            } else {
                setgrossmcxmess('');
            }

            if (!grossnse) {
                setgrossnsemess('This field is required');
                hasError = true;
            } else {
                setgrossnsemess('');
            }

            if (!grossoption) {
                setgrossoptionmess('This field is required');
                hasError = true;
            } else {
                setgrossoptionmess('');
            }

            if (!grosscomex) {
                setgrosscomexmess('This field is required');
                hasError = true;
            } else {
                setgrosscomexmess('');
            }

            if (!brokagemcx) {
                setbrokagemcxmess('This field is required');
                hasError = true;
            } else {
                setbrokagemcxmess('');
            }

            if (!brokagense) {
                setbrokagensemess('This field is required');
                hasError = true;
            } else {
                setbrokagensemess('');
            }

            if (!brokageoption) {
                setbrokageoptionmess('This field is required');
                hasError = true;
            } else {
                setbrokageoptionmess('');
            }

            if (!brokagecomex) {
                setbrokagecomexmess('This field is required');
                hasError = true;
            } else {
                setbrokagecomexmess('');
            }

            if (hasError) return false;
        }

        const action = e.target.value; // detect clicked button
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
            const raw = localStorage.getItem(`transaction-${Orgcode}`);
            existingData = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
        } catch (err) {
            existingData = [];
        }
        // console.log(action)
        if (action === 'submit' || inlinecheck === 'submit') {
            const nextId =
                existingData.length > 0
                    ? Math.max(...existingData.map((entry) => entry.id || 0)) + 1
                    : 1;

            const newEntry = {
                id: nextId,
                customerName: clientname,
                amount: amount || 0,
                seer: seer || 0,
                netamount: netamount || 0,
                gross: {
                    mcx: grossmcx || 0,
                    nse: grossnse || 0,
                    option: grossoption || 0,
                    comex: grosscomex || 0
                },
                grosstotal: grosstotal || 0,
                brokage: {
                    mcx: brokagemcx || 0,
                    nse: brokagense || 0,
                    option: brokageoption || 0,
                    comex: brokagecomex || 0
                },
                netcommision: {
                    mcx: netmcx || 0,
                    nse: netnse || 0,
                    option: netoption || 0,
                    comex: netcomex || 0
                },
                comm: comm || 0,
                createdDate: dateTime,
                updatedDate: dateTime,
            };
            existingData.push(newEntry);
        } else if (action === 'update') {
            existingData = existingData.map((item) => {
                if (item.id === edituserid) {
                    return {
                        ...item,
                        customerName: clientname,
                        amount: amount,
                        seer: seer,
                        netamount: netamount,
                        gross: {
                            mcx: grossmcx,
                            nse: grossnse,
                            option: grossoption,
                            comex: grosscomex
                        },
                        grosstotal: grosstotal,
                        brokage: {
                            mcx: brokagemcx,
                            nse: brokagense,
                            option: brokageoption,
                            comex: brokagecomex
                        },
                        netcommision: {
                            mcx: netmcx,
                            nse: netnse,
                            option: netoption,
                            comex: netcomex
                        },
                        comm: comm,
                        createdDate: dateTime,
                        updatedDate: dateTime,
                    };
                }
                return item;
            });
        }

        localStorage.setItem(`transaction-${Orgcode}`, JSON.stringify(existingData));
        if(action === 'submit') {
            setclientname('VT');
            setamount('');
            setseer(seer);
            setgrossmcx('');
            setgrossnse('');
            setgrossoption('');
            setgrosscomex('');
            setbrokagemcx('');
            setbrokagense('');
            setbrokageoption('');
            setbrokagecomex('');
            setcomm('');
        }
        setseermess('');
        setamountmess('');
        setgrossmcxmess('');
        setgrossnsemess('');
        setgrossoptionmess('');
        setgrosscomexmess('');
        setbrokagemcxmess('');
        setbrokagensemess('');
        setbrokageoptionmess('');
        setbrokagecomexmess('');
        setexistingUsers(existingData);
        setSortedUsers(existingData);
        setallrecords(existingData.length);
        setanymessage({ 'error': action + ' ' + 'successfully' });
    }

    function deletetransaction(id) {
        const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");

        if (!confirmDelete) return;

        const updatedUsers = existingUsers.filter(item => item.id !== id);

        localStorage.setItem(`transaction-${Orgcode}`, JSON.stringify(updatedUsers));
        setexistingUsers(updatedUsers);
    }


    return (
        <div>
            <div className={`fixed inset-0 ${(modalType == 'add' || modalType == 'edit') ? 'visible' : 'hidden'}`}
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
                        {/* Close Button */}
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

                        {/* Form */}
                        <form className="mt-6 space-y-4">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex flex-col w-full">
                                    <label htmlFor="name">Customer Name</label>
                                    <select
                                        value={clientname}
                                        id="name"
                                        className="border p-2 rounded bg-white"
                                        onChange={(e) => setclientname(e.target.value)}
                                    >
                                        <option value="SANJU">SANJU</option>
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
                                    <label htmlFor="ipo">Amount</label>
                                    <input
                                        value={amount}
                                        onChange={(e) => setamount(e.target.value)}
                                        type="number"
                                        id="amount"
                                        className="border p-2 rounded bg-white"
                                    />
                                    {amountmess && <p className="text-red-500 text-sm">{amountmess}</p>}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex flex-col w-full">
                                    <label htmlFor="sauda">SEER</label>
                                    <div className="flex gap-5 items-center">
                                        <input
                                            value={seer}
                                            onChange={(e) => setseer(e.target.value)}
                                            type="number"
                                            disabled
                                            id="seer"
                                            className="border p-2 rounded bg-white"
                                        />
                                        <span>%</span>
                                    </div>
                                    {seermess && <p className="text-red-500 text-sm">{seermess}</p>}
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex flex-col w-full">
                                    <label htmlFor="quan">Net Amount</label>
                                    <input
                                        value={netamount}
                                        disabled
                                        type="number"
                                        id="netamount"
                                        className="border p-2 rounded bg-white"
                                    />
                                    {netamountmess && <p className="text-red-500 text-sm">{netamountmess}</p>}
                                </div>
                            </div>

                            <h1 className="font-bold">GROSS COMMISSION</h1>
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex flex-col max-md:w-full w-[150px]">
                                    <label htmlFor="grossmcx">MCX</label>
                                    <input
                                        value={grossmcx}
                                        onChange={(e) => setgrossmcx(e.target.value)}
                                        type="number"
                                        id="grossmcx"
                                        className="border p-2 rounded bg-white"
                                    />
                                    {grossmcxmess && <p className="text-red-500 text-sm">{grossmcxmess}</p>}
                                </div>
                                <div className="flex flex-col max-md:w-full w-[150px]">
                                    <label htmlFor="grossnse">NSE</label>
                                    <input
                                        value={grossnse}
                                        onChange={(e) => setgrossnse(e.target.value)}
                                        type="number"
                                        id="grossnse"
                                        className="border p-2 rounded bg-white"
                                    />
                                    {grossnsemess && <p className="text-red-500 text-sm">{grossnsemess}</p>}
                                </div>


                                <div className="flex flex-col max-md:w-full w-[150px]">
                                    <label htmlFor="grossoptions">Option</label>
                                    <input
                                        value={grossoption}
                                        onChange={(e) => setgrossoption(e.target.value)}
                                        type="number"
                                        id="grossoptions"
                                        className="border p-2 rounded bg-white"
                                    />
                                    {grossoptionmess && <p className="text-red-500 text-sm">{grossoptionmess}</p>}
                                </div>
                                <div className="flex flex-col max-md:w-full w-[150px]">
                                    <label htmlFor="grosscomex">Comex</label>
                                    <input
                                        value={grosscomex}
                                        onChange={(e) => setgrosscomex(e.target.value)}
                                        type="number"
                                        id="grosscomex"
                                        className="border p-2 rounded bg-white"
                                    />
                                    {grosscomexmess && <p className="text-red-500 text-sm">{grosscomexmess}</p>}
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex flex-col w-full">
                                    <label htmlFor="grosstotal">GROSS TOTAL</label>
                                    <input
                                        value={grosstotal}
                                        // onChange={(e) => setgrosstotal(e.target.value)}
                                        disabled
                                        type="number"
                                        id="grosstotal"
                                        className="border p-2 rounded bg-white"
                                    />
                                </div>
                            </div>
                            <h1 className="font-bold">BROKERAGE</h1>
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex flex-col max-md:w-full w-[150px]">
                                    <label htmlFor="brokagemcx">MCX</label>
                                    <input
                                        value={brokagemcx}
                                        onChange={(e) => setbrokagemcx(e.target.value)}
                                        type="number"
                                        id="brokagemcx"
                                        className="border p-2 rounded bg-white"
                                    />
                                    {brokagemcxmess && <p className="text-red-500 text-sm">{brokagemcxmess}</p>}
                                </div>
                                <div className="flex flex-col max-md:w-full w-[150px]">
                                    <label htmlFor="brokagense">NSE</label>
                                    <input
                                        value={brokagense}
                                        onChange={(e) => setbrokagense(e.target.value)}
                                        type="number"
                                        id="brokagense"
                                        className="border p-2 rounded bg-white"
                                    />
                                    {brokagensemess && <p className="text-red-500 text-sm">{brokagensemess}</p>}
                                </div>


                                <div className="flex flex-col max-md:w-full w-[150px]">
                                    <label htmlFor="brokageoptions">Option</label>
                                    <input
                                        value={brokageoption}
                                        onChange={(e) => setbrokageoption(e.target.value)}
                                        type="number"
                                        id="brokageoptions"
                                        className="border p-2 rounded bg-white"
                                    />
                                    {brokageoptionmess && <p className="text-red-500 text-sm">{brokageoptionmess}</p>}
                                </div>
                                <div className="flex flex-col max-md:w-full w-[150px]">
                                    <label htmlFor="brokagecomex">Comex</label>
                                    <input
                                        value={brokagecomex}
                                        onChange={(e) => setbrokagecomex(e.target.value)}
                                        type="number"
                                        id="brokagecomex"
                                        className="border p-2 rounded bg-white"
                                    />
                                    {brokagecomexmess && <p className="text-red-500 text-sm">{brokagecomexmess}</p>}
                                </div>
                            </div>

                            <h1 className="font-bold">NET COMMISSION</h1>
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex flex-col max-md:w-full w-[150px]">
                                    <label htmlFor="netmcx">MCX</label>
                                    <input
                                        value={netmcx}
                                        type="number"
                                        disabled
                                        id="netmcx"
                                        className="border p-2 rounded bg-white"
                                    />
                                    {netmcxmess && <p className="text-red-500 text-sm">{netmcxmess}</p>}
                                </div>
                                <div className="flex flex-col max-md:w-full w-[150px]">
                                    <label htmlFor="netnse">NSE</label>
                                    <input
                                        value={netnse}
                                        disabled
                                        type="number"
                                        id="netnse"
                                        className="border p-2 rounded bg-white"
                                    />
                                    {netnsemess && <p className="text-red-500 text-sm">{netnsemess}</p>}
                                </div>


                                <div className="flex flex-col max-md:w-full w-[150px]">
                                    <label htmlFor="netoptions">Option</label>
                                    <input
                                        value={netoption}
                                        disabled
                                        type="number"
                                        id="netoptions"
                                        className="border p-2 rounded bg-white"
                                    />
                                    {netoptionmess && <p className="text-red-500 text-sm">{netoptionmess}</p>}
                                </div>
                                <div className="flex flex-col max-md:w-full w-[150px]">
                                    <label htmlFor="netcomex">Comex</label>
                                    <input
                                        value={netcomex}
                                        type="number"
                                        disabled
                                        id="netcomex"
                                        className="border p-2 rounded bg-white"
                                    />
                                    {netcomexmess && <p className="text-red-500 text-sm">{netcomexmess}</p>}
                                </div>
                            </div>
                            {console.log(comm,netcomex)}
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex flex-col w-full">
                                    <label htmlFor="comm">COMM REV</label>
                                    <input
                                        value={comm}
                                        disabled
                                        type="number"
                                        id="comm"
                                        className="border p-2 rounded bg-white"
                                    />
                                </div>
                            </div>
                            {/* Footer with Close and Submit Buttons */}
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
                                    onClick={(e) => handleSubmit(e, null)}
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
            )}
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

            <div className="bg-gray-100 rounded-2xl py-2 px-4 overflow-auto">
                {/* Search & Add User */}
                <div className="flex gap-5 items-center mb-2 justify-between">
                    <div className="flex justify-start">
                        <input
                            type="search"
                            value={searchvalue}
                            placeholder={`Search by ${loggeduser?.payload?.role === 'CLIENT' ? '' : 'customer,'} IPO , type...`}
                            onChange={(e) => search(e)}
                            className="max-sm:w-[40vw] w-[30vw] px-4 py-2 border border-gray-600 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200"
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="flex justify-end gap-3">
                            <div className="flex items-center cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" ref={iconRef} viewBox="0 0 16 16" fill="currentColor" onClick={(e) => refresh(e)} className="size-4">
                                    <path d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.932.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-1.242l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.241l-.84-.84v1.371a.75.75 0 0 1-1.5 0V9.591a.75.75 0 0 1 .75-.75H5.35a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.932.75.75 0 0 1 1.025-.273Z" />
                                </svg>
                            </div>
                            {/* <button
                                className="cursor-pointer text-white font-semibold text-[10px] py-2 px-6 rounded-lg shadow-md transition duration-300"
                                onClick={(e) => downloadexcel(e)}
                                style={{ backgroundColor: '#198754' }}
                            >
                                <div className="flex gap-2">
                                    <span className="max-md:hidden">
                                        Export
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4 max-md:visible">
                                        <path d="M8.75 2.75a.75.75 0 0 0-1.5 0v5.69L5.03 6.22a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L8.75 8.44V2.75Z" />
                                        <path d="M3.5 9.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 4.75 14h6.5A2.75 2.75 0 0 0 14 11.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-1.5Z" />
                                    </svg>
                                </div>
                            </button> */}

                        </div>
                        {loggeduser?.payload?.role !== 'client' ?
                            <div>
                                <button
                                    onClick={() => edituserform(null, modalType)}
                                    className="cursor-pointer px-4 py-2 text-white rounded shadow transition duration-200 text-[12px]"
                                    style={{ backgroundColor: '#0d6efd' }}
                                >
                                    <div className="flex gap-2 justify-center items-center">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                        </span>
                                        <span className="max-sm:hidden">
                                            Add Transaction
                                        </span>
                                    </div>
                                </button>
                            </div>

                            :
                            ''

                        }
                    </div>
                </div>

                {/* User Table */}
                <div className="overflow-x-auto rounded-t-xl">
                    <table className="w-full text-sm text-left bg-white rounded-t-xl shadow overflow-hidden border-2 border-b-gray-300">
                        <thead className="text-white uppercase bg-[#a9a9a9] text-center">

                            <tr>
                                <th rowSpan="2" className="border p-2">S.no</th>
                                <th rowSpan="2" className="border p-2">Client Name</th>
                                <th rowSpan="2" className="border p-2">Amount</th>
                                <th rowSpan="2" className="border p-2">Net Amount</th>
                                <th rowSpan="2" className="border p-2">Seer</th>
                                <th colSpan="5" className="border p-2">Gross</th>
                                <th colSpan="4" className="border p-2">Brokerage</th>
                                <th colSpan="4" className="border p-2">Net Commision</th>
                                <th rowSpan="2" className="border p-2">Comm Rev</th>
                                <th rowSpan="2" className="border p-2 cursor-pointer">Action</th>

                            </tr>
                            <tr>
                                <th className="border p-2 cursor-pointer" onClick={() => sortuser('mcx')}>MCX</th>
                                <th className="border p-2 cursor-pointer" onClick={() => sortuser('nse')}>NSE</th>
                                <th className="border p-2 cursor-pointer" onClick={() => sortuser('option')}>OPTION</th>
                                <th className="border p-2 cursor-pointer" onClick={() => sortuser('comex')}>COMEX</th>
                                <th className="border p-2 cursor-pointer" onClick={() => sortuser('total')}>TOTAL</th>
                                <th className="border p-2 cursor-pointer" onClick={() => sortuser('mcx')}>MCX</th>
                                <th className="border p-2 cursor-pointer" onClick={() => sortuser('nse')}>NSE</th>
                                <th className="border p-2 cursor-pointer" onClick={() => sortuser('option')}>OPTION</th>
                                <th className="border p-2 cursor-pointer" onClick={() => sortuser('comex')}>COMEX</th>
                                <th className="border p-2 cursor-pointer" onClick={() => sortuser('mcx')}>MCX</th>
                                <th className="border p-2 cursor-pointer" onClick={() => sortuser('nse')}>NSE</th>
                                <th className="border p-2 cursor-pointer" onClick={() => sortuser('option')}>OPTION</th>
                                <th className="border p-2 cursor-pointer" onClick={() => sortuser('comex')}>COMEX</th>
                            </tr>



                        </thead>
                        <tbody>
                            <tr className="">
                                <td></td>
                                <td>
                                    <select
                                        value={clientname}
                                        id="name"
                                        className="border px-4 my-4 h-10 w-[200px] rounded bg-white"
                                        onChange={(e) => setclientname(e.target.value)}
                                    >
                                        <option value="SANJU">SANJU</option>
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
                                <td>
                                    <input
                                        value={amount}
                                        onChange={(e) => setamount(e.target.value)}
                                        placeholder="Enter Amount"
                                        type="number"
                                        id="amount"
                                        className="border px-4 my-4 mx-2 h-10 w-[200px] rounded bg-white"
                                    />
                                    {amountmess && <p className="text-red-500 text-sm px-4 w-[200px]">{amountmess}</p>}
                                </td>
                                <td>
                                    <input
                                        value={netamount}
                                        disabled
                                        placeholder="Calculating net amount"
                                        type="number"
                                        id="netamount"
                                        className="border px-4 my-4 mx-2 h-10 w-[200px] rounded bg-white"
                                    />
                                    {netcomexmess && <p className="text-red-500 text-sm px-4 w-[200px]">{netcomexmess}</p>}
                                </td>
                                <td>
                                    <input
                                        value={seer}
                                        onChange={(e) => setseer(e.target.value)}
                                        type="number"
                                        placeholder="Enter seer"
                                        disabled
                                        id="seer"
                                        className="border px-4 my-4 mx-2 h-10 w-[200px] rounded bg-white"
                                    />
                                    {seermess && <p className="text-red-500 text-sm px-4 w-[200px]">{seermess}</p>}
                                </td>
                                <td>
                                    <input
                                        value={grossmcx}
                                        onChange={(e) => setgrossmcx(e.target.value)}
                                        placeholder="Enter gross mcx"
                                        type="number"
                                        id="grossmcx"
                                        className="border px-4 my-4 mx-2 h-10 w-[200px] rounded bg-white"
                                    />
                                    {grossmcxmess && <p className="text-red-500 text-sm px-4 w-[200px]">{grossmcxmess}</p>}
                                </td>
                                <td>
                                    <input
                                        value={grossnse}
                                        onChange={(e) => setgrossnse(e.target.value)}
                                        placeholder="Enter gross nse"
                                        type="number"
                                        id="grossnse"
                                        className="border px-4 my-4 mx-2 h-10 w-[200px] rounded bg-white"
                                    />
                                    {grossnsemess && <p className="text-red-500 text-sm px-4 w-[200px]">{grossnsemess}</p>}
                                </td>
                                <td>
                                    <input
                                        value={grossoption}
                                        onChange={(e) => setgrossoption(e.target.value)}
                                        placeholder="Enter gross option"
                                        type="number"
                                        id="grossoptions"
                                        className="border px-4 my-4 mx-2 h-10 w-[200px] rounded bg-white"
                                    />
                                    {grossoptionmess && <p className="text-red-500 text-sm px-4 w-[200px]">{grossoptionmess}</p>}
                                </td>
                                <td>
                                    <input
                                        value={grosscomex}
                                        onChange={(e) => setgrosscomex(e.target.value)}
                                        placeholder="Enter gross comex"
                                        type="number"
                                        id="grosscomex"
                                        className="border px-4 my-4 mx-2 h-10 w-[200px] rounded bg-white"
                                    />
                                    {grosscomexmess && <p className="text-red-500 text-sm px-4 w-[200px]">{grosscomexmess}</p>}
                                </td>
                                <td>
                                    <input
                                        value={grosstotal}
                                        // onChange={(e) => setgrosstotal(e.target.value)}
                                        disabled
                                        type="number"
                                        id="grosstotal"
                                        placeholder="Calculating gross total"
                                        className="border  px-4 my-4 mx-2 h-10 w-[200px] rounded bg-white"
                                    />

                                </td>
                                <td>
                                    <input
                                        value={brokagemcx}
                                        onChange={(e) => setbrokagemcx(e.target.value)}
                                        placeholder="Enter brokage mcx"
                                        type="number"
                                        id="brokagemcx"
                                        className="border px-4 my-4 mx-2 h-10 w-[200px] rounded bg-white"
                                    />
                                    {brokagemcxmess && <p className="text-red-500 text-sm px-4 w-[200px]">{brokagemcxmess}</p>}
                                </td>
                                <td>
                                    <input
                                        value={brokagense}
                                        onChange={(e) => setbrokagense(e.target.value)}
                                        placeholder="Enter brokage nse"
                                        type="number"
                                        id="brokagense"
                                        className="border px-4 my-4 mx-2 h-10 w-[200px] rounded bg-white"
                                    />
                                    {brokagensemess && <p className="text-red-500 text-sm px-4 w-[200px]">{brokagensemess}</p>}
                                </td>
                                <td>
                                    <input
                                        value={brokageoption}
                                        onChange={(e) => setbrokageoption(e.target.value)}
                                        placeholder="Enter brokage option"
                                        type="number"
                                        id="brokageoptions"
                                        className="border px-4 my-4 mx-2 h-10 w-[200px] rounded bg-white"
                                    />
                                    {brokageoptionmess && <p className="text-red-500 text-sm px-4 w-[200px]">{brokageoptionmess}</p>}
                                </td>
                                <td>
                                    <input
                                        value={brokagecomex}
                                        onChange={(e) => setbrokagecomex(e.target.value)}
                                        type="number"
                                        placeholder="Enter brokage comex"
                                        id="brokagecomex"
                                        className="border px-4 my-4 mx-2 h-10 w-[200px] rounded bg-white"
                                    />
                                    {brokagecomexmess && <p className="text-red-500 text-sm px-4 w-[200px]">{brokagecomexmess}</p>}
                                </td>
                                <td>
                                    <input
                                        value={netmcx}
                                        type="number"
                                        placeholder="Calculating net mcx"
                                        disabled
                                        id="netmcx"
                                        className="border px-4 my-4 mx-2 h-10 w-[200px] rounded bg-white"
                                    />
                                </td>
                                <td>
                                    <input
                                        value={netnse}
                                        disabled
                                        type="number"
                                        placeholder="Calculating net nse"
                                        id="netnse"
                                        className="border px-4 my-4 mx-2 h-10 w-[200px] rounded bg-white"
                                    />
                                </td>
                                <td>
                                    <input
                                        value={netoption}
                                        disabled
                                        type="number"
                                        placeholder="Calculating net option"
                                        id="netoptions"
                                        className="border px-4 my-4 mx-2 h-10 w-[200px] rounded bg-white"
                                    />
                                </td>
                                <td>
                                    <input
                                        value={netcomex}
                                        type="number"
                                        disabled
                                        placeholder="Calculating net comex"
                                        id="netcomex"
                                        className="border px-4 my-4 mx-2 h-10 w-[200px] rounded bg-white"
                                    />
                                </td>
                                <td>
                                    <input
                                        value={comm}
                                        disabled
                                        type="number"
                                        id="comm"
                                        placeholder="Calculating Comm"
                                        className="border px-4 my-4 mx-2 h-10 w-[200px] rounded bg-white"
                                    />
                                </td>
                                <td>
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={(e) => handleSubmit(e, 'submit')}
                                            value={'submit'}
                                            className="cursor-pointer px-3 py-2 text-white rounded-md text-xs"
                                            style={{ backgroundColor: '#696969' }}
                                        >
                                            <div className="flex gap-2 justify-center items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </div>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {sortedUsers && sortedUsers.length > 0 ? (
                                sortedUsers
                                    .slice(startindex, startindex + Number(records_per_Page))
                                    .map((element, index) => {
                                        return (

                                            <tr
                                                key={index}
                                                className="hover:bg-gray-50 border-2 transition duration-150 border-b border-gray-100"
                                            >
                                                <td className="p-4">{element.id}</td>
                                                <td className="p-4">{element?.customerName}</td>
                                                <td className="p-4">{element?.amount}</td>
                                                <td className="p-4">{element?.netamount}</td>
                                                <td className="p-4">{element?.seer}</td>

                                                <td className="p-4">{element?.gross?.mcx}</td>
                                                <td className="p-4">{element?.gross?.nse}</td>
                                                <td className="p-4">{element?.gross?.option}</td>
                                                <td className="p-4">{element?.gross?.comex}</td>
                                                <td className="p-4">{element?.grosstotal}</td>
                                                <td className="p-4">{element?.brokage?.mcx}</td>
                                                <td className="p-4">{element?.brokage?.nse}</td>
                                                <td className="p-4">{element?.brokage?.option}</td>
                                                <td className="p-4">{element?.brokage?.comex}</td>
                                                <td className="p-4">{element?.netcommision?.mcx}</td>
                                                <td className="p-4">{element?.netcommision?.nse}</td>
                                                <td className="p-4">{element?.netcommision?.option}
                                                </td>
                                                <td className="p-4">{element?.netcommision?.comex}</td>
                                                <td className="p-4">{element?.comm}</td>
                                                {loggeduser?.payload?.role !== 'client' && (
                                                    <td className="p-4 text-center">
                                                        <div className="flex justify-center gap-2">
                                                            <button
                                                                onClick={() => edituserform(element.id, 'edit')}
                                                                className="cursor-pointer px-3 py-2 text-white rounded-md text-xs"
                                                                style={{ backgroundColor: '#696969' }}
                                                            >
                                                                <div className="flex gap-2 justify-center items-center">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-4">
                                                                        <path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                                                    </svg>
                                                                </div>
                                                            </button>                                                            
                                                            <button
                                                                onClick={() => deletetransaction(element.id)}
                                                                className="cursor-pointer px-3 py-1 bg-[#dc3545] text-white rounded-md text-xs"
                                                            >
                                                                <div className="flex gap-2 justify-center items-center">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-4">
                                                                        <path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                                    </svg>

                                                                    {/* <span className="max-sm:hidden text-[14px]">Delete</span> */}
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>

                                        );
                                    })
                            ) : (
                                <tr>
                                    <td colSpan="20" className="text-center p-6 text-gray-500">
                                        No data found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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

        </div>

    )
}

export default Transaction