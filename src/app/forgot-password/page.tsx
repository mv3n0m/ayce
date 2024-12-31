'use client';
import { useState, useRef } from "react";
import axios from 'axios';
import Image from 'next/image'
import SecondaryButton from '../components/SecondaryButton';
import Link from 'next/link';
import Alert from 'src/public/icons/alert.svg'
import { useRouter } from 'next/navigation';
import Logo from 'src/public/logos/color.svg'

const ForgotPasswordPage = () => {
    const emailRef = useRef(null);
    const errorMessageRef = useRef(null);
    const successMessageRef = useRef(null);
    const [showAlert, setShowAlert] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const emailValue = emailRef.current.value;
    
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/user/reset/password?email=${encodeURIComponent(emailValue)}`,
                null,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            console.log('API Response:', response.data);
    
            const { message } = response.data;

            if (message) {
                router.push('/reset-password-email');
            } else {
                setShowAlert(true);
                errorMessageRef.current.innerText = `Email doesn't exist.`;
            }
        } catch (error) {
            console.error('API Error:', error);
            setShowAlert(true);
            errorMessageRef.current.innerText = `Email doesn't exist.`;
        }
    };
    
  return (
    <main className='flex min-h-screen flex-col items-center justify-start bg-white lg:bg-background'>
        <div className='mt-6 mb-10 lg:mt-12 lg:mb-16'>
            <Logo className='login-logo' />
        </div>

        <div className='flex flex-col bg-white pb-6 lg:pt-16 lg:pb-10 px-6 lg:px-10 lg:rounded-3xl width-container lg:box-shadow'>
            <h5 className='display mb-2 lg:mb-4'>Forgot your password?</h5>
            <p className='body-lg text-body-primary mb-6 lg:mb-10'>Enter the email you use with your account for a link to reset your password.</p>
            <form onSubmit={handleSubmit}>
                <div className='lg:mb-2'>
                    <label className='hidden'>Email</label>
                    <input className='bg-background p-3.5 lg:p-4 body w-full rounded-2xl'
                        type="email"
                        required
                        placeholder="Email"
                        ref={emailRef}
                        />
                </div>
                <div className="flex items-center mb-4">
                    {showAlert && (
                    <Alert className='h-5 w-5 text-states-error max-w-fit inline-block mr-1' />
                    )}
                    <p className='body-xs text-states-error' ref={errorMessageRef}></p>
                    {showSuccess && (
                    <Alert className='h-5 w-5 text-states-success max-w-fit inline-block mr-1' />
                    )}
                    <p className='body-xs text-states-success' ref={successMessageRef}></p>
                </div>
                <div className='mb-4 body font-bold'>
                    <SecondaryButton text='Submit'/>
                </div>
            </form>
            <Link className='body text-primary-default mx-auto flex justify-center' href='/login'>Go to Sign-in</Link>
            <div className='mt-6 mb-2 lg:mt-10 lg:mb-4 w-full border-b border-line'></div>
            <p className='text-body-secondary meta'>Need help? <Link className='text-primary-default' href="">Visit support </Link>  or <Link className='text-primary-default' href="">Contact us</Link>.</p>
        </div>

    </main>
  )
  
}

export default ForgotPasswordPage;
