import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Providers from '@/provider/providers';
import NavBar from '@/components/common/NavBar';
import GlobalModal from '@/components/modal/GlobalModal';
import { SocketProvider } from '@/contexts/SocketContext';
import { Toaster } from 'react-hot-toast';

//font 설정
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'T1 Chat',
  description: 'KakaoTalk Clone Coding',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div className={`${geistSans.variable} ${geistMono.variable}`}>
          <Providers>
            <SocketProvider>
              {/* Flex 레이아웃: NavBar와 컨텐츠를 가로로 배치 */}
              <div className="flex h-screen">
                {/* 왼쪽 고정 NavBar */}
                <NavBar />

                {/* 오른쪽 메인 컨텐츠 영역 */}
                <main className="flex-1 overflow-auto">{children}</main>
              </div>

              {/* 전역 모달 */}
              <GlobalModal />

              {/* Toast 알림 */}
              <Toaster
                position="top-center"
                toastOptions={{
                  // 기본 스타일
                  duration: 3000,
                  style: {
                    background: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid #7f1d1d',
                    borderRadius: '0.5rem',
                    fontSize: '14px',
                  },
                  // 성공 토스트
                  success: {
                    iconTheme: {
                      primary: '#22c55e',
                      secondary: '#fff',
                    },
                  },
                  // 에러 토스트
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </SocketProvider>
          </Providers>
        </div>
      </body>
    </html>
  );
}
