import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchOwnerOrders, updateOrderStatus } from "@/lib/api";
import type { OrderStatus } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { ClipboardList } from "lucide-react";
import OrderList from "./order-list";
import { WS_URLS } from "@/const";
import { useOrdersWebSocket } from "@/lib/useOrdersWebSocket";

interface ContentProps {
    storeId: string;
    statusFilter: OrderStatus | "ALL";
}

export default function Content({ storeId, statusFilter }: ContentProps) {
    const queryClient = useQueryClient();

    const { orders, isLoading, error, isConnected } = useOrdersWebSocket({
        queryKey: ['orders', 'store', storeId],
        queryFn: () => fetchOwnerOrders(storeId!),
        wsUrl: WS_URLS.STORE_ORDERS(storeId),
    });

    // 필터링
    const filteredOrders = useMemo(() => {
        if (!orders) return [];

        // 상태 필터링
        if (statusFilter !== "ALL") {
            return orders.filter(order => order.status === statusFilter);
        }

        return orders;
    }, [orders, statusFilter]);

    const updateStatusMutation = useMutation({
        mutationFn: ({ orderId, status }: { orderId: number; status: "ACCEPTED" | "REJECTED" | "COMPLETED" }) =>
            updateOrderStatus(orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders', 'store', storeId] });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });

    const handleStatusChange = (orderId: number, status: "ACCEPTED" | "REJECTED" | "COMPLETED") => {
        updateStatusMutation.mutate({ orderId, status });
    };

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

    if (!filteredOrders || filteredOrders.length === 0) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <ClipboardList />
                    </EmptyMedia>
                    <EmptyTitle>
                        {statusFilter === "ALL" ? "주문이 없습니다" : "해당 상태의 주문이 없습니다"}
                    </EmptyTitle>
                    <EmptyDescription>
                        {statusFilter === "ALL"
                            ? "아직 접수된 주문이 없어요."
                            : "해당 상태의 주문이 없습니다. 다른 상태를 확인해보세요."}
                    </EmptyDescription>
                </EmptyHeader>
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
            <OrderList orders={filteredOrders} onStatusChange={handleStatusChange} />
        </div>
    );
}
