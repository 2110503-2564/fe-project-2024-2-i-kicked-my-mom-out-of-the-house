'use client'
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { BlurFade } from "@/components/magicui/blur-fade";

export default function Banner() {
    const [index, setIndex] = useState(0);
    const router = useRouter();
    const { data: session } = useSession();
    console.log(session);

    return (
        <div className="relative flex items-center justify-center w-full h-screen">
            {/* Background Image */}
            <Image
                src="/img/bg.jpg"
                alt="cover"
                fill
                priority
                className="object-cover z-0"
            />

            {/* Content Container */}
            <div className="absolute flex flex-col items-center text-center space-y-4">
                {/* Animated Text */}
                <BlurFade delay={0.25} inView>
                    <h2 className="text-3xl font-serif tracking-tighter sm:text-5xl xl:text-xl text-white leading-relaxed tracking-wider">GROUP</h2>
                </BlurFade>
                <BlurFade delay={0.5} inView>
                    <span className="text-white text-xl tracking-tighter sm:text-3xl xl:text-4xl font-serif leading-relaxed tracking-wider font-bold">
                        I kicked my mom out of the house
                    </span>
                </BlurFade>
                <BlurFade delay={0.75} inView>
                    <span className="text-white text-xl tracking-tighter sm:text-3xl xl:text-4xl font-serif leading-relaxed tracking-wider font-bold">
                        I kicked my mom out of the house
                    </span>
                </BlurFade>
                <BlurFade delay={1.0} inView>
                    <span className="text-white text-xl tracking-tighter sm:text-3xl xl:text-4xl font-serif leading-relaxed tracking-wider font-bold">
                        I kicked my mom out of the house
                    </span>
                </BlurFade>
                <BlurFade delay={1.25} inView>
                    <span className="text-white text-l tracking-tighter sm:text-3xl xl:text-2xl font-serif leading-relaxed tracking-wider">
                        From now on, you are my mom.
                    </span>
                </BlurFade>
                <BlurFade delay={1.5} inView>
                    <span className="text-white text-l tracking-tighter sm:text-3xl xl:text-xl font-serif leading-relaxed tracking-wider">
                        Rental Car Booking Web Page
                    </span>
                </BlurFade>

                {/* Buttons */}
                <BlurFade delay={1.75} inView>
                    <div className="flex justify-center gap-4 mt-4">
                        <button className="w-40 h-12 text-lg opacity-90 hover:shadow-inner hover:shadow-blue-800 
                            hover:bg-blue-500 bg-blue-600 shadow-lg text-white py-2 px-4 
                            rounded-xl font-serif flex items-center justify-center relative group"
                            onClick={() => router.push('/provider')}>
                            <span className="transition-all duration-300 ease-in-out group-hover:opacity-0">
                                Providers
                            </span>
                            <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                                Providers ▶
                            </span>
                        </button>

                        <button className="w-40 h-12 text-lg opacity-90 hover:shadow-inner hover:shadow-blue-800 
                            hover:bg-blue-500 bg-blue-600 shadow-lg text-white py-2 px-4 
                            rounded-xl font-serif flex items-center justify-center relative group"
                            onClick={() => router.push('/reservation')}>
                            <span className="transition-all duration-300 ease-in-out group-hover:opacity-0">
                                Reservation
                            </span>
                            <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                                Reservation ▶
                            </span>
                        </button>

                        {session && (
                            <button className="w-40 h-12 text-lg opacity-90 hover:shadow-inner hover:shadow-blue-800 
                                hover:bg-blue-500 bg-blue-600 shadow-lg text-white py-2 px-4 
                                rounded-xl font-serif flex items-center justify-center relative group"
                                onClick={() => router.push('/yourProfile')}>
                                <span className="transition-all duration-300 ease-in-out group-hover:opacity-0">
                                    Your Profile
                                </span>
                                <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                                    Your Profile ▶
                                </span>
                            </button>
                        )} 
                    </div>
                </BlurFade>
            </div>
        </div>
    );
}
