import { fetchOrders } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";
import { ShoppingBag } from "lucide-react";
import OrderList from "./order-list";
import { WS_URLS } from "@/const";
import { useOrdersWebSocket } from "@/lib/useOrdersWebSocket";

export default function Content() {
    const navigate = useNavigate();

    const { orders, isLoading, error, isConnected } = useOrdersWebSocket({
        queryKey: ['orders'],
        queryFn: fetchOrders,
        wsUrl: WS_URLS.ORDERS,
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

    if (orders.length === 0) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <ShoppingBag />
                    </EmptyMedia>
                    <EmptyTitle>주문 내역이 없습니다</EmptyTitle>
                    <EmptyDescription>
                        아직 주문한 내역이 없어요. 맛있는 음식을 주문해보세요!
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button onClick={() => navigate("/stores")}>
                        매장 둘러보기
                    </Button>
                </EmptyContent>
            </Empty>
        );
    }

    return (
        <div>
            {isConnected && (
                <div className="mb-2 text-xs text-green-600 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                    실시간 연결
                </div>
            )}
            <OrderList orders={orders} />
        </div>
    );
}
