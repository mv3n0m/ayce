'use client'

import Link from 'next/link';
import SecondaryButton from '../../../components/SecondaryButton';
import Right from 'src/public/icons/arrow-right.svg'
import ArrowDown from 'src/public/icons/arrow-down.svg'
import Calendar from 'src/public/icons/calendar.svg'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect, useRef } from 'react';

export default function ActivitiesDownloadPage() {

  const { data: session, status } = useSession();

  const token = session?.token; // Extract the token from the session

  // store all unfiltered transactions here
  const [transactions, setTransactions] = useState([]);

  const [selectedTimeframe, setSelectedTimeframe] = useState("last-week");
  const [selectedType, setSelectedType] = useState("");

  const filterTransactions = () => {
    const currentTime = Date.now(); // Current time in milliseconds
    let startTime; // Time from which to start filtering
    let endTime = currentTime; // Default endTime is set to current time
    let filtered = [...transactions];

    switch (selectedTimeframe) {
      case "last-week":
        startTime = currentTime - 7 * 24 * 60 * 60 * 1000; // 7 days ago
        break;
      case "this-month":
        startTime = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
        break;
      case "last-month":
        startTime = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).getTime();
        endTime = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getTime();
        break;
      case "this-year":
        startTime = new Date(new Date().getFullYear(), 0, 1).getTime();
        break;
      case "last-year":
        startTime = new Date(new Date().getFullYear() - 1, 0, 1).getTime();
        endTime = new Date(new Date().getFullYear() - 1, 11, 31).getTime();
        break;
      default:
        startTime = 0;
    }

    // Filter by selected type
    if (selectedType !== "all" && selectedType) {
      filtered = filtered.filter(t => t.type === selectedType);
    }

    // Further refine `filtered` based on timeframe
    filtered = filtered.filter(t => {
      const transactionTime = t.initiated_at * 1000; // Convert to milliseconds
      return transactionTime >= startTime && transactionTime <= endTime;
    });

    return filtered;
  };


  const convertToCSV = (transactions) => {
    let csv = 'Name,BTC,USD,Status,Payment mode,Date,Time,Address,Transfer Fee,Transfer ID,Block Explorer\n';

    transactions.forEach(transaction => {
      const {
        description,
        btc_amount,
        usd_amount,
        status,
        payment_mode,
        type,
        initiated_at,
        address,
        transfer_fee,
        transaction_label,
        blockExplorer
      } = transaction;

      const name = description ? description : "Payment request";
      const btc = btc_amount ? btc_amount.toFixed(8) : '';
      const usd = usd_amount ? parseFloat(usd_amount).toFixed(2) : '';
      const date = new Date(initiated_at * 1000).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
      const txMode = payment_mode
        ? (payment_mode === "on-chain" ? "On-chain"
        : (payment_mode === "lightning" ? "Lightning"
        : ""))
        : (type === "transfer" ? "Transfer"
        : (type === "conversion" ? "Conversion"
        : ""));

      // Adding row to CSV
      csv += `${name},${btc},${usd},${status},${txMode},${date},${address},${transfer_fee},${transaction_label},${blockExplorer}\n`;
    });

    return csv;
  };

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

  // state to control the dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { label: 'Last week', value: 'last-week' },
    { label: 'This month', value: 'this-month' },
    { label: 'Last month', value: 'last-month' },
    { label: 'This year', value: 'this-year' },
    { label: 'Last year', value: 'last-year' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getDateRange = (timeframe) => {
    let today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    let startDate;
    let endDate = new Date(today); // setting default endDate to today

    switch (timeframe) {
      case 'last-week':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case 'this-month':
        startDate = new Date(currentYear, currentMonth, 1);
        break;
      case 'last-month':
        startDate = new Date(currentYear, currentMonth - 1, 1);
        endDate.setDate(0); // Sets date to the last day of the previous month
        break;
      case 'this-year':
        startDate = new Date(currentYear, 0, 1);
        break;
      case 'last-year':
        startDate = new Date(currentYear - 1, 0, 1);
        endDate = new Date(currentYear - 1, 11, 31);
        break;
      default:
        return ['', ''];
    }

    // Format the date as "Month day, year"
    const format = date => date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return [format(startDate), format(endDate)];
  };

  const getOptionLabel = (value) => {
    switch (value) {
      case 'last-week':
      case 'this-month':
      case 'last-month':
      case 'this-year':
      case 'last-year':
        const [startDate, endDate] = getDateRange(value);
        if (startDate === endDate) {
          return startDate;
        }
        return `${startDate} - ${endDate}`;
      default:
        return options.find(option => option.value === value)?.label || '';
    }
  };

  const downloadCSV = (transactions) => {
    const csvData = convertToCSV(transactions);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    const [startDate, endDate] = getDateRange(selectedTimeframe);
    const filename = `Ayce transactions ${startDate} - ${endDate}.csv`;

    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };


  const handleDownloadCSV = () => {
    const filteredTransactions = filterTransactions();
    downloadCSV(filteredTransactions);
  };

  return (
    <div className='flex mx-6 mt-24 lg:mx-16 lg:mt-32 w-full relative sidemenu-padding'>
      <div className='flex flex-col w-full lg:w-1/2 relative'>

        <div className='flex items-center'>

          <div className='lg:-top-22 lg:left-0 relative lg:absolute flex items-center mb-6 lg:mx-0 lg:mb-0'>
            <Link href="/dashboard/activities/" className='text-body-secondary body hover:text-title-active'>Activity</Link>
            <Right className='h-6 w-6 text-title-active mx-2' />
            <p className='text-title-active body'>Download</p>
          </div>

        </div>
          <h4 className='display mb-14 mr-10 hidden lg:flex'>Activity</h4>
          <h5 className='display mb-6'>Download activity</h5>

          <p className='text-body-secondary body-sm font-bold mb-1'>Timeframe</p>

          {/* custom dropdown timeframe selector */}
          <div className='relative' ref={dropdownRef}>
            <div className='bg-background p-4 w-full body rounded-2xl mb-2 text-title-active cursor-pointer' onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              {getOptionLabel(selectedTimeframe)}
              <Calendar className="h-6 w-6 text-body-primary absolute right-4 top-4" />
            </div>
            {isDropdownOpen && (
              <div className="absolute top-full mt-0 w-full border border-line bg-background rounded-3xl z-10">
                <div className="flex justify-between px-4 py-3 space-x-3 w-full">
                  <div className='w-1/2 flex justify-between relative text-placeholder border-line bg-white border rounded-3xl px-4 py-3.5'>
                    {getDateRange(selectedTimeframe)[0]}
                    <Calendar className="h-6 w-6 text-body-primary" />
                  </div>
                  <div className='w-1/2 flex justify-between relative text-placeholder border-line bg-white border rounded-3xl px-4 py-3.5'>
                    {getDateRange(selectedTimeframe)[1]}
                    <Calendar className="h-6 w-6 text-body-primary" />
                  </div>
                </div>
                {options.map(option => (
                  <div
                    key={option.value}
                    className="pb-3 px-4 cursor-pointer text-placeholder hover:text-title-active"
                    onClick={() => {
                      setSelectedTimeframe(option.value);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className='text-body-secondary body-sm font-bold mb-1 mt-5'>Type</p>
          <div className='relative mb-7'>
            <select
            name="transactionType"
            className='bg-background p-4 w-full body rounded-2xl mb-2 text-title-active'
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            // value={}
            // onChange={}
            >
              <option value="" disabled className=''>All</option>
              <option value="all">All</option>
              <option value="receieve">Sales</option>
              <option value="transfer">Transfers</option>
              <option value="conversion">Conversions</option>
            </select>
            <ArrowDown className='h-6 w-6 text-body-primary absolute right-4 top-4'></ArrowDown>
          </div>

          <div className='w-full max-w-fit mr-auto flex' onClick={handleDownloadCSV}>
            <SecondaryButton text='Download CSV'/>
          </div>
      </div>
    </div>
  )
}
