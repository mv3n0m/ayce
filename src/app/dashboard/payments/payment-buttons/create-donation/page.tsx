'use client'
import Link from 'next/link';
import ArrowRight from 'src/public/icons/arrow-right.svg'
import Back from 'src/public/icons/back.svg'
import PrimaryButtonFull from '../../../../components/PrimaryButtonFull';
import { useState, useRef } from 'react';
import Add from 'src/public/icons/add2.svg'
import ArrowDown from 'src/public/icons/arrow-down.svg'
import ArrowUp from 'src/public/icons/arrow-up.svg'
import Edit from 'src/public/icons/edit.svg'
import Copy from 'src/public/icons/copy.svg'
import PayBtc from 'src/public/icons/pay-with-bitcoin.svg'
import SendLg from 'src/public/icons/send-48px.svg'
import Trash from 'src/public/icons/trash.svg'
import Close from 'src/public/icons/close.svg'
import Payment from 'src/public/icons/payment.svg'


export default function CreateDonationPage() {
  const [chainTabState, setChainTabState] = useState('link');
  const [createStep, setCreatestep] = useState(0);
  const textToCopyRef = useRef(null);
  const [product, setProduct] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('$');
  const [discountType, setDiscountType] = useState('');
  const [discountNumber, setDiscountNumber] = useState('');
  const [successURL, setSuccessURL] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [sliderValue, setSliderValue] = useState(50);
  const [showOptions, setShowOptions] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  const [customQuestions, setCustomQuestions] = useState([]);

  const addQuestion = () => {
    setCustomQuestions([...customQuestions, { text: customQuestion }]);
    setCustomQuestion("");
  }

  const removeQuestion = (questionIndex) => {
    setCustomQuestions(customQuestions.filter((_, index) => index !== questionIndex));
  }

  const toggleOptions = () => {
    event.preventDefault();
    setShowOptions(!showOptions);
  };

  const copyToClipboard = (e) => {
    navigator.clipboard.writeText(textToCopyRef.current.innerText)
      .then(() => { 
        // Success!
        console.error('copied to clipboard');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };


  // Event handler to update state
  const handleChainTabChange = (e) => {
    setChainTabState(e.target.value);
  };

  // Next step for transfer
  const nextStep = async (event) => {
    event.preventDefault();
    setCreatestep(createStep + 1);
  };

  // Event handlers to update state
  const handleProductChange = (e) => {
    setProduct(e.target.value);
  };
  
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleDiscountTypeChange = (e) => {
    setDiscountType(e.target.value);
  };

  const handleDiscountNumberChange = (e) => {
    setDiscountNumber(e.target.value);
  };

  const handleSuccessURLChange = (e) => {
    setSuccessURL(e.target.value);
  };

  const handleDiscountCodeChange = (e) => {
    setDiscountCode(e.target.value);
  };

  const handleSliderChange = (e) => {
    setSliderValue(e.target.value);
  };

  const handleCustomQuestionChange = (e) => {
    setCustomQuestion(e.target.value);
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
          <Link href="/dashboard/payments/payment-buttons" className='text-body-secondary body hover:text-title-active'>Payment Buttons</Link>
          <ArrowRight className='h-6 w-6 text-title-active mx-1 lg:mx-2' />
          <p className='text-title-active body'>Create Donation</p>
        </div>

        {createStep === 0 &&
        <h4 className='display mb-1 lg:mb-10 hidden lg:flex'>Create donation</h4>
        }

        {createStep === 1 &&
        <div className='flex justify-between'>
        <h4 className='display mb-1 lg:mb-10 hidden lg:flex'>Donation</h4>
        <Link href="" className='text-primary-default flex items-center lg:mb-10'>
          <p>View donation</p>
          <Payment className='text-primary-default h-6 w-6' />
        </Link>
        </div>
        }

        {createStep === 0 && (
          <form className='w-full flex flex-col' onSubmit={nextStep}>
            <div className='flex flex-col'>
              <div className="rounded-4xl border-background border-2 flex flex-col payment-create p-4 lg:px-10 lg:py-10 mx-auto box-shadow">
                <div className='flex flex-col items-center justify-center w-full'>
      
                    <input 
                    id='add'
                    type="file" 
                    className='hidden'
                    />
                    <label htmlFor="add">
                    <div className='border-line bg-background rounded-full h-16 w-16 flex items-center justify-center mx-auto cursor-pointer'>
                      <Add className='text-primary-default cursor-pointer h-6 w-6'/>
                    </div>
                    </label>
                    <p className='body-sm text-body-secondary mt-2 text-center mb-4'>Upload an image (Optional)</p>
                    <label htmlFor="" className='hidden'>Title (e.g. Donation to XYZ Org)</label>
                    <input className='bg-background p-4 w-full body rounded-3xl mb-4 lg:mb-2'
                        type={"text"}
                        required
                        placeholder="Title (e.g. Donation to XYZ Org)"
                        value={product}
                        onChange={handleProductChange}
                    />
                    <label htmlFor="" className='hidden'>Description</label>
                    <input className='bg-background p-4 w-full body rounded-3xl mb-4 lg:mb-2'
                        type={"text"}
                        required
                        placeholder="Description (e.g. Thank you for supporting...)"
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                    <div className='relative w-full mb-4'>
                      <label htmlFor="" className='hidden'>Price</label>
                      <input className='bg-background p-4 w-full body rounded-3xl mb-4 lg:mb-2'
                          type={"text"}
                          required
                          placeholder="Enter an amount (optional)"
                          value={price}
                          onChange={handlePriceChange}
                      />
                      <div className='absolute right-0 top-0'>
                        <label className='hidden'>Currency</label>
                        <div className='relative w-24 mb-6'>
                          <select 
                          name="currency" 
                          className='bg-background p-5 w-full rounded-3xl mb-4 lg:mb-2 text-body-primary meta font-bold no-border'
                          value={currency}
                          onChange={handleCurrencyChange}
                          required
                          >
                            <option value="$">USD</option>
                            <option value="BTC">BTC</option>
                          </select>
                          <ArrowDown className='h-6 w-6 text-title-active absolute right-4 top-4'></ArrowDown>
                        </div>
                      </div>
                    </div>
                    <div className='w-full'>
                      <p className='text-body-primary my-2'>Do you want to collect information?</p>
                      <div className='flex items-center mb-2'>
                        <input type="checkbox" className='check h-full' id='fullname' />
                        <label className='default-check mb-4' htmlFor="fullname"></label>
                        <p className='body text-body-primary'>Full name</p>
                      </div>
                      <div className='flex items-center mb-2'>
                        <input type="checkbox" className='check h-full' id='Email' />
                        <label className='default-check mb-4' htmlFor="Email"></label>
                        <p className='body text-body-primary'>Email</p>
                      </div>
                      <div className='flex items-center mb-2'>
                        <input type="checkbox" className='check h-full' id='shipping' />
                        <label className='default-check mb-4' htmlFor="shipping"></label>
                        <p className='body text-body-primary'>Shipping address</p>
                      </div>
                      <div className='flex items-center mb-2'>
                        <input type="checkbox" className='check h-full' id='phone' />
                        <label className='default-check mb-4' htmlFor="phone"></label>
                        <p className='body text-body-primary'>Phone number</p>
                      </div>

                      <button className='flex items-center mb-2 -translate-x-1' onClick={(event) => {event.preventDefault();setShowQuestion(true);}}>
                        <Add className='w-6 h-6 text-primary-default mr-2'/>
                        <p className='body text-primary-default'>Add additional question</p>
                      </button>


                      {customQuestions.map((question, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <p className='body text-body-primary mb-2'>{question.text}</p>
                          <button onClick={(event) => { event.preventDefault(); removeQuestion(index); }}>
                            <Close className='text-primary-default h-6 w-6 mb-2 ml-2'/>
                          </button>
                        </div>
                      ))}
                      
                      {showQuestion && (
                      <div>
                        <label htmlFor="" className='hidden'>Custom question</label>
                        <div className='flex items-center relative'>
                          <input className='bg-background p-4 w-full body rounded-3xl mb-4 lg:mb-2'
                            name='customQuestion'
                            type={"text"}
                            placeholder="Custom question"
                            value={customQuestion}
                            onChange={handleCustomQuestionChange}
                          />
                          <button className='body text-primary-default absolute right-12 top-4' onClick={(event) => {event.preventDefault();addQuestion({customQuestion});}}>Add</button>
                          <button onClick={() => { setShowQuestion(false);}}>
                          <Trash className='text-primary-default h-6 w-6 mb-2 ml-2'/>
                          </button>
                        </div>
                      </div>

                      )}

                      <button className='flex items-center mb-1 mt-6' onClick={toggleOptions}>
                        <p className='text-primary-default body'>Show more options</p>
                        {showOptions ? <ArrowUp className='h-6 w-6 text-primary default text-primary-default'/> 
                        : <ArrowDown className='h-6 w-6 text-primary default text-primary-default'/>}
                      </button>
                      <p className='body-sm text-body-secondary mb-4'>Set automatic conversion (from 💵 to BTC), set success URL, configure promotions.</p>
                      {showOptions && (
                      <div className=''>
                      <label htmlFor="" className='hidden'>Success URL</label>
                      <input className='bg-background p-4 w-full body rounded-3xl mb-4'
                          type={"text"}
                          placeholder="Success URL"
                          value={successURL}
                          onChange={handleSuccessURLChange}
                      />
                      <div className='grid grid-rows-1 grid-cols-2 gap-x-2 mb-4'>
                        <div className='relative w-full'>
                          <label htmlFor="" className='hidden'>DiscountCode</label>
                          <input className='bg-background w-full p-4 body rounded-3xl mb-4 lg:mb-2'
                              type={"text"}
                              placeholder="Discount Code"
                              value={discountCode}
                              onChange={handleDiscountCodeChange}
                          />
                        </div>
                        <div className='relative w-full'>
                          <label htmlFor="" className='hidden'>DiscountNumber</label>
                          <input className='bg-background w-full p-4 body rounded-3xl mb-4 lg:mb-2'
                              type={"text"}
                              placeholder="Discount"
                              value={discountNumber}
                              onChange={handleDiscountNumberChange}
                          />
                          <div className='absolute right-0 top-0'>
                            <label className='hidden'>DiscountType</label>
                            <div className='relative w-24 flex mb-6'>
                              <select 
                              name="DiscountType" 
                              className='bg-background p-5 w-full rounded-3xl mb-4 lg:mb-2 text-body-primary meta font-bold no-border'
                              value={discountType}
                              onChange={handleDiscountTypeChange}
                              required
                              >
                                <option value="$">AMT</option>
                                <option value="%">%</option>
                              </select>
                              <ArrowDown className='h-6 w-6 text-title-active absolute right-4 top-4'></ArrowDown>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='flex justify-between items-center mb-4'>
                        <p className='text-body-primary body-sm'>Automatic conversion (from 💵 to BTC)</p>
                        <div className='border border-line rounded-md'>
                        <p className='text-body-primary body-sm my-0.5 mx-2'>{sliderValue}%</p>
                        </div>
                      </div>

                      <div className='slider-container'>
                        <div className='slider-track'></div>
                        <div 
                          className='slider-fill' 
                          style={{width: `${sliderValue}%`}}
                        ></div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={sliderValue} 
                          onChange={handleSliderChange} 
                          className="slider w-full" 
                          id="myRange" 
                        />
                      </div>
                      </div>
                      )}
                  </div>
                </div>
              </div>
              <h6 className='display max-w-fit mx-auto my-8' >
                <PrimaryButtonFull text="Create payment button" />
              </h6>
            </div>
          </form>
        )}

          {createStep === 1 && (
          <div className='flex flex-col'>
            <div className="rounded-4xl border-line border-2 flex flex-col payment-create mx-auto box-shadow">
              <div className='flex flex-col items-center justify-center w-full'>
    
                  <div className='bg-background w-full px-10 pt-6 rounded-t-4xl'>
                    <div className='border-line bg-line rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4'>
                    </div>

                    <div className='flex flex-col items-center bg-background'>
                      <p className='body-lg font-bold text-title-active mb-2'>{product}</p>
                      <p className='body text-body-primary mb-4'>{description}</p>
                      <h3 className='text-title-active mb-4'><span>{currency}</span>{price}</h3>
                      <button className='body text-primary-default flex items-center mb-10'>
                        <p>Edit product</p>
                        <Edit className='h-6 w-6 text-primary-default'/>
                      </button>
                    </div>
                  </div>
                 
                  <div className='flex flex-col w-full mt-5 mb-10 px-10'>
                    <div className="chain-tabs flex justify-between w-full mb-6">
                      <input type="radio" id="radio-onchain" name="chain-tabs" value='link' checked={chainTabState === 'link'} onChange={handleChainTabChange} className='chain' />
                      <label 
                      className={`z-10 chain-tab font-bold body py-2 w-1/2 flex items-center justify-center border-b border-title-active ${chainTabState === 'onchain' ? 'active' : 'z-10 chain-tab body py-2 w-1/2 flex items-center justify-center text-placeholder border-b border-placeholder'}`}
                      htmlFor="radio-onchain">Link
                      </label>
                      <input type="radio" id="radio-lightning" name="chain-tabs" value='button' checked={chainTabState === 'button'} onChange={handleChainTabChange} className='chain' />
                      <label 
                      className={`z-10 chain-tab font-bold body py-2 w-1/2 flex items-center justify-center border-b border-title-active ${chainTabState === 'lightning' ? 'active' : 'z-10 chain-tab body py-2 w-1/2 flex items-center justify-center text-placeholder border-b border-placeholder'}`}
                      htmlFor="radio-lightning">Button
                      </label>
                      <span className="chain-glider"></span>
                    </div>

                    {chainTabState === 'link' && (
                     <div className='flex flex-col'>
                      <p className='body-sm text-body-secondary mb-2'>Share a permanent link to a hosted payment page</p>
                      <div className='flex items-center mb-6 p-4 bg-background rounded-3xl'>
                        <p ref={textToCopyRef} className='body text-title-active mr-5 overflow-x-auto whitespace-nowrap'>https://checkout.ayceexpress.co/i/ae76f8a</p>
                        <button onClick={copyToClipboard}>
                          <Copy className='h-6 w-6 text-body-primary'/>
                        </button>
                      </div>
                      <p className='body-sm text-body-secondary mb-2'>Send payment link to</p>
                      <div className='relative'>
                        <label htmlFor="" className='hidden'>Email</label>
                        <input className='bg-background p-4 w-full body rounded-3xl'
                            type={"email"}
                            placeholder='example@example.com'
                        />
                        <button className='absolute right-4 top-1'>
                          <SendLg/>
                        </button>
                      </div>
                     </div>
                    )}

                    {chainTabState === 'button' && (
                      <div className='flex flex-col'>
                        <PayBtc className='mb-6 mx-auto'/>
                        <p className='body-sm text-body-secondary mb-2'>Embed this snippet onto your website</p>
                        <div className='flex items-center mb-6 p-4 bg-background rounded-3xl'>
                          <p ref={textToCopyRef} className='body text-title-active mr-5 overflow-x-auto whitespace-nowrap'>{"<a href=\"https://checkout.ayceexpress.co/p/"}</p>
                          <button onClick={copyToClipboard}>
                            <Copy className='h-6 w-6 text-body-primary'/>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
              </div>
            </div>
          </div>
          )}

        </div>
    </div>
  )
}
