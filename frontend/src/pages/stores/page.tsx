
import Header from "@/pages/stores/header";
import Content from "@/pages/stores/content";


export default function StoresPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-6">
                <Content />
            </main>
        </div>
    );
}