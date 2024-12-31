'use client'
import Image from 'next/image'
import PrimaryButton from '../../components/PrimaryButton';
import Link from 'next/link';
import { signIn } from "next-auth/react";
import React, { useRef, useEffect, useState } from "react";
import Alert from 'src/public/icons/alert.svg'
import { useRouter } from 'next/navigation';
import Logo from 'src/public/logos/color.svg'
import axios from 'axios';
import { useSearchParams } from 'next/navigation'
import Download from 'src/public/icons/download.svg'
import AyceLogo from 'src/public/logos/logomark-color.svg'

const PayerInvoicePage = () => {
  const searchParams = useSearchParams()
  const invoiceToken = searchParams.get('invoiceToken')
  const payerToken = searchParams.get('payerToken')
  const [invoiceData, setInvoiceData] = useState(null);
  const [rows, setRows] = useState([]);
  const router = useRouter();

  const handlePayInvoiceClick = () => {
    const payerPage = `/payer/onchain-lightning?payerToken=${payerToken}`;
    router.push(payerPage);
  };

  const handlePrint = () => {
    window.print();
  }

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/transactions/get-invoice/${invoiceToken}`,
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
  
        console.log("Server Response:", response.data);
        setInvoiceData(response.data);
        setRows(response.data.items); 
      } catch (error) {
        console.error("Error fetching the invoice:", error.response?.data || error.message);
      }
    };
  
    if (invoiceToken) {
      fetchInvoice();
    }
  }, [invoiceToken]);

  console.log('Current invoiceToken:', invoiceToken);


  return (
    <main className='flex min-h-screen flex-col items-center relative justify-start bg-white lg:bg-background'>
        <AyceLogo className='h-12 w-12 lg:h-16 lg:w-16 mt-12 mb-4 lg:mt-10 lg:mb-10'  />

        <div className='w-full flex flex-col' style={{ maxWidth: '784px' }}>
          <div className='flex flex-col'>
            <div className="rounded-4xl border-line border-2 flex flex-col box-shadow mb-10">
              <div className='flex flex-col items-center justify-center w-full'>

                  <div className='flex w-full justify-between items-center px-10 pt-12'>
                    <h4 className='display'>Invoice #{invoiceData?.invoice_number}</h4>

                    <button className='flex items-center text-primary-default body' onClick={handlePrint}>download PDF
                      <Download className='h-6 w-6'/>
                    </button>
                  </div>

                  <div className='flex justify-between w-full px-10 pt-10 pb-8'>

                    <div className='flex flex-col w-1/2'>
                     <p className='text-body-secondary font-bold body-sm'>Bill to</p>
                     <p className='body text-title-active'>{invoiceData?.recipient_name}</p>
                     <p className='body text-title-active'>{invoiceData?.recipient_email}</p>
                    </div>

                    <div className='flex items-end flex-col w-1/2'>
                      <h3>${invoiceData?.total_due.amount.toFixed(2)}</h3>                      
                      <p className='body text-title-active'>Due: {invoiceData?.due_date}</p>
                    </div>

                  </div>
                  <table className="table-fixed w-full border-none">
                    <thead className='bg-background'>
                      <tr className='bg-background'>
                        <th className="w-1/2 text-left pl-10 py-2 font-bold text-title-active">Item</th>
                        <th className="w-1/6 px-4 py-2 font-bold text-title-active">Quantity</th>
                        <th className="w-1/6 px-4 py-2 font-bold text-title-active">Price</th>
                        <th className="w-1/6 px-4 py-2 font-bold text-title-active">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                          <tr className='relative' key={index}>
                            <td className="pl-10 py-3 text-title-active">
                              {row.name}
                            </td>
                            <td className="px-4 py-2 text-center text-title-active">
                              {row.quantity}
                            </td>
                            <td className="px-4 py-2 text-center text-title-active">
                              {row.price.toFixed(2)}
                            </td>
                            <td className="px-4 py-2 text-center text-title-active">
                              ${(row.price * row.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}

                        {invoiceData?.discount_percentage !== 0 && (
                            <tr className='relative'>
                              <td className='relative text-left pl-10 py-3'>
                                Fee terms 
                              </td>
                              <td className=''></td>
                              <td></td>
                              <td className='text-center relative'>
                                {invoiceData && typeof invoiceData.discount_percentage === 'number' ? 
                                  (invoiceData.discount_percentage < 0 ? 
                                    `-$${Math.abs(invoiceData.discount_percentage).toFixed(2)}` : 
                                    `$${invoiceData.discount_percentage.toFixed(2)}`
                                  ) 
                                  : null  // or a default value if you wish
                                }
                              </td>
                            </tr>
                        )}

                        <tr className='border-t border-line border-b'>
                          <td></td>
                          <td></td>
                          <td className='text-center font-bold body text-title-active py-6'>Total Due</td>
                          <td className='text-center body text-title-active'>${invoiceData?.total_due.amount.toFixed(2)}</td>
                        </tr>
                    </tbody>
                  </table>
              </div>
              {invoiceData && invoiceData.additional_information && invoiceData.additional_information.recipient_address &&
                <div className='flex flex-col w-full px-10 py-4 border-b border-line'>
                  <p className='text-body-secondary font-bold body-sm mb-2'>Recipient’s address</p>
                  <p className='body text-title-active'>{invoiceData.additional_information.recipient_address}</p>
                </div>
              }

              {invoiceData && invoiceData.additional_information && invoiceData.additional_information.your_address &&
                <div className='flex flex-col w-full px-10 py-4 border-b border-line'>
                  <p className='text-body-secondary font-bold body-sm mb-2'>Your address</p>
                  <p className='body text-title-active'>{invoiceData.additional_information.your_address}</p>
                </div>
              }

              {invoiceData && invoiceData.additional_information && invoiceData.additional_information.notes &&
                <div className='flex flex-col w-full px-10 py-4 border-b border-line'>
                  <p className='text-body-secondary font-bold body-sm mb-2'>Notes</p>
                  <p className='body text-title-active'>{invoiceData.additional_information.notes}</p>
                </div>
              }

              <h6 className='display mt-6 lg:mt-10 mb-10 hide-print' onClick={handlePayInvoiceClick}>
                <PrimaryButton text="Pay invoice" />
              </h6>

            </div>
          </div>
        </div>

        <div className='flex items-center mt-auto mb-6 lg:mb-10'>
          <p className='body-sm text-body-secondary mr-1.5'>powered by</p>
          <Logo className='h-6'/>
        </div>

    </main>
  )
  
}

export default PayerInvoicePage;