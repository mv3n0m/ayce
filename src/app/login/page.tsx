'use client'
import Image from 'next/image'
import PrimaryButton from '../components/PrimaryButton';
import Link from 'next/link';
import { signIn } from "next-auth/react";
import React, { useRef, useState } from "react";
import Alert from 'src/public/icons/alert.svg'
import Logo from 'src/public/logos/color.svg'
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const email = useRef("");
  const pass = useRef("");
  const [signInError, setSignInError] = useState(false);
  const router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Prevents the default form submission behavior
    event.preventDefault();
    
    try{
    const result = await signIn("credentials", {
      email: email.current,
      password: pass.current,
      // redirect set to false to prevent default page refresh from nextAuth SignIn function, so that error states will show
      redirect: false,
      // callbackUrl: "/dashboard/overview"
    });
    if (result) {
      console.log(result);
      if (!result.error) {
        // Successful login, redirect to the dashboard
        router.push('/dashboard/overview');
      } else {
        setSignInError(true);
      }
    }
  
    } catch (error) {
      console.error(error);
      setSignInError(true); // Set the sign-in error state to true if there is an error
    }
  };
  return (
    <main className='flex min-h-screen flex-col items-center justify-start bg-white lg:bg-background'>
      <div className='mt-6 mb-10 lg:mt-12 lg:mb-16'>
        <Logo className='login-logo' />
      </div>

      <div className='flex flex-col bg-white pb-6 lg:pt-16 lg:pb-10 px-6 lg:px-10 lg:rounded-3xl width-container lg:box-shadow'>
        <h4 className='text-center mb-10 display'>Log in</h4>
        <form onSubmit={onSubmit}>
          <div className='mb-4'>
            <label className='hidden'>Email</label>
            <input className='bg-background p-3.5 lg:p-4 w-full body rounded-2xl'
              type={"text"}
              required
              placeholder="Email"
              onChange={(e) => (email.current = e.target.value)}
            />
          </div>
            <div className='mb-2'>
                <label className='hidden'>Password</label>
                <input className='bg-background p-3.5 lg:p-4 w-full body rounded-2xl'
                    type={"password"}
                    required
                    placeholder="Password"
                    onChange={(e) => (pass.current = e.target.value)}
                />
            </div>
            {signInError && ( // Render the error div only if signInError is true
              <div className='flex items-center mb-4'>
              <Alert className='h-5 w-5 text-states-error max-w-fit inline-block mr-1' />
              <p className='text-states-error body-xs'>Incorrect password or email.</p>
              </div>
            )}
            <Link className='body-sm text-primary-default' href="/forgot-password">Forgot password?</Link>
            <h6 className='display mt-6 lg:mt-10 mb-6'>
              <PrimaryButton text="Login" />
            </h6>
        </form>
        <p className='text-center body text-title-active'>Don&#39;t have an account? <Link href="/sign-up" className='text-primary-button'>Create account</Link></p>
        <div className='mt-6 mb-2 lg:mt-10 lg:mb-4 w-full border-b border-line'></div>
        <p className='meta text-body-secondary'>By continuing, you are agreeing to our <a className='underline' href="">terms of service</a> and <a className='underline' href="">privacy policy</a>.</p>
      </div>

    </main>
  )
  
}

export default LoginPage;