import { useEffect, useMemo, useState } from 'react';
import { CTASection } from './components/CTASection';
import { FAQSection } from './components/FAQSection';
import { FeatureCardsSection } from './components/FeatureCardsSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Modal } from './components/Modal';
import { PricingComparisonSection } from './components/PricingComparisonSection';
import { PricingSection } from './components/PricingSection';
import { TrustSection } from './components/TrustSection';
import { WorkflowSection } from './components/WorkflowSection';
import { modalContent, problems, processSteps, results, solutions } from './data/siteData';

const observedSections = ['problems', 'solutions', 'results', 'process', 'pricing', 'workflow'];

export default function App() {
  const [activeId, setActiveId] = useState('solutions');
  const [activeModalKey, setActiveModalKey] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentModalData = useMemo(() => (activeModalKey ? modalContent[activeModalKey] : null), [activeModalKey]);

  useEffect(() => {
    document.body.classList.toggle('modal-open', Boolean(activeModalKey) || isMenuOpen);
    return () => document.body.classList.remove('modal-open');
  }, [activeModalKey, isMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveModalKey(null);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));

    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    const sections = observedSections.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        let best = null;
        let bestRatio = 0;

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            best = entry.target;
          }
        });

        if (best?.id) setActiveId(best.id);
      },
      { threshold: [0.25, 0.4, 0.55] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    setActiveId(id);
    setActiveModalKey(null);
    setIsMenuOpen(false);
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNavClick = (event, item) => {
    event.preventDefault();

    if (activeModalKey === item.modalKey) {
      setActiveModalKey(null);
      return;
    }

    setActiveId(item.id);
    setActiveModalKey(item.modalKey);
  };

  return (
    <>
      <div className="mobileOverlay" hidden={!isMenuOpen} onClick={() => setIsMenuOpen(false)} />
      <div className="container">
        <Header
          activeId={activeId}
          activeModalKey={activeModalKey}
          isMenuOpen={isMenuOpen}
          onMenuToggle={() => setIsMenuOpen((value) => !value)}
          onMenuClose={() => setIsMenuOpen(false)}
          onNavClick={handleNavClick}
        />
        <Modal
          data={currentModalData}
          isOpen={Boolean(activeModalKey)}
          onClose={() => setActiveModalKey(null)}
          onNavigate={scrollToSection}
        />
        <Hero />
        <FeatureCardsSection id="problems" title="Проблемы" items={problems} />
        <FeatureCardsSection id="solutions" title="Решения" items={solutions} />
        <WorkflowSection />
        <FeatureCardsSection id="process" title="Как это работает" items={processSteps} variant="steps" />
        <FeatureCardsSection id="results" title="Результаты" items={results} />
        <TrustSection />
        <PricingSection />
        <PricingComparisonSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
