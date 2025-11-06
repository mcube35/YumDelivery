import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateStore } from "@/lib/api";
import type { Store, StoreEditRequest } from "@/lib/types";

interface StoreInfoFormProps {
    store: Store;
    onUpdate: () => void;
}

export default function StoreInfoForm({ store, onUpdate }: StoreInfoFormProps) {
    const [formData, setFormData] = useState<StoreEditRequest>({
        name: store.name,
        description: store.description,
        contact: store.contact,
        address: store.address,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // helper to update a single field concisely
    const setField = <K extends keyof StoreEditRequest>(key: K, value: StoreEditRequest[K]) =>
        setFormData((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            await updateStore(store.id, formData);
            setMessage({ type: "success", text: "가게 정보가 수정되었습니다." });
            onUpdate();
        } catch (err: any) {
            setMessage({ type: "error", text: err?.message ?? "가게 정보 수정에 실패했습니다." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>가게 정보 수정</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">가게명 *</Label>
                        <Input id="name" value={formData.name} onChange={(e) => setField("name", e.target.value)} required disabled={loading} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">설명 *</Label>
                        <Input id="description" value={formData.description} onChange={(e) => setField("description", e.target.value)} required disabled={loading} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contact">연락처 *</Label>
                        <Input id="contact" value={formData.contact} onChange={(e) => setField("contact", e.target.value)} required disabled={loading} placeholder="예: 010-1234-5678" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">주소 *</Label>
                        <Input id="address" value={formData.address} onChange={(e) => setField("address", e.target.value)} required disabled={loading} />
                    </div>

                    {message && (
                        <div
                            className={`p-3 rounded-md text-sm ${message.type === "success"
                                ? "bg-green-50 text-green-800 border border-green-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                                }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "수정 중..." : "수정하기"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
