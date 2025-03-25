export default async function getProviders() {

    await new Promise((resolve) => setTimeout(resolve, 5000))
    const response = await fetch("https://ikickedmymom.vercel.app/RentalC01/rentalCarProvider/", { next: { tags: ['Providers'] } })
    if (!response.ok) {
        throw new Error(`Failed to fetch providers: ${response.statusText}`);
    }
    return await response.json()
}
// const getProviders = async () => {
//     try {
//         await new Promise((resolve) => setTimeout(resolve, 5000));

//         const response = await fetch("http://localhost:5000/RentalC01/rentalCarProvider", {
//             next: { tags: ['Providers'] },
//         });

//         if (!response.ok) {
//             throw new Error(`Failed to fetch providers: ${response.statusText}`);
//         }

//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error("Error fetching providers:", error);
//         throw error;
//     }
// };