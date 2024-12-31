import '../globals.css'
import { Inter } from 'next/font/google'
import OnboardMenu from '../components/OnboardMenu'
import OnboardTile from '../components/OnboardTile'
import Providers from '../components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AYCE',
  description: 'AYCE Express',
}

export default function OnboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className='flex flex-col'>
      <Providers>
        <OnboardTile/>
        <div className='flex'>
            <OnboardMenu/>
            {children}
        </div>
      </Providers>
    </main>
  )
}
