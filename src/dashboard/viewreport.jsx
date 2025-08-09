import React, { useRef, useState, useEffect } from "react";
import axiosInstance from "../../axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { setfinalmasterrecord } from "../../store/slices/mastercommonrecord";
import { useParams } from "react-router-dom";
import { utils, writeFile, write } from "xlsx-js-style";



const ViewReport = () => {
    const loggeduser = useSelector((state) => state.loggeduser.user);
    const dispatch = useDispatch();
    const { Orgcode } = 'Org01';
    const [searchInput, setSearchInput] = useState('');
    const [ipoid, setipoid] = useState('');
    const [filteredipos, setFilteredipos] = useState(['UG50', 'VG', 'RSA', 'RITESH', 'SHARES', 'VT', 'GB', 'AYT', 'DB']);
    const [resultsArray, setresultsArray] = useState([]);
    const [searchresultsArray, setsearchresultsArray] = useState([]);



    const iconRef = useRef();
    const [loading, setLoading] = useState(false);
    const [modalType, setModalType] = useState("");
    const [iponamefilter, setiponamefilter] = useState("");
    const [searchvalue, setsearchvalue] = useState('');


    //Pagination
    const [records_per_Page, setRecordsperpage] = useState(10);
    const [allrecords, setallrecords] = useState(0);
    const [totalpages, settotalpages] = useState(0);
    const [total,settotal] = useState(0);
    const [totalcommrev,settotalcommrev] = useState(0);
    const [checkpaginationbutton, setcheckpaginationbutton] = useState(false);
    const [currentpage, setcurrentpage] = useState(1);
    const startindex = (currentpage - 1) * records_per_Page;


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
        setallrecords(resultsArray?.length);
        settotalpages(resultsArray?.length / records_per_Page);
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


    function getnetamount(name, master, transaction) {
        const result = (Number(master.commision) / 100) * Number(transaction[name].amount);
        return result.toFixed(2);
    }


    function getgrosstotal(name, master, transaction) {
        const total =
            Number(transaction[name].gross.mcx) +
            Number(transaction[name].gross.nse) +
            Number(transaction[name].gross.option) +
            Number(transaction[name].gross.comex);

        return total.toFixed(2);
    }

    function getnetcalculation(name, master, transaction) {
        const netmcxtotal = isFinite((transaction[name].gross.mcx / transaction[name].brokage.mcx) * (transaction[name].brokage.mcx - master.mcx))
            ? ((transaction[name].gross.mcx / transaction[name].brokage.mcx) * (transaction[name].brokage.mcx - master.mcx)).toFixed(2)
            : 0

        const netnsetotal = isFinite((transaction[name].gross.nse / transaction[name].brokage.nse) * (transaction[name].brokage.nse - master.nse))
            ? ((transaction[name].gross.nse / transaction[name].brokage.nse) * (transaction[name].brokage.nse - master.nse)).toFixed(2)
            : 0

        const netoptiontotal = isFinite((transaction[name].gross.option / transaction[name].brokage.option) * (transaction[name].brokage.option - master.options))
            ? ((transaction[name].gross.option / transaction[name].brokage.option) * (transaction[name].brokage.option - master.options)).toFixed(2)
            : 0

        const netcomextotal = isFinite((transaction[name].gross.comex / transaction[name].brokage.comex) * (transaction[name].brokage.comex - master.comex))
            ? ((transaction[name].gross.comex / transaction[name].brokage.comex) * (transaction[name].brokage.comex - master.comex)).toFixed(2)
            : 0

        return { netmcxtotal, netnsetotal, netoptiontotal, netcomextotal }
    }

    function calcomm(seer, comm) {

        const total = ((Number(comm.netmcxtotal) + Number(comm.netnsetotal) + Number(comm.netoptiontotal) + Number(comm.netcomextotal)) * seer);
        return (total / 100).toFixed(2);
    }


    const handleChange = (e) => {
        const newLimit = Number(e.target.value);
        setRecordsperpage(newLimit);
        setcurrentpage(1); // or 0 if your pagination is 0-indexed
    };
    const prevbutton = () => {
        setcurrentpage(prev => (prev > 1 ? prev - 1 : prev));
    };

    const nextbutton = () => {
        const totalItems = searchvalue === '' ? searchresultsArray.length : resultsArray.length;
        const totalPages = Math.ceil(totalItems / Number(records_per_Page));

        setcurrentpage(prev => (prev < totalPages ? prev + 1 : prev));
    };
    const search = (e) => {
        const searchvalue = e.target.value;
        setsearchvalue(searchvalue);
        if (searchvalue) {
            const filteredUsers = searchresultsArray.filter(data =>
            (
                data.name.toLowerCase().includes(searchvalue.toLowerCase())
                // data.agentName.toLowerCase().includes(searchvalue.toLowerCase())
            )
            );

            setresultsArray(filteredUsers);
            setcurrentpage(1);
            setallrecords(filteredUsers.length);
        } else {
            setresultsArray(searchresultsArray);
            setallrecords(searchresultsArray.length);
        }
    };

    function downloadexcel() {
        // First header row (merged titles)
        const headerRow1 = [
            "Client Name", "Amount", "Net Amount", "Seer",
            "Gross", "", "", "", "",
            "Net Commission", "", "", "",
            "Comm Rev",
            "Brokerage", "", "", ""
        ];

        // Second header row (sub-columns)
        const headerRow2 = [
            "", "", "", "",
            "MCX", "NSE", "OPTION", "COMEX", "TOTAL",
            "MCX", "NSE", "OPTION", "COMEX",
            "", // Comm Rev
            "MCX", "NSE", "OPTION", "COMEX"
        ];

        // Sample or real data - make sure it matches the headers
        const dataRows = resultsArray.map((item) => ([
            item.name,
            item.amount,
            item.netamount,
            item.seer,
            item.gross.mcx,
            item.gross.nse,
            item.gross.option,
            item.gross.comex,
            item.grosstotal,
            item.netcomm.netmcxtotal,
            item.netcomm.netnsetotal,
            item.netcomm.netoptiontotal,
            item.netcomm.netcomextotal,
            item.comm,
            item.brokage.mcx,
            item.brokage.nse,
            item.brokage.option,
            item.brokage.comex
        ]));

        // Combine header and data
        const aoa = [headerRow1, headerRow2, ...dataRows];
        const worksheet = utils.aoa_to_sheet(aoa);

        // Define merges (updated column indices after removing S.no)
        worksheet['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // Client Name
            { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // Amount
            { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // Net Amount
            { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } }, // Seer

            { s: { r: 0, c: 4 }, e: { r: 0, c: 8 } }, // Gross
            { s: { r: 0, c: 9 }, e: { r: 0, c: 12 } }, // Net Commission

            { s: { r: 0, c: 13 }, e: { r: 1, c: 13 } }, // Comm Rev

            { s: { r: 0, c: 14 }, e: { r: 0, c: 17 } }, // Brokerage
        ];

        // Set column widths
        worksheet['!cols'] = Array(18).fill({ wch: 12 });

        // Style headers (rows 0 and 1)
        for (let col = 0; col < headerRow1.length; col++) {
            const cell1 = worksheet[utils.encode_cell({ r: 0, c: col })];
            const cell2 = worksheet[utils.encode_cell({ r: 1, c: col })];

            const headerStyle = {
                font: { bold: true },
                alignment: { horizontal: "center", vertical: "center" },
                fill: { fgColor: { rgb: "A9A9A9" } },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } }
                }
            };

            if (cell1) cell1.s = headerStyle;
            if (cell2) cell2.s = headerStyle;
        }

        // Create workbook and export
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Report");
        writeFile(workbook, "Detailed_Report.xlsx");
    }

    function refresh(e) {
        if (iconRef.current) {
            iconRef.current.classList.add('spin');
        }

        setLoading(true);
        fetchalltransaction();

    }


    useEffect(() => {
        if (searchInput?.trim() === '') {
            setFilteredipos(['UG50', 'VG', 'RSA', 'RITESH', 'SHARES', 'VT', 'GB', 'AYT', 'DB']);
            setipoid('');
            return;
        }
        const filtered = filteredipos.filter(c =>
            c?.toLowerCase().includes(searchInput?.toLowerCase())
        );
        setFilteredipos(filtered);
    }, [searchInput]);

    useEffect(() => {
        const resultsArray1 = [];
        var allnames = [];
        const alldata = JSON.parse(localStorage.getItem(`agents-${Orgcode}`));
        const alldatatrans = JSON.parse(localStorage.getItem(`transaction-${Orgcode}`));

        const agents = loggeduser?.username;

        const reportmaster = alldata.filter((items => items.agentName === agents)).map((item) => {
            allnames?.push(item.customerName)
            return {
                name: item.customerName,
                commision: item.commision,
                mcx: item.mcx,
                nse: item.nse,
                option: item.options,
                comex: item.comex
            };
        }
        );

        const mainalldata = alldatatrans.filter(itemtran =>
            reportmaster.some(item =>
                itemtran.customerName?.toLowerCase() === item.name.toLowerCase()
            )
        );


        const reporttransaction = mainalldata.map(item => ({
            [item.customerName]: {
                amount: item.amount,
                gross: item.gross,
                grosstotal: item.grosstotal,
                brokage: item.brokage
            }
        }));

        // console.log(reportmaster, reporttransaction, allnames)
        for (var i = 0; i < reportmaster?.length; i++) {
            const netamount = getnetamount(allnames[i], reportmaster[i], reporttransaction[i]);
            settotal((total + Number(getnetamount(allnames[i], reportmaster[i], reporttransaction[i]))).toFixed(2));
            const grosstotal = getgrosstotal(allnames[i], reportmaster[i], reporttransaction[i]);
            const netcomm = getnetcalculation(allnames[i], reportmaster[i], reporttransaction[i]);
            const comm = calcomm(reportmaster[i].commision, netcomm);
            settotalcommrev((totalcommrev+Number(comm)).toFixed(2));
            resultsArray1.push({
                name: allnames[i],
                amount: reporttransaction[i][allnames[i]].amount,
                netamount: netamount,
                seer: reportmaster[i].commision,
                gross: reporttransaction[i][allnames[i]].gross,
                grosstotal: grosstotal,
                brokage: reporttransaction[i][allnames[i]].brokage,
                netcomm: netcomm,
                comm: comm
            });
        }

        setresultsArray(resultsArray1);
        setallrecords(resultsArray1.length);
        setsearchresultsArray(resultsArray1);
    }, []);


    return (
        <div>
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
                            <button
                                className="cursor-pointer text-white font-semibold text-[10px] py-2 px-6 rounded-lg shadow-md transition duration-300"
                                onClick={(e) => downloadexcel(e)}
                                style={{ backgroundColor: '#198754' }}
                            >
                                <div className="flex gap-2">
                                    <span className="max-md:hidden">
                                        Export as Excel
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4 max-md:visible">
                                        <path d="M8.75 2.75a.75.75 0 0 0-1.5 0v5.69L5.03 6.22a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L8.75 8.44V2.75Z" />
                                        <path d="M3.5 9.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 4.75 14h6.5A2.75 2.75 0 0 0 14 11.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-1.5Z" />
                                    </svg>
                                </div>
                            </button>

                        </div>
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
                                <th colSpan="4" className="border p-2">Net Commision</th>
                                <th rowSpan="2" className="border p-2">Comm Rev</th>
                                <th colSpan="4" className="border p-2">Brokerage</th>

                            </tr>
                            <tr>
                                <th className="border p-2 cursor-pointer">MCX</th>
                                <th className="border p-2 cursor-pointer">NSE</th>
                                <th className="border p-2 cursor-pointer">OPTION</th>
                                <th className="border p-2 cursor-pointer" onClick={() => sortuser('comex')}>COMEX</th>
                                <th className="border p-2 cursor-pointer">TOTAL</th>
                                <th className="border p-2 cursor-pointer">MCX</th>
                                <th className="border p-2 cursor-pointer">NSE</th>
                                <th className="border p-2 cursor-pointer">OPTION</th>
                                <th className="border p-2 cursor-pointer">COMEX</th>
                                <th className="border p-2 cursor-pointer">MCX</th>
                                <th className="border p-2 cursor-pointer">NSE</th>
                                <th className="border p-2 cursor-pointer">OPTION</th>
                                <th className="border p-2 cursor-pointer">COMEX</th>
                            </tr>



                        </thead>
                        <tbody>

                            {resultsArray && resultsArray.length > 0 ? (
                                resultsArray
                                    .slice(startindex, startindex + Number(records_per_Page))
                                    .map((element, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="hover:bg-gray-50 border-2 transition duration-150 border-b border-gray-100"
                                            >
                                                <td className="p-4">{((currentpage - 1) * (records_per_Page)) + 1 + index}</td>
                                                <td className="p-4">{element?.name}</td>
                                                <td className="p-4">{element?.amount}</td>
                                                <td className="p-4">{element?.netamount}</td>
                                                <td className="p-4">{element?.seer}</td>

                                                <td className="p-4">{element?.gross?.mcx}</td>
                                                <td className="p-4">{element?.gross?.nse}</td>
                                                <td className="p-4">{element?.gross?.option}</td>
                                                <td className="p-4">{element?.gross?.comex}</td>
                                                <td className="p-4">{element?.grosstotal}</td>
                                                <td className="p-4">{element?.netcomm?.netmcxtotal}</td>
                                                <td className="p-4">{element?.netcomm?.netnsetotal}</td>
                                                <td className="p-4">{element?.netcomm?.netoptiontotal}</td>
                                                <td className="p-4">{element?.netcomm?.netcomextotal}</td>
                                                <td className="p-4">{element?.comm}</td>
                                                <td className="p-4">{element?.brokage?.mcx}</td>
                                                <td className="p-4">{element?.brokage?.nse}</td>
                                                <td className="p-4">{element?.brokage?.option}</td>
                                                <td className="p-4">{element?.brokage?.comex}</td>
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

                <div className="flex items-center justify-center bg-gray-50">
                    <table className="border-collapse border border-black text-center text-lg font-medium bg-white shadow-lg">
                        <tbody>
                            <tr>
                                <td className="border border-black px-6 py-3 font-bold">TOTAL</td>
                                <td className="border border-black px-6 py-3">{total}</td>
                            </tr>
                            <tr>
                                <td className="border border-black px-6 py-3 font-bold">COMM REV</td>
                                <td className="border border-black px-6 py-3">{totalcommrev}</td>
                            </tr>
                            <tr>
                                <td className="border border-black px-6 py-3 font-bold">GRAND TOTAL</td>
                                <td className="border border-black px-6 py-3">{(Number(total) + Number(totalcommrev)).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>

        </div>

    )
}

export default ViewReport