'use client'
import Link from 'next/link';
import Bitcoin from 'src/public/icons/bitcoin.svg'
import Usd from 'src/public/icons/usd.svg'
import Right from 'src/public/icons/right.svg'
import ArrowRight from 'src/public/icons/arrow-right.svg'
import InstantBitcoin from 'src/public/icons/instant-bitcoin.svg'
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Conversion from 'src/public/icons/conversion.svg'
import MassPayouts from 'src/public/icons/mass-payouts.svg'
import OneOffPayouts from 'src/public/icons/one-off-payouts.svg'
import axios from 'axios';

export default function PayoutsPage() {

  const [btcData, setBtcData] = useState({ amount: 0, in_usd: 0 });
  const [usdData, setUsdData] = useState({ amount: 0, in_btc: 0 });

  const { data: session, status } = useSession();

  const token = session?.token; // Extract the token from the session

  useEffect(() => {
    if (!token) return;  // No token, don't fetch
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/account/get-balances`, {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the authorization header
          }
        });

        if (response.status === 200) {
          const btcAmount = Number(response.data.btc.amount.toFixed(8));
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
    <div className='flex mx-16 mt-32 w-full sidemenu-padding'>
      <div className='flex flex-col w-full relative'>

        <div className='-top-22 left-0 absolute flex items-center'>
          <Link href="/dashboard/payments/" className='text-body-secondary body hover:text-title-active'>Payments</Link>
          <ArrowRight className='h-6 w-6 text-title-active mx-2' />
          <p className='text-title-active body'>Payouts</p>
        </div>

        <h4 className='display mb-6'>Payouts</h4>
        <div className='flex justify-center w-full gap-x-4 relative'>

        <button className='absolute bg-white rounded-full border-title-active border-2 p-2.5 top-14'>
            <Conversion className='w-6 h-6 text-title-active'/>
          </button>

          <div className='bg-secondary-keylimeLight rounded-3xl border-secondary-keylime border-2 w-1/2'>
            <div className='flex justify-between items-start px-10 py-8'>
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

          <div className='bg-secondary-aquamarineLight rounded-3xl border-secondary-aquamarine border-2 w-1/2'>
            <div className='flex justify-between items-start px-10 py-8'>
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

          <div className='grid grid-rows-2 grid-cols-2 gap-x-4 mt-6'>

          <Link href='/dashboard/payments/payouts/mass-payout' className='flex items-center justify-between p-5 border-line border rounded-2xl bg-white w-full mb-4'>
            <div className='flex items-center'>
              <MassPayouts className='mr-4 h-12 w-12'/>
              <div className='flex flex-col'>
                <p className='body text-title-active mb-1'>Mass Payout</p>
                <p className='meta text-body-secondary'>Upload CSV file to initiate payout</p>
              </div>
            </div>
            <Right className='text-primary-default h-6 w-6'/>
          </Link>

          <Link href='/dashboard/payments/payouts/one-off-transfer' className='flex items-center justify-between p-5 border-line border rounded-2xl bg-white w-full mb-4'>
            <div className='flex items-center'>
              <OneOffPayouts className='mr-4 h-12 w-12'/>
              <div className='flex flex-col'>
                <p className='body text-title-active mb-1'>One-off Transfer</p>
                <p className='meta text-body-secondary'>Enter payout instructions</p>
              </div>
            </div>
            <Right className='text-primary-default h-6 w-6'/>
          </Link>

          <Link href='' className='flex items-center justify-between p-5 border-line border rounded-2xl bg-background w-full mb-4'>
            <div className='flex items-center'>
              <div className='flex flex-col'>
                <p className='body text-title-active mb-1'>API Documentation</p>
                <p className='meta text-body-secondary'>Learn the basics of the AYCE Express API</p>
              </div>
            </div>
            <button>
            <Right className='text-primary-default h-6 w-6'/>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
