import { pricingComparison, pricingPlans } from '../data/siteData';

export function PricingComparisonSection() {
  return (
    <section className="section">
      <div className="glass comparison sectionBlock reveal" id="comparison" data-section="comparison">
        <div className="sectionTitleBig">Сравнение тарифов</div>
        <p className="comparisonLead">Сделали сравнение проще: у каждого тарифа видно, для кого он подходит и что именно вы получаете.</p>

        <div className="comparisonCards">
          {pricingPlans.map((plan) => (
            <article key={plan.name} className={`comparisonCard reveal${plan.popular ? ' popular' : ''}`}>
              <div className={`pricingBadge${plan.popular ? ' is-hot' : ''}`}>{plan.badge}</div>
              <h3>{plan.name}</h3>
              <p className="comparisonAudience">{plan.audience}</p>

              <ul className="comparisonList">
                {pricingComparison.map((row) => (
                  <li key={`${plan.name}-${row.key}`}>
                    <span>{row.label}</span>
                    <strong>{plan.comparison[row.key]}</strong>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
