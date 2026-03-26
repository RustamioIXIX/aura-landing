import { workflowSteps } from '../data/siteData';

export function WorkflowSection() {
  return (
    <section className="section">
      <div className="glass feature sectionBlock reveal" id="workflow" data-section="workflow">
        <div className="sectionTitleBig">Как мы работаем</div>
        <div className="workflowIntro">
          <h2>Понятный сценарий запуска без лишней сложности</h2>
          <p>Вы понимаете каждый шаг: от первого сообщения до момента, когда автоматизация начинает обрабатывать заявки в работе.</p>
        </div>

        <div className="workflowGrid">
          {workflowSteps.map((item) => (
            <article key={item.step} className="workflowCard reveal">
              <div className="workflowStep">{item.step}</div>
              <div className="workflowLine" aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
