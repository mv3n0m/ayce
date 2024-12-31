'use client'
import Link from 'next/link';
import ArrowRight from 'src/public/icons/arrow-right.svg'
import Add from 'src/public/icons/add2.svg'
import Back from 'src/public/icons/back.svg'
import Down from 'src/public/icons/arrow-down.svg'
import Up from 'src/public/icons/arrow-up.svg'
import { useState, useEffect, useRef, useCallback } from 'react'
import PrimaryButton from '../../../components/PrimaryButton';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function PosPage() {
  const [currentInput, setCurrentInput] = useState("");
  const [description, setDescription] = useState("");
  const [sum, setSum] = useState(0);
  const [history, setHistory] = useState([]);
  const { data: session, status } = useSession();
  const id = `${session?.user?.id}`
  const [isShown, setIsShown] = useState(false);
  const descriptionRef = useRef(null);
  const token = session?.token; // Extract the token from the session
  const displayRef = useRef<HTMLParagraphElement>(null);
  const [btcRate, setBtcRate] = useState('');
  const [currency, setCurrency] = useState('USD');
  
  const toggleContent = () => {
    setIsShown(prevState => !prevState);
  }

  const formatNumberWithCommas = useCallback((num) => {
    const reg = /^(\d+(\.\d*)?|\.\d+)([eE][-+]?[0-9]+)?$/;
    const match = ('' + num).match(reg);
    
    if (match) {
      let [, leading, , scale] = match;
      if (scale) {
        let zeroes = Math.abs(scale);
        leading = leading.replace('.', '');
        let l = leading.length;

        if (scale < 0) {
          return parseFloat('0.' + '0'.repeat(zeroes - 1) + leading).toLocaleString();
        } else {
          return (parseFloat(leading + '0'.repeat(zeroes - (l - 1)))).toLocaleString();
        }
      }
    }

    return num.toLocaleString();
  }, []);

  const totalWithFee = new Intl.NumberFormat().format(
    currency === 'BTC'
      ? parseFloat((sum * btcRate).toFixed(2))
      : currency === 'SAT'
        ? parseFloat((sum * btcRate / 100_000_000).toFixed(2))
        : parseFloat((sum * 1).toFixed(2))
  );


  const handleClick = (value) => {
    if (value === 'C') {
      setCurrentInput('');
      setHistory([]);
      setSum(0);
    } else if (value === '+' && currentInput) { 
      setHistory([...history, currentInput, value]);
      setCurrentInput('');
    } else if (typeof value === 'number') {
      setCurrentInput(currentInput + value);
    }
  };

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

  useEffect(() => {
    if (history.length > 0) {
      // Filter history array for numbers and calculate sum
      const numArr = history.filter(item => typeof item === 'number' || !isNaN(item));
      const sumFromHistory = numArr.reduce((a, b) => parseInt(a) + parseInt(b), 0);
  
      // Add currentInput to the sum from history
      setSum(sumFromHistory + parseInt(currentInput || 0)); 
    } else {
      // If history is empty, simply use the currentInput as the sum
      setSum(parseInt(currentInput || 0));
    }
  }, [history, currentInput]); 

  // auto scrolls to most recent number in equation when width overflows
  useEffect(() => {
    if (displayRef.current) {
      const element = displayRef.current;
      element.scrollLeft = element.scrollWidth;
    }
  }, [history, currentInput]);

  // API call 
  const handleChargeClick = async () => {
    try {
      // Create the base request payload
      let payload = {
        amount: totalWithFee
      };
        // If descriptionRef.current exists, then check its value and add to the payload if necessary
      if (descriptionRef.current && descriptionRef.current.value.trim() !== "") {
        payload.description = descriptionRef.current.value;
      }
  
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/pos/create-transaction`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      console.log("Server Response:", response.data);
  
      // Extract token from the server response and construct the URL
      if (response.data) {
        const payerToken = response.data.token;
        const payerPage = `/payer/onchain-lightning?payerToken=${payerToken}`;
        window.open(payerPage, '_blank');  // Opens the URL in a new tab or window
      } else {
        console.error("Received unexpected data from the server");
      }
    } catch (error) {
      console.error("Error making the POST request:", error);
    }
  };
  
  return (
    <div className='flex mx-6 mt-24 lg:mx-16 lg:mt-32 w-full relative sidemenu-padding'>
      <div className='flex flex-col w-full relative'>

        <div className='lg:-top-22 lg:left-0 relative lg:absolute flex items-center mb-6 lg:mx-0 lg:mb-0'>
          <Link href="/dashboard/payments/" className='text-body-secondary body hover:text-title-active'>Payments</Link>
          <ArrowRight className='h-6 w-6 text-title-active mx-1 lg:mx-2' />
          <p className='text-title-active body'>POS App</p>
        </div>

          {/* calculator */}
          <div className='flex flex-col w-full justify-center '>
            {/* for mobile number display */}
            <p ref={displayRef} className='lg:hidden body-lg text-body-secondary mb-2 h-7 whitespace-nowrap overflow-x-auto max-w-lg no-scrollbar'>{history.join(' ')} {currentInput}</p>
            <p className='lg:hidden h3 text-title-active mb-6 lg:mb-10 whitespace-nowrap overflow-x-auto max-w-lg no-scrollbar'>
              {currency === 'USD'
                ? `$${formatNumberWithCommas(sum)}`
                : `${formatNumberWithCommas(sum)} ${currency}`}
            </p>
            <div className="calculator mx-auto">
              <div className="display">
                {/* for desktop number display */}
                <p ref={displayRef} className='hidden lg:flex body-lg text-body-secondary mb-2 h-7 whitespace-nowrap overflow-x-auto no-scrollbar'>{history.join(' ')} {currentInput}</p>
                <p className='hidden lg:flex h3 text-title-active mb-6 lg:mb-10 whitespace-nowrap overflow-x-auto no-scrollbar'>
                  {currency === 'USD'
                    ? `$${formatNumberWithCommas(sum)}`
                    : `${formatNumberWithCommas(sum)} ${currency}`}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-6 lg:gap-x-12 lg:gap-y-8 mb-6 lg:mb-10">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '+'].map((value, index) => (
                  <button 
                  key={index} 
                  className="col-span-1 calculator-button text-title-active bg-background rounded-full" 
                  onClick={() => handleClick(value)}>
                  {/* replace + with custom svg */}
                  {value === '+' ? <Add className='h-6 w-6 lg:h-8 lg:w-8 text-white m-auto bg-primary-default rounded-full box-content p-5 lg:p-6' /> : value}
                  </button>
                ))}
              </div>
            <div className='flex-flex-col items-center'>
              <button className='flex items-center' onClick={toggleContent}>
                <p className='body-lg text-primary-default mb-1'>Show {isShown ? 'less' : 'more'} options</p>
                {isShown ? <Up className='h-6 w-6 text-primary-default' /> : <Down className='h-6 w-6 text-primary-default' />}
              </button>
              <p className='body text-body-secondary mb-4'>Add a description or change currency.</p>
              
              {isShown && (
                <div className=''>
                  <div className='mb-4'>
                    <label className='hidden'>description</label>
                    <input
                      className='bg-background p-3.5 lg:p-4 w-full body rounded-2xl'
                      type="text"
                      required
                      placeholder="Transaction Description (e.g. Invoice #)"
                      ref={descriptionRef}
                    />
                  </div>
                  <div className='relative mb-4'>
                    <select 
                      name="businessLocation" 
                      className='bg-background p-4 w-full body rounded-2xl mb-2'
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="USD">USD</option>
                      <option value="BTC">BTC</option>
                      <option value="SAT">SAT</option>
                    </select>
                    <Down className='h-6 w-6 text-title-active absolute right-4 top-4'></Down>
                  </div>

                  <div className='flex items-center'>
                    <input type="checkbox" className='check h-full' id='contactinfo' />
                    <label className='default-check mb-4' htmlFor="contactinfo"></label>
                    <p className='body text-body-primary'>Ask for contact info</p>
                  </div>


                </div>
              )}
              <h6 className='display mt-6 lg:mt-10 mb-10' onClick={handleChargeClick}>
                {/* add transaction fee */}
                <PrimaryButton text={`Charge $${totalWithFee}`} />
              </h6>
            </div>
            </div>
          </div>
      </div>
    </div>
  )
}
