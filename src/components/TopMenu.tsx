import styles from './topmenu.module.css'
import Image from 'next/image';
import TopMenuItem from './TopMenuItem';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Link } from '@mui/material';
import getUserProfile from '@/libs/getUserProfile';

export default async function TopMenu() {

    const session = await getServerSession(authOptions)


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

    return (
        <div className={styles.menucontainer}>
            <Image src={'/img/logo.png'} className={styles.logoimg} alt='logo'
                width={0} height={0} sizes='100vh' />
            {session ? '' : <TopMenuItem title='Register Now' pageRef='/about' />}
            {/* <TopMenuItem title='Your reservation' pageRef={`/yourReservation/${user?.data?._id}`} /> */}
            <TopMenuItem title='Your reservation' pageRef={"/yourReservation"} />
            <TopMenuItem title='New reservation' pageRef={"/reservation"} />
            <div className="flex flex-row absolute right-0 h-full">
                {
                    session ? <Link href="api/auth/signout">
                        <div className='flex items-center h-full px-2
                     text-cyan-600 text-sm'>Sign-Out</div></Link>
                        : <Link href="api/auth/signin"><div className='flex items-center h-full px-2
                     text-cyan-600 text-sm'>login</div></Link>
                }
                {user?.data.role === 'admin' ?
                    <div className='flex items-center h-full px-2 text-cyan-600 text-sm'>admin mode</div> : ''}
            </div>

        </div>
    );
}