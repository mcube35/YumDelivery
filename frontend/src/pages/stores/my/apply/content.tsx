import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { applyStoreEntry } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Content() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        contact: "",
        address: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);
        try {
            await applyStoreEntry(formData);
            alert("입점 신청이 완료되었습니다!");
            navigate("/stores/my");
        } catch (error) {
            console.error("입점 신청 실패:", error);
            alert("입점 신청에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateField = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    return (
        <main className="container mx-auto px-4 py-6">
            <Card>
                <CardHeader>
                    <CardTitle>가게 정보 입력</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">가게 이름 *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={updateField("name")}
                                placeholder="가게 이름을 입력하세요"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">가게 설명 *</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={updateField("description")}
                                placeholder="가게 설명을 입력하세요"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contact">연락처 *</Label>
                            <Input
                                id="contact"
                                value={formData.contact}
                                onChange={updateField("contact")}
                                placeholder="010-1234-5678"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">주소 *</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={updateField("address")}
                                placeholder="가게 주소를 입력하세요"
                                required
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/stores/my")}
                                disabled={isSubmitting}
                                className="flex-1"
                            >
                                취소
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1"
                            >
                                {isSubmitting ? "신청 중..." : "입점 신청"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
