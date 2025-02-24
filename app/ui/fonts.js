import { Inter } from 'next/font/google';
import { Lusitana } from 'next/font/google';
import { Bebas_Neue } from 'next/font/google';
import { Anton } from 'next/font/google';

export const anton = Anton({
    subsets : ['latin'],
    weight : ['400']
})
export const bebas = Bebas_Neue({
    subsets : ['latin'],
    weight : ['400']
});
export const inter = Inter({ subsets: ['latin'] });
export const lusitana = Lusitana({
    weight : ['400', '700'],
    subsets: ['latin']
});
