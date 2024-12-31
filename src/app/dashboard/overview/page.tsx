'use client'
import Link from 'next/link';
import Bitcoin from 'src/public/icons/bitcoin.svg'
import Usd from 'src/public/icons/usd.svg'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import OverviewActivity from '../../components/OverviewActivity';

export default function OverviewPage() {

  const [btcData, setBtcData] = useState({ amount: 0, in_usd: 0 });
  const [usdData, setUsdData] = useState({ amount: 0, in_btc: 0 });

  const totalAmount = (parseFloat(usdData.amount) + parseFloat(btcData.in_usd)).toLocaleString('en-US');

  const { data: session, status } = useSession();

  const token = session?.token; // Extract the token from the session

  useEffect(() => {
    if (!token) return;  // No token, don't fetch
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/accounts/get-balances`, {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the authorization header
          }
        });

        if (response.status === 200) {
          const btcAmount = Number(response.data.btc.amount);
          setBtcData({ ...response.data.btc, amount: btcAmount });
          setUsdData(response.data.usd);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className='flex mx-6 lg:mx-16 mt-24 lg:mt-32 w-full sidemenu-padding'>
      <div className='flex flex-col w-full'>
        <h4 className='display mb-2'>Overview</h4>
        <p className='body text-body-secondary mb-6'>Total balance:<span className='font-bold ml-1'>${totalAmount} USD</span> </p>
        <div className='flex lg:flex-row flex-col justify-center w-full gap-x-4'>

          <div className='bg-secondary-keylimeLight rounded-3xl border-secondary-keylime border-2 w-full lg:w-1/2 p-6 lg:px-10 lg:py-8 lg:mb-0 mb-4'>
            <div className='flex justify-between items-start'>
              <div className='flex flex-col justify-center'>
                <p className='text-title-active body-lg font-bold'>Bitcoin</p>
                <h3 className='text-title-active break-all block'>{btcData.amount} BTC</h3>
                <p className='text-body-secondary body-sm break-all block'>≈${btcData.in_usd.toLocaleString('en-US')} USD</p>
              </div>
              <div>
                <Bitcoin/>
              </div>
            </div>
          </div>
      
          <div className='bg-secondary-aquamarineLight rounded-3xl border-secondary-aquamarine border-2 w-full p-6 lg:px-10 lg:py-8 lg:w-1/2'>
            <div className='flex justify-between items-start'>
              <div className='flex flex-col justify-center'>
                <p className='text-title-active body-lg font-bold'>USD</p>
                <h3 className='text-title-active break-all block'>{usdData.amount.toLocaleString('en-US')} USD</h3>
                <p className='text-body-secondary body-sm'>≈${usdData.in_btc} BTC</p>
              </div>
              <div>
                <Usd/>
              </div>
            </div>
          </div>

        </div>
        {/* <div className='my-10 w-full border-b border-title-active'></div> */}
        {/* if user is has yet to onboard, show this, will later make into component */}
        {/* <h5 className='text-title-active mb-6 mx-auto'>Add business details to get started</h5>
        <Link className='max-w-fit flex justify-center items-center w-full mx-auto' href="/onboard/about"><h6 className='flex font-ginto body items-center justify-center mx-auto bg-primary-button text-white px-10 py-4 font-bold primary-button max-w-fit'>Continue</h6></Link> */}
        <OverviewActivity />
      </div>
    </div>
  )
}
