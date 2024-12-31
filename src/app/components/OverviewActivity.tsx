'use client'

import Link from 'next/link';
import Transfer from 'src/public/icons/transfer.svg'
import Conversion from 'src/public/icons/conversion.svg'
import Receive from 'src/public/icons/receive.svg'
import ArrowDown from 'src/public/icons/arrow-down-48px.svg'
import Search from 'src/public/icons/search.svg'
import SortAscend from 'src/public/icons/sort-ascend.svg'
import SortDescend from 'src/public/icons/sort-descend.svg'
import Ellipsis from 'src/public/icons/ellipsis.svg'
import EllipsisActive from 'src/public/icons/ellipsis-active.svg'
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
);

const OverviewActivity = () => {

  const { data: session, status } = useSession();

  const token = session?.token; // Extract the token from the session

  const [usdAmountsArray, setUsdAmountsArray] = useState([]);

  // store all unfiltered transactions here
  const [transactions, setTransactions] = useState([]);

  // only confirmed transactions to show in the chart
  const [confirmedTransactions, setConfirmedTransactions] = useState([]);

  const modalRefs = useRef([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);

  // used to make strings on x-axis of chart shorter
  const truncateString = (str, maxLength) => {
    if (str.length <= maxLength) return str;
    return `${str.substring(0, maxLength - 3)}...`;
  };

  useEffect(() => {
    if (!token) return;  // No token, don't fetch
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/accounts/get-transactions`, {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the authorization header
          }
        });

        if (response.status === 200) {
          const allTransactions = [...response.data.transactions].reverse();
          setTransactions(allTransactions || []);

          // Filter out transactions with status: confirmed
          const filteredTransactions = allTransactions.filter(txn => 
            txn.status === 'confirmed' && txn.type == 'receive'
          );
          
          setConfirmedTransactions(filteredTransactions);

          // const usdAmounts = response.data.transactions.map(transaction => transaction.usd_amount);
          // console.log(usdAmounts);  // This will log an array of usd_amount values

          // setUsdAmountsArray(usdAmounts);

        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
}, [token]);

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
      if (sortOrder === 'ascend') {
        result.sort((a, b) => parseFloat(a.btc_amount) - parseFloat(b.btc_amount));
      } else if (sortOrder === 'descend') {
        result.sort((a, b) => parseFloat(b.btc_amount) - parseFloat(a.btc_amount));
      }
    } else if (sortColumn === 'date') {
      if (dateSortOrder === 'ascend') {
          result.sort((a, b) => new Date(a.initiated_at).getTime() - new Date(b.initiated_at).getTime());
      } else {
          result.sort((a, b) => new Date(b.initiated_at).getTime() - new Date(a.initiated_at).getTime());
      }
    }
  
    return result;
  };
  
  // Chart logic start

  const [chartType, setChartType] = useState('USD');

  // options for react chart, mostly tooltip customizations
  const options = (chartType) => ({
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#67808F',
        }
      },
      y: {
        ticks: {
          maxTicksLimit: 6,
          color: '#67808F',
          callback: function(value, index, values) {
            if (chartType === 'USD') {
              return `$${value}`;
            } else if (chartType === 'BTC') {
              return parseFloat(value).toFixed(4);
            }
            return value;
          }
        }
      }
    },
    plugins: {
      filler: {
        propagate: true
      },
      tooltip: {
        position: 'average',
        backgroundColor: '#E91675',
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            if (chartType === 'BTC') {
              // Round the BTC value to 8 decimal points and append ' BTC'
              return `${value.toFixed(8)} BTC`;
            } else {
              // Return the USD value with '$' and ' USD'
              return `$${value} USD`;
            }
          },
          title: function() {
            return ''; // Hide the title
          }
        },
        titleFont: { size: 0 },
        bodyFont: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10
        },
        displayColors: false,
      },
    },
    elements: {
      line: {
        tension: 0
      }
    },
  });
  
  const extractChartData = (transactions) => {
    const labels = transactions.map(txn => truncateString(txn.description, 15));
    const usdData = transactions.map(txn => txn.usd_amount);
    const btcData = transactions.map(txn => txn.btc_amount);
  
    let datasets = [];
  
    const gradientBackgroundColor = (context) => {
      const ctx = context.chart.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, 250); // 250px height to match linechart height
      gradient.addColorStop(0, "rgba(255, 240, 240, 1)");
      gradient.addColorStop(1, "rgba(255, 240, 240, 0)");
      return gradient;
    };
  
    if (chartType === 'USD') {
      datasets.push({
        label: 'USD Amount',
        data: usdData,
        fill: {
          target: 'origin',
          above: gradientBackgroundColor,
        },
        borderColor: '#E91675',
        pointBackgroundColor: '#E91675',
      
      });
    } else if (chartType === 'BTC') {
      datasets.push({
        label: 'BTC Amount',
        data: btcData,
        fill: {
          target: "origin",
          above: gradientBackgroundColor,
        },
        borderColor: '#E91675',
        pointBackgroundColor: '#E91675',
      });
    }
  
    return {
      labels: labels,
      datasets: datasets,
    };
  };
  
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  
  useEffect(() => {
    setChartData(extractChartData(confirmedTransactions));
  }, [confirmedTransactions, chartType]);

  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const allRows = filteredRows();
  const pageCount = Math.ceil(allRows.length / itemsPerPage);

  const currentRows = allRows.slice(itemOffset, itemOffset + itemsPerPage);

  return (
    <div className='flex w-full mb-10'>
      <div className='flex flex-col w-full'>

      {/* line chart */}
      <div className='flex flex-col mt-14 mb-16'>
        <div className='flex'>
          <h4 className='display mb-2 mr-10 whitespace-pre'>Sales</h4>
          <div className='flex space-x-6'>
            <button 
              className={`body-sm font-bold text-body-secondary ${chartType === 'USD' ? 'text-title-active' : ''}`} 
              onClick={() => setChartType('USD')}
            >
              USD
            </button>
            <button 
              className={`body-sm font-bold text-body-secondary ${chartType === 'BTC' ? 'text-title-active' : ''}`} 
              onClick={() => setChartType('BTC')}
            >
              BTC
            </button>
          </div>
        </div>
        <Line options={options(chartType)} data={chartData} className="lineChart w-full"/>
      </div>

        <div className='flex items-center lg:mb-6'>
          <h4 className='display lg:mb-2 mr-10 whitespace-nowrap'>Recent activity</h4>

          <Link href='/dashboard/activities' className='ml-auto flex items-center text-primary-default body lg:hidden'>
          see more
          </Link>

          {/* desktop */}
          <div className='justify-between w-full hidden lg:flex'>
            <div className='flex space-x-6'>
            <button className='text-body-secondary body-sm font-bold' onClick={() => setActiveFilter('all')}>All</button>
            <button className='text-body-secondary body-sm font-bold' onClick={() => setActiveFilter('receive')}>Sales</button>
            <button className='text-body-secondary body-sm font-bold' onClick={() => setActiveFilter('transfer')}>Transfers</button>
            <button className='text-body-secondary body-sm font-bold' onClick={() => setActiveFilter('conversion')}>Conversions</button>
            </div>
            <Link href='/dashboard/activities' className='flex items-center text-primary-default body'>see more
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
          <Link href='/dashboard/activities' className='items-center text-primary-default body hidden lg:flex'>see more
          </Link>
        </div>

        {/* <div className='relative mb-6'>
          <input
            className='bg-background py-4 pr-4 pl-12 w-full body rounded-2xl'
            type="text"
            placeholder='Search'
            onChange={handleSearchChange}
            value={searchValue}
          />
          <Search className='h-6 w-6 text-body-primary absolute top-4 left-4' />
        </div> */}

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
            {currentRows.slice(0, 6).map((transaction, index) => {
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
          </div>
      </div>
    </div>
  );
}

export default OverviewActivity;