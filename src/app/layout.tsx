import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '../styles/global.css';
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
    title: 'TriunfoVerso - Um jogo trunfo',
    description: 'TriunfoVerso é um jogo trunfo online multiplater.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='pt-BR'>
            <head>
                {/* <link rel='apple-touch-icon' sizes='180x180' href='favicon/apple-touch-icon.png' />
                <link rel='icon' type='image/png' sizes='32x32' href='favicon/favicon-32x32.png' />
                <link rel='icon' type='image/png' sizes='16x16' href='favicon/favicon-16x16.png' />
                <link rel='manifest' href='favicon/webmanifest' />
                <meta name='theme-color' content='#ffffff' /> */}
            </head>
            <body className={poppins.className}>
                <Toaster position='bottom-center' />
                {children}
            </body>
        </html>
    );
}
