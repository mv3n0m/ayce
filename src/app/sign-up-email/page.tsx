'use client'
import Image from 'next/image'
import SecondaryButton from '../components/SecondaryButton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Logo from 'src/public/logos/color.svg'

export default function SignUpEmailPage() {
  const router = useRouter();
  const email = router.query;

  const handleResend = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/usersignup`,
        {
          email: email,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    
      console.log('API Response:', response.data);
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
        <h5 className='display mb-4'>Let’s verify your email</h5>
        <p className='body-lg text-body-primary mb-6 lg:mb-10'>Check <span>{email}</span> for a verification email and get started there. </p>
        <form onSubmit={handleResend}>
            <div className='mb-4 body body-bold'>
                <SecondaryButton text='Resend email'/>
            </div>
            <Link href="/login" className='body text-center max-w-fit flex items-center mx-auto text-primary-default'>
            Login
            </Link>
        </form>
        <div className='mt-6 mb-2 lg:mt-10 lg:mb-4 w-full border-b border-line'></div>
        <p className='text-body-secondary meta'>Need help? <Link className='text-primary-default' href="">Visit support </Link>  or <Link className='text-primary-default' href="">Contact us</Link>.</p>
      </div>

    </main>
  )
}
