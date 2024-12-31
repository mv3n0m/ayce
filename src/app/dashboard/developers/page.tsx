'use client'
import Image from 'next/image'
import Link from 'next/link';
import SideMenu from '../../components/SideMenu'
import Search from 'src/public/icons/search.svg'
import Add from 'src/public/icons/add2.svg'
import Generate from 'src/public/icons/generate.svg'
import Webhook from 'src/public/icons/webhook.svg'
import Trash from 'src/public/icons/trash.svg'
import Right from 'src/public/icons/right.svg'
import { useState, useRef, useEffect } from 'react';
import Logomark from 'src/public/logos/logomark-color.svg'
import PrimaryButton from '../../components/PrimaryButton';
import OtpInput from 'react-otp-input';
import Close from 'src/public/icons/close.svg'
import ArrowDown from 'src/public/icons/arrow-down.svg'
import Copy from 'src/public/icons/copy.svg'

export default function DevelopersPage() {
  const [otp, setOtp] = useState('');
  const [modalOpenAddKey, modalIsOpenAddKey] = useState(false);
  const [modalOpenWebHook, modalIsOpenWebHook] = useState(false);
  const [modalOpenEcommerce, modalIsOpenEcommerce] = useState(false);
  const [modalStepAddKey, setModalStepAddKey] = useState(0);

  const textToCopyRef = useRef(null);

  const nextAddKeyStep = async (event) => {
    event.preventDefault();
    setModalStepAddKey(modalStepAddKey + 1);
  };

  const openModalAddKey = () => {
    modalIsOpenAddKey(true);
  };

  const closeModalAddKey = () => {
    modalIsOpenAddKey(false);
    setModalStepAddKey(0);
  };

  const openModalWebHook = () => {
    modalIsOpenWebHook(true);
  };

  const closeModalWebHook = () => {
    modalIsOpenWebHook(false);
  };

  const openModalEcommerce = () => {
    modalIsOpenEcommerce(true);
  };

  const closeModalEcommerce = () => {
    modalIsOpenEcommerce(false);
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

  useEffect(() => {
    if (otp.length === 6) {
      setModalStepAddKey(2);
      setOtp('');
    }
  }, [otp]);

  return (
    <div className='flex mx-16 mt-32 w-full sidemenu-padding'>
      <div className='flex flex-col w-full'>
        <h4 className='display mb-14'>Developers</h4>
        <h5 className='display mb-6'>API Keys</h5>
        <div className='flex justify-between w-full'>
            <div className='flex space-x-16'>
              <button onClick={openModalAddKey} className='text-primary-default body font-bold flex items-center justify-center'>
                <Add className='h-6 w-6 text-primary-default mr-2'/>
                <p>Add key</p>
              </button>
              <button onClick={openModalEcommerce} className='text-primary-default body font-bold flex items-center justify-center'>
                <Generate className='h-6 w-6 text-primary-default mr-2'/>
                <p>Generate e-commerce key</p>
              </button>
              <button onClick={openModalWebHook} className='text-primary-default body font-bold flex items-center justify-center'>
                <Webhook className='h-6 w-6 text-primary-default mr-2'/>
                <p>Test your webhooks</p>
              </button>
            </div>
        </div>
        <div className='flex items-start w-full justify-between'>
          <div className='flex flex-grow flex-col'>
            <div className='relative mt-6 mb-5'>
              <label className='hidden'>Email</label>
              <input className='bg-background py-4 pr-4 pl-12 w-full body rounded-2xl'
                  type={"text"}
                  placeholder='Search'
              />
              <Search className='h-6 w-6 text-body-primary absolute top-4 left-4' />
            </div>
              <table className="table-auto w-full">
                <thead className='border-b border-line'>
                  <tr className=''>
                    <th className='body-sm font-bold text-title-active  py-1.5'>
                      <div className='flex items-center'>
                        Label
                      </div>
                    </th>
                    <th className='body-sm font-bold text-title-active  py-1.5'>
                      <div className='flex items-center'>
                        Permissions
                      </div>
                    </th>
                    <th className='body-sm font-bold text-title-active  py-1.5'>
                      <div className='flex items-center'>
                        Date created
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='border-b border-line'>
                    <td className='flex items-center py-4'>
                      <p className='body text-body-primary'>abcdefg</p>
                    </td>
                    <td><p className='body text-body-primary'>Read-only</p></td>
                    <td className='text-body-primary'>05-22-2023, 00:00:00</td>
                    <td className=''>
                      <button className='flex justify-center items-center text-body-secondary'>
                      <Trash className='h-6 w-6 mr-2 text-body-secondary'/>Revoke
                      </button>
                      </td>
                  </tr>
                  <tr className='border-b border-line'>
                    <td className='flex items-center py-4'>
                      <p className='body text-body-primary'>abcdefg</p>
                    </td>
                    <td><p className='body text-body-primary'>Read-only</p></td>
                    <td className='text-body-primary'>05-22-2023, 00:00:00</td>
                    <td className=''>
                      <button className='flex justify-center items-center text-body-secondary'>
                      <Trash className='h-6 w-6 mr-2 text-body-secondary'/>Revoke
                      </button>
                      </td>
                  </tr>
                  <tr className='border-b border-line'>
                    <td className='flex items-center py-4'>
                      <p className='body text-body-primary'>abcdefg</p>
                    </td>
                    <td><p className='body text-body-primary'>Read-only</p></td>
                    <td className='text-body-primary'>05-22-2023, 00:00:00</td>
                    <td className=''>
                      <button className='flex justify-center items-center text-body-secondary'>
                      <Trash className='h-6 w-6 mr-2 text-body-secondary'/>Revoke
                      </button>
                      </td>
                  </tr>
                  <tr className='border-b border-line'>
                    <td className='flex items-center py-4'>
                      <p className='body text-body-primary'>abcdefg</p>
                    </td>
                    <td><p className='body text-body-primary'>Read-only</p></td>
                    <td className='text-body-primary'>05-22-2023, 00:00:00</td>
                    <td className=''>
                      <button className='flex justify-center items-center text-body-secondary'>
                      <Trash className='h-6 w-6 mr-2 text-body-secondary'/>Revoke
                      </button>
                      </td>
                  </tr><tr className='border-b border-line'>
                    <td className='flex items-center py-4'>
                      <p className='body text-body-primary'>abcdefg</p>
                    </td>
                    <td><p className='body text-body-primary'>Read-only</p></td>
                    <td className='text-body-primary'>05-22-2023, 00:00:00</td>
                    <td className=''>
                      <button className='flex justify-center items-center text-body-secondary'>
                      <Trash className='h-6 w-6 mr-2 text-body-secondary'/>Revoke
                      </button>
                      </td>
                  </tr>
                </tbody>
              </table>
          </div>
          <div className='flex bg-background rounded-2xl p-5 mt-6 ml-4'>
            <div className='flex flex-col'>
              <p className='text-title-active body'>API Documentation</p>
              <p className='text-body-secondary meta'>Learn the basics of the AYCE Express API</p>
            </div>
            <Link href=''>
              <Right className='w-6 h-6 text-primary-default ml-5' />
            </Link>
          </div>
        </div>
      </div>

      {modalOpenAddKey && (
          <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-25 z-10">
          <div className='bg-white modal-width-noheight lg:rounded-3xl p-6 lg:p-10 flex flex-col items-center justify-start z-20 relative'>
            
            {modalStepAddKey === 0 && (
                <>
                  <p className='text-title-active body-lg font-bold mb-2'>New API Key</p>
                  <form className='w-full' onSubmit={nextAddKeyStep}>
                    <div className='mb-8 w-full'>
                    <label className='text-body-secondary font-bold body-sm mb-1 mr-auto text-left'>Label</label>
                    <input className='wallet-modal p-4 w-full body rounded-2xl mb-4'
                        type={"text"}
                        required
                        placeholder="label"
                    />

                    <label className='text-body-secondary font-bold body-sm mb-1 mr-auto text-left'>Permissions</label>
                    <div className='relative w-full'>
                        <select 
                        name="currency" 
                        className='bg-white wallet-modal p-4 w-full body rounded-3xl mb-4 border border-line'
                        required
                        >
                          <option value="withdrawals">Withdrawals</option>
                          <option value="deposits">Deposits</option>
                        </select>
                        <ArrowDown className='h-6 w-6 text-title-active absolute right-4 top-4'></ArrowDown>
                      </div>

                    <label className='text-body-secondary font-bold body-sm mb-1 mr-auto text-left'>IP Whitelist (separate by comma)</label>
                    <input className='wallet-modal p-4 w-full body rounded-2xl'
                        type={"text"}
                        required
                        placeholder="IP Whitelist"
                    />
                    </div>
                    <h6 className='display mt-10 mb-6'>
                      <PrimaryButton text="Continue" />
                    </h6>
                  </form>
                </>
            )}

            {modalStepAddKey === 1 && (
              <>
                <Logomark className='h-12 w-12 mb-10 hidden lg:flex' />
                <h5 className='text-title-active font-bold mb-4'>Enter the 6-digit code from you verification email</h5>
                <p className='text-body-secondary body mb-4'>An email with a verification code was just sent to john@example.com</p>
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
            )}

            {modalStepAddKey === 2 && (
                <>
                  <p className='text-title-active body-lg font-bold mb-4'>New API Key</p>
                  <form className='w-full' onSubmit={nextAddKeyStep}>
                    <div className='mb-8 w-full'>
                    <p className='text-body-secondary font-bold body-sm mb-1 mr-auto text-left'>Your E-commerce key is:</p>
                    <div className='bg-background p-4 w-full body rounded-2xl mb-4 flex justify-between'>
                      <p ref={textToCopyRef} className=' text-title-active'>xxx</p>
                      <button onClick={copyToClipboard}>
                      <Copy className='h-6 w-6 text-body-primary' />
                      </button>
                    </div>
                    <p className='text-body-secondary'>Make sure to copy your new key. You won’t be able to see it again.</p>


                    </div>
                  </form>
                </>
            )}

            {/* close button */}
            <button onClick={closeModalAddKey} className='absolute right-2 top-2 lg:-right-8 lg:-top-8'>
              <div className='h-8 w-8 bg-white rounded-full flex justify-center items-center'>
                <Close className='h-6 w-6 text-primary-default' />
              </div>
            </button>
          </div>
        </div>
      )}

      {modalOpenEcommerce && (
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-25 z-10">
          <div className='bg-white modal-width-noheight lg:rounded-3xl p-6 lg:p-10 flex flex-col items-center justify-start z-20 relative'>
          
                <p className='text-title-active body-lg font-bold mb-4'>E-commerce Key</p>
                <form className='w-full' onSubmit={nextAddKeyStep}>
                  <div className='mb-8 w-full'>
                  <p className='text-body-secondary font-bold body-sm mb-1 mr-auto text-left'>Your E-commerce key is:</p>
                  <div className='bg-background p-4 w-full body rounded-2xl mb-4 flex justify-between'>
                    <p ref={textToCopyRef} className=' text-title-active'>xxx</p>
                    <button onClick={copyToClipboard}>
                    <Copy className='h-6 w-6 text-body-primary' />
                    </button>
                  </div>
                  <p className='text-body-secondary'>Make sure to copy your new key. You won’t be able to see it again.</p>


                  </div>
                </form>

            {/* close button */}
            <button onClick={closeModalEcommerce} className='absolute right-2 top-2 lg:-right-8 lg:-top-8'>
              <div className='h-8 w-8 bg-white rounded-full flex justify-center items-center'>
                <Close className='h-6 w-6 text-primary-default' />
              </div>
            </button>
          </div>
        </div>
      )}

      {modalOpenWebHook && (
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-25 z-10">
          <div className='bg-white modal-width-noheight lg:rounded-3xl p-6 lg:p-10 flex flex-col items-center justify-start z-20 relative'>
          
                <p className='text-title-active body-lg font-bold mb-2'>Webhook Simulator</p>
                <form className='w-full' onSubmit={nextAddKeyStep}>
                  <div className='mb-8 w-full'>
                  <label className='text-body-secondary font-bold body-sm mb-1 mr-auto text-left'>API Key</label>
                  <input className='wallet-modal p-4 w-full body rounded-2xl mb-4'
                      type={"text"}
                      required
                      placeholder="API Key"
                  />

                  <label className='text-body-secondary font-bold body-sm mb-1 mr-auto text-left'>Callback URL</label>
                  <input className='wallet-modal p-4 w-full body rounded-2xl mb-4'
                      type={"text"}
                      required
                      placeholder="https://"
                  />

                  <label className='text-body-secondary font-bold body-sm mb-1 mr-auto text-left'>Type</label>
                  <div className='relative w-full'>
                    <select 
                    name="currency" 
                    className='bg-white wallet-modal p-4 w-full body rounded-3xl mb-4 border border-line'
                    required
                    >
                      <option value="charge">charge</option>
                      <option value="deposits">Deposits</option>
                    </select>
                    <ArrowDown className='h-6 w-6 text-title-active absolute right-4 top-4'></ArrowDown>
                  </div>

                  <label className='text-body-secondary font-bold body-sm mb-1 mr-auto text-left'>Status</label>
                  <div className='relative w-full'>
                    <select 
                    name="currency" 
                    className='bg-white wallet-modal p-4 w-full body rounded-3xl mb-4 border border-line'
                    required
                    >
                      <option value="select">Select option</option>
                      <option value="option1">option 1</option>
                    </select>
                    <ArrowDown className='h-6 w-6 text-title-active absolute right-4 top-4'></ArrowDown>
                  </div>

                  </div>
                  <h6 className='display mt-8'>
                    <PrimaryButton text="Test" />
                  </h6>
                </form>

            {/* close button */}
            <button onClick={closeModalWebHook} className='absolute right-2 top-2 lg:-right-8 lg:-top-8'>
              <div className='h-8 w-8 bg-white rounded-full flex justify-center items-center'>
                <Close className='h-6 w-6 text-primary-default' />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
