'use client';
import { useState, useRef } from "react";
import axios from 'axios';
import Image from 'next/image';
import SecondaryButton from '../components/SecondaryButton';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Alert from 'src/public/icons/alert.svg'
import Logo from 'src/public/logos/color.svg'

const ResetPasswordPage = () => {
  const passwordRef = useRef(null);
  const reEnterPasswordRef = useRef(null);
  const errorMessageRef = useRef(null);
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const searchParams = useSearchParams(); // New way to use search parameters
  const token = searchParams.get('query');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const passwordValue = passwordRef.current.value;
    const reEnterPasswordValue = reEnterPasswordRef.current.value;

    if (passwordValue !== reEnterPasswordValue) {
      setShowAlert(true);
      errorMessageRef.current.innerText = 'Password doesn’t match.';
      return;
    }

    try {
      const response = await axios.post(
        // exmaple with query
        // https:ayce/reset-pass/query=36468879512679kghfhdg
        `${process.env.NEXT_PUBLIC_API_URL}/users/reset-password`,
        {
          token: token,
          password: passwordValue,
        },
        {
          headers: {
            'Content-Type': 'application/json', // Add the Content-Type header
          },
        }
      );

      console.log('API Response:', response.data); // Log the response data

      const { message, status } = response.data;

      if (status === 'success') {

        router.push(`/reset-password-email`);
      } else if (status === 'exists') {
        setShowAlert(true);

      }
    } catch (error) {
      console.error('API Error:', error);
    }
  }
  return (
    <main className='flex min-h-screen flex-col items-center justify-start bg-white lg:bg-background'>
        <div className='mt-6 mb-10 lg:mt-12 lg:mb-16'>
          <Logo className='login-logo' />
        </div>

        <div className='flex flex-col bg-white pb-6 lg:pt-16 lg:pb-10 px-6 lg:px-10 lg:rounded-3xl width-container lg:box-shadow'>
            <h5 className='display mb-2 lg:mb-4'>Reset your password</h5>
            <p className='body-lg text-body-primary mb-6 lg:mb-10'>Please enter your new password below.</p>
            <form onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label className='hidden'>Password</label>
                    <input className='bg-background p-3.5 lg:p-4 w-full body rounded-2xl'
                    type="password"
                    required
                    placeholder="Password"
                    ref={passwordRef}
                    />
                </div>
                <div className='mb-2'>
                    <label className='hidden'>Re-enter new password</label>
                    <input className='bg-background p-3.5 lg:p-4 w-full body rounded-2xl'
                    type="password"
                    required
                    placeholder="Re-enter new password"
                    ref={reEnterPasswordRef}
                    />
                </div>

                <div className="flex items-center mb-4">
                    {showAlert && (
                    <Alert className='h-5 w-5 text-states-error max-w-fit inline-block mr-1' />
                    )}
                    <p className='body-xs text-states-error' ref={errorMessageRef}></p>
                </div>

                <div className='lg:mb-4 body font-bold'>
                    <SecondaryButton text='Reset password'/>
                </div>
            </form>
            <div className='mt-6 mb-2 lg:mt-10 lg:mb-4 w-full border-b border-line'></div>
            <p className='text-body-secondary meta'>Need help? <Link className='text-primary-default' href="">Visit support </Link>  or <Link className='text-primary-default' href="">Contact us</Link>.</p>
        </div>

    </main>
  )

}

export default ResetPasswordPage;
