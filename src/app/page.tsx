import Image from "next/image";
import styles from "./page.module.css";
import Banner from "@/components/Banner";
import ProductCard from "@/components/ProductCard";
import CarPanel from "@/components/ProviderPanel";
import { TravelCard } from "@/components/TravelCard";

export default function Home() {
  return (
    <main>
      <Banner />
      <TravelCard></TravelCard>
    </main>
  );
}
