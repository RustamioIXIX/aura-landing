import { navItems, WHATSAPP_URL } from '../data/siteData';

export function Header({ activeId, activeModalKey, isMenuOpen, onMenuToggle, onMenuClose, onNavClick }) {
  return (
    <header className="topbar topbarSticky">
      <div className="brand" aria-label="Бренд">
        <div className="mark" aria-hidden="true" />
        <div className="brandName">AURA.</div>
      </div>

      <button
        className={`menuToggle${isMenuOpen ? ' is-open' : ''}`}
        type="button"
        aria-label="Открыть меню"
        aria-expanded={isMenuOpen}
        aria-controls="siteNavigation"
        onClick={onMenuToggle}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`navPanel${isMenuOpen ? ' is-open' : ''}`}>
        <nav className="navLinks" id="siteNavigation" aria-label="Навигация">
          {navItems.map((item) => (
            <a
              key={item.id}
              className={`navItem${activeId === item.id ? ' is-active' : ''}`}
              href={`#${item.id}`}
              data-modal={item.modalKey}
              aria-expanded={activeModalKey === item.modalKey}
              aria-controls="navModal"
              onClick={(event) => {
                onMenuClose();
                onNavClick(event, item);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          className="btn btnPrimary btnTop"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          onClick={onMenuClose}
        >
          WhatsApp
        </a>
      </div>
    </header>
  );
}
