import HeroSection from '@/components/home/HeroSection';
import LoginChatSection from '@/components/home/LoginChatSection';
import FeaturesGrid from '@/components/home/FeaturesGrid';
import StatsSection from '@/components/home/StatsSection';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <HeroSection />
                <LoginChatSection />
                <FeaturesGrid />
                <StatsSection />
            </div>
        </div>
    );
};

export default HomePage;