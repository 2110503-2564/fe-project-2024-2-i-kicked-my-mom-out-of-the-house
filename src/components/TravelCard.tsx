'use client'
import { VlogPlayer } from "./VlogPlayer"
import { useState } from "react"
import { Rating } from "@mui/material"
import { useWindowListener } from "@/hooks/useWindowListener"

export function TravelCard(){

    const [playing, setPlaying] = useState(true)
    const [rating, setRating] = useState(0)
    const [pointerPosition, setPointerPosition] = useState({x:0,y:0});

    useWindowListener('pointermove',
        (e)=>{setPointerPosition({x:(e as PointerEvent).clientX, y: (e as PointerEvent).clientY})}
    )

    return(
        <div className='w-[80%] shadow-lg mx-[10%] my-10 p-6 rounded-lg bg-gray-50 flex flex-row gap-6 items-center'>
            <VlogPlayer isPlaying={playing} vdoSrc="/video/aewebeve.mov" className="rounded-lg shadow-md"></VlogPlayer>
            <div className="flex flex-col items-start font-serif">
                <h1 className="mb-4 text-2xl font-bold leading-relaxed tracking-wide text-gray-800">I kicked my mom out of the house</h1>
                <button className="w-36 h-12 text-lg opacity-90 hover:shadow-inner hover:shadow-blue-800 
                        hover:bg-blue-500 bg-blue-600 shadow-lg text-white py-2 px-6 
                        rounded-xl font-serif flex items-center justify-center relative group mt-3
                        transition-all duration-300"
                onClick={()=> setPlaying(!playing)}>
                    {playing? 'Pause':'Play'}
                </button>
                <div className="mt-4 p-4 bg-white shadow-xl rounded-lg text-gray-700 w-full">
                    <p className="font-semibold">6733032421 Jiratchaya Kunyaphila</p>
                    <p className="font-semibold">6733214321 Rachata Boonmemechai</p>
                    <p className="font-semibold">6733218921 Ratima Klabprasit</p>
                </div>
            </div>
        </div>
    )
}