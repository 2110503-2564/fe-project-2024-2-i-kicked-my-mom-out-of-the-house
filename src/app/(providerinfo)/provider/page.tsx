import ProviderPanel from "@/components/ProviderPanel";
import ProviderCatalog from "@/components/ProviderCatalog";
import getProviders from "@/libs/getProviders";

import { Suspense } from "react"
import { LinearProgress } from "@mui/material";

export default function Providers() {
  const Providers = getProviders()
  return (
    <main className="text-center p-5">
      <h1 className='text-2xl font-bold font-serif'>Select Your Car Provider</h1>
      <Suspense fallback={<p>Loading...<LinearProgress /></p>}>
        <ProviderCatalog providerJson={Providers} />
      </Suspense>
      {/* <hr className="my-10" />
      <h1 className='text-xl font-medium'>TRY Client-Side</h1> */}
      {/* <ProviderPanel /> */}
    </main>
  );
}