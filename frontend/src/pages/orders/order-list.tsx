import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { OrderCard } from "./order-card";
import type { Order } from "@/lib/types";

interface OrderListProps {
    orders: Order[];
}

export default function OrderList({ orders }: OrderListProps) {
    const [displayCount, setDisplayCount] = useState(10);

    const displayedOrders = orders.slice(0, displayCount);
    const hasMore = displayCount < orders.length;

    return (
        <div className="space-y-4">
            {displayedOrders.map((order) => (
                <OrderCard
                    key={order.id}
                    order={order}
                    storeName={order.storeName}
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
