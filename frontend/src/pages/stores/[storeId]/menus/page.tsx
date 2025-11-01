import { useParams } from "react-router-dom";
import Header from "./header";
import Content from "./content";

export default function MenusPage() {
    const { storeId } = useParams();
    const currentStoreId = storeId ? parseInt(storeId, 10) : 0;

    return (
        <div className="min-h-screen bg-background">
            {/* 헤더 */}
            <Header storeId={currentStoreId} />

            {/* 메인 컨텐츠 */}
            <main className="container mx-auto px-4 py-6 pb-42">
                <Content storeId={currentStoreId} />
            </main>
        </div>
    );
}