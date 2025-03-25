import styles from './topmenu.module.css';
import Image from 'next/image';
import TopMenuItem from './TopMenuItem';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getUserProfile from '@/libs/getUserProfile';

export default async function TopMenu() {
    const session = await getServerSession(authOptions); 

    console.log(session?.user.token);
    console.log("==========");
    async function getData() {
        if (session) {
            if (session.user.token) {
                const user = await getUserProfile(session.user.token)
                return user
            }
        }
    }

    const user = await getData();
    // console.log(user);

    const handleLogout = () => {
        signOut({ redirect: true, callbackUrl: '/' }); 
    };

    return (
        <div className={`${styles.menucontainer} font-serif`}> {/* ✅ กำหนด font-serif */}
            {/* ✅ คลิกที่โลโก้แล้วไปหน้า Home */}
            <Link href="/">
                <Image
                    src={'/img/ikmmlogo.png'}
                    className={styles.logoimg}
                    alt="logo"
                    width={100} /* ✅ กำหนดขนาดเริ่มต้นให้ Next.js คำนวณ */
                    height={40} /* ✅ ให้พอดีกับเมนู */
                    priority
                />
            </Link>
            {/* ถ้ายังไม่ได้ล็อกอินให้แสดง Register */}
            {!session && <TopMenuItem title='Register Now' pageRef='/api/auth/register' />}
            
            {/* เมนูทั่วไป */}
            <TopMenuItem title='Your reservation' pageRef='/yourReservation' />
            
            {/* เมนูขวา - Login/Logout */}
            <div className="flex flex-row absolute right-0 h-full">
            {user?.data.role === 'admin' ?
                    <div className='flex items-center h-full px-2 text-white text-sm'>admin mode</div> : ''}
                {session ? (
                    <Link href={'/api/auth/signout'}>
                        <div className='flex items-center h-full px-2 text-white text-sm cursor-pointer'>
                            Logout
                        </div>
                    </Link>
                ) : (
                    <Link href="/api/auth/signin">
                        <div className='flex items-center h-full px-2 text-white text-sm'>
                            Login
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
}
