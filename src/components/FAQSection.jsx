import { useState } from 'react';
import { faqItems } from '../data/siteData';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="section">
      <div className="glass faq sectionBlock reveal" id="faq" data-section="faq">
        <div className="sectionTitleBig">FAQ</div>
        <div className="faqIntro">
          <h2>Частые вопросы перед запуском</h2>
          <p>Собрали самые частые вопросы, которые помогают быстрее понять формат работы, сроки и состав запуска.</p>
        </div>

        <div className="faqList">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <article key={item.question} className={`faqItem${isOpen ? ' is-open' : ''}`}>
                <button
                  className="faqQuestion"
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span>{item.question}</span>
                  <span className="faqIcon" aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                <div className="faqAnswer" hidden={!isOpen}>
                  <p>{item.answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
