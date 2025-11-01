import { useQuery } from "@tanstack/react-query";
import { fetchOwnerStores } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { Store } from "lucide-react";
import StoreList from "./store-list";

export default function Content() {
    const { data: stores, isLoading, error } = useQuery({
        queryKey: ['stores', 'owner'],
        queryFn: fetchOwnerStores,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner className="size-8" />
            </div>
        );
    }

    if (error) {
        const message = error instanceof Error ? error.message : "데이터를 불러오는데 실패했습니다.";
        return (
            <Card className="border-destructive">
                <CardContent className="pt-6">
                    <p className="text-destructive text-center">{message}</p>
                </CardContent>
            </Card>
        );
    }

    if (!stores || stores.length === 0) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Store />
                    </EmptyMedia>
                    <EmptyTitle>등록된 가게가 없습니다</EmptyTitle>
                    <EmptyDescription>
                        아직 등록된 가게가 없어요. 새로운 가게를 등록해보세요!
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    return <StoreList stores={stores} />;
}
