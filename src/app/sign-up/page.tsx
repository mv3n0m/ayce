'use client';
import { useState, useRef } from "react";
import axios from 'axios';
import Image from 'next/image';
import PrimaryButton from '../components/PrimaryButton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Alert from 'src/public/icons/alert.svg'
import Logo from 'src/public/logos/color.svg'

const SignUpPage = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const reEnterPasswordRef = useRef(null);
  const errorMessageRef = useRef(null);
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    //'emailRef.current' is possibly 'null'. is invalid since input is required
    const emailValue = emailRef.current.value;
    const passwordValue = passwordRef.current.value;
    const reEnterPasswordValue = reEnterPasswordRef.current.value;

    if (passwordValue !== reEnterPasswordValue) {
      setShowAlert(true);
      errorMessageRef.current.innerText = 'Password doesn’t match.';
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/register/`,
        {
          emailaddress: emailValue,
          pswd: passwordValue,
        },
        {
          headers: {
            'Content-Type': 'application/json', // Add the Content-Type header
          },
        }
      );
    
      console.log('API Response:', response.data); // Log the response data
    
      if (response.data.message && response.data.message === 'user created') {
        router.push(`/sign-up-email?email=${encodeURIComponent(emailValue)}`);
      } else if (response.data.error) {
        setShowAlert(true);
        errorMessageRef.current.innerText = `User already exists`;
      }
    } catch (error) {
      console.error('API Error:', error);
      setShowAlert(true);
      errorMessageRef.current.innerText = `Sign-up failed for ${emailValue}`;
    }
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-start bg-white lg:bg-background'>

    <div className='mt-6 mb-10 lg:mt-12 lg:mb-16'>
      <Logo className='login-logo' />
    </div>
    <div className='flex flex-col bg-white pb-6 lg:pt-16 lg:pb-10 px-6 lg:px-10 lg:rounded-3xl width-container lg:box-shadow'>
        <h4 className='text-center mb-10 display'>Business account</h4>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
              <label className='hidden'>Email</label>
              <input
              className='bg-background p-3.5 lg:p-4 w-full body rounded-2xl'
              type="email"
              required
              placeholder="Email"
              ref={emailRef}
              />
          </div>
          <div className='mb-4'>
              <label className='hidden'>Password</label>
              <input
              className='bg-background p-3.5 lg:p-4 w-full body rounded-2xl'
              type="password"
              required
              placeholder="Password"
              ref={passwordRef}
              />
          </div>
          <div className='mb-2'>
              <label className='hidden'>Re-enter password</label>
              <input
              className='bg-background p-4 w-full body rounded-2xl'
              type="password"
              required
              placeholder="Re-enter password"
              ref={reEnterPasswordRef}
              />
          </div>

          <div className="flex items-center">
            {showAlert && (
            <Alert className='h-5 w-5 text-states-error max-w-fit inline-block mr-1' />
            )}
            <p className='body-xs text-states-error' ref={errorMessageRef}></p>
          </div>

          <h6 className='display mt-6 mb-4 lg:mt-10 lg:mb-4'>
              <PrimaryButton text="Create account" />
          </h6>
        </form>
        <Link href="/login" className='body text-center max-w-fit mx-auto text-primary-default mb-4'>
          Create personal account
        </Link>
        <p className='text-center body text-title-active'>
          Have an account? <Link href="/login" className='text-primary-button'>Log in</Link>
        </p>
        <div className='mt-6 mb-2 lg:mt-10 lg:mb-4 w-full border-b border-line'></div>
        <p className='meta text-body-secondary'>
        By continuing, you are agreeing to our <a className='underline' href="">terms of service</a> and <a className='underline' href="">privacy policy</a>.
        </p>
    </div>
    </main>
  );
};

export default SignUpPage;
