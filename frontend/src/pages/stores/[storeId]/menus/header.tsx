import { useQuery } from "@tanstack/react-query";
import { fetchStoreList } from "@/lib/api";
import type { Store } from "@/lib/types";
import BackButton from "@/components/back-button";
import CartButton from "@/components/cart-button";

interface HeaderProps {
    storeId: number;
}

export default function Header({ storeId }: HeaderProps) {
    const { data: stores } = useQuery({
        queryKey: ['stores'],
        queryFn: fetchStoreList,
    });

    const storeInfo = stores?.find((store: Store) => store.id === storeId);

    return (
        <header className="sticky top-0 z-10 bg-card border-b">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Back Button */}
                    <BackButton />


                    {/* Store Name - Center */}
                    <div className="flex-1 text-center">
                        <h1 className="text-xl font-bold">{storeInfo?.name || 'Loading...'}</h1>
                        <p className="text-sm text-muted-foreground">{storeInfo?.description || ''}</p>
                    </div>

                    {/* Shopping Cart */}
                    <CartButton />
                </div>
            </div>
        </header>
    );
}