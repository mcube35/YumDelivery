import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function CartButton() {
    const { getTotalItems } = useCartStore();
    const totalItems = getTotalItems();

    return (
        <Button size="icon" variant="outline" className="relative" asChild>
            <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                    <Badge
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        variant="destructive"
                    >
                        {totalItems}
                    </Badge>
                )}
            </Link>
        </Button>
    );
}
