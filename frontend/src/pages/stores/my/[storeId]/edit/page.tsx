import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import StoreInfoForm from "./store-info-form";
import MenuManagement from "./menus";
import { fetchStoreList, fetchMenuList } from "@/lib/api";
import type { Store, MenuItem } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";

export default function StoreEditPage() {
    const { storeId } = useParams<{ storeId: string }>();
    const navigate = useNavigate();
    const [store, setStore] = useState<Store | null>(null);
    const [menus, setMenus] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadStoreData();
    }, [storeId]);

    const loadStoreData = async () => {
        try {
            setLoading(true);
            setError(null);

            // 가게 정보 가져오기
            const storesData = await fetchStoreList();
            const currentStore = storesData.find((s: Store) => s.id === Number(storeId));

            if (!currentStore) {
                throw new Error("가게를 찾을 수 없습니다.");
            }
            setStore(currentStore);

            // 메뉴 정보 가져오기
            const menusData = await fetchMenuList(storeId!);
            setMenus(menusData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleMenuUpdate = () => {
        // 메뉴가 변경되면 다시 로드
        loadStoreData();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Spinner className="size-8" />
            </div>
        );
    }

    if (error || !store) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-destructive">{error || "가게를 찾을 수 없습니다."}</p>
                        <div className="flex justify-center mt-4">
                            <Button onClick={() => navigate("/stores/my")}>
                                목록으로 돌아가기
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/stores/my")}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    내 가게 목록으로
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">가게 관리</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Tabs defaultValue="store-info" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="store-info">가게 정보</TabsTrigger>
                    <TabsTrigger value="menus">메뉴 관리</TabsTrigger>
                </TabsList>

                <TabsContent value="store-info">
                    <StoreInfoForm store={store} onUpdate={loadStoreData} />
                </TabsContent>

                <TabsContent value="menus">
                    <MenuManagement
                        storeId={Number(storeId)}
                        menus={menus}
                        onUpdate={handleMenuUpdate}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
