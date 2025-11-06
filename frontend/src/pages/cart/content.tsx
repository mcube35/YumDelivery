import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/store/useCartStore";
import { createOrder, fetchMenuList } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";
import { ShoppingCart } from "lucide-react";
import { CartItem } from "./cart-item";
import { OrderForm } from "./order-form";
import { OrderSummary } from "./order-summary";
import type { MenuItem } from "@/lib/types";

export default function Content() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { cart, addToCart, removeFromCart, clearCart, updateItemPrice } = useCartStore();
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [specialRequests, setSpecialRequests] = useState("");
    const [isOrdering, setIsOrdering] = useState(false);

    const formatPrice = (price: number) => `${price.toLocaleString("ko-KR")}원`;

    // 장바구니 로드 시 최신 가격으로 동기화
    useEffect(() => {
        if (!cart.length) return;

        const storeId = cart[0]?.storeId;
        if (!storeId) return;

        fetchMenuList(String(storeId))
            .then((menus) => {
                cart.forEach((cartItem) => {
                    const currentMenu = menus.find((m: MenuItem) => m.id === cartItem.id);
                    if (currentMenu && currentMenu.price !== cartItem.price) {
                        updateItemPrice(cartItem.id, currentMenu.price);
                    }
                });
            })
            .catch((error) => console.error("가격 동기화 실패:", error));
    }, []);

    const handleQuantityChange = (itemId: number, change: number) => {
        if (change > 0) {
            const item = cart.find((c) => c.id === itemId);
            if (item) addToCart(item);
        } else {
            removeFromCart(itemId);
        }
    };

    const handleOrderPlace = async () => {
        if (!deliveryAddress.trim()) {
            alert("배송 주소를 입력해주세요.");
            return;
        }

        setIsOrdering(true);

        try {
            await createOrder({
                storeId: cart[0]?.storeId,
                items: cart.map((item) => ({ menuId: item.id, qty: item.quantity })),
                deliveryAddress,
                specialRequests,
            });

            await queryClient.invalidateQueries({ queryKey: ['orders'] });

            alert("주문이 완료되었습니다!");
            clearCart();
            navigate("/orders");
        } catch (e) {
            alert(`주문 실패: ${e instanceof Error ? e.message : "알 수 없는 오류"}`);
        } finally {
            setIsOrdering(false);
        }
    };

    if (!cart.length) {
        return (
            <main className="container mx-auto px-4 py-8">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <ShoppingCart />
                        </EmptyMedia>
                        <EmptyTitle>장바구니가 비어있습니다</EmptyTitle>
                        <EmptyDescription>
                            맛있는 음식을 담아보세요!
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button asChild>
                            <Link to="/stores">음식점 둘러보기</Link>
                        </Button>
                    </EmptyContent>
                </Empty>
            </main>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                {cart.map(item => (
                    <CartItem
                        key={item.id}
                        item={item}
                        onQuantityChange={handleQuantityChange}
                        formatPrice={formatPrice}
                    />
                ))}
            </div>

            <OrderForm
                deliveryAddress={deliveryAddress}
                specialRequests={specialRequests}
                onDeliveryAddressChange={setDeliveryAddress}
                onSpecialRequestsChange={setSpecialRequests}
            />

            <OrderSummary
                cartItems={cart}
                deliveryAddress={deliveryAddress}
                formatPrice={formatPrice}
                onOrderPlace={handleOrderPlace}
                isOrdering={isOrdering}
            />
        </div>
    );
}
