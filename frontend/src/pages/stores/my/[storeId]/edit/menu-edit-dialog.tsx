import { useState, useEffect } from "react";
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
import { editMenu } from "@/lib/api";
import type { MenuItem, MenuEditRequest } from "@/lib/types";

interface MenuEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    storeId: number;
    menu: MenuItem | null;
    onSuccess: () => void;
}

export default function MenuEditDialog({ open, onOpenChange, storeId, menu, onSuccess }: MenuEditDialogProps) {
    const [formData, setFormData] = useState<MenuEditRequest>({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        category: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (menu) {
            setFormData({
                name: menu.name,
                description: menu.description,
                price: menu.price,
                stock: menu.stock || 0,
                category: menu.category,
            });
        }
    }, [menu]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!menu) return;

        setLoading(true);
        setError(null);

        try {
            await editMenu(storeId, menu.id, formData);
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : "메뉴 수정에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    if (!menu) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>메뉴 수정</DialogTitle>
                    <DialogDescription>
                        메뉴 정보를 수정합니다.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-menu-name">메뉴명 *</Label>
                        <Input
                            id="edit-menu-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-menu-description">설명 *</Label>
                        <Input
                            id="edit-menu-description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-menu-category">카테고리 *</Label>
                        <Input
                            id="edit-menu-category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                            disabled={loading}
                            placeholder="예: 메인, 사이드, 음료"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-menu-price">가격 *</Label>
                            <Input
                                id="edit-menu-price"
                                type="number"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-menu-stock">재고 *</Label>
                            <Input
                                id="edit-menu-stock"
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
                            {loading ? "수정 중..." : "수정"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
