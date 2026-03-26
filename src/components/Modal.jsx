export function Modal({ data, isOpen, onClose, onNavigate }) {
  return (
    <div
      className={`modalLayer${isOpen ? ' is-open' : ''}`}
      id="navModal"
      aria-hidden={isOpen ? 'false' : 'true'}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modalCard" role="dialog" aria-modal="true" aria-labelledby="navModalTitle" aria-describedby="navModalDesc">
        <div className="modalHeader">
          <div>
            <div className="modalEyebrow">{data?.eyebrow ?? 'AURA'}</div>
            <h2 className="modalTitle" id="navModalTitle">
              {data?.title}
            </h2>
            <p className="modalDesc" id="navModalDesc">
              {data?.description}
            </p>
          </div>

          <button className="modalClose" type="button" onClick={onClose} aria-label="Закрыть окно">
            ✕
          </button>
        </div>

        <ul className="modalList">
          {data?.items?.map((item) => (
            <li key={item}>
              <strong>{item}</strong>
            </li>
          ))}
        </ul>

        {data?.sectionId ? (
          <div className="modalActions">
            <button className="btn btnPrimary" type="button" onClick={() => onNavigate(data.sectionId)}>
              {data.actionLabel ?? 'Перейти к разделу'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
