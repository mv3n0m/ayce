'use client'

import Link from 'next/link';
import Transfer from 'src/public/icons/transfer.svg'
import Conversion from 'src/public/icons/conversion.svg'
import Receive from 'src/public/icons/receive.svg'
import Download from 'src/public/icons/download.svg'
import Search from 'src/public/icons/search.svg'
import SortAscend from 'src/public/icons/sort-ascend.svg'
import SortDescend from 'src/public/icons/sort-descend.svg'
import Ellipsis from 'src/public/icons/ellipsis.svg'
import EllipsisActive from 'src/public/icons/ellipsis-active.svg'
import ArrowDown from 'src/public/icons/arrow-down-48px.svg'
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import ReactPaginate from 'react-paginate';

export default function ActivitiesPage() {

  const { data: session, status } = useSession();

  const token = session?.token; // Extract the token from the session

  // store all unfiltered transactions here
  const [transactions, setTransactions] = useState([]);

  const modalRefs = useRef([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!token) return;  // No token, don't fetch
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/account/get-transactions`, {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the authorization header
          }
        });

        if (response.status === 200) {
          setTransactions([...response.data.transactions].reverse() || []);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
}, [token]);

console.log(transactions);

  const [activeFilter, setActiveFilter] = useState('All');
  const detailsRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const buttonSVGRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>(null);
  const [dateSortOrder, setDateSortOrder] = useState<'ascend' | 'descend' | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [sortColumn, setSortColumn] = useState<'btc' | 'date' | null>(null);  // to track if sortOrder or dateSortOrder is being clicked

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'confirmed':
        return {
          textColor: 'text-states-successDark',
          bgColor: 'bg-states-successLight'
        };
      case 'pending':
        return {
          textColor: 'text-states-pendingDark',
          bgColor: 'bg-states-pendingLight'
        };
      case 'expired':
        return {
          textColor: 'text-states-errorDark',
          bgColor: 'bg-states-errorLight'
        };
      default:
        return {
          textColor: '',
          bgColor: ''
        };
    }
  };

  const toggleDetails = (index: number) => {
    const detailsElement = detailsRefs.current[index];
    const buttonElement = buttonSVGRefs.current[index];
    const modalElement = modalRefs.current[index];
    const overlayElement = overlayRefs.current[index];

    if (window.innerWidth < 1024) { // for mobile
      if (modalElement && overlayElement) {
        if (modalElement.style.display === 'none' || modalElement.style.display === '') {
          modalElement.style.display = 'block';
          overlayElement.style.display = 'block';
          if (buttonElement) {
            ReactDOM.render(<EllipsisActive/>, buttonElement);
          }
        } else {
          modalElement.style.display = 'none';
          overlayElement.style.display = 'none';
          if (buttonElement) {
            ReactDOM.render(<Ellipsis/>, buttonElement);
          }
        }
      }
    } else { // for desktop
      if (detailsElement) {
        const parentRow = detailsElement.previousSibling as HTMLElement;

        if (detailsElement.style.display === '' || detailsElement.style.display === 'none') {
          detailsElement.style.display = 'table-row';
          if (parentRow) {
            parentRow.style.backgroundColor = '#F5F7F8';
          }
          if (buttonElement) {
            ReactDOM.render(<EllipsisActive/>, buttonElement);
          }
        } else {
          detailsElement.style.display = 'none';
          if (parentRow) {
            parentRow.style.backgroundColor = '';
          }
          if (buttonElement) {
            ReactDOM.render(<Ellipsis/>, buttonElement);
          }
        }
      }
    }
  };

  const hideAllDetails = () => {
    detailsRefs.current.forEach((detailElement, index) => {
      const detailsElement = detailsRefs.current[index];
      const buttonElement = buttonSVGRefs.current[index];
      if (detailsElement) {
        detailsElement.style.display = 'none';
        const parentRow = detailsElement.previousSibling as HTMLElement;
        if (parentRow) {
            parentRow.style.backgroundColor = '';
        }
      }
      if (buttonElement) {
          ReactDOM.render(<Ellipsis/>, buttonElement);
      }
    });
  };

  const getSVGByType = (type: string) => {
    switch(type) {
      case 'transfer':
        return <Transfer className='h-6 w-6 mr-4 ml-2 min-w-fit' />;
      case 'receive':
        return <Receive className='h-6 w-6 mr-4 ml-2 min-w-fit' />;
      case 'conversion':
        return <Conversion className='h-6 w-6 mr-4 ml-2 min-w-fit' />;
      default:
        return null;
    }
  };

  const toggleSort = () => {
    if (sortOrder === 'ascend') {
      setSortOrder('descend');
    } else {
      setSortOrder('ascend');
    }
    setSortColumn('btc');
    hideAllDetails();
  };

  const toggleDateSort = () => {
    if (dateSortOrder === 'ascend') {
      setDateSortOrder('descend');
    } else {
      setDateSortOrder('ascend');
    }
    setSortColumn('date');
    hideAllDetails();
  };

  const filteredRows = () => {
    let result = transactions;

    // Filter based on buttons
    switch (activeFilter) {
      case 'receive':  // Sales
        result = result.filter(row => row.type === 'receive');
        break;
      case 'transfer':  // Transfers
        result = result.filter(row => row.type === 'transfer');
        break;
      case 'conversion':  // Conversions
        result = result.filter(row => row.type === 'conversion');
        break;
      default:
        break;
    }

    // Filter based on search input
    if (searchValue.trim()) {
      result = result.filter(row => row.description.toLowerCase().includes(searchValue.trim().toLowerCase()));
    }

    // Sort based on sortColumn and respective order after filtering
    if (sortColumn === 'btc') {
      console.log("Sorting BTC before:", result.map(r => r.btc_amount));
      if (sortOrder === 'ascend') {
        result.sort((a, b) => parseFloat(a.btc_amount) - parseFloat(b.btc_amount));
      } else if (sortOrder === 'descend') {
        result.sort((a, b) => parseFloat(b.btc_amount) - parseFloat(a.btc_amount));
      }
      console.log("Sorting BTC after:", result.map(r => r.btc_amount));
    } else if (sortColumn === 'date') {
      if (dateSortOrder === 'ascend') {
          result.sort((a, b) => new Date(a.initiated_at).getTime() - new Date(b.initiated_at).getTime());
      } else {
          result.sort((a, b) => new Date(b.initiated_at).getTime() - new Date(a.initiated_at).getTime());
      }
    }

    return result;
  };

  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const allRows = filteredRows();
  const pageCount = Math.ceil(allRows.length / itemsPerPage);

  const currentRows = allRows.slice(itemOffset, itemOffset + itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage;
    setItemOffset(newOffset);
  };

  const handleItemsPerPageChange = (count) => {
    setItemsPerPage(count);
    setItemOffset(0);  // Reset to the first page.
  };

  return (
    <div className='flex mx-6 lg:mx-16 mt-24 lg:mt-32 w-full sidemenu-padding'>
      <div className='flex flex-col w-full'>

        <div className='flex items-center lg:mb-6'>
          <h4 className='display lg:mb-2 mr-10'>Activity</h4>

          <Link href='/dashboard/activities/download' className='ml-auto flex items-center text-primary-default body lg:hidden'>
          <Download className='h-6 w-6'/>
          </Link>

          {/* desktop */}
          <div className='justify-between w-full hidden lg:flex'>
            <div className='flex space-x-6'>
            <button className='text-body-secondary body-sm font-bold' onClick={() => setActiveFilter('all')}>All</button>
            <button className='text-body-secondary body-sm font-bold' onClick={() => setActiveFilter('receive')}>Sales</button>
            <button className='text-body-secondary body-sm font-bold' onClick={() => setActiveFilter('transfer')}>Transfers</button>
            <button className='text-body-secondary body-sm font-bold' onClick={() => setActiveFilter('conversion')}>Conversions</button>
            </div>
            <Link href='/dashboard/activities/download' className='flex items-center text-primary-default body'>download activity
            <Download className='h-6 w-6'/>
            </Link>
          </div>
        </div>
        {/* mobile */}
        <div className='flex justify-between w-full lg:hidden pt-2 pb-3'>
          <div className='flex space-x-6'>
          <button className='text-body-secondary body-sm font-bold' onClick={() => setActiveFilter('all')}>All</button>
          <button className='text-body-secondary body-sm font-bold' onClick={() => setActiveFilter('receive')}>Sales</button>
          <button className='text-body-secondary body-sm font-bold' onClick={() => setActiveFilter('transfer')}>Transfers</button>
          <button className='text-body-secondary body-sm font-bold' onClick={() => setActiveFilter('conversion')}>Conversions</button>
          </div>
          <Link href='/dashboard/activities/download' className='items-center text-primary-default body hidden lg:flex'>download activity
          <Download className='h-6 w-6'/>
          </Link>
        </div>

        <div className='relative mb-6'>
          <input
            className='bg-background py-4 pr-4 pl-12 w-full body rounded-2xl'
            type="text"
            placeholder='Search'
            onChange={handleSearchChange}
            value={searchValue}
          />
          <Search className='h-6 w-6 text-body-primary absolute top-4 left-4' />
        </div>

        <div className=''>
          <table className="table-auto lg:table-fixed w-full">
            <thead className='border-b border-line'>
              <tr className=''>
                <th className='body-sm font-bold text-title-active text-left py-1.5 w-3/4 md:w-1/2 lg:w-1/4'>Name</th>
                <th className='body-sm font-bold text-title-active text-left py-1.5 w-1/4 md:w-1/2 lg:w-auto'>
                  <button className='flex items-center' onClick={() => toggleSort()}>
                    BTC
                    {sortOrder === 'ascend' ? <SortAscend className='text-primary-default h-5 w-5'/> : <SortDescend className='text-primary-default h-5 w-5'/>}
                  </button>
                </th>
                <th className='body-sm font-bold text-title-active w-20 text-left py-1.5 hidden lg:table-cell'>
                  <button className='flex items-center' onClick={() => toggleSort()}>
                    USD
                    {sortOrder === 'ascend' ? <SortAscend className='text-primary-default h-5 w-5'/> : <SortDescend className='text-primary-default h-5 w-5'/>}
                  </button>
                </th>
                <th className='body-sm font-bold text-title-active text-left py-1.5 hidden lg:table-cell'>Status</th>
                <th className='body-sm font-bold text-title-active text-left py-1.5 hidden lg:table-cell'>TX</th>
                <th className='body-sm font-bold text-title-active text-left py-1.5 hidden lg:table-cell'>
                  <button className='flex items-center' onClick={toggleDateSort}>
                    Date
                    {dateSortOrder === 'ascend' ? <SortAscend className='text-primary-default h-5 w-5'/> : <SortDescend className='text-primary-default h-5 w-5'/>}
                  </button>
                </th>
                <th className='w-6'></th>
              </tr>
            </thead>
            <tbody>
            {currentRows.map((transaction, index) => {
              // Get the textColor and bgColor for the current row's status
              const { textColor, bgColor } = getStatusClasses(transaction.status);

              return (
                <React.Fragment key={index}>
                <tr className='border-b border-line'>
                  <td className='flex items-center py-4'>
                        {getSVGByType(transaction.type)}
                        <p className='body text-body-primary'>
                            {
                                transaction.description
                                    ? (transaction.description.length > 30
                                        ? transaction.description.slice(0, 30) + '...'
                                        : transaction.description)
                                    : "Payment request"
                            }
                        </p>
                    </td>
                    <td><p className='body text-body-secondary'>{transaction.btc_amount ? transaction.btc_amount.toFixed(8) : ''}</p></td>
                    <td><p className='body text-body-secondary hidden lg:table-cell'>{transaction.usd_amount ? parseFloat(transaction.usd_amount).toFixed(2) : ''}</p></td>
                    <td className='hidden lg:table-cell'>
                        <div className={`${textColor} ${bgColor} body-xs rounded-lg py-0.5 px-2 max-w-fit mr-auto`}>
                            {transaction.status}
                        </div>
                    </td>
                    <td className='hidden lg:table-cell'>
                    <div className='text-body-primary bg-background body-xs rounded-lg py-0.5 px-2 max-w-fit mr-auto'>
                    {
                        transaction.payment_mode
                          ? (transaction.payment_mode === "on-chain"
                              ? "On-chain"
                              : (transaction.payment_mode === "lightning"
                                  ? "Lightning"
                                  : ""))
                          : (transaction.type === "transfer"
                              ? "Transfer"
                              : (transaction.type === "conversion"
                                  ? "Conversion"
                                  : (transaction.type === "send"
                                      ? "Send"
                                      : (transaction.type === "receive"
                                          ? "Receive"
                                          : "Pending"))))
                      }
                    </div>
                    </td>
                    <td className='text-body-primary hidden lg:table-cell'>{new Date(transaction.initiated_at * 1000).toLocaleString()}</td>
                    <td className=''>
                      <button ref={el => buttonSVGRefs.current[index] = el} onClick={() => toggleDetails(index)}>
                          <Ellipsis/>
                      </button>
                    </td>
                  </tr>
                  <tr ref={el => detailsRefs.current[index] = el} style={{ display: 'none' }}>
                    <td colSpan={7}>
                      <div className="py-4 px-12 flex flex-col">

                        <div className='flex flex-col mb-4'>
                          <p className='meta text-body-secondary mb-1'>To:</p>
                          <p className='body-sm text-body-primary'>{transaction.address}</p>
                        </div>

                        <div className='flex justify-between'>
                          <div className='flex flex-col'>
                            <p className='meta text-body-secondary mb-1'>Transfer Fee:</p>
                            <p className='body-sm text-body-primary'>{transaction.transfer_fee}</p>
                          </div>

                          <div className='flex flex-col'>
                            <p className='meta text-body-secondary mb-1'>Transfer ID:</p>
                            <p className='body-sm text-body-primary'>{transaction.transaction_label}</p>
                          </div>

                          <div className='flex flex-col'>
                            <p className='meta text-body-secondary mb-1'>Block Explorer:</p>
                            <p className='body-sm text-body-primary'><a href={transaction.blockExplorer} target="_blank" rel="noopener noreferrer" className='underline'>View Transaction</a></p>
                          </div>
                        </div>
                      </div>
                      <div className='border-b border-line w-full'></div>

                    </td>
                  </tr>

                  {/* black overlay for mobile modal */}
                  <div
                    className="fixed inset-0 bg-black opacity-25 z-10 lg:hidden"
                    ref={el => overlayRefs.current[index] = el}
                    style={{ display: 'none' }}
                    onClick={() => toggleDetails(index)}
                  ></div>

                  {/* mobile modal */}
                  <div className="fixed bottom-0 left-0 w-full rounded-t-4xl bg-white border-t shadow-lg z-20 lg:hidden" ref={el => modalRefs.current[index] = el} style={{ display: 'none' }}>
                    <div className="pb-4 pt-12 px-6 flex flex-col justify-start">
                      <div className='flex flex-col mb-4'>
                        <p className='meta text-body-secondary mb-1'>To:</p>
                        <p className='body-sm text-body-primary'>{transaction.address}</p>
                      </div>

                      <div className='flex flex-col'>
                        <div className='flex flex-col mb-4'>
                          <p className='meta text-body-secondary mb-1'>Transfer Fee:</p>
                          <p className='body-sm text-body-primary'>{transaction.transfer_fee}</p>
                        </div>

                        <div className='flex flex-col mb-4'>
                          <p className='meta text-body-secondary mb-1'>Transfer ID:</p>
                          <p className='body-sm text-body-primary'>{transaction.transaction_label}</p>
                        </div>

                        <div className='flex flex-col'>
                          <p className='meta text-body-secondary mb-1'>Block Explorer:</p>
                          <p className='body-sm text-body-primary'>
                            <a href={transaction.blockExplorer} target="_blank" rel="noopener noreferrer" className='underline'>View Transaction</a>
                          </p>
                        </div>
                      </div>
                    </div>
                    <button className='mx-auto flex' onClick={() => toggleDetails(index)}>
                      <ArrowDown className='mx-auto h-12 w-12 mb-4' />
                    </button>
                  </div>

                </React.Fragment>
              );
            })}
            </tbody>
          </table>

          <div className='flex items-center justify-between text-body-secondary mt-2 pb-20'>
            <ReactPaginate className='flex space-x-4 body-sm'
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={pageCount}
                previousLabel="<"
                renderOnZeroPageCount={null}
                activeClassName="font-bold text-title-active"
            />
            {
              pageCount > 0 && (
                <div className='flex body-sm text-body-secondary space-x-3'>
                  <p>Show</p>
                  <button className={itemsPerPage === 10 ? "font-bold text-title-active" : ""} onClick={() => handleItemsPerPageChange(10)}>10</button>
                  <button className={itemsPerPage === 25 ? "font-bold text-title-active" : ""} onClick={() => handleItemsPerPageChange(25)}>25</button>
                  <button className={itemsPerPage === 50 ? "font-bold text-title-active" : ""} onClick={() => handleItemsPerPageChange(50)}>50</button>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}
