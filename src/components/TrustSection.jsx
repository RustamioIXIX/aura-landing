import { trustItems } from '../data/siteData';

export function TrustSection() {
  return (
    <section className="section">
      <div className="glass trust sectionBlock reveal" id="trust" data-section="trust">
        <div className="sectionTitleBig">Почему нам доверяют</div>
        <div className="trustIntro">
          <h2>Не просто делаем бота, а выстраиваем понятный рабочий инструмент</h2>
          <p>Даже без кейсов можно показать зрелость подхода: прозрачный процесс, быстрый запуск и ориентация на реальные бизнес-результаты.</p>
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
