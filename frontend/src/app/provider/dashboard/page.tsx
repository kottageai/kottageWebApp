import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'white' }}>
            <Sidebar />
            <main style={{ flex: 1, padding: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>Dashboard</h1>
            </main>
        </div>
    );
} 