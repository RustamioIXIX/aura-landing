export function FeatureCardsSection({ id, title, items, variant = 'list' }) {
  const gridClass = variant === 'steps' ? 'stepsGrid' : 'listGrid';

  return (
    <section className="section">
      <div id={id} className="glass feature sectionBlock reveal" data-section={id}>
        <div className="sectionTitle">{title}</div>
        <div className={gridClass}>
          {items.map((item) => (
            <div key={item.title} className={`card reveal${variant === 'steps' ? ' step' : ''}`}>
              {variant === 'steps' ? <div className="stepNum">{item.step}</div> : null}

              {variant === 'list' ? (
                <div className="cardTop">
                  <div className={id === 'problems' ? 'badge' : 'ico'} aria-hidden="true">
                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              ) : (
                <>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
