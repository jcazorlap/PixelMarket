import React, { useState, useEffect, useRef } from 'react';
import './GameModal.css';

function GameModal({ isOpen, onClose, onSave, game, allGenres = [] }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  
  // Image states
  const [imageMode, setImageMode] = useState('url'); // 'url' or 'file'
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  // Categorías state
  const [selectedGenreIds, setSelectedGenreIds] = useState([]);
  
  // Prices state
  const [prices, setPrices] = useState([]);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (game) {
      setName(game.name || '');
      setDescription(game.description || '');
      setIsVisible(game.is_visible !== false);
      setCoverImageUrl(game.cover_image || '');
      setImageMode('url');
      setImagePreview(game.cover_image || '');
      
      // Load categories
      setSelectedGenreIds(game.genres ? game.genres.map(g => g.id) : []);
      
      // Load prices
      if (game.prices && Array.isArray(game.prices)) {
        setPrices(game.prices.map(p => ({
          store_name: p.store ? p.store.name : '',
          price: p.price || 0,
          url_link: p.url_link || ''
        })));
      } else {
        setPrices([]);
      }
    } else {
      resetForm();
    }
  }, [game, isOpen]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setIsVisible(true);
    setImageMode('url');
    setCoverImageUrl('');
    setCoverImageFile(null);
    setImagePreview('');
    setPrices([]);
    setSelectedGenreIds([]);
  };

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPrice = () => {
    setPrices([...prices, { store_name: '', price: '', url_link: '' }]);
  };

  const handleRemovePrice = (index) => {
    setPrices(prices.filter((_, i) => i !== index));
  };

  const handlePriceFieldChange = (index, field, value) => {
    const newPrices = [...prices];
    newPrices[index][field] = value;
    setPrices(newPrices);
  };

  const toggleGenre = (genreId) => {
    setSelectedGenreIds(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId) 
        : [...prev, genreId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('is_visible', isVisible);
    
    if (imageMode === 'file' && coverImageFile) {
      formData.append('cover_image_file', coverImageFile);
    } else {
      formData.append('cover_image', coverImageUrl);
    }
    
    // Add prices as JSON string
    formData.append('prices', JSON.stringify(prices));
    
    // Add genres as JSON string
    formData.append('genres', JSON.stringify(selectedGenreIds));
    
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{game ? 'Editar Videojuego' : 'Añadir Nuevo Videojuego'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-sections">
            {/* Left Section: Info & Media */}
            <div className="form-section main-info">
              <div className="input-group">
                <label>Nombre del Juego</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Elden Ring"
                  required
                />
              </div>
              
              <div className="input-group">
                <label>Descripción</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Resumen del juego..."
                  rows="3"
                />
              </div>

              {/* Categorías Section */}
              <div className="category-selection">
                <label>Categorías</label>
                <div className="genres-grid">
                  {allGenres.map(genre => (
                    <button
                      key={genre.id}
                      type="button"
                      className={`genre-chip ${selectedGenreIds.includes(genre.id) ? 'active' : ''}`}
                      onClick={() => toggleGenre(genre.id)}
                    >
                      {genre.name}
                    </button>
                  ))}
                  {allGenres.length === 0 && <span className="empty-msg-small">No hay categorías disponibles</span>}
                </div>
              </div>

              <div className="image-management">
                <label>Imagen de Portada</label>
                <div className="mode-toggle">
                  <button 
                    type="button" 
                    className={imageMode === 'url' ? 'active' : ''} 
                    onClick={() => setImageMode('url')}
                  >
                    URL de Red
                  </button>
                  <button 
                    type="button" 
                    className={imageMode === 'file' ? 'active' : ''} 
                    onClick={() => setImageMode('file')}
                  >
                    Subir Archivo
                  </button>
                </div>

                {imageMode === 'url' ? (
                  <input 
                    type="text" 
                    value={coverImageUrl} 
                    onChange={(e) => {
                      setCoverImageUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                ) : (
                  <div className="file-upload-zone" onClick={() => fileInputRef.current.click()}>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      hidden 
                      accept="image/*"
                    />
                    <p>{coverImageFile ? coverImageFile.name : 'Haz clic para seleccionar o arrastra una imagen'}</p>
                  </div>
                )}

                {imagePreview && (
                  <div className="image-preview-container">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="checkbox-field">
                <input 
                  type="checkbox" 
                  id="isVisible" 
                  checked={isVisible} 
                  onChange={(e) => setIsVisible(e.target.checked)} 
                />
                <label htmlFor="isVisible">Visible en el catálogo público</label>
              </div>
            </div>

            {/* Right Section: Platform Prices */}
            <div className="form-section platform-prices">
              <div className="section-header">
                <label>Enlaces de Compra y Precios</label>
                <button type="button" className="btn-add-price" onClick={handleAddPrice}>
                  + Añadir Tienda
                </button>
              </div>

              <div className="prices-list">
                {prices.length === 0 && <p className="empty-msg">No hay tiendas añadidas aún.</p>}
                {prices.map((item, index) => (
                  <div key={index} className="price-item-row">
                    <div className="price-row-inputs">
                      <input 
                        type="text" 
                        placeholder="Tienda (Steam, Epic...)" 
                        value={item.store_name}
                        onChange={(e) => handlePriceFieldChange(index, 'store_name', e.target.value)}
                        required
                      />
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder="Precio (€)" 
                        value={item.price}
                        onChange={(e) => handlePriceFieldChange(index, 'price', e.target.value)}
                        required
                      />
                    </div>
                    <input 
                      type="url" 
                      placeholder="URL del enlace directo" 
                      value={item.url_link}
                      onChange={(e) => handlePriceFieldChange(index, 'url_link', e.target.value)}
                      required
                    />
                    <button type="button" className="btn-remove-price" onClick={() => handleRemovePrice(index)}>
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save-confirm">
              {game ? 'Guardar Cambios' : 'Crear Videojuego'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GameModal;
