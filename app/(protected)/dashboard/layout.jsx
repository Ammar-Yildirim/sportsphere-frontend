import Navbar from '@/app/ui/dashboard/Navbar'

export default function Layout({children}){
    return (
        <div className='flex md:flex-row h-screen flex-col '>
            <div className='w-full flex-none md:w-64'>
                <Navbar />
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}