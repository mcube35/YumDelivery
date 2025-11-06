import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import type { MenuItem } from "@/lib/types";

interface MenuItemCardProps {
    item: MenuItem;
    quantity: number;
    onAdd: (item: MenuItem) => void;
    onRemove: (itemId: number) => void;
    formatPrice: (price: number) => string;
}

export default function MenuItemCard({ item, quantity, onAdd, onRemove, formatPrice }: MenuItemCardProps) {
    const QuantityControls = () => (
        quantity === 0 ? (
            <Button size="sm" onClick={() => onAdd(item)} className="px-4">
                담기
            </Button>
        ) : (
            <div className="flex items-center space-x-1">
                <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => onRemove(item.id)}
                >
                    <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-medium text-sm">{quantity}</span>
                <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => onAdd(item)}
                >
                    <Plus className="h-3 w-3" />
                </Button>
            </div>
        )
    );

    return (
        <Card className="overflow-hidden p-3">
            <article className="flex gap-4">
                <img
                    src="/placeholder.svg"
                    alt={item.name}
                    className="w-28 h-28 flex-shrink-0 rounded-lg object-cover"
                />

                <section className="flex flex-1 flex-col justify-between">
                    <header>
                        <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                            {item.description}
                        </p>
                    </header>

                    <footer className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                            {formatPrice(item.price)}
                        </span>
                        <QuantityControls />
                    </footer>
                </section>
            </article>
        </Card>
    );
}