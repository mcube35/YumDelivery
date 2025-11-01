import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/store/useCartStore";

interface OrderSummaryProps {
    cartItems: CartItem[];
    deliveryAddress: string;
    formatPrice: (price: number) => string;
    onOrderPlace: () => void;
    isOrdering: boolean;
}

const DELIVERY_FEE = 3000;

const PriceRow = ({
    label,
    price,
    bold = false
}: {
    label: string;
    price: string;
    bold?: boolean;
}) => (
    <div className={`flex justify-between ${bold ? 'font-bold text-lg' : ''}`}>
        <span>{label}</span>
        <span className={bold ? 'text-primary' : ''}>{price}</span>
    </div>
);

export function OrderSummary({
    cartItems,
    deliveryAddress,
    formatPrice,
    onOrderPlace,
    isOrdering
}: OrderSummaryProps) {
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalTotal = totalPrice + DELIVERY_FEE;

    return (
        <Card>
            <CardHeader>
                <CardTitle>주문 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <PriceRow label="상품 금액" price={formatPrice(totalPrice)} />
                    <PriceRow label="배송비" price={formatPrice(DELIVERY_FEE)} />
                    <hr />
                    <PriceRow label="총 결제 금액" price={formatPrice(finalTotal)} bold />
                </div>

                <Button
                    className="w-full"
                    size="lg"
                    onClick={onOrderPlace}
                    disabled={!deliveryAddress.trim() || isOrdering}
                >
                    {isOrdering ? "주문 중..." : `${formatPrice(finalTotal)} 주문하기`}
                </Button>
            </CardContent>
        </Card>
    );
}