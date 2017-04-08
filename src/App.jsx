import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/routing/ScrollToTop';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CookieConsent from './components/layout/CookieConsent';
import WhatsAppFab from './components/layout/WhatsAppFab';
import LocaleLayout from './i18n/LocaleLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PortfolioPage from './pages/PortfolioPage';
import ToolsPage from './pages/ToolsPage';
import ToolPage from './pages/ToolPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';
import { legacyToolRedirects } from './data/tools';

const contentRoutes = (
  <>
    <Route index element={<HomePage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="portfolio" element={<PortfolioPage />} />
    <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
    <Route path="terms-and-conditions" element={<TermsPage />} />
    <Route path="tools" element={<ToolsPage />} />
    {Object.entries(legacyToolRedirects).map(([from, to]) => {
      const routePath = from.replace(/^\//, '');
      return <Route key={routePath} path={routePath} element={<Navigate to={to} replace />} />;
    })}
    <Route path="tools/:toolId/:app?" element={<ToolPage />} />
  </>
);

function App() {
  return (
    <div className="site-layout">
      <ScrollToTop />
      <Navbar />
      <main className="site-main">
        <Routes>
          <Route element={<LocaleLayout locale="en" />}>{contentRoutes}</Route>
          <Route path="/de" element={<LocaleLayout locale="de" />}>
            {contentRoutes}
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <CookieConsent />
      <WhatsAppFab />
    </div>
  );
}

export default App;
