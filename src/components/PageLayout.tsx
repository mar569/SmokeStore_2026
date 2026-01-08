import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import AgeVerificationModal from '@/components/AgeVerificationModal';

interface PageLayoutProps {
    children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <Header onSearchOpen={() => setIsSearchOpen(true)} />
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <AgeVerificationModal />

            <main className="flex-1">
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default PageLayout;