import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/useCartStore";

interface CartSummaryProps {
    formatPrice: (price: number) => string;
    storeId: number;
}

export default function CartSummary({ formatPrice, storeId }: CartSummaryProps) {
    const { cart, getTotalItems, getTotalPrice } = useCartStore();
    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();

    if (totalItems === 0) return null;

    const cartStoreId = cart[0]?.storeId;
    if (cartStoreId && cartStoreId !== storeId) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-20">
            <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">장바구니 ({totalItems}개)</p>
                            <p className="text-sm opacity-90">
                                총 {formatPrice(totalPrice)}
                            </p>
                        </div>
                        <Button variant="secondary" asChild>
                            <Link to="/cart">
                                주문하기
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}