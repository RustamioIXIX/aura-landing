import { pricingPlans, WHATSAPP_URL } from '../data/siteData';

export function PricingSection() {
  return (
    <section className="section">
      <div className="glass pricing sectionBlock reveal" id="pricing" data-section="pricing">
        <div className="pricingHead">
          <div className="pricingIntro">
            <div className="sectionTitleBig">Тарифы</div>
            <p>Тарифы собраны так, чтобы вы могли быстро выбрать формат запуска: от точечного старта до комплексной автоматизации под ключ.</p>
          </div>

          <div className="pricingNote">Скидка действует на запуск в этом месяце</div>
        </div>

        <div className="pricingGrid">
          {pricingPlans.map((plan) => (
            <article key={plan.name} className={`pricingCard reveal${plan.popular ? ' popular' : ''}`}>
              <div className="pricingTop">
                <div className={`pricingBadge${plan.popular ? ' is-hot' : ''}`}>{plan.badge}</div>
                <p className="pricingAudience">{plan.audience}</p>
              </div>

              <h3 className="pricingName">{plan.name}</h3>
              <p className="pricingText">{plan.description}</p>

              <div className="priceWrap">
                <span className="oldPrice">{plan.oldPrice}</span>
                <div className="newPrice">
                  <strong>{plan.newPrice}</strong>
                  <span className="discountPill">{plan.discount}</span>
                </div>
                <div className="pricingValue">{plan.value}</div>
              </div>

              <ul className="pricingFeatures">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <div className="pricingCta">
                <a
                  className={`btn ${plan.buttonVariant === 'primary' ? 'btnPrimary' : 'btnGhost'}`}
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {plan.buttonLabel}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
