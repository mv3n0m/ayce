'use client'
import Link from 'next/link';
import ArrowRight from 'src/public/icons/arrow-right.svg'
import Back from 'src/public/icons/back.svg'
import PrimaryButtonFull from '../../../../components/PrimaryButtonFull';
import PrimaryButton from '../../../../components/PrimaryButton';
import { useState, useRef, useEffect } from 'react';
import Add from 'src/public/icons/add.svg'
import Download from 'src/public/icons/download.svg'
import Document from 'src/public/icons/document.svg'
import Close from 'src/public/icons/close.svg'
import Logomark from 'src/public/logos/logomark-color.svg'
import Trash from 'src/public/icons/trash.svg'
import Success from 'src/public/icons/success-emblem.svg'
import Upload from 'src/public/icons/upload.svg'
import Contact from 'src/public/icons/contact.svg'
import ArrowDown from 'src/public/icons/arrow-down.svg'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import OtpInput from 'react-otp-input';
import Papa from 'papaparse';

export default function MassPayout() {
  const { data: session, status } = useSession();
  const token = session?.token; // Extract the token from the session

  const [createStep, setCreatestep] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [notes, setNotes] = useState('');
  const [btcRate, setBtcRate] = useState('');

  const [modalOpen, modalIsOpen] = useState(false);
  const [modalStep, setModalStep] = useState(0);

  const [payoutToken, setPayoutToken] = useState('');
  const [otp, setOtp] = useState('');

  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
       Papa.parse(file, {
          header: true,
          complete: (result) => {
             const parsedData = result.data.map((item) => ({
                type: item.TYPE.toLowerCase(),
                recipient: item.ADDRESS,
                source: item.SOURCE_WALLET,
                amount: parseFloat(item.AMOUNT),
                currency: item.CURRENCY
             }));
             setRows(parsedData);
          }
       });
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

  // Close modal
  const closeModal = () => {
    modalIsOpen(false);
  };

  const [rows, setRows] = useState([
    { type: 'btc_onchain', recipient: '', source: 'BTC', amount: 0.0, currency: 'USD' },
  ]);

  const subtotal = rows.reduce((total, row) => {
    switch(row.currency) {
      case 'BTC':
        return total + (row.amount * btcRate);
      case 'SAT':
        return total + ((row.amount / 100_000_000) * btcRate); // Convert SATs to BTC first, then to the desired currency
      default:
        return total + row.amount;}
  }, 0);

  useEffect(() => {
    setTotalDue(subtotal);
  }, [rows]);

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    if (field === 'amount') {
      newRows[index][field] = Number(value);
    } else {
      newRows[index][field] = value;
    }
    setRows(newRows);
  };

  const handleAddRow = () => {
    event.preventDefault()
    setRows([...rows, { type: 'btc_onchain', recipient: '', source: 'BTC', amount: 0.0, currency: 'USD' }]);
  };

  const handleRemoveRow = (index) => {
    event.preventDefault()
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  // Next step for transfer
  const nextStep = async (event) => {
    event.preventDefault();
    setCreatestep(createStep + 1);
  };

  // previous step for transfer
  const previousStep = async (event) => {
    event.preventDefault();
    setCreatestep(createStep - 1);
    setModalStep(0);
  };

  // first API call to create payout
  const createPayout = async (event) => {
    event.preventDefault();
  
    const records = rows.map(row => ({
      address_type: row.type,
      address: row.recipient,
      amount: row.amount,
      currency: row.currency,
      source_wallet: row.source
    }));
  
    const payoutPayload = {
      records: records
    };
  
    try {
      const payoutResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/payouts`,
        payoutPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      console.log("Payout Server Response:", payoutResponse.data);

      // Setting the payoutToken
      if (payoutResponse.data && payoutResponse.data.token) {
        setPayoutToken(payoutResponse.data.token);
      }

      setCreatestep(createStep + 1);
    } catch (error) {
      console.log(records)
      console.error("Error during payout creation:", error.response?.data || error.message);
    }
  };

  // 2nd useEffect API call when otp is 6
  useEffect(() => {
    if (otp.length === 6) {
      // Building the request payload with both token and otp
      const otpPayload = {
        token: payoutToken,
        otp: otp
      };
  
      // Making the POST API call
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/payouts/otp-confirm`,
        otpPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )
      .then(response => {
        // On success
        console.log("OTP Confirmation Response:", response.data);
        setModalStep(1);
      })
      .catch(error => {
        // Handle the error here (e.g., show an error message to the user)
        console.error("Error during OTP confirmation:", error.response?.data || error.message);
      });
    }
  }, [otp, token, payoutToken]);  // Updated dependency array
  
  return (
    <div className='flex mx-2 lg:mx-16 mt-24 lg:mt-32 w-full sidemenu-padding'>
      <div className='flex flex-col w-full relative'>

        <div className='lg:-top-22 lg:left-0 relative lg:absolute flex items-center mb-4 mx-4 lg:mx-0 lg:mb-0'>
          <Link href='/dashboard/payments'>
          <Back className='h-6 w-6 text-title-active mr-5 flex lg:hidden' />
          </Link>
          <Link href="/dashboard/payments/" className='text-body-secondary body hover:text-title-active'>Payments</Link>
          <ArrowRight className='h-6 w-6 text-title-active mx-1 lg:mx-2' />
          <Link href="/dashboard/payments/payouts" className='text-body-secondary body hover:text-title-active'>Payouts</Link>
          <ArrowRight className='h-6 w-6 text-title-active mx-1 lg:mx-2' />
          {createStep === 0 &&
          <p className='text-title-active body'>Mass Payouts</p>
          }
          {createStep === 1 &&
          <p className='text-title-active body'>Details</p>
          }
        </div>

        <div className='flex justify-between items-center'>
        <h4 className='display mb-1 lg:mb-10 hidden lg:flex'>Mass payout</h4>
        <Link href="" className='text-primary-default flex items-center lg:mb-10'>
          <p>Learn more</p>
          <Document className='text-primary-default h-6 w-6' />
        </Link>
        </div>

        {createStep === 0 && (
          <form className='w-full flex flex-col' onSubmit={createPayout}>
            <div className='flex flex-col'>
              <div className="rounded-4xl border-background border-2 flex flex-col box-shadow">
                <div className='flex flex-col justify-items-end items-end w-full'>

                    <div className='flex items-center pt-6 pb-4 pr-11'>
                    <label className="flex items-center mr-4">
                      <span className='text-primary-default'>Upload CSV File</span>
                      <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={handleCSVUpload}
                          accept=".csv"
                      />
                      <Upload className='h-5 w-5 text-primary-default' />
                    </label>

                      <a href="/template.csv" download className='flex items-center'>
                        <p className='text-primary-default'>CSV Template</p>
                        <Download className='h-5 w-5 text-primary-default' />
                      </a>
                    </div>

                    <table className="table-fixed w-full border-none">
                      <thead className='bg-background w-full'>
                        <tr className='w-full'>
                          <th className="w-1/5 text-left pl-10 py-2 font-bold text-title-active">Type</th>
                          <th className="w-2/5 px-4 py-2 font-bold text-title-active">Recipient</th>
                          <th className="w-1/5 px-4 py-2 font-bold text-title-active">Source</th>
                          <th className="w-1/5 text-right p-4 py-2 font-bold text-title-active">Amount</th>
                          <th className="w-0 px-4 py-2 font-bold text-title-active"></th>
                        </tr>
                      </thead>
                      <tbody className=''>
                        {rows.map((row, index) => (
                          <tr className='relative' key={index}>

                            <td className='relative text-center pl-10 pr-2'>
                              <select 
                                name="type" 
                                className='bg-background py-3.5 px-4 w-full body-sm rounded-3xl my-3 text-title-active'
                                value={row.type}
                                onChange={(e) => handleInputChange(index, 'type', e.target.value)}
                              >
                                <option value="btc_onchain">BTC Address</option>
                                <option value="email">Email</option>
                              </select>
                              <ArrowDown className='h-6 w-6 text-title-active absolute right-4 top-7'/>
                            </td>

                            <td className="px-2 ">
                              <div className='relative'>
                                <input className='bg-background py-3.5 pl-4 pr-12 w-full body-sm rounded-3xl'
                                  type="text"
                                  name='recipient'
                                  required
                                  placeholder="Address"
                                  value={row.recipient}
                                  onChange={(e) => handleInputChange(index, 'recipient', e.target.value)}
                                />
                                <Contact className='h-6 w-6 text-body-primary absolute top-3 right-4' />
                              </div>
                            </td>
                            
                            <td className='px-2 relative text-center '>
                              <select 
                                name="source" 
                                className='bg-background py-3.5 px-4 w-full body-sm rounded-3xl my-3 text-title-active'
                                value={row.source}
                                onChange={(e) => handleInputChange(index, 'source', e.target.value)}
                              >
                                <option value="BTC">BTC Wallet</option>
                                <option value="USD">USD Wallet</option>
                              </select>
                              <ArrowDown className='h-6 w-6 text-title-active absolute right-4 top-7'/>
                            </td>

                            <td className="px-2 w-full text-center">
                              <input className=' bg-background py-3.5 px-4 mx-0 my-3 body-sm rounded-3xl w-full'
                                type="number"
                                name='amount'
                                placeholder='0.00'
                                required
                                value={row.amount || undefined}
                                onChange={(e) => handleInputChange(index, 'amount', Number(e.target.value))}
                              />
                              <div className='absolute right-10 w-20 top-1 text-center'>
                                <select 
                                  name="currency" 
                                  className='bg-background font-bold meta py-3.5 px-4 w-full min-w-fit body-sm rounded-r-3xl my-3 text-title-active'
                                  value={row.currency || undefined}
                                  onChange={(e) => handleInputChange(index, 'currency', (e.target.value))}
                                >
                                  <option value="USD">USD</option>
                                  <option value="BTC">BTC</option>
                                  {/* <option value="SAT">SAT</option> */}
                                </select>
                                <ArrowDown className='h-6 w-6 text-title-active absolute right-2 top-5.5'/>
                              </div>
                            </td>

                            <td className='absolute right-2 top-6'>
                              <button onClick={() => handleRemoveRow(index)}>
                                <Trash className='h-6 w-6 text-primary-default'/>                              
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr className='border-b border-t border-line'>
                          <td className='pl-10 py-3'>
                            <button onClick={handleAddRow} className='flex items-center'>
                              <Add className='h-6 w-6 text-primary-default mr-2'/>
                              <p className='font-bold body text-primary-default'>Add payout</p>
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td className='text-center py-3.5 px-4 text-title-active'>
                            <div className="flex justify-between items-start">
                             <p className='font-bold'>Total</p>
                             <div className='flex flex-col items-end'>
                              <p className=''>${new Intl.NumberFormat().format(subtotal.toFixed(2))}</p>
                              <p className='body-sm text-body-secondary'>{(subtotal / btcRate).toFixed(8)} BTC</p>
                             </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                </div>

                <div className=''>
                  <div className='border-t border-line w-full px-10'>
                    <textarea className='bg-background p-4 h-20 w-full body-sm rounded-3xl mt-4 mb-20'
                      name="notes" 
                      placeholder='Notes (Optional)'
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      >
                    </textarea>
                  </div>
                </div>
              </div>
              <h6 className='display max-w-fit ml-auto my-8' >
                <PrimaryButtonFull text="Continue" />
              </h6>
            </div>
          </form>
        )}

    {createStep === 1 && (
      <div className='w-full flex flex-col'>
        <div className='flex flex-col'>
          <div className="rounded-4xl border-line border-2 flex flex-col box-shadow mb-10">
            <div className='flex flex-col items-center justify-center w-full'>
              <div className='flex justify-between w-full px-10 pt-10'>
              </div>
              <table className="table-fixed w-full border-none">
                <thead className='bg-background'>
                  <tr className=''>
                    <th className="w-1/4 text-left pl-10 py-2 font-bold text-title-active">Type</th>
                    <th className="w-1/4 text-left px-4 py-2 font-bold text-title-active">Recipient</th>
                    <th className="w-1/4 px-4 py-2 font-bold text-title-active">Source</th>
                    <th className="w-1/4 text-right pr-10 py-2 font-bold text-title-active">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr className='relative' key={index}>
                      <td className="pl-10 py-2 text-title-active">
                        {row.type === "btc_onchain" ? "BTC Onchain" : 
                        row.type === "email" ? "Email" : 
                        row.type}
                      </td>
                      <td className="px-4 py-2 text-left text-title-active break-words">
                        {row.recipient}
                      </td>
                      <td className="px-4 py-2 text-center text-title-active">
                        {row.source}
                      </td>
                      <td className="pr-10 py-2 text-right text-title-active">
                          {row.currency === 'USD' 
                              ? `$${row.amount.toFixed(2)}` 
                              : `${row.amount.toFixed(8)} ${row.currency}`}
                      </td>
                    </tr>
                  ))}

                  <tr className='border-t'>
                    <td></td>
                    <td></td>
                    <td className='font-bold text-center'>Total</td>
                    <td className='text-center py-3.5 px-4 text-title-active pr-10'>
                      <div className='flex flex-col items-end'>
                        <p className=''>${new Intl.NumberFormat().format(subtotal.toFixed(2))}</p>
                        <p className='body-sm text-body-secondary'>{(subtotal / btcRate).toFixed(8)} BTC</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {notes &&
            <div className='flex flex-col w-full px-10 py-4'>
              <p className='text-body-secondary font-bold body-sm mb-2'>Notes</p>
              <p className='body text-title-active'>{notes}</p>
            </div>
            }
          </div>
          <div className='flex justify-end'>
            <button className='text-primary-default' onClick={previousStep}>Go back</button>
            <h6 className='display max-w-fit ml-4 my-0' onClick={() => modalIsOpen(true)}>
              <PrimaryButtonFull text="Continue" />
            </h6>
          </div>
        </div>
      </div>
    )}

        {modalOpen && (
            <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-25 z-10">
            <div className='bg-white modal-width lg:rounded-3xl p-6 lg:p-10 flex flex-col items-center justify-start z-20 relative'>
              
              {modalStep === 0 ? (
                <>
                  <Logomark className='h-12 w-12 mb-10 hidden lg:flex' />
                  <h5 className='text-title-active font-bold mb-4'>Enter the 6-digit code from you verification email</h5>
                  <p className='text-body-secondary body mb-4'>An email with a verification code was just sent to {session?.user?.emailaddress}</p>
                  <form className='w-full'>
                    <div className='mb-4 w-full'>
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      renderSeparator={<span> </span>}
                      renderInput={(props) => <input {...props} className="otp-input" />}
                      containerStyle={{ 
                        display: 'flex', 
                        justifyContent: 'center',
                      }}
                      inputStyle={{
                        width: '56px',
                        height: '64px',
                        margin: '0 5px',
                        padding: '16px',
                        fontSize: '24px',
                        background: 'white',
                        borderRadius: '16px',
                        border: '1px solid #ccd5da',
                      }}
                    />
                    </div>
                    <div className='flex flex-col items-center justify-start'>
                    <button className='text-primary-default body mb-4 lg:mb-10'>Resend code</button>
                    <button className='text-primary-default body'>Or use authenticator app</button>
                    </div>
                  </form>
                </>
              ) : (
                <div className='flex flex-col items-center'>
                  <Success className='mt-4 mb-4 lg:mb-10 h-24 w-24 lg:h-30 lg:w-30' />
                  <h5 className='text-title-active font-bold'>Mass payout completed!</h5>
                  <div className='border-b border-line w-full my-6'></div>
                  <Link href='/dashboard/activities' className='w-full'>
                    <h6 className='display w-full mb-4'>
                      <PrimaryButtonFull text="View activity"/>
                    </h6>
                  </Link>
                  <Link href='/dashboard/payments/payouts' className='text-primary-default body'>Back to Payouts</Link>
                </div>
              )}

              {/* close button */}
              <button onClick={closeModal} className='absolute right-2 top-2 lg:-right-8 lg:-top-8'>
                <div className='h-8 w-8 bg-white rounded-full flex justify-center items-center'>
                  <Close className='h-6 w-6 text-primary-default' />
                </div>
              </button>
            </div>
          </div>
        )}

        </div>
    </div>
  )
}
