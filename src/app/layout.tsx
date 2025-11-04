import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next';
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Reverse-Proverbs - Bởi Vì Động Lực Quá Phổ Biến',
  description: 'Tạo những câu trích dẫn phản động lực hài hước đen tối, châm biếm chế giễu nội dung truyền cảm hứng thông thường. Hoàn hảo để chia sẻ trên mạng xã hội.',
  keywords: 'câu trích dẫn phản động lực, câu nói châm biếm, hài hước đen tối, phản động lực, trích dẫn viral',
  authors: [{ name: 'Reverse-Proverbs Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Reverse-Proverbs - Bởi Vì Động Lực Quá Phổ Biến',
    description: 'Tạo những câu trích dẫn phản động lực hài hước đen tối, châm biếm chế giễu nội dung truyền cảm hứng thông thường.',
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reverse-Proverbs - Bởi Vì Động Lực Quá Phổ Biến',
    description: 'Tạo những câu trích dẫn phản động lực hài hước đen tối, châm biếm chế giễu nội dung truyền cảm hứng thông thường.',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
