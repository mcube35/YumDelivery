import Header from "./header";
import Content from "./content";

export default function MyStoresPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* 헤더 */}
            <Header />

            {/* 메인 컨텐츠 */}
            <main className="container mx-auto px-4 py-6">
                <Content />
            </main>
        </div>
    );
}

