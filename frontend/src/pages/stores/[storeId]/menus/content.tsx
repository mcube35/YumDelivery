import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCartStore } from "@/store/useCartStore";
import { fetchMenuList } from "@/lib/api";
import type { MenuItem } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import MenuList from "./menu-list";
import CartSummary from "./cart-summary";

interface ContentProps {
    storeId: number;
}

export default function Content({ storeId }: ContentProps) {
    const { data: menuItems = [], isLoading, error } = useQuery({
        queryKey: ['menus', storeId],
        queryFn: () => fetchMenuList(storeId),
        enabled: !!storeId,
    });

    const { cart, addToCart: storeAddToCart, removeFromCart, replaceCart } = useCartStore();
    const [showAlert, setShowAlert] = useState(false);
    const [pendingItem, setPendingItem] = useState<MenuItem | null>(null);

    const handleAddToCart = (item: MenuItem) => {
        if (!storeAddToCart(item)) {
            setPendingItem(item);
            setShowAlert(true);
        }
    };

    const handleAlertResponse = (confirmed: boolean) => {
        if (confirmed && pendingItem) {
            replaceCart(pendingItem);
        }
        setPendingItem(null);
        setShowAlert(false);
    };

    const getQuantity = (id: number) => cart.find(item => item.id === id)?.quantity || 0;
    const formatPrice = (price: number) => `${price.toLocaleString('ko-KR')}원`;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner className="size-8" />
            </div>
        );
    }

    if (error) {
        const message = error instanceof Error ? error.message : "데이터를 불러오는데 실패했습니다.";
        return (
            <Card className="border-destructive">
                <CardContent className="pt-6">
                    <p className="text-destructive text-center">{message}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <MenuList
                menuItems={menuItems}
                getQuantity={getQuantity}
                onAdd={handleAddToCart}
                onRemove={removeFromCart}
                formatPrice={formatPrice}
            />

            {/* 장바구니 요약 */}
            <CartSummary
                formatPrice={formatPrice}
                storeId={storeId}
            />

            {/* 장바구니 변경 확인 다이얼로그 */}
            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>장바구니 변경</AlertDialogTitle>
                        <AlertDialogDescription>
                            장바구니에 한 가게의 메뉴만 담을 수 있습니다. 기존 장바구니를 비우고 새로운 메뉴를 담으시겠습니까?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => handleAlertResponse(false)}>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleAlertResponse(true)}>담기</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
