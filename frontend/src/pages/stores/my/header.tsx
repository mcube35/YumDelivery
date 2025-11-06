import BackButton from "@/components/back-button";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Header() {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-10 bg-background border-b">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Back Button */}
                        <BackButton to="/stores" />

                        <h1 className="text-2xl font-bold">내 가게 관리</h1>
                    </div>

                    {/* 입점 신청 버튼 */}
                    <Button
                        onClick={() => navigate("/stores/my/apply")}
                        size="sm"
                        className="gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        입점 신청
                    </Button>
                </div>
            </div>
        </header>
    )
}