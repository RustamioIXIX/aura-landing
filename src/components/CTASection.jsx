import { WHATSAPP_URL } from '../data/siteData';

export function CTASection() {
  return (
    <section className="glass cta reveal" id="cta">
      <div className="ctaText">
        <h2>Начните автоматизацию уже сегодня</h2>
        <p>
          Расскажите о вашем бизнесе в WhatsApp, и мы предложим сценарий, который начнёт обрабатывать клиентов уже в
          ближайшее время.
        </p>
      </div>

      <div className="heroActions" style={{ marginTop: 0 }}>
        <a className="btn btnPrimary" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
          <span aria-hidden="true">🟢</span>
          WhatsApp
        </a>
      </div>
    </section>
  );
}
