import BackButton from "@/components/back-button";

export default function Header() {
    return (
        <header className="sticky top-0 z-10 bg-card border-b">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center relative">
                    {/* Back Button */}
                    <BackButton />

                    <h1 className="text-2xl font-bold ml-4">내 주문 내역</h1>
                </div>
            </div>
        </header>
    );
}
