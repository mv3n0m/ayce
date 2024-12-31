'use client'
import Link from 'next/link';
import ArrowRight from 'src/public/icons/arrow-right.svg'
import Back from 'src/public/icons/back.svg'
import PrimaryButtonFull from '../../../../components/PrimaryButtonFull';
import { useState, useRef, useEffect } from 'react';
import Add from 'src/public/icons/add.svg'
import Download from 'src/public/icons/download.svg'
import Payment from 'src/public/icons/payment.svg'
import Trash from 'src/public/icons/trash.svg'
import Calendar from 'src/public/icons/calendar.svg'
import ArrowDown from 'src/public/icons/arrow-down.svg'
import Copy from 'src/public/icons/copy.svg'
import SecondaryButton from '../../../../components/SecondaryButton';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function CreateInvoicePage() {
  const { data: session, status } = useSession();
  const token = session?.token; // Extract the token from the session

  const [btcRate, setBtcRate] = useState('');

  const [createStep, setCreatestep] = useState(0);
  const [billTo, setBillTo] = useState('');
  const [email, setEmail] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0.0);
  const [amount, setAmount] = useState(0.0);
  const [totalDue, setTotalDue] = useState(0);
  const [totalDueBTC, setTotalDueBTC] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [feeTerms, setFeeTerms] = useState([{fee: 0, termType: 'discount', customFee: ''}]);  // Start with one row with 0 fee to avoid $NaN
  const [recipientAddress, setRecipientAddress] = useState('');
  const [yourAddress, setYourAddress] = useState('');
  const [notes, setNotes] = useState('');
  const textToCopyRef = useRef(null);
  const [invoiceToken, setInvoiceToken] = useState('');
  const [sentInvoice, setSentInvoice] = useState(false);
  const [payerToken, setPayerToken] = useState(''); 

  const handleViewInvoice = () => {
    const url = `${window.location.origin}/payer/invoice?invoiceToken=${invoiceToken}&payerToken=${payerToken}`;
    window.open(url, '_blank');
  }

  const handlePrint = () => {
    window.print();
  }

  const [rows, setRows] = useState([
    { productName: '', quantity: 0, price: 0.0, amount: 0.0 },
  ]);

  const subtotal = rows.reduce((total, row) => total + row.amount, 0);

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    if (field === 'quantity' || field === 'price') {
      newRows[index]['amount'] = newRows[index]['quantity'] * newRows[index]['price'];
    }
    setRows(newRows);
  };

  const handleAddRow = () => {
    event.preventDefault()
    setRows([...rows, { productName: '', quantity: 0, price: 0.0, amount: 0.0 }]);
  };

  const handleRemoveRow = (index) => {
    event.preventDefault()
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };
  
  const handleAddTerm = () => {
    event.preventDefault()
    setFeeTerms([...feeTerms, {fee: 0, termType: 'discount'}]);
  };

  const handleFeeChange = (index, event) => {
    const newFeeTerms = [...feeTerms];
    newFeeTerms[index].fee = event.target.value === '' ? 0 : parseFloat(event.target.value);
    setFeeTerms(newFeeTerms);
  };

  const handleCustomFeeChange = (index, event) => {
    const newFeeTerms = [...feeTerms];
    newFeeTerms[index].customFee = event.target.value;
    setFeeTerms(newFeeTerms);
  };

  const handleTermTypeChange = (index, event) => {
    const newFeeTerms = [...feeTerms];
    newFeeTerms[index].termType = event.target.value;
    setFeeTerms(newFeeTerms);
  };
  
  const handleRemoveTerm = (index) => {
    event.preventDefault()
    const newFeeTerms = [...feeTerms];
    newFeeTerms.splice(index, 1);
    setFeeTerms(newFeeTerms);
  };

  const handleBillToChange = (e) => {
    setBillTo(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleInvoiceNoChange = (e) => {
    setInvoiceNo(e.target.value);
  };

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  // Next step for transfer
  const nextStep = async (event) => {
    event.preventDefault();
    setCreatestep(createStep + 1);
  };

  // Previous step for transfer
  const prevStep = async (event) => {
    event.preventDefault();
    setCreatestep(createStep - 1);
  };

  const copyToClipboard = (e) => {
    navigator.clipboard.writeText(textToCopyRef.current.innerText)
      .then(() => { 
        console.error('copied to clipboard');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
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
    setAmount(quantity * price);
  }, [quantity, price]);

  // Calculate totalDue whenever feeTerms,subtotal or btcRate changes
  useEffect(() => {
    const totalInUSD = feeTerms.reduce((total, term) => {
        const feeAmount = term.fee / 100 * subtotal;

        if (term.termType === 'discount') {
            return total - feeAmount;
        } else if (term.termType === 'tax' || term.termType === 'custom') {
            return total + feeAmount;
        } else {
            return total;
        }
    }, subtotal);

    setTotalDue(totalInUSD); // Always set totalDue in USD

    const btcEquivalent = totalInUSD / btcRate; // Convert total to BTC equivalent
    setTotalDueBTC(btcEquivalent);

  }, [feeTerms, subtotal, btcRate]);

  // API call to create invoice (first step)
  const createInvoice = async (event) => {
    event.preventDefault();
  
    // Calculate total fee amount
    const totalFeeAmount = feeTerms.reduce((total, term) => {
      const feeAmount = term.fee / 100 * subtotal;
  
      if (term.termType === 'discount') {
        return total - feeAmount;
      } else if (term.termType === 'tax' || term.termType === 'custom') {
        return total + feeAmount;
      } else {
        return total;
      }
    }, 0); // placeholder of 0 if no fee
  
    let invoicePayload = {
      "recipient_email": email,
      "recipient_name": billTo,
      "invoice_number": invoiceNo,
      "due_date": dueDate,
      "items": rows.map(row => ({
        "name": row.productName,
        "quantity": row.quantity,
        "price": row.price
      })),
      "total_due": {
        "currency": currency,
        "amount": totalDue,
      },
      "discount_percentage": totalFeeAmount,
    };
  
    if (recipientAddress || yourAddress || notes) {
      invoicePayload.additional_information = {
        "recipient_address": recipientAddress,
        "your_address": yourAddress,
        "notes": notes,
      };
    }
  
    try {
      const invoiceResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/create-invoice`,
        invoicePayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      setCreatestep(createStep + 1);
      setInvoiceToken(invoiceResponse.data['invoice-token']);
      console.log(invoicePayload);
      console.log("Invoice Server Response:", invoiceResponse.data);
  
      // create transaction
      let chargePayload = {
        amount: totalDue,
        description: `Invoice #${invoiceNo}`,
      };
  
      const chargeResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/pos/create-transaction`,
        chargePayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      console.log("Charge Server Response:", chargeResponse.data);
  
      // save payerToken
      if (chargeResponse.data) {
        const token = chargeResponse.data.token;
        setPayerToken(token);
      } else {
        console.error("Received unexpected data from the server during charge");
      }
  
    } catch (error) {
      console.error("Error during invoice creation and charge:", error.response?.data || error.message);
    }
  };
  

  // API call to send invoice (second step)
  const sendInvoice = async (event) => {
    event.preventDefault();

    // Encode the invoiceLink
    const invoiceLink = `${window.location.origin}/payer/invoice?invoiceToken=${invoiceToken}&payerToken=${payerToken}`;
    const encodedInvoiceLink = encodeURIComponent(invoiceLink);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/send-invoice/${invoiceToken}?invoice_link=${encodedInvoiceLink}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setSentInvoice(true);
      console.log("Server Response:", response.data);
    } catch (error) {
      console.error("Error sending the invoice:", error.response?.data || error.message);
    }
  };

  // API call to cancel/void invoice
  const cancelInvoice = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/cancel-invoice/${invoiceToken}
        `,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setCreatestep(0);
      console.log("Server Response:", response.data);
    } catch (error) {
      console.error("Error cancelling the invoice:", error.response?.data || error.message);
    }
  };
  
  return (
    <div className='flex mx-2 lg:mx-16 mt-24 lg:mt-32 w-full sidemenu-padding'>
      <div className='flex flex-col w-full relative'>

        <div className='lg:-top-22 lg:left-0 relative lg:absolute flex items-center mb-4 mx-4 lg:mx-0 lg:mb-0'>
          <Link href='/dashboard/payments'>
          <Back className='h-6 w-6 text-title-active mr-5 flex lg:hidden' />
          </Link>
          <Link href="/dashboard/payments/" className='text-body-secondary body hover:text-title-active'>Payments</Link>
          <ArrowRight className='h-6 w-6 text-title-active mx-1 lg:mx-2' />
          <Link href="/dashboard/payments/billing-invoice" className='text-body-secondary body hover:text-title-active'>Billing/Invoice</Link>
          <ArrowRight className='h-6 w-6 text-title-active mx-1 lg:mx-2' />
          {createStep === 0 &&
          <p className='text-title-active body'>Create invoice</p>
          }
          {createStep === 1 &&
          <p className='text-title-active body'>Details</p>
          }
        </div>

        {createStep === 0 &&
        <h4 className='display mb-1 lg:mb-10 hidden lg:flex'>Create invoice</h4>
        }

        {createStep === 1 &&
        <div className='flex items-center justify-between w-full mb-1 lg:mb-10'>
          <div className='flex items-center'>
            <h4 className='display'>Invoice #{invoiceNo}</h4>
            <div className='bg-states-pendingLight rounded-2xl ml-4'>
              <p className='body text-states-pendingDark body-xs py-0.5 px-2'>Unpaid</p>
            </div>
          </div>
          <div className='flex'>
            <button onClick={handleViewInvoice} className='flex items-center text-primary-default body mr-10'>View invoice
              <Payment className='h-6 w-6'/>
            </button>
            <button className='flex items-center text-primary-default body' onClick={handlePrint}>download PDF
              <Download className='h-6 w-6'/>
            </button>
          </div>
        </div>
        }

        {createStep === 0 && (
          <form className='w-full flex flex-col' onSubmit={createInvoice}>
            <div className='flex flex-col'>
              <div className="rounded-4xl border-background border-2 flex flex-col box-shadow">
                <div className='flex flex-col items-center justify-center w-full'>

                    <p className='flex flex-end body text-body-secondary ml-auto py-4 px-10'></p>

                    <div className='flex w-full px-10 mb-8'>

                      <div className='flex flex-col w-1/2'>
                        <div className='flex mb-4 lg:mb-2'>
                          <label htmlFor="" className='body-sm font-bold text-body-secondary pr-8 py-4 whitespace-nowrap'>Bill to</label>
                          <input className='bg-background p-4 w-full body-sm rounded-3xl'
                          type={"text"}
                          required
                          placeholder="Enter recipient’s name"
                          value={billTo}
                          onChange={handleBillToChange}
                        />
                        </div>
                        <div className='flex'>
                          <label htmlFor="" className='body-sm font-bold text-body-secondary pr-8 py-4 whitespace-nowrap'>Email</label>
                          <input className='bg-background p-4 w-full body-sm rounded-3xl'
                          type={"email"}
                          required
                          placeholder="example@example.com"
                          value={email}
                          onChange={handleEmailChange}
                        />
                        </div>
                      </div>

                      <div className='flex flex-col w-1/2'>
                        <div className='flex mb-4 lg:mb-2'>
                          <label htmlFor="" className='body-sm font-bold text-body-secondary px-8 py-4 whitespace-nowrap'>Invoice No.</label>
                          <input className='bg-background p-4 w-full body-sm rounded-3xl'
                          type={"text"}
                          required
                          placeholder="123456789"
                          value={invoiceNo}
                          onChange={handleInvoiceNoChange}
                          maxLength={18}
                        />
                        </div>
                        <div className='flex'>
                          <label htmlFor="" className='body-sm font-bold text-body-secondary pl-8 pr-10.5 py-4 whitespace-nowrap'>Due Date</label>
                          <div className='relative w-full'>
                            <input className='bg-background p-4 w-full body-sm rounded-3xl'
                            type="date"
                            required
                            value={dueDate}
                            onChange={handleDueDateChange}
                            />
                            <Calendar className='h-6 w-6 text-body-primary absolute right-4 top-4'></Calendar>
                          </div>
                        </div>
                      </div>
                    </div>
                    <table className="table-fixed w-full border-none">
                      <thead className='bg-background'>
                        <tr className=''>
                          <th className="w-1/2 text-left pl-10 py-2 font-bold text-title-active">Item</th>
                          <th className="w-1/6 px-4 py-2 font-bold text-title-active">Quantity</th>
                          <th className="w-1/6 px-4 py-2 font-bold text-title-active">Price</th>
                          <th className="w-1/6 px-4 py-2 font-bold text-title-active">Amount</th>
                        </tr>
                      </thead>
                      <tbody className=''>
                        {rows.map((row, index) => (
                          <tr className='relative' key={index}>
                            <td className="pl-10 py-3">
                              <input className='bg-background p-4 w-full body-sm rounded-3xl'
                                type="text"
                                name='productName'
                                required
                                placeholder="Enter product name"
                                value={row.productName}
                                onChange={(e) => handleInputChange(index, 'productName', e.target.value)}
                              />
                            </td>
                            <td className="px-4 py-2 w-20 text-center">
                              <input className='bg-background p-4 mx-auto w-20 body-sm rounded-3xl'
                                type="number"
                                name='quantity'
                                required
                                placeholder='0'
                                value={row.quantity || undefined}
                                onChange={(e) => handleInputChange(index, 'quantity', Number(e.target.value))}
                              />
                            </td>
                            <td className="px-4 py-2 w-20 text-center">
                              <input className='bg-background p-4 mx-auto w-20 body-sm rounded-3xl'
                                type="number"
                                name='price'
                                placeholder='$0.00'
                                required
                                value={row.price || undefined}
                                onChange={(e) => handleInputChange(index, 'price', Number(e.target.value))}
                              />
                            </td>
                            <td className="px-4 pt-6 flex items-center justify-center">
                              <div className='flex mr-2 body text-title-active'>
                                ${row.amount.toFixed(2)}
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
                              <p className='font-bold body text-primary-default'>Add item</p>
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td className="text-center py-3 body text-title-active">Subtotal</td>
                          <td className='text-center py-3 px-4 text-title-active'>${subtotal.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>

                    <table className="table-fixed w-full border-none">
                    <thead>
                      <tr>
                        <th className="w-1/2 "/>
                        <th className="w-2/6 "/>
                        <th className="w-1/6 "/>
                      </tr>
                    </thead>
                    <tbody>
                      {feeTerms.map((term, index) => (
                        <tr className='relative' key={index}>
                          <td className='pl-18'></td>
                          {term.termType === 'custom' ? (
                            
                            <td className='relative text-center pl-10'>
                              <input 
                                type="text" 
                                className='bg-background p-4 w-full body-sm rounded-2xl my-3 text-title-active'
                                value={term.customFee || ''}
                                placeholder="Input custom fee"
                                onChange={(event) => handleCustomFeeChange(index, event)}
                              />
                            </td>
                          ) : (
                            <td className='relative text-center pl-10'>
                              <select 
                                name="feeterm" 
                                className='bg-background p-4 w-full body-sm rounded-2xl my-3 text-title-active'
                                value={term.termType}
                                onChange={(event) => handleTermTypeChange(index, event)}
                              >
                                <option value="discount">Discount</option>
                                <option value="tax">Tax</option>
                                <option value="custom">Custom</option>
                              </select>
                              <ArrowDown className='h-6 w-6 text-title-active absolute right-4 top-7'/>
                            </td>
                          )}
                          <td className='text-center relative'>
                            <input className='bg-background w-20 p-4 mx-auto body-sm rounded-3xl'
                                type="number"
                                placeholder='%'
                                name='fee'
                                min="0"
                                max="100"
                                value={term.fee || undefined}
                                onChange={(event) => handleFeeChange(index, event)}
                              />
                          </td>
                          <td className='absolute right-2 top-6'>
                            <button onClick={() => handleRemoveTerm(index)}>
                              <Trash className='h-6 w-6 text-primary-default'/>                              
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td></td>
                        <td></td>
                        <td className='py-3'>
                          <button className='flex items-center pr-10' onClick={handleAddTerm}>
                            <Add className='h-6 w-6 min-h-fit min-w-fit text-primary-default mr-2'/>
                            <p className='font-bold body text-primary-default'>Add fee term</p>
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td className="text-center py-3 font-bold">
                          <div className='flex justify-end items-center'>
                            <div className='pt-1'>
                              <input type="checkbox" className='check h-full' id='myCheckbox' />
                              <label className='terms' htmlFor="myCheckbox"></label>
                            </div>
                            <p className='body font-bold text-primary-default'>Include processing fee</p>
                          </div>

                        </td>
                        <td className='text-center py-3 px-4 text-title-active'>$0.00</td>
                      </tr>

                        <tr className=''>
                          <td></td>
                          <td className="text-center py-3">
                            <div className='flex justify-end items-center'>
                              <p className='font-bold text-title-active body mr-4'>Total Due</p>
                              <div className='relative'>
                                <select 
                                  name="duecurrency" 
                                  className='bg-background p-4 w-24 body-sm rounded-2xl my-3 text-title-active'
                                  value={currency}
                                  onChange={handleCurrencyChange}
                                >
                                  <option value="USD">USD</option>
                                  <option value="BTC">BTC</option>
                                </select>
                                <ArrowDown className='h-6 w-6 text-title-active absolute right-4 top-7'/>
                              </div>
                            </div>

                          </td>
                          <td className='text-center py-3 px-4 text-title-active'>
                              {currency === 'USD'
                                ? `$${totalDue.toFixed(2)}`
                                : `${totalDueBTC.toFixed(8)} BTC`}
                          </td>
                        </tr>
                    </tbody>
                  </table>
                </div>

                <div className='mt-10'>
                  <div className='border-t border-line w-full px-10 pb-10'>
                    <p className='body-sm font-bold text-title-active py-4'>Additional information</p>
                    <div className='grid grid-cols-2 grid-rows-1 gap-x-4'>
                      <input className='bg-background p-4 w-full body-sm rounded-3xl'
                        type="text"
                        name='recipientaddress'
                        placeholder="Recipient’s address (Optional)"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                      />

                      <input className='bg-background p-4 w-full body-sm rounded-3xl'
                        type="text"
                        name='youraddress'
                        placeholder="Your address (Optional)"
                        value={yourAddress}
                        onChange={(e) => setYourAddress(e.target.value)}
                      />
                    </div>

                    <textarea className='bg-background p-4 h-20 w-full body-sm rounded-3xl mt-4'
                      name="notes" 
                      placeholder='Notes (Optional)'
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      >
                    </textarea>
                  </div>
                </div>
              </div>
              <h6 className='display max-w-fit ml-auto mt-6 mb-22' >
                <PrimaryButtonFull text="Create invoice" />
              </h6>
            </div>
          </form>
        )}

        {createStep === 1 && (
        <div className='w-full flex flex-col' onSubmit={nextStep}>
          <div className='flex flex-col'>
            <div className="rounded-4xl border-background border-2 flex flex-col box-shadow mb-10">
              <div className='flex flex-col items-center justify-center w-full'>

                  <div className='flex justify-between w-full px-10 pt-10 pb-8'>

                    <div className='flex flex-col w-1/2'>
                     <p className='text-body-secondary font-bold body-sm'>Bill to</p>
                     <p className='body text-title-active'>{billTo}</p>
                     <p className='body text-title-active'>{email}</p>
                    </div>

                    <div className='flex items-end flex-col w-1/2'>
                      <h3>${totalDue.toFixed(2)}</h3>                      
                      <p className='body text-title-active'>Due: {dueDate}</p>
                    </div>

                  </div>
                  <table className="table-fixed w-full border-none">
                    <thead className='bg-background'>
                      <tr className=''>
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
                              {row.productName}
                            </td>
                            <td className="px-4 py-2 text-center text-title-active">
                              {row.quantity}
                            </td>
                            <td className="px-4 py-2 text-center text-title-active">
                              {row.price.toFixed(2)}
                            </td>
                            <td className="px-4 py-2 text-center text-title-active">
                              ${row.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}

                        {feeTerms.map((term, index) => (
                          <tr className='relative' key={index}>
                            <td className='relative text-left pl-10 py-3'>
                              {term.termType === 'custom' ? term.customFee.replace(/ /g, '\u00A0') : term.termType.charAt(0).toUpperCase() + term.termType.slice(1)}
                            </td>
                            <td className=''></td>
                            <td className='text-center relative'>
                              {term.fee.toFixed(2)}
                              <span className='absolute transform translate-x-1'>%</span>
                            </td>
                            <td className='text-center relative'>
                              {term.termType === 'discount' ? 
                                <><span className='absolute transform -translate-x-4'>-</span>${
                                  (term.fee * subtotal / 100).toFixed(2)}</> :
                                `$${(term.fee * subtotal / 100).toFixed(2)}`
                              }
                            </td>
                          </tr>
                        ))}

                        <tr className='border-t border-line border-b'>
                          <td></td>
                          <td></td>
                          <td className='text-center font-bold body text-title-active py-6'>Total Due</td>
                          <td className='text-center body text-title-active'>${totalDue.toFixed(2)}</td>
                        </tr>
                    </tbody>
                  </table>
              </div>
              {recipientAddress &&
              <div className='flex flex-col w-full px-10 py-4 border-b border-line'>
                <p className='text-body-secondary font-bold body-sm mb-2'>Recipient’s address</p>
                <p className='body text-title-active'>{recipientAddress}</p>
              </div>
              }

              {yourAddress &&
              <div className='flex flex-col w-full px-10 py-4 border-b border-line'>
                <p className='text-body-secondary font-bold body-sm mb-2'>Your address</p>
                <p className='body text-title-active'>{yourAddress}</p>
              </div>
              }

              {notes &&
              <div className='flex flex-col w-full px-10 py-4 border-b border-line'>
                <p className='text-body-secondary font-bold body-sm mb-2'>Notes</p>
                <p className='body text-title-active'>{notes}</p>
              </div>
              }

              <div className='flex flex-col w-full px-10 py-4 border-b border-line'>
                <p className='text-body-secondary font-bold body-sm mb-2'>Share a permanent link to this invoice</p>
                <div className='flex items-center p-4 bg-background max-w-fit rounded-3xl'>
                  <p ref={textToCopyRef} className='body text-title-active mr-5 overflow-x-auto whitespace-nowrap'>{window.location.origin}/payer/invoice?invoiceToken={invoiceToken}</p>
                  <button onClick={copyToClipboard}>
                    <Copy className='h-6 w-6 text-body-primary'/>
                  </button>
                </div>
              </div>

              <div className='flex justify-between items-center px-10 py-10'>
                <button onClick={cancelInvoice} className='text-primary-default hide-print'>Void invoice</button>
                <div className='flex items-center'>
                  { sentInvoice && 
                  <p className='text-body-secondary mr-4'>Last sent: {`${new Date().toLocaleString('default', { month: 'short' })} ${new Date().getDate()}, ${new Date().getFullYear()}`}</p>
                  }
                  <div onClick={sendInvoice} className='max-w-fit mx-auto lg:flex hidden mr-2'>
                    <SecondaryButton text={sentInvoice ? 'Resend invoice' : 'Send invoice'}/>
                  </div>

                  <div className='max-w-fit mx-auto lg:flex hidden'>
                    <button onClick={prevStep} className='border-primary-default border-2 font-bold text-primary-default py-2 px-6 w-full flex justify-center noshadow-button'>Edit invoice</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        </div>
    </div>
  )
}
