import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import type { Order } from "@/lib/types";
import OrderCard from "./order-card";

interface OrderListProps {
    orders: Order[];
    onStatusChange: (orderId: number, status: "ACCEPTED" | "REJECTED" | "COMPLETED") => void;
}

export default function OrderList({ orders, onStatusChange }: OrderListProps) {
    const [displayCount, setDisplayCount] = useState(10);

    const displayedOrders = orders.slice(0, displayCount);
    const hasMore = displayCount < orders.length;

    return (
        <div className="space-y-4">
            {displayedOrders.map((order: Order) => (
                <OrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={(status) => onStatusChange(order.id, status)}
                />
            ))}
            {hasMore && (
                <div className="flex justify-center py-8">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDisplayCount((prev) => prev + 10)}
                        className="rounded-full h-12 w-12"
                    >
                        <ChevronDown className="h-6 w-6" />
                    </Button>
                </div>
            )}
        </div>
    );
}
