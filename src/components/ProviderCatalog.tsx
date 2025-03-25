'use client'
import ProductCard from "./ProductCard";
import Link from "next/link";
import { ProviderJson, ProviderItem } from "../../interfaces";

export default async function ProviderCatalog({ providerJson }: { providerJson: Promise<ProviderJson> }) {
    const providerJsonReady = await providerJson
    return (
        <>
            Explore {providerJsonReady.count} car provider in our catalog
            <div style={{
                margin: "20px", display: "flex",
                flexDirection: "row", alignContent: "space-around",
                justifyContent: "space-around", flexWrap: "wrap", padding: "10px"
            }}>
                {
                    providerJsonReady.data.map((provider: ProviderItem) => (
                        <Link href={`/provider/${provider._id}`}
                            className="w-[100%] sm:w-[50%] md:w-[30%] lg:w-[25%]
                        p-2 sm:p-4 md:p-4 lg:p-8">
                            <ProductCard providerName={provider.name}
                                detail={`${provider?.address || ""} ${provider?.district || ""} ${provider?.province || ""} ${provider?.region || ""}`.trim()} />
                        </Link>
                    ))
                }
            </div>
        </>
    )
}