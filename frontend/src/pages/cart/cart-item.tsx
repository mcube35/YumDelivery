import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, Trash2 } from "lucide-react";
import type { CartItem } from "@/lib/types";

interface CartItemProps {
    item: CartItem;
    onQuantityChange: (itemId: number, change: number) => void;
    formatPrice: (price: number) => string;
}

export function CartItem({ item, onQuantityChange, formatPrice }: CartItemProps) {
    const { id, name, price, quantity } = item;

    return (
        <Card>
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1">
                    <h3 className="font-medium">{name}</h3>
                    <p className="text-sm text-muted-foreground">
                        {formatPrice(price)} × {quantity}
                    </p>
                    <p className="font-bold text-primary">
                        {formatPrice(price * quantity)}
                    </p>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => onQuantityChange(id, -1)}
                    >
                        {quantity === 1 ? <Trash2 className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                    </Button>

                    <span className="w-8 text-center font-medium">{quantity}</span>

                    <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => onQuantityChange(id, 1)}
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}