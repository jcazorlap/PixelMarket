import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ContactPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFormData(prev => ({
      ...prev,
      subject: '',
      message: ''
    }));
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error(data.message || 'Error al enviar el mensaje');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="contact-container">
        {submitted ? (
          <div className="contact-card success-message">
            <div className="success-icon-container">
              <svg className="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="success-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="success-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            <h2>¡Mensaje Enviado!</h2>
            <p>Gracias por contactarnos, <span className="user-highlight">{formData.name}</span>. Hemos recibido tu consulta y te responderemos lo antes posible.</p>
            <button onClick={handleReset} className="submit-btn secondary-btn">
              Volver a escribir
            </button>
          </div>
        ) : (
          <>
            <div className="hero contact-hero">
              <h1>Contacta con <span className="gradient-text">Nosotros</span></h1>
              <p>¿Tienes alguna duda o problema? Estamos aquí para ayudarte.</p>
            </div>

            <div className="contact-card">
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="name">Nombre</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      required
                      className="contact-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      required
                      className="contact-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Asunto</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="¿En qué podemos ayudarte?"
                    required
                    className="contact-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Mensaje</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Escribe tu mensaje aquí..."
                    required
                    className="contact-input contact-textarea"
                    rows="5"
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar Mensaje'}
                  {!loading && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>}
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      <style>{`
        .contact-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1.5rem 6rem;
          animation: fadeIn 0.8s ease;
        }

        .contact-card {
          background: var(--glass);
          backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: 2rem;
          padding: 3rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        label {
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.9rem;
          margin-left: 0.5rem;
        }

        .contact-input {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          border-radius: 1rem;
          padding: 1rem 1.25rem;
          color: #fff;
          font-family: inherit;
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .contact-input:focus {
          border-color: var(--accent-primary);
          background: rgba(255, 255, 255, 0.07);
          box-shadow: var(--neon-shadow);
          transform: translateY(-2px);
        }

        .contact-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .submit-btn {
          margin-top: 1rem;
          background: var(--accent-primary);
          border: none;
          color: #fff;
          padding: 1.25rem;
          border-radius: 1rem;
          font-weight: 800;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: var(--neon-shadow);
        }

        .submit-btn:hover {
          transform: scale(1.02) translateY(-3px);
          filter: brightness(1.1);
        }

        .secondary-btn {
          background: var(--glass);
          border: 1px solid var(--glass-border);
          margin-top: 2rem;
          padding: 1rem 2rem;
        }

        .secondary-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--accent-primary);
        }

        .success-message {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          padding: 6rem 3rem;
          animation: scaleUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .success-icon-container {
          width: 100px;
          height: 100px;
          margin-bottom: 2rem;
        }

        .success-checkmark {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: block;
          stroke-width: 2;
          stroke: var(--accent-success);
          stroke-miterlimit: 10;
          box-shadow: inset 0px 0px 0px var(--accent-success);
          animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
        }

        .success-checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: var(--accent-success);
          fill: none;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }

        .success-checkmark-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }

        @keyframes stroke {
          100% { stroke-dashoffset: 0; }
        }

        @keyframes fill {
          100% { box-shadow: inset 0px 0px 0px 50px rgba(68, 201, 151, 0.1); }
        }

        .success-message h2 {
          font-size: 3rem;
          margin: 0;
          font-family: 'Outfit', sans-serif;
          background: linear-gradient(to right, #fff, var(--accent-success));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .success-message p {
          color: var(--text-muted);
          font-size: 1.3rem;
          max-width: 500px;
          line-height: 1.6;
        }

        .user-highlight {
          color: var(--accent-primary);
          font-weight: 700;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 1.25rem;
          border-radius: 1rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(239, 68, 68, 0.2);
          text-align: center;
          font-weight: 600;
          animation: shake 0.5s ease;
        }

        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @media (max-width: 640px) {
          .form-group-row { grid-template-columns: 1fr; }
          .contact-card { padding: 2rem; }
          .contact-container { padding-top: 0; }
          .success-message h2 { font-size: 2rem; }
        }
      `}</style>
    </>
  );
};

export default ContactPage;
