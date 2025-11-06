import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
    to?: string;
}

export default function BackButton({ to }: BackButtonProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <Button variant="ghost" size="sm" onClick={handleClick}>
            <ArrowLeft className="h-4 w-4 mr-2" />
        </Button>
    )
}