export default async function getProvider(id: string) {
    const response = await fetch(`https://ikickedmymom.vercel.app/RentalC01/rentalCarProvider/${id}`)
    if (!response.ok) {
        throw new Error("Failed to fetch Provider")
    }
    return await response.json()
}