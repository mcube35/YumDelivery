import Header from "./header";
import Content from "./content";

export default function OrdersPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* 헤더 */}
            <Header />

            {/* 메인 컨텐츠 */}
            <main className="container mx-auto px-4 py-6 max-w-4xl">
                <Content />
            </main>
        </div>
    );
}
