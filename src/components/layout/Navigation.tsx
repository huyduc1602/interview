import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher, UserMenu } from '@/components/ui';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { MenuToggleIcon } from '@/components/ui/menuToggleIcon';

const commonClasses = {
    link: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium',
    activeLink: 'text-purple-600 dark:text-purple-400',
    settingsLink: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-2',
    navContainer: 'bg-white dark:bg-gray-800 border-b sticky top-0 z-50',
    navInner: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16',
    navContent: 'hidden md:flex items-center gap-8',
    homeLink: 'text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent',
    userActions: 'flex items-center gap-4 pl-8 border-l justify-center sm:justify-between',
    mobileMenu: 'md:hidden absolute top-16 left-0 w-full bg-white dark:bg-gray-800 shadow-lg transition-transform transform',
    mobileMenuOpen: 'h-auto',
    mobileMenuClosed: 'h-0 overflow-hidden',
};

export function Navigation() {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const { t } = useTranslation();
    const user = true; // Assuming user is defined for demonstration purposes
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (isHome) return null;

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className={commonClasses.navContainer}>
            <div className={commonClasses.navInner}>
                <div className="flex items-center gap-2">
                    <Link
                        to="/"
                        className={commonClasses.homeLink}
                    >
                        {t('nav.home')}
                    </Link>
                </div>

                <div className={commonClasses.navContent}>
                    <Link
                        to="/knowledge"
                        className={`${commonClasses.link} ${location.pathname === '/knowledge' ? commonClasses.activeLink : ''}`}
                    >
                        {t('nav.knowledgeBase')}
                    </Link>
                    <Link
                        to="/questions"
                        className={`${commonClasses.link} ${location.pathname === '/questions' ? commonClasses.activeLink : ''}`}
                    >
                        {t('nav.interviewQuestions')}
                    </Link>
                    <Link
                        to="/chat"
                        className={`${commonClasses.link} ${location.pathname === '/chat' ? commonClasses.activeLink : ''}`}
                    >
                        {t('nav.chat')}
                    </Link>

                    {user && (
                        <Link
                            to="/settings"
                            className={commonClasses.settingsLink}
                        >
                            <Settings className="w-4 h-4" />
                            {t('nav.settings')}
                        </Link>
                    )}

                    <div className={commonClasses.userActions}>
                        <LanguageSwitcher />
                        <UserMenu />
                    </div>
                </div>

                <MenuToggleIcon isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
            </div>

            <div className={`${commonClasses.mobileMenu} ${isMobileMenuOpen ? commonClasses.mobileMenuOpen : commonClasses.mobileMenuClosed}`}>
                <Link
                    to="/knowledge"
                    className={`${commonClasses.link} block px-4 py-2 ${location.pathname === '/knowledge' ? commonClasses.activeLink : ''}`}
                    onClick={toggleMobileMenu}
                >
                    {t('nav.knowledgeBase')}
                </Link>
                <Link
                    to="/questions"
                    className={`${commonClasses.link} block px-4 py-2 ${location.pathname === '/questions' ? commonClasses.activeLink : ''}`}
                    onClick={toggleMobileMenu}
                >
                    {t('nav.interviewQuestions')}
                </Link>
                <Link
                    to="/chat"
                    className={`${commonClasses.link} block px-4 py-2 ${location.pathname === '/chat' ? commonClasses.activeLink : ''}`}
                    onClick={toggleMobileMenu}
                >
                    {t('nav.chat')}
                </Link>

                {user && (
                    <Link
                        to="/settings"
                        className={`${commonClasses.settingsLink} block px-4 py-2`}
                        onClick={toggleMobileMenu}
                    >
                        <Settings className="w-4 h-4 inline-block mr-2" />
                        {t('nav.settings')}
                    </Link>
                )}

                <div className="px-4 py-2 flex flex-col gap-4">
                    <LanguageSwitcher />
                    <UserMenu />
                </div>
            </div>
        </nav>
    );
}