'use client'
import { useReducer } from "react";
import ProductCard from "./ProductCard";
import { compare } from "bcryptjs";
import Link from "next/link";
import { useRef, useEffect } from "react";
import getProviders from "@/libs/getProviders";
import { useState } from "react";
import { ProviderItem, ProviderJson } from "../../interfaces";

export default function ProviderPanel() {


    const [providerResponse, setproviderResponse] = useState<ProviderJson | null>(null);

    useEffect(() => {
        // Removed the unnecessary parameter from fetchData
        const fetchData = async () => {
            const providers = await getProviders()
            setproviderResponse(providers)

        }

        fetchData()
    }, [])

    const countRef = useRef(0)
    const inputRef = useRef<HTMLInputElement>(null)
    let count = 0;

    const compareReducer = (compareList: Set<string>, action: { type: string, providerName: string }) => {
        switch (action.type) {
            case 'add': {
                return new Set(compareList.add(action.providerName))
            }
            case 'remove': {
                compareList.delete(action.providerName)
                return new Set(compareList)
            }
            default: return compareList
        }
    }

    const [compareList, dispatchCompare] = useReducer(compareReducer, new Set<string>())


    if (!providerResponse) return (<p>Loading Provider ...</p>)



    return (
        <div>
            {/* <div style={{
                margin: "20px", display: "flex",
                flexDirection: "row", flexWrap: "wrap",
                justifyContent: "space-around", alignContent: "space-around", padding: "10px"
            }}>
                {

                    providerResponse.data.map((providerItem: ProviderItem) => (
                        <Link href={`/provider/${providerItem._id}`} className="w-1/5" key={providerItem._id}>
                            <ProductCard providerName={providerItem.name}
                                onCompare={(provider: string) => dispatchCompare({ type: 'add', providerName: provider })}
                            />
                        </Link>
                    )
                    )
                }
            </div> */}
            <div className="w-full text-xl font-medium" >Compare List: {compareList.size}</div>
            {Array.from(compareList).map((provider) => <div key={provider}
                onClick={() => dispatchCompare({ type: 'remove', providerName: provider })}>
                {provider}</div>)}

            <button className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2
                  text-white shadow-sm"
                onClick={() => { countRef.current = countRef.current + 1; alert(countRef.current) }}>
                Count with Ref object
            </button>

            {/* <input type="text" placeholder="please fill" className="block text gray text-sm 
                    rounded-lg p-2 m-2 bg-purple-50 ring-1 ring-inset ring-purple-400
                    focus:outline-none focus:bg-purple-200 focus:ring-2"
                ref={inputRef} />
            <button className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2
                text-white shadow-sm"
                onClick={() => { if (inputRef.current != null) inputRef.current.focus() }}>
                Focus Input
            </button> */}

        </div>
    );
}