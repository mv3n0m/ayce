import '../globals.css'
import { Inter } from 'next/font/google'
import SideMenu from '../components/SideMenu'
import Providers from '../components/Providers'
import NotificationProfile from '../components/notificationProfile'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AYCE',
  description: 'AYCE Express',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className='flex'>
      <Providers>
        <SideMenu/>
        <NotificationProfile/>
        {children}
      </Providers>
    </main>
  )
}
