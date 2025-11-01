import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Store } from "@/lib/types";
import { categoryIcons } from "@/lib/store-data";
import { Info, MapPin, ClipboardList, Settings } from "lucide-react";

interface StoreListProps {
    stores: Store[];
}

export default function StoreList({ stores }: StoreListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store: Store) => (
                <Card key={store.id} className="overflow-hidden h-full">
                    <div className="aspect-video relative overflow-hidden bg-muted">
                        <img
                            src={store.imageUrl || "/placeholder.svg"}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-xl">{store.name}</CardTitle>
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <span>{categoryIcons[store.category]}</span>
                                {store.category}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Info className="h-4 w-4" aria-hidden="true" />
                                    {store.description}
                                </p>
                                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" aria-hidden="true" />
                                    {store.address}
                                </p>
                            </div>

                            {/* 관리 버튼 */}
                            <div className="flex gap-2 pt-2 border-t">
                                <Button
                                    size="sm"
                                    variant="default"
                                    className="flex-1"
                                    asChild
                                >
                                    <Link to={`/stores/my/${store.id}/orders`}>
                                        <ClipboardList className="h-4 w-4 mr-1" />
                                        주문 관리
                                    </Link>
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                    disabled
                                >
                                    <Settings className="h-4 w-4 mr-1" />
                                    가게 수정
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
