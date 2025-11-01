import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-center text-balance">배달앱 데모</h1>
                    <p className="text-lg text-muted-foreground text-center text-pretty max-w-md">
                        맛있는 음식을 빠르게 주문하세요
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button asChild size="lg">
                            <Link to="/login">로그인</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link to="/register">회원가입</Link>
                        </Button>
                        <Button asChild variant="secondary" size="lg">
                            <Link to="/stores">음식점 둘러보기</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}