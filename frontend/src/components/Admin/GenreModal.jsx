import React, { useState, useEffect } from 'react';
import './GameModal.css'; // Reusing styles

function GenreModal({ isOpen, onClose, onSave, genre }) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (genre) {
      setName(genre.name || '');
    } else {
      setName('');
    }
  }, [genre, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '450px' }}>
        <div className="modal-header">
          <h2>{genre ? 'Editar Categoría' : 'Añadir Categoría'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-sections" style={{ gridTemplateColumns: '1fr', padding: '30px' }}>
            <div className="input-group">
              <label>Nombre de la Categoría</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: RPG, Acción, Aventura..."
                required
                autoFocus
              />
            </div>
          </div>

          <div className="modal-footer" style={{ padding: '20px 30px' }}>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save-confirm">
              {genre ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GenreModal;
