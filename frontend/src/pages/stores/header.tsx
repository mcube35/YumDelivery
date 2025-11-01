import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { Search, NotepadText, Store } from "lucide-react";
import { Link } from "react-router-dom";
import CartButton from "@/components/cart-button";

export default function Header() {
    const { isOwner } = useAuthStore();

    return (
        <header className="sticky top-0 z-10 bg-card border-b">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center mb-4 relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <Link to="/" className="text-xl font-semibold text-foreground hover:text-muted-foreground transition-colors no-underline">
                            🍔 Yum Delivery
                        </Link>
                    </div>

                    <div className="flex-1 flex justify-end space-x-2">
                        {/* 내 가게 보기 아이콘 - 사장님과 관리자에게만 표시 */}
                        {isOwner() && (
                            <Button size="icon" variant="outline" className="relative" asChild>
                                <Link to="/stores/my">
                                    <Store className="h-5 w-5" />
                                </Link>
                            </Button>
                        )}

                        {/* 주문내역 아이콘 */}
                        <Button size="icon" variant="outline" className="relative" asChild>
                            <Link to="/orders">
                                <NotepadText className="h-5 w-5" />
                            </Link>
                        </Button>

                        {/* 장바구니 아이콘 */}
                        <CartButton />
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="음식점 검색" className="pl-10" />
                </div>
            </div>
        </header>
    )
}