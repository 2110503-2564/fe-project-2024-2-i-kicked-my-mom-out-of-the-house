'use client'

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { ProviderJson, ProviderItem } from "../../interfaces";

export default function ProviderCatalog({ providerJson }: { providerJson?: Promise<ProviderJson> | ProviderJson }) {
    const [providerData, setProviderData] = useState<ProviderJson | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchProviders() {
            try {
                if (!providerJson) {
                    throw new Error("Provider data is missing.");
                }
                if (providerJson instanceof Promise) {
                    const data = await providerJson;
                    setProviderData(data);
                } else {
                    setProviderData(providerJson);
                }
            } catch (err) {
                setError("Failed to load providers.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchProviders();
    }, [providerJson]);

    if (loading) return <p className="text-center text-lg text-blue-500 font-serif animate-pulse">Loading providers...</p>;
    if (error) return <p className="text-center text-lg text-red-600 font-serif">{error}</p>;
    if (!providerData) return <p className="text-center text-lg text-gray-500 font-serif">No providers found.</p>;

    return (
        <div className="min-h-screen p-8"> {/* เอา bg-gradient ออก */}
            <h2 className="text-xl text-black mb-6 text-center font-serif">
                Explore {providerData.count} Car Providers in Our Catalog
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {providerData.data.map((provider: ProviderItem) => (
                    <Link key={provider._id} href={`/provider/${provider._id}`} className="block transform transition duration-300 hover:scale-105">
                        <ProductCard 
                            providerName={provider.name}
                            detail={[
                                provider?.address, 
                                provider?.district, 
                                provider?.province, 
                                provider?.region
                            ].filter(Boolean).join(" ")}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}
