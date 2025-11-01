import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Order, OrderStatus } from "@/lib/types";
import { Clock, User, Phone, MapPin } from "lucide-react";

interface OrderCardProps {
    order: Order;
    onStatusChange: (status: "ACCEPTED" | "REJECTED" | "COMPLETED") => void;
}

export default function OrderCard({ order, onStatusChange }: OrderCardProps) {
    const statusColors: Record<OrderStatus, string> = {
        PENDING: "bg-yellow-500",
        ACCEPTED: "bg-blue-500",
        COMPLETED: "bg-green-500",
        REJECTED: "bg-red-500",
        CANCELLED: "bg-gray-500",
    };

    const statusLabels: Record<OrderStatus, string> = {
        PENDING: "대기중",
        ACCEPTED: "수락됨",
        COMPLETED: "완료",
        REJECTED: "거절됨",
        CANCELLED: "취소됨",
    };

    const canApprove = order.status === "PENDING";
    const canComplete = order.status === "ACCEPTED";
    const isFinished = ["COMPLETED", "REJECTED", "CANCELLED"].includes(order.status);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-lg">주문 #{order.id}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {new Date(order.createdAt).toLocaleString("ko-KR")}
                        </div>
                    </div>
                    <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* 고객 정보 */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{order.customerName || "고객"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{order.deliveryAddress}</span>
                    </div>
                    {order.specialRequest && (
                        <div className="flex items-start gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <span>{order.specialRequest}</span>
                        </div>
                    )}
                </div>

                <Separator />

                {/* 주문 상세 */}
                {order.items && order.items.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold mb-2">주문 상세</h3>
                        <div className="space-y-2 pl-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <span>
                                        {item.menuName} x {item.qty}
                                    </span>
                                    <span className="font-medium">
                                        {(item.price * item.qty).toLocaleString()}원
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-semibold">총 금액</span>
                    <span className="text-lg font-bold">{order.totalPrice.toLocaleString()}원</span>
                </div>

                {/* 액션 버튼 */}
                {!isFinished && (
                    <div className="flex gap-2 pt-2">
                        {canApprove && (
                            <>
                                <Button
                                    className="flex-1"
                                    variant="default"
                                    onClick={() => onStatusChange("ACCEPTED")}
                                >
                                    수락
                                </Button>
                                <Button
                                    className="flex-1"
                                    variant="destructive"
                                    onClick={() => onStatusChange("REJECTED")}
                                >
                                    거절
                                </Button>
                            </>
                        )}
                        {canComplete && (
                            <Button
                                className="flex-1"
                                variant="default"
                                onClick={() => onStatusChange("COMPLETED")}
                            >
                                완료 처리
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
