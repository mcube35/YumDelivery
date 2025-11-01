import MenuItemCard from "./item-card";
import type { MenuItem } from "@/lib/types";

interface MenuListProps {
    menuItems: MenuItem[];
    getQuantity: (id: number) => number;
    onAdd: (item: MenuItem) => void;
    onRemove: (itemId: number) => void;
    formatPrice: (price: number) => string;
}

export default function MenuList({ menuItems, getQuantity, onAdd, onRemove, formatPrice }: MenuListProps) {
    const groupByCategory = (items: MenuItem[]) =>
        items.reduce((groups: Record<string, MenuItem[]>, item) => {
            const category = item.category || '기타';
            (groups[category] ||= []).push(item);
            return groups;
        }, {});

    return (
        <div className="space-y-8">
            {Object.entries(groupByCategory(menuItems)).map(([category, items]) => (
                <div key={category}>
                    <h2 className="text-2xl font-bold mb-4">{category}</h2>
                    <div className="grid gap-4">
                        {items.map((item) => (
                            <MenuItemCard
                                key={item.id}
                                item={item}
                                quantity={getQuantity(item.id)}
                                onAdd={onAdd}
                                onRemove={onRemove}
                                formatPrice={formatPrice}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
