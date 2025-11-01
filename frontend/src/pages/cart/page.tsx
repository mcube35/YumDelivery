import { useCartStore } from "@/store/useCartStore";
import Header from "./header";
import Content from "./content";

export default function CartPage() {
    const { cart } = useCartStore();

    return (
        <div className="min-h-screen bg-background">
            {/* 헤더 */}
            <Header storeId={cart[0]?.storeId} />

            {/* 메인 컨텐츠 */}
            <main className="container mx-auto px-4 py-6 max-w-2xl">
                <Content />
            </main>
        </div>
    );
}