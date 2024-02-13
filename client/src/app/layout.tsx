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
            <body className={poppins.className}>
                <Toaster position='bottom-center' />
                {children}
            </body>
        </html>
    );
}
