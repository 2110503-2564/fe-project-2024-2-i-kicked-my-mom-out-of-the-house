'use client'
import { useState } from 'react';
import styles from './banner.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Banner() {
    // const covers = ['/img/cover.jpg', '/img/cover2.jpg', '/img/cover3.jpg']
    // const [index, setIndex] = useState(0)
    const router = useRouter()
    const { data: session } = useSession()
    console.log(session?.user.token)

    return (
        <div className="relative block m-0 w-full h-[100vh]">
            {/* ภาพมี z-index ต่ำสุด */}
            <Image
                src="/img/bg.jpg"
                alt="cover"
                fill
                priority
                className="object-cover z-0"
            />

            {/* ข้อความมี z-index สูงกว่า */}
            <div className={styles.bannerText}>
                <h3>GROUP</h3>
                <h1 className="text-4xl font-bold">I kicked my mom out off the house</h1>
                <h1 className="text-4xl font-bold">I kicked my mom out off the house</h1>
                <h1 className="text-4xl font-bold">I kicked my mom out off the house</h1>
                <h2 className="text-l  m-[7px]">From now on, you are my mom.</h2>
                <h2 className="text-l font-bold mb-[20px]">rental Car Booking web Page</h2>
                {
                    session ?
                        <div className="flex justify-center gap-[15px]">
                            <button className="opacity-90 hover:shadow-inner hover:shadow-neutral-800 hover:bg-white hover:text-neutral-800
            bg-neutral-800 shadow-lg text-white py-2 px-4 rounded "
                                onClick={(e) => { e.stopPropagation(); router.push('/provider') }}>catalog</button>
                            <button className="opacity-90 hover:shadow-inner hover:shadow-neutral-800 hover:bg-white hover:text-neutral-800
            bg-neutral-800 shadow-lg text-white py-2 px-4 rounded "
                                onClick={(e) => { e.stopPropagation(); router.push('/reservations') }} >reservation</button>
                            <button className="opacity-90 hover:shadow-inner hover:shadow-neutral-800 hover:bg-white hover:text-neutral-800
            bg-neutral-800 shadow-lg text-white py-2 px-4 rounded ">yourProfile</button>
                        </div> :
                        <div className="flex justify-center gap-[15px]">
                            <button className="opacity-90 hover:shadow-inner hover:shadow-neutral-800 hover:bg-white hover:text-neutral-800
            bg-neutral-800 shadow-lg text-white py-2 px-4 rounded "
                                onClick={(e) => { e.stopPropagation(); router.push('/provider') }}>catalog</button>
                            <button className="opacity-90 hover:shadow-inner hover:shadow-neutral-800 hover:bg-white hover:text-neutral-800
            bg-neutral-800 shadow-lg text-white py-2 px-4 rounded "
                                onClick={(e) => { e.stopPropagation(); router.push('/reservations') }} > reservation</button>
                        </div>
                }
            </div>

        </div>
    );
}