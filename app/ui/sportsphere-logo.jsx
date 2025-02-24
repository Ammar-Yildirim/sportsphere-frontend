import Image from 'next/image'
import {anton} from '@/app/ui/fonts'

export default function SportSphereLogo(){
    return(
        <div className="flex flex-row items-center leading-none text-white space-x-2">
            <Image 
            src="/SportSphereLogo.png"
            width={33}
            height={33}
            className='h-8 w-8'
            alt='SportSphere Logo' />
            <p className={`${anton.className} text-[33px]`}>SportSphere</p>
        </div>
    )
}