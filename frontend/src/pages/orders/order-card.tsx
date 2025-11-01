import { useNavigate } from "react-router-dom";
import type { Order, OrderStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface OrderCardProps {
    order: Order;
    storeName: string;
}

const STATUS_CONFIG: Record<OrderStatus, { text: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    PENDING: { text: "접수 대기", variant: "outline" },
    ACCEPTED: { text: "승인됨", variant: "default" },
    COMPLETED: { text: "완료됨", variant: "secondary" },
    CANCELLED: { text: "취소됨", variant: "destructive" },
    REJECTED: { text: "거절됨", variant: "destructive" },
};

export function OrderCard({ order, storeName }: OrderCardProps) {
    const navigate = useNavigate();
    const statusConfig = STATUS_CONFIG[order.status];
    const formatPrice = (price: number) => `${price.toLocaleString("ko-KR")}원`;
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{storeName}</CardTitle>
                    <Badge variant={statusConfig.variant}>{statusConfig.text}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                        <span className="font-semibold text-gray-700">총 금액:</span>{" "}
                        <span className="text-gray-900 font-bold">{formatPrice(order.totalPrice)}</span>
                    </div>
                    <div className="md:col-span-2">
                        <span className="font-semibold text-gray-700">배달 주소:</span>{" "}
                        <span className="text-gray-900">{order.deliveryAddress}</span>
                    </div>
                    {order.specialRequest && (
                        <div className="md:col-span-2">
                            <span className="font-semibold text-gray-700">특별 요청:</span>{" "}
                            <span className="text-gray-900">{order.specialRequest}</span>
                        </div>
                    )}
                    <div>
                        <span className="font-semibold text-gray-700">주문 일시:</span>{" "}
                        <span className="text-gray-600">{formatDate(order.createdAt)}</span>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-700">수정 일시:</span>{" "}
                        <span className="text-gray-600">{formatDate(order.updatedAt)}</span>
                    </div>
                </div>
                <div className="flex justify-end pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/stores/${order.storeId}/menus`)}
                    >
                        매장 보기
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
