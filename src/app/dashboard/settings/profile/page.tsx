'use client'
import Link from 'next/link';
import ArrowRight from 'src/public/icons/arrow-right.svg'
import Document from 'src/public/icons/document.svg'
import Edit from 'src/public/icons/edit.svg'
import Close from 'src/public/icons/close.svg'
import Qr from 'src/public/logos/qr.svg'
import Copy from 'src/public/icons/copy.svg'
import PrimaryButton from '../../../components/PrimaryButton';
import SecondaryButton from '../../../components/SecondaryButton';
import { useState } from 'react';
import OtpInput from 'react-otp-input';
import Image from 'next/image'

export default function ProfilePage() {
  const [editAccount, setEditAccount] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [enableAuth, setEnableAuth] = useState(false);

  const [otp, setOtp] = useState('');
  
  const toggleEditAccount = () => {
    setEditAccount(prevState => !prevState);
  };

  const toggleEditPassword = () => {
    setEditPassword(prevState => !prevState);
  };

  const toggleEnableAuth = () => {
    setEnableAuth(prevState => !prevState);
  };
  
  return (
    <div className='flex mx-16 mt-32 w-full sidemenu-padding'>
      <div className='flex flex-col w-full relative'>

        <div className='-top-22 left-0 absolute flex items-center'>
          <Link href="/dashboard/settings/" className='text-body-secondary body hover:text-title-active'>Settings</Link>
          <ArrowRight className='h-6 w-6 text-title-active mx-2' />
          <p className='text-title-active body'>Profile</p>
        </div>
        <div className='flex justify-between items-center mb-14'>
          <h4 className='display'>Profile</h4>
          <Link className='text-primary-default body flex items-center' href=''>
            Help Center
            <Document className='text-primary default h-6 w-6' />
          </Link>
        </div>

        <div className='border border-line rounded-3xl py-6 px-8 w-1/2 mb-4'>
          <div className='flex items-center justify-between'>
            <p className='text-title-active body-lg font-bold mb-4'>Account Information</p>
            {!editAccount && (
              <button onClick={toggleEditAccount}>
                <Edit className='text-primary-default w-6 h-6' />
              </button>
            )}
          </div>
          {!editAccount && (
            <>
              <p className='text-title-active body font-bold'>Name</p>
              <p className='text-body-primary body-sm'>John Doe</p>
              <div className='border-b border-line my-4'></div>
              <p className='text-title-active body font-bold'>Email</p>
              <p className='text-body-primary body-sm'>john@example.com</p>
            </>
          )}

          {editAccount && (
            <div className='flex flex-col'>
              <p className='text-body-secondary font-bold body-sm mb-1 mr-auto text-left'>Name</p>
              <label className='hidden'>Name</label>
              <input className='wallet-modal p-4 w-full body rounded-2xl'
                  type={"text"}
                  required
                  placeholder=""
              />

              <p className='text-body-secondary font-bold body-sm mb-1 mr-auto text-left mt-4'>Email</p>
              <label className='hidden'>Email</label>
              <input className='wallet-modal p-4 w-full body rounded-2xl'
                  type={"email"}
                  required
                  placeholder=""
              />

              <div className='flex items-center justify-start mt-4'>
                <div className='max-w-fit mr-4'>
                  <SecondaryButton text='Update'/>
                </div>
                <button onClick={toggleEditAccount} className='body text-primary-default'>Cancel</button>
              </div>
            </div>
          )}
        </div>

        <div className='border border-line rounded-3xl py-6 px-8 w-1/2'>
          <p className='text-title-active body-lg font-bold mb-4'>Security</p>
          <div className='flex items-center justify-between'>
            <div>
            <p className='text-title-active body font-bold'>Change password</p>
            <p className='text-body-primary body-sm'>JLorem ipsum dolor sit amet.</p>
            </div>
            <button onClick={toggleEditPassword}>
              <Edit className='text-primary-default w-6 h-6' />
            </button>
          </div>
          <div className='border-b border-line my-4'></div>
          <div className='flex items-center justify-between'>
            <div>
            <p className='text-title-active body font-bold'>Enable authentication</p>
            <p className='text-body-primary body-sm'>JLorem ipsum dolor sit amet.</p>
            </div>
            <button onClick={toggleEnableAuth}>
              <Edit className='text-primary-default w-6 h-6' />
            </button>
          </div>
        </div>



      </div>

      {editPassword && (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-25 z-10">
        <div className='bg-white modal-width-noheight lg:rounded-3xl p-6 lg:p-10 flex flex-col items-center justify-start z-20 relative'>

          <p className="font-bold body-lg text-title-active">Change Password</p>
          <div className='flex flex-col w-full mt-4'>
            <p className='text-body-secondary font-bold body-sm mb-1 mr-auto text-left'>Old password</p>
            <label className='hidden'>Old password</label>
            <input className='wallet-modal p-4 w-full body rounded-2xl'
                type={"password"}
                required
                placeholder=""
            />

            <p className='text-body-secondary font-bold body-sm mb-1 mr-auto text-left mt-4'>New password</p>
            <label className='hidden'>New password</label>
            <input className='wallet-modal p-4 w-full body rounded-2xl'
                type={"password"}
                required
                placeholder=""
            />

            <p className='text-body-secondary font-bold body-sm mb-1 mr-auto text-left mt-4'>Re-enter new password</p>
            <label className='hidden'>Re-enter new password</label>
            <input className='wallet-modal p-4 w-full body rounded-2xl'
                type={"password"}
                required
                placeholder=""
            />
          </div>

          <h6 className='display mt-10 mb-6'>
            <PrimaryButton text="Login" />
          </h6>

          

          {/* close button */}
          <button onClick={toggleEditPassword} className='absolute right-2 top-2 lg:-right-8 lg:-top-8'>
            <div className='h-8 w-8 bg-white rounded-full flex justify-center items-center'>
              <Close className='h-6 w-6 text-primary-default' />
            </div>
          </button>
        </div>
      </div>
      )}

      {enableAuth && (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-25 z-10">
        <div className='bg-white modal-width-noheight lg:rounded-3xl p-6 lg:p-10 flex flex-col items-center justify-start z-20 relative'>

        <p className="font-bold body-lg text-title-active mb-">Enable Authenticator</p>

        <p className='body-sm text-body-primary my-4'>Scan the QR code using your authenticator app and enter the code below.</p>

        <Qr className="h-80 w-80" />

        <button className='flex items-center my-2 mb-6'>
          <Copy className="h-6 w-6 text-primary-default" />
          <p className='body text-primary-default'>Copy</p>
        </button>

        <p className='text-body-secondary font-bold body-sm mb-1 mr-auto text-left'>Two-factor authentication</p>
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
          </div>
        </form>
        <button onClick={toggleEnableAuth} className='body text-primary-default'>Cancel</button>

          {/* close button */}
          <button onClick={toggleEnableAuth} className='absolute right-2 top-2 lg:-right-8 lg:-top-8'>
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
