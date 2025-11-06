import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import MenuAddDialog from "./menu-add-dialog";
import MenuEditDialog from "./menu-edit-dialog";
import MenuList from "./menu-list";

interface MenuManagementProps {
    storeId: number;
    menus: MenuItem[];
    onUpdate: () => void;
}

export default function MenuManagement({ storeId, menus, onUpdate }: MenuManagementProps) {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);

    const handleAddSuccess = () => {
        setShowAddDialog(false);
        onUpdate();
    };

    const handleEditSuccess = () => {
        setEditingMenu(null);
        onUpdate();
    };

    const handleEdit = (menu: MenuItem) => {
        setEditingMenu(menu);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>메뉴 관리</CardTitle>
                        <Button onClick={() => setShowAddDialog(true)} size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            메뉴 추가
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {menus.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            등록된 메뉴가 없습니다. 메뉴를 추가해주세요.
                        </div>
                    ) : (
                        <MenuList 
                            menus={menus} 
                            onEdit={handleEdit}
                            onDelete={onUpdate}
                            storeId={storeId}
                        />
                    )}
                </CardContent>
            </Card>

            <MenuAddDialog
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                storeId={storeId}
                onSuccess={handleAddSuccess}
            />

            <MenuEditDialog
                open={!!editingMenu}
                onOpenChange={(open: boolean) => !open && setEditingMenu(null)}
                storeId={storeId}
                menu={editingMenu}
                onSuccess={handleEditSuccess}
            />
        </>
    );
}
