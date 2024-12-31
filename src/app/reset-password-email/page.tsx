import Image from 'next/image'
import Link from 'next/link';
import Logo from 'src/public/logos/color.svg'

export default function ResetPasswordEmailPage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-start bg-white lg:bg-background'>
        <div className='mt-6 mb-10 lg:mt-12 lg:mb-16'>
          <Logo className='login-logo' />
        </div>

        <div className='flex flex-col bg-white pb-6 lg:pt-16 lg:pb-10 px-6 lg:px-10 lg:rounded-3xl width-container lg:box-shadow'>
            <h5 className='display mb-4'>Email sent.</h5>
            <p className='body-lg text-body-primary mb-10'>Please check your inbox for a reset link to change your password.</p>
            <div className='mt-6 mb-2 lg:mt-10 lg:mb-4 w-full border-b border-line'></div>
            <p className='text-body-secondary meta'>Need help? <Link className='text-primary-default' href="">Visit support </Link>  or <Link className='text-primary-default' href="">Contact us</Link>.</p>
        </div>

    </main>
  )
  
}
