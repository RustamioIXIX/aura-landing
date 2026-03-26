import { heroContent, WHATSAPP_URL } from '../data/siteData';

export function Hero() {
  return (
    <section className="hero">
      <div className="glass heroMain reveal is-visible">
        <div className="kicker">
          <span className="spark" aria-hidden="true" />
          {heroContent.kicker}
        </div>

        <h1>
          <span className="h1White">{heroContent.title}</span>
          <span className="h1Grad"> Больше заявок, меньше ручной рутины.</span>
        </h1>

        <p className="lead">{heroContent.subtitle}</p>

        <div className="heroHighlights" aria-label="Преимущества">
          {heroContent.highlights.map((item) => (
            <span key={item} className="heroHighlight">
              {item}
            </span>
          ))}
        </div>

        <div className="heroActions">
          <a className="btn btnPrimary" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <span aria-hidden="true">💬</span>
            {heroContent.ctaPrimary}
          </a>

          <a className="btn btnGhost" href="#workflow">
            <span aria-hidden="true">⚡</span>
            {heroContent.ctaSecondary}
          </a>
        </div>

        <div className="heroMock" aria-hidden="true">
          <div className="heroMockFrame">
            <div className="heroMockGrid">
              <div className="heroMockPanel heroMockPanelA">
                <div className="mockStack">
                  <div className="mockTopRow">
                    <div className="mockChip mockChipTg">TG</div>
                    <div className="mockChip mockChipWa">WA</div>
                  </div>
                  <div className="mockBubble mockBubbleLeft">Здравствуйте! Какая задача у вашего бизнеса сейчас самая приоритетная?</div>
                  <div className="mockBubble mockBubbleRight">
                    {'{заявка} → '} <span className="mockStrong">в работу без задержки</span>
                  </div>
                  <div className="mockBubble mockBubbleLeft">Бот уточняет детали, собирает контакт и передаёт клиента в следующий этап.</div>
                </div>
              </div>

              <div className="heroMockPanel heroMockPanelB">
                <div className="mockBoard">
                  <div className="mockBoardTitle">
                    <span className="mockPulseDot" aria-hidden="true" />
                    Автоматизация заявок
                  </div>

                  <div className="mockProgress">
                    <div className="mockProgressRow">
                      <span>Обработано сегодня</span>
                      <b>24</b>
                    </div>
                    <div className="mockBar">
                      <span className="mockBarFill" />
                    </div>
                  </div>

                  <div className="mockBoardMsgs">
                    <div className="mockMsg mockMsgTg">Telegram: клиент квалифицирован</div>
                    <div className="mockMsg mockMsgWa">WhatsApp: заявка передана менеджеру</div>
                  </div>

                  <div className="mockInputRow">
                    <div className="mockInputFake">Сценарий: заявка → уточнение → квалификация → передача в работу</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
