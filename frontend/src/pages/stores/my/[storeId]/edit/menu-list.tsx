import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Edit2, Trash2 } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import { deleteMenu } from "@/lib/api";

interface MenuListProps {
    menus: MenuItem[];
    onEdit: (menu: MenuItem) => void;
    onDelete: () => void;
    storeId: number;
}

export default function MenuList({ menus, onEdit, onDelete, storeId }: MenuListProps) {
    const [deletingMenu, setDeletingMenu] = useState<MenuItem | null>(null);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!deletingMenu) return;

        setLoading(true);
        try {
            await deleteMenu(storeId, deletingMenu.id);
            setDeletingMenu(null);
            onDelete();
        } catch (error) {
            alert(error instanceof Error ? error.message : "메뉴 삭제에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="space-y-3">
                {menus.map((menu) => (
                    <Card key={menu.id} className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-lg">{menu.name}</h3>
                                    <span className="text-xs bg-muted px-2 py-1 rounded">
                                        {menu.category}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                    {menu.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="font-semibold text-primary">
                                        {menu.price.toLocaleString()}원
                                    </span>
                                    {menu.stock !== undefined && (
                                        <span className="text-muted-foreground">
                                            재고: {menu.stock}개
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onEdit(menu)}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setDeletingMenu(menu)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <AlertDialog open={!!deletingMenu} onOpenChange={(open) => !open && setDeletingMenu(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>메뉴 삭제</AlertDialogTitle>
                        <AlertDialogDescription>
                            정말로 "{deletingMenu?.name}" 메뉴를 삭제하시겠습니까?
                            <br />
                            이 작업은 되돌릴 수 없습니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>취소</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={loading}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {loading ? "삭제 중..." : "삭제"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
