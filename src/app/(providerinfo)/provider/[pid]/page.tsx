import getProvider from "@/libs/getProvider";
import Link from "next/link";

export default async function ProviderDetailPage({ params }: { params: { pid: string } }) {
    const ProviderDetail = await getProvider(params.pid);

    return (
        <main className="min-h-screen p-8 bg-gray-50 flex flex-col items-center font-serif">
            {/* Header */}
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {ProviderDetail.data.name}
            </h1>

            {/* รายละเอียดของผู้ให้บริการ */}
            <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl">
                <div className="space-y-3 text-gray-700">
                    <p className="text-lg"><span className="font-semibold">Address:</span> {ProviderDetail.data.address}</p>
                    <p><span className="font-semibold">District:</span> {ProviderDetail.data.district}</p>
                    <p><span className="font-semibold">Province:</span> {ProviderDetail.data.province}</p>
                    <p><span className="font-semibold">Postal Code:</span> {ProviderDetail.data.postalcode}</p>
                    <p><span className="font-semibold">Region:</span> {ProviderDetail.data.region}</p>
                    <p><span className="font-semibold">Tel:</span> {ProviderDetail.data.tel}</p>
                </div>

                {/* ปุ่มจองรถ */}
                <div className="mt-6 flex justify-center">
                    <Link href={`/reservation?id=${params.pid}&model=${ProviderDetail.data.name}`}>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition duration-300">
                            Make Reservation
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    );
}

export async function generateStaticParams() {
    return [{ cid: '001' }, { cid: '002' }, { cid: '003' }, { cid: '004' }];
}
