import { trustItems } from '../data/siteData';

export function TrustSection() {
  return (
    <section className="section">
      <div className="glass trust sectionBlock reveal" id="trust" data-section="trust">
        <div className="sectionTitleBig">Почему нам доверяют</div>
        <div className="trustIntro">
          <h2>Работаем прозрачно, быстро и с фокусом на реальные заявки</h2>
          <p>Строим понятный процесс запуска, где каждый этап ведёт к конкретному рабочему результату для бизнеса.</p>
        </div>

        <div className="trustGrid">
          {trustItems.map((item) => (
            <article key={item.title} className="trustCard reveal">
              <div className="trustDot" aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
