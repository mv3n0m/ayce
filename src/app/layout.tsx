import './globals.css'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import Providers from './components/Providers'

const inter = Inter({ subsets: ['latin'] })

const helvetica = localFont({
  src: [
    {
      path: '../public/fonts/helveticaneueltpro-bd-webfont.woff2',
      weight: '700'
    },
    {
      path: '../public/fonts/helveticaneueltpro-roman-webfont.woff2',
      weight: '400'
    }
  ],
  variable: '--font-helvetica'
})

const ginto = localFont({
  src: [
    {
      path: '../public/fonts/ABCGintoNord-Bold.woff2',
      weight: '700'
    }
  ],
  variable: '--font-ginto'
})

export const metadata = {
  title: 'AYCE',
  description: 'AYCE Express',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${helvetica.variable} ${ginto.variable}`}>
      {children}
      </body>
    </html>
  )
}
