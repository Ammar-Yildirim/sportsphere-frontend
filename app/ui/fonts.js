import { Inter } from 'next/font/google';
import { Lusitana } from 'next/font/google';
import { Bebas_Neue } from 'next/font/google';
import { Anton } from 'next/font/google';
import { Poppins } from 'next/font/google';
import { Carter_One } from 'next/font/google';

export const co = Carter_One({
    subsets : ['latin'],
    weight : ['400']
}) 
export const poppins = Poppins({
    subsets : ['latin'],
    weight : ['200','300','400','500','600','800']
})
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
