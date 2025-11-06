import { useQuery } from "@tanstack/react-query";
import { fetchStoreList } from "@/lib/api";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Store } from "@/lib/types";
import { Info, MapPin } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function Content() {
    const { data: stores, isLoading, error } = useQuery({
        queryKey: ['stores'],
        queryFn: fetchStoreList,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner className="size-8" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-lg text-red-500">매장 정보를 불러오는데 실패했습니다.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores?.map((store: Store) => (
                <Link key={store.id} to={`/stores/${store.id}/menus`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <div className="aspect-video relative overflow-hidden bg-muted">
                            <img
                                src="/placeholder.svg"
                                alt={store.name}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xl">{store.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Info className="h-4 w-4" aria-hidden="true" />
                                    {store.description}
                                </p>
                                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" aria-hidden="true" />
                                    {store.address}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}