import Image from "next/image"
import getProvider from "@/libs/getProvider";
import Link from "next/link";
export default async function ProviderDetailPage({ params }: { params: { pid: string } }) {

  const ProviderDetail = await getProvider(params.pid)

  return (
    <main className="text-center p-5">
      <h1 className="text-lg font medium text-left">{ProviderDetail.data.name}</h1>
      <div className="flex flex-row my-5">
        {/* <Image src={ProviderDetail.data.picture}
                    alt='Car Image'
                    width={0} height={0} sizes="100vw"
                    className="rounded-lg w-[30%] bg-black"/> */}
        <div className="text-left">
          <div className='text-md mx-5'>Address: {ProviderDetail.data.address}</div>
          <div className='text-md mx-5'>District: {ProviderDetail.data.district}</div>
          <div className='text-md mx-5'>Province: {ProviderDetail.data.province}</div>
          <div className='text-md mx-5'>Postal Code: {ProviderDetail.data.postalcode}</div>
          <div className='text-md mx-5'>Region: {ProviderDetail.data.region} </div>
          <div className='text-md mx-5'>Tel: {ProviderDetail.data.tel}</div>

          <Link href={`/reservations?id=${params.pid}&model=${ProviderDetail.data.name}`}>
            <button className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-1
                        text-white shadow-sm">
              Make Reservation
            </button>
          </Link>

        </div>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return [{ cid: '001' }, { cid: '002' }, { cid: '003' }, { cid: '004' }]
}