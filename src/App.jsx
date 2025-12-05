import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [product, setProduct] = useState('');
  const [vibe, setVibe] = useState('Luxury'); 
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false); 
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!product) return;
    
    setLoading(true);
    setImageLoading(false); 
    setError('');
    setResult(null);

    try {
      const response = await axios.post('https://brand-rocket-backend.onrender.com/api/generate', { 
        product, 
        vibe 
      });
      
      setResult(response.data);
      setImageLoading(true); 
    } catch (err) {
      console.error(err);
      setError('The AI is sleeping. Try again in 1 minute!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>🚀 Brand<span className="gradient-text">Rocket</span></h1>
        <p>AI Marketing Studio: Turn a product name into a campaign instantly.</p>
      </header>

      <div className="input-section">
        <input 
          type="text" 
          placeholder="e.g. Vintage Leather Jacket" 
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />
        
        <select value={vibe} onChange={(e) => setVibe(e.target.value)}>
          <option value="Luxury">✨ Luxury</option>
          <option value="Cyberpunk">🤖 Cyberpunk</option>
          <option value="Minimalist">⚪ Minimalist</option>
          <option value="Vintage">🎞️ Vintage</option>
          <option value="Funny">🤪 Funny</option>
        </select>

        <button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Thinking...' : 'Launch Campaign 🚀'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result-card">
          <div className="image-container">
            {imageLoading && (
              <div className="skeleton-loader">
                <div className="spinner"></div>
                <p>Image loading...</p>
              </div>
            )}

            <img 
              src={`https://image.pollinations.ai/prompt/${encodeURIComponent(result.imagePrompt)}?width=1024&height=1024&model=flux&nologo=true`} 
              alt="AI Generated Ad" 
              style={{ display: imageLoading ? 'none' : 'block' }} 
              onLoad={() => setImageLoading(false)} 
            />
          </div>
          
          <div className="caption-box">
            <h3>📸 Instagram Caption</h3>
            <p>{result.caption}</p>
            <button className="copy-btn" onClick={() => navigator.clipboard.writeText(result.caption)}>
              Copy Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;