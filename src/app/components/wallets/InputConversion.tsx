import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import ArrowDown from 'src/public/icons/arrow-down.svg';
import Switch from 'src/public/icons/switch.svg';
// ... (import your other components like Switch, ArrowDown, and Alert)

type InputEvent = ChangeEvent<HTMLInputElement>;

interface InputConversionProps {
  inputBtcValue: string;
  setInputBtcValue: (value: string) => void;
  exchangeBtcValue: string;
  setExchangeBtcValue: (value: string) => void;
  setParentConversionRate: (rate: number) => void;
  btcData: number;
  usdData: number; 
}

const InputConversion: React.FC<InputConversionProps> = ({ 
  inputBtcValue, 
  setInputBtcValue, 
  exchangeBtcValue,
  setExchangeBtcValue,
  setParentConversionRate,
  btcData,
  usdData,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [currency, setCurrency] = useState('BTC');
  const [conversionRate, setConversionRate] = useState<number | null>(null);

  const handleInputChange = (e: InputEvent) => {
    const numericValue = e.target.value;
    if (/^[0-9]*(\.[0-9]*)?$/.test(numericValue)) {
      setInputValue(numericValue);
      setExchangeBtcValue(numericValue);
      if (currency === 'BTC') {
        setInputBtcValue(numericValue);
        setExchangeBtcValue(numericValue);
      } else if (currency === 'USD' && conversionRate) {
        const btcEquivalent = (Number(numericValue) / conversionRate).toFixed(8);
        setInputBtcValue(btcEquivalent);
        setExchangeBtcValue(btcEquivalent);
      }
    }
  };

  // Fetch current conversion rate for 1 unit of the current currency
  const fetchCurrentConversionRate = async (currencyToConvert: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/currency-conversion?amount=1&currency=${currencyToConvert}`;
    try {
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.data._to && response.data._to.currency === 'USD') {
        const rate = Number(response.data._to.amount);
        setConversionRate(rate);
        setParentConversionRate(rate);
        console.log(rate);
      } else {
        console.error("Unexpected server response:", response.data);
      }
    } catch (error) {
      console.error("Error making the API call:", error.response?.data || error.message);
    }
  };

  const setMaxAmount = () => {
    event.preventDefault();
    if (currency === "BTC") {
      setInputValue(btcData.amount);  // Assuming setInputValue is your state updater function
    } else if (currency === "USD") {
      setInputValue(btcData.in_usd);
    }
  };

  const handleConversion = async (event) => {
    event.preventDefault();
    
    if (!inputValue) {
      setCurrency(prevCurrency => {
        fetchCurrentConversionRate('BTC');
        return prevCurrency === 'BTC' ? 'USD' : 'BTC';
      });
      return;
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_URL}/currency-conversion?amount=${inputValue}&currency=${currency}`;
    try {
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.data._to) {
        setInputValue(response.data._to.amount);
        setCurrency(response.data._to.currency);
        if (currency === 'BTC' && response.data._to.currency === 'USD') {
          const rate = Number(response.data._to.amount) / Number(inputValue);
          setConversionRate(rate);
          setParentConversionRate(rate);
        }
      } else {
        console.error("Unexpected server response:", response.data);
      }
    } catch (error) {
      console.error("Error making the API call:", error.response?.data || error.message);
    }
  };
  
  useEffect(() => {
    fetchCurrentConversionRate('BTC'); // Fetch conversion for 1 BTC to USD when the component mounts
  }, []);

  return (
    <div className='my-10 lg:my-16 flex flex-col relative w-full items-center justify-center'>
      <div className="relative w-4/5 input-container textarea-container">
        <input 
          type="text"
          placeholder={`0 ${currency}`}
          className='wallet transparent-input text-placeholder bg-secondary-keylimeLight h2 w-full text-center'
          value={inputValue}
          onChange={handleInputChange}
          required
        />
        {/* <div className="w-4/5 text-center text-placeholder h2">{inputValue} {currency}</div> */}
        <button className='meta text-placeholder absolute right-0 top-5' onClick={setMaxAmount}>MAX</button>
      </div>
      <div className='flex items-center mt-4'>
        <button className='flex' onClick={handleConversion}>
          <Switch className='h-6 w-6 text-primary-default mr-2'></Switch>
        </button>
        <div className='relative w-full flex'>
          <select 
            name="currency" 
            className='w-full focus:outline-none bg-secondary-keylimeLight'
            value={currency}
            onChange={(e) => {
              setCurrency(e.target.value);
              setInputValue(''); // reset input value when currency changes
            }}
          >
            <option value="USD">BTC</option>
            <option value="BTC">USD</option>
          </select>
          <ArrowDown className='h-6 w-6 text-title-active absolute -right-5'></ArrowDown>
        </div>
      </div>
    </div>
  );
}

export default InputConversion;
