/* eslint-disable max-len */
import { useEffect, useRef, useState } from 'react';
import './assistant.scss';
import { Link, useLocation } from 'react-router-dom';
import { ProductsContext } from '../../context/ProductsContext';
import { useContext } from 'react';
import { makeRequest } from '../../services/utils/makeRequest';
import { ChatMessage } from '../../interfaces/interfaces';

export const Assistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [closing, setClosing] = useState(false);
  const location = useLocation();
  const context = useContext(ProductsContext);
  const [isLoading, setIsLoading] = useState(false);

  const closeDialog = () => {
    setClosing(true);
  };

  useEffect(() => {
    if (closing) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        setClosing(false);
      }, 200);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [closing]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [chat]);

  const parseMessage = (msg: string) => {
    const lines = msg.split('\n');
    const listItems: string[] = [];
    let introText = '';
    let outroText = '';
    let isList = false;
    let listEnded = false;

    lines.forEach(line => {
      const match = line.match(/^(\d+)\.\s*(.*)/);
      const trimmedLine = line.trim();

      if (match) {
        isList = true;
        listEnded = false;
        listItems.push(match[2].trim().replaceAll('**', ''));
      } else {
        if (!isList) {
          introText += trimmedLine ? `${trimmedLine}\n` : '';
        } else {
          if (trimmedLine) {
            if (!listEnded) {
              const isPotentialOutro = !trimmedLine.match(/^- \w+:/);

              if (isPotentialOutro) {
                listEnded = true;
                outroText += `${trimmedLine}\n`;
              } else {
                if (listItems.length > 0) {
                  listItems[listItems.length - 1] += ` ${trimmedLine}`;
                }
              }
            } else {
              outroText += `${trimmedLine}\n`;
            }
          }
        }
      }
    });

    if (listItems.length > 0) {
      return (
        <>
          {introText.trim() && (
            <div className="ai-assistant__list-intro">{introText.trim()}</div>
          )}
          <div className="ai-assistant__product-list">
            {listItems.map((item, index) => {
              const productName = item.split(' - ')[0].trim();
              const productMatch = context.findProductByName(productName);

              return (
                <div key={index} className="ai-assistant__product-item">
                  <div className="ai-assistant__product-content">
                    {productMatch ? (
                      <Link
                        to={`/${productMatch.category}/${productMatch.itemId}`}
                        state={{ location }}
                        className="ai-assistant__product-link"
                        onClick={closeDialog}
                      >
                        <div className="ai-assistant__product-image-container">
                          <img
                            src={productMatch.image}
                            alt={productMatch.name}
                            className="ai-assistant__product-image"
                          />
                          <div className="ai-assistant__product-name">
                            {item}
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div className="ai-assistant__product-name">{item}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {outroText.trim() && (
            <div className="ai-assistant__list-outro">{outroText.trim()}</div>
          )}
        </>
      );
    }

    return (
      <div className="ai-assistant__plain-message">
        {lines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    );
  };

  const askChatGpt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      return;
    }

    setChat(state => [...state, { role: 'Me', message }]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await makeRequest(message);

      setChat(state => [...state, { role: 'ChatGPT', message: response }]);
    } catch (error) {
      setChat(state => [
        ...state,
        {
          role: 'Assistant',
          message: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className={`ai-assistant__fab ${!isOpen ? 'ai-assistant__fab--closed' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Assistant"
      >
        <div className="ai-assistant__fab-content">
          <span className="ai-assistant__fab-text">AI</span>
          <span className="ai-assistant__fab-hover-text">Assistant</span>
        </div>
      </button>

      {isOpen && (
        <>
          <div className="ai-assistant__backdrop" onClick={closeDialog} />
          <div
            className={`ai-assistant__dialog ${closing ? 'ai-assistant__dialog--closing' : ''}`}
          >
            <button
              className="ai-assistant__close-btn"
              onClick={closeDialog}
              aria-label="Close"
            >
              <svg
                className="ai-assistant__close-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="ai-assistant__header">
              <div className="nav__logo" />
            </div>

            <div className="ai-assistant__messages" ref={messagesEndRef}>
              {chat.map((item, i) => (
                <div
                  key={i}
                  className={`ai-assistant__message-bubble ${
                    item.role === 'Me'
                      ? 'ai-assistant__message-bubble--user'
                      : 'ai-assistant__message-bubble--assistant'
                  }`}
                >
                  <div className="ai-assistant__role">{item.role}</div>
                  <div>{parseMessage(item.message)}</div>
                </div>
              ))}

              {isLoading && (
                <div className="ai-assistant__message-bubble ai-assistant__message-bubble--assistant">
                  <div className="ai-assistant__role">Assistant</div>
                  <div className="ai-assistant__loader">
                    <div className="ai-assistant__loader-dot" />
                    <div className="ai-assistant__loader-dot" />
                    <div className="ai-assistant__loader-dot" />
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={askChatGpt} className="ai-assistant__form">
              <div className="ai-assistant__input-group">
                <input
                  type="text"
                  value={message}
                  ref={inputRef}
                  onChange={e => setMessage(e.target.value)}
                  className="ai-assistant__input"
                  placeholder="I can help you to choose..."
                />
                <button type="submit" className="ai-assistant__send-btn">
                  Send
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};
