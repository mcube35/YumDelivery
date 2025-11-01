import { useQuery } from "@tanstack/react-query";
import { fetchStoreList } from "@/lib/api";
import type { Store } from "@/lib/types";
import BackButton from "@/components/back-button";

interface HeaderProps {
    storeId?: number;
    storeName?: string;
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
                <div className="flex items-center relative">
                    {/* Back Button */}
                    <BackButton />

                    <div className="ml-4">
                        <h1 className="text-xl font-bold">장바구니</h1>
                        {storeId && storeInfo && <p className="text-sm text-muted-foreground">{storeInfo.name}</p>}
                    </div>
                </div>
            </div>
        </header>
    );
}