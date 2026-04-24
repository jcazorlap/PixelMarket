import React, { useState, useEffect } from 'react';
import './ScraperModal.css';

const ScraperModal = ({ isOpen, onClose }) => {
  const [modelId, setModelId] = useState('models/gemini-2.5-flash');
  const [urls, setUrls] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const MODELS = [
    { value: 'models/gemini-3.1-pro', label: 'Gemini 3.1 Pro' },
    { value: 'models/gemini-3-flash', label: 'Gemini 3 Flash' },
    { value: 'models/gemini-3.1-flash-live', label: 'Gemini 3.1 Flash Live' },
    { value: 'models/gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
    { value: 'models/gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'models/gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite' },
    { value: 'models/gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    { value: 'models/gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
    { value: 'models/gemini-1.5-flash-8b', label: 'Gemini 1.5 Flash 8B' }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchConfig();
    } else {
      setStatusMsg('');
    }
  }, [isOpen]);

  const fetchConfig = async () => {
    setIsLoading(true);
    setStatusMsg('');
    try {
      const response = await fetch('/api/scraper/config');
      if (response.ok) {
        const data = await response.json();
        setModelId(data.model_id || 'models/gemini-2.5-flash');
        setUrls(data.urls || '');
      } else {
        setStatusMsg('Error al cargar la configuración.');
      }
    } catch (error) {
      console.error('Failed to fetch config:', error);
      setStatusMsg('Error de conexión al servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg('');

    try {
      const response = await fetch('/api/scraper/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model_id: modelId, urls: urls }),
      });

      if (response.ok) {
        setStatusMsg('Configuración guardada correctamente.');
        setTimeout(() => onClose(), 1500);
      } else {
        setStatusMsg('Error al guardar la configuración.');
      }
    } catch (error) {
      console.error('Failed to save config:', error);
      setStatusMsg('Error de conexión al guardar.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container scraper-modal" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Configuración del Scraper</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </header>

        {isLoading ? (
          <div className="scraper-loading">Cargando configuración...</div>
        ) : (
          <form onSubmit={handleSave} className="modal-form">
            <div className="form-sections" style={{ gridTemplateColumns: '1fr', padding: '30px 40px' }}>
              <div className="form-section">

                <div className="input-group">
                  <label>Modelo de Agente Gemini</label>
                  <select
                    value={modelId}
                    onChange={(e) => setModelId(e.target.value)}
                    className="scraper-select"
                    required
                  >
                    {MODELS.map(model => (
                      <option key={model.value} value={model.value}>
                        {model.label}
                      </option>
                    ))}
                  </select>
                  <small className="form-hint">Selecciona el modelo de IA que analizará las webs.</small>
                </div>

                <div className="input-group">
                  <label>URLs a Scrapear</label>
                  <textarea
                    value={urls}
                    onChange={(e) => setUrls(e.target.value)}
                    className="scraper-textarea"
                    placeholder="https://ejemplo.com/juego1&#10;https://ejemplo.com/juego2"
                    rows={8}
                  />
                  <small className="form-hint">Introduce una URL por línea.</small>
                </div>

                {statusMsg && (
                  <div className={`status-msg ${statusMsg.includes('Error') ? 'error' : 'success'}`}>
                    {statusMsg}
                  </div>
                )}

              </div>
            </div>

            <footer className="modal-footer">
              <button type="button" className="btn-cancel" onClick={onClose} disabled={isSaving}>
                Cancelar
              </button>
              <button type="submit" className="btn-save-confirm" disabled={isSaving}>
                {isSaving ? 'Guardando...' : 'Guardar Configuración'}
              </button>
            </footer>
          </form>
        )}
      </div>
    </div>
  );
};

export default ScraperModal;
