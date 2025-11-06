import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addMenu } from "@/lib/api";
import type { MenuAddRequest } from "@/lib/types";

interface MenuAddDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    storeId: number;
    onSuccess: () => void;
}

export default function MenuAddDialog({ open, onOpenChange, storeId, onSuccess }: MenuAddDialogProps) {
    const [formData, setFormData] = useState<MenuAddRequest>({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        category: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await addMenu(storeId, formData);
            // 폼 초기화
            setFormData({
                name: "",
                description: "",
                price: 0,
                stock: 0,
                category: "",
            });
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : "메뉴 추가에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>메뉴 추가</DialogTitle>
                    <DialogDescription>
                        새로운 메뉴를 추가합니다.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="menu-name">메뉴명 *</Label>
                        <Input
                            id="menu-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="menu-description">설명 *</Label>
                        <Input
                            id="menu-description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="menu-category">카테고리 *</Label>
                        <Input
                            id="menu-category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                            disabled={loading}
                            placeholder="예: 메인, 사이드, 음료"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="menu-price">가격 *</Label>
                            <Input
                                id="menu-price"
                                type="number"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="menu-stock">재고 *</Label>
                            <Input
                                id="menu-stock"
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-md text-sm bg-red-50 text-red-800 border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-2 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            취소
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "추가 중..." : "추가"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
