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
import SecondaryButton from '../../../components/SecondaryButton';
import Right from 'src/public/icons/arrow-right.svg'

export default function BillingInvoicePage() {

  const { data: session, status } = useSession();

  const token = session?.token; // Extract the token from the session

  // store all unfiltered transactions here
  const [transactions, setTransactions] = useState([]);

  const [btcRate, setBtcRate] = useState('');

  useEffect(() => {
    if (!token) return;  // No token, don't fetch
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transactions/list-invoices`, {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the authorization header
          }
        });

        if (response.status === 200) {
          console.log(response)
          setTransactions([...response.data.data].reverse() || []);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  // API call to get conversion price of 1 btc
  useEffect(() => {
    const fetchConversionData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/currency-conversion?amount=1&currency=btc`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setBtcRate(response.data._to.amount);
      } catch (error) {
        console.error("Error making the API call:", error);
      }
    };

    fetchConversionData();
  }, [token]);

  console.log(transactions);

  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>(null);
  const [dateSortOrder, setDateSortOrder] = useState<'ascend' | 'descend' | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [sortColumn, setSortColumn] = useState<'btc' | 'date' | null>(null);  // to track if sortOrder or dateSortOrder is being clicked

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'paid':
        return {
          textColor: 'text-states-successDark',
          bgColor: 'bg-states-successLight'
        };
      case 'unpaid':
        return {
          textColor: 'text-states-pendingDark',
          bgColor: 'bg-states-pendingLight'
        };
      case 'cancelled':
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

  const toggleSort = () => {
    if (sortOrder === 'ascend') {
      setSortOrder('descend');
    } else {
      setSortOrder('ascend');
    }
    setSortColumn('btc');
  };
  
  const toggleDateSort = () => {
    if (dateSortOrder === 'ascend') {
      setDateSortOrder('descend');
    } else {
      setDateSortOrder('ascend');
    }
    setSortColumn('date');
  };

  const filteredRows = () => {
    let result = transactions;
  
    // Filter based on buttons
    switch (activeFilter) {
      case 'paid':  // Sales
        result = result.filter(row => row.status === 'paid');
        break;
      case 'unpaid':  // Transfers
        result = result.filter(row => row.status === 'unpaid');
        break;
      case 'cancelled':  // Conversions
        result = result.filter(row => row.status === 'cancelled');
        break;
      default:
        break;
    }
  
    // Filter based on search input
    if (searchValue.trim()) {
      const trimmedSearch = searchValue.trim().toLowerCase();
  
      result = result.filter(row => {
          const invoiceNumberMatches = String(row.invoice_number).includes(trimmedSearch);
          const recipientNameMatches = row.recipient_name.toLowerCase().includes(trimmedSearch);
          
          return invoiceNumberMatches || recipientNameMatches;
      });
    }
  
    // Sort based on sortColumn and respective order after filtering
    if (sortColumn === 'btc') {
      if (sortOrder === 'ascend') {
        result.sort((a, b) => parseFloat(a.total_due.amount) - parseFloat(b.total_due.amount));
      } else if (sortOrder === 'descend') {
        result.sort((a, b) => parseFloat(b.total_due.amount) - parseFloat(a.total_due.amount));
      }
    } else if (sortColumn === 'date') {
      if (dateSortOrder === 'ascend') {
          result.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
      } else {
          result.sort((a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime());
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
      <div className='flex flex-col w-full relative'>

        <div className='flex items-center'>
          <div className='-top-22 left-0 absolute flex items-center'>
            <Link href="/dashboard/payments/" className='text-body-secondary body hover:text-title-active'>Payments</Link>
            <Right className='h-6 w-6 text-title-active mx-2' />
            <p className='text-title-active body'>Billing/Invoice</p>
            </div>
        </div>

        <div className='flex items-center lg:mb-6'>
          <h4 className='display lg:mb-2 mr-10'>Invoices</h4>

          {/* desktop */}
          <div className='justify-between w-full hidden lg:flex'>
            <div className='flex space-x-6'>
            <button className='text-body-secondary body-sm font-bold' onClick={() => setActiveFilter('all')}>All</button>
            <button className='text-body-secondary body-sm font-bold' onClick={() => setActiveFilter('paid')}>Paid</button>
            <button className='text-body-secondary body-sm font-bold' onClick={() => setActiveFilter('unpaid')}>Unpaid</button>
            <button className='text-body-secondary body-sm font-bold' onClick={() => setActiveFilter('cancelled')}>Overdue</button>
            </div>
            <Link href='/dashboard/payments/billing-invoice/create-invoice' className='hidden lg:flex body bg-primary-default font-bold text-white py-2 px-6 justify-center noshadow-button'>Create invoice</Link>
          </div>
        </div>
        {/* mobile */}
        <div className='flex justify-between w-full lg:hidden pt-2 pb-3'>
          <div className='flex space-x-6'>
          <button className='text-body-secondary body-sm font-bold' onClick={() => setActiveFilter('all')}>All</button>
          <button className='text-body-secondary body-sm font-bold' onClick={() => setActiveFilter('paid')}>Paid</button>
          <button className='text-body-secondary body-sm font-bold' onClick={() => setActiveFilter('unpaid')}>Unpaid</button>
          <button className='text-body-secondary body-sm font-bold' onClick={() => setActiveFilter('cancelled')}>Overdue</button>
          </div>
          <Link href='/dashboard/payments/billing-invoice/create-invoice' className='body bg-primary-default font-bold text-white py-2 px-6 flex justify-center noshadow-button'>Create invoice</Link>
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
                <th className='body-sm font-bold text-title-active text-left py-1.5 w-3/4 md:w-1/2 lg:w-1/4'>Invoice #</th>
                <th className='body-sm font-bold text-title-active text-left py-1.5 w-3/4 md:w-1/2 lg:w-auto'>Customer</th>
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
                <th className='body-sm font-bold text-title-active text-center py-1.5 hidden lg:table-cell'>Status</th>
                <th className='body-sm font-bold text-title-active text-right py-1.5 hidden lg:table-cell'>
                  <button className='flex items-center ml-auto mr-2' onClick={toggleDateSort}>
                    Due Date
                    {dateSortOrder === 'ascend' ? <SortAscend className='text-primary-default h-5 w-5'/> : <SortDescend className='text-primary-default h-5 w-5'/>}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
            {currentRows.map((transaction, index) => {
              // Get the textColor and bgColor for the current row's status
              const { textColor, bgColor } = getStatusClasses(transaction.status);

              return (
                <React.Fragment key={index}>
                <tr className='border-b border-line'>
                    <td className='flex items-center py-4'><p className='body text-body-primary'>{transaction.invoice_number}</p></td>
                    <td><p className='body text-body-primary'>{transaction.recipient_name}</p></td>
                    <td><p className='body text-body-primary'>{transaction.total_due.amount ? (transaction.total_due.amount / btcRate).toFixed(8) : ''}</p></td>
                    <td><p className='body text-body-secondary hidden lg:table-cell'>{transaction.total_due.amount ? parseFloat(transaction.total_due.amount).toFixed(2) : ''}</p></td>
                    <td className='hidden lg:table-cell'>
                        <div className={`${textColor} ${bgColor} body-xs rounded-lg py-0.5 px-2 max-w-fit mx-auto`}>
                            {transaction.status}
                        </div>
                    </td>
                    <td className='text-body-primary hidden text-right pr-2 lg:table-cell'>{transaction.due_date}</td>
                  </tr>

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
