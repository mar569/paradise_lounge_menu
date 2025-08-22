
export default function PageLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <main className="relative min-h-screen ">
                {children}

            </main>
        </>
    )
}
