import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { OrderStatus } from "@/lib/types";
import BackButton from "@/components/back-button";

interface OrdersHeaderProps {
    statusFilter: OrderStatus | "ALL";
    onStatusFilterChange: (value: OrderStatus | "ALL") => void;
}

export default function Header({ statusFilter, onStatusFilterChange }: OrdersHeaderProps) {
    return (
        <header className="sticky top-0 z-10 bg-background border-b">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center gap-4">
                    {/* Back Button */}
                    <BackButton />

                    <h1 className="text-2xl font-bold">주문 관리</h1>
                </div>

                {/* 상태 필터 */}
                <div className="mt-4">
                    <Select value={statusFilter} onValueChange={(value) => onStatusFilterChange(value as OrderStatus | "ALL")}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="상태 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">전체</SelectItem>
                            <SelectItem value="PENDING">대기중</SelectItem>
                            <SelectItem value="ACCEPTED">수락됨</SelectItem>
                            <SelectItem value="COMPLETED">완료</SelectItem>
                            <SelectItem value="REJECTED">거절됨</SelectItem>
                            <SelectItem value="CANCELLED">취소됨</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </header>
    );
}
