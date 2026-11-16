import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import {
  Navbar,
  Hero,
  LogoBar,
  LiveEditor,
  TemplateShowcase,
  HowItWorks,
  CVGenerator,
  Testimonials,
  CTA,
  Footer,
} from '../components/landing';

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-[#fdfbf9] dark:bg-[#050507] text-zinc-900 dark:text-zinc-100 selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-400">
      {/* Fixed Header Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main>
        <Hero isLoggedIn={isLoggedIn} />
        <LogoBar />
        <LiveEditor />
        <TemplateShowcase />
        <HowItWorks />
        <CVGenerator />
        <Testimonials />
        <CTA isLoggedIn={isLoggedIn} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
