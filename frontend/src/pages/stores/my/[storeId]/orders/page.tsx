import { useState } from "react";
import { useParams } from "react-router-dom";
import type { OrderStatus } from "@/lib/types";
import Header from "./header";
import Content from "./content";

export default function StoreOrdersPage() {
    const { storeId } = useParams<{ storeId: string }>();
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");

    return (
        <div className="min-h-screen bg-background">
            {/* 헤더 */}
            <Header
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
            />

            {/* 메인 컨텐츠 */}
            <main className="container mx-auto px-4 py-6">
                <Content storeId={storeId!} statusFilter={statusFilter} />
            </main>
        </div>
    );
}
