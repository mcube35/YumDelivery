import BackButton from "@/components/back-button";

export default function Header() {
    return (
        <header className="sticky top-0 z-10 bg-background border-b">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center gap-4">
                    {/* Back Button */}
                    <BackButton />

                    <h1 className="text-2xl font-bold">내 가게 관리</h1>
                </div>
            </div>
        </header>
    )
}