import { useState } from 'react';
import './index.css';

interface MarketResult {
  market: string;
  predicted_price: number;
}

const COMMODITIES = [
  'Bananas', 'Beans', 'Beans (mung)', 'Cabbage', 'Carrots', 'Chili (red, dry raw)', 
  'Coconut', 'Cowpeas (whole, average)', 'Eggplants', 'Eggs', 'Fish (dry, katta)', 
  'Fish (dry, sprats)', 'Fish (goldstripe sardinella)', 'Fish (jack)', 'Fish (sail fish)', 
  'Fish (skipjack tuna)', 'Fish (trenched sardinella)', 'Fish (yellowfin tuna)', 'Lentils', 'Meat (chicken, broiler)', 
  'Meat (chicken, fresh)', 'Oil (coconut)', 'Onions (imported)', 'Onions (red)', 
  'Onions (red, imported)', 'Onions (red, local)', 'Papaya', 'Pineapples', 
  'Potatoes (imported)', 'Potatoes (local)', 'Pumpkin', 'Rice (long grain)', 
  'Rice (medium grain)', 'Rice (red nadu)', 'Rice (red)', 'Rice (white)', 
  'Snake gourd', 'Sugar', 'Tomatoes', 'Wheat flour'
];

const MARKETS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Bandarawela', 'Batticaloa', 
  'Colombo City', 'Dammbagalla', 'Dehiattakandiya', 'Economic Centre - Peliyagoda', 
  'Economic Centre-Dambulla', 'Economic Centre-Maradagahamula', 'Economic Centre-Pettah', 
  'Embilipitiya', 'Fish market-Negombo', 'Fish market-Peliyagoda', 'Galenbindunuwewa', 
  'Galle', 'Gampaha', 'Hambantota', 'Hanguranketha', 'Jaffna', 'Kalutara', 'Kandy', 
  'Kegalle', 'Keppetipola (DEC}', 'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 
  'Matara', 'Meegoda(DEC)', 'Monaragala', 'Mulaitivu', 'Mullativu', 'National Average', 
  'Nikaweratiya', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Rathnapura', 
  'Thambuttegama', 'Tissamaharama', 'Trincomalee', 'Vavuniya'
];

export default function App() {
  const [activeView, setActiveView] = useState<'price-view' | 'market-view'>('price-view');
  
  
  const [commodity1, setCommodity1] = useState('Rice (red nadu)');
  const [market, setMarket] = useState('Colombo City');
  const [month1, setMonth1] = useState('10');
  const [year1, setYear1] = useState('2026');
  
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [isLoading1, setIsLoading1] = useState(false);

  
  const [commodity2, setCommodity2] = useState('Rice (red nadu)');
  const [month2, setMonth2] = useState('10');
  const [year2, setYear2] = useState('2026');
  
  const [bestMarkets, setBestMarkets] = useState<MarketResult[]>([]);
  const [isLoading2, setIsLoading2] = useState(false);

  const handlePredictPrice = async () => {
    setIsLoading1(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          market,
          commodity: commodity1,
          year: parseInt(year1, 10),
          month: parseInt(month1, 10)
        })
      });
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      setPredictedPrice(data.predicted_price);
    } catch (error) {
      console.error(error);
      alert('Failed to connect to backend.');
    } finally {
      setIsLoading1(false);
    }
  };

  const handleAnalyzeMarkets = async () => {
    setIsLoading2(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/analyze-markets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commodity: commodity2,
          year: parseInt(year2, 10),
          month: parseInt(month2, 10)
        })
      });
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      setBestMarkets(data.highly_recommended_markets);
    } catch (error) {
      console.error(error);
      alert('Failed to connect to backend.');
    } finally {
      setIsLoading2(false);
    }
  };

  return (
    <>
      <aside className="sidebar">
        <div className={`nav-item ${activeView === 'price-view' ? 'active' : ''}`} onClick={() => setActiveView('price-view')}>
          Local Food Price Predictor
        </div>
        <div className={`nav-item ${activeView === 'market-view' ? 'active' : ''}`} onClick={() => setActiveView('market-view')}>
          Cheapeast Market Predictor
        </div>
      </aside>

      <main>
       <div className={`view-section ${activeView === 'price-view' ? 'active' : ''}`}>
          <h1>Check Expected Local Retail Prices</h1>
          <div className="content-grid">
            <div className="card">
              <div className="form-group">
                <label>Agricultural Commodity</label>
                <select className="select-box" value={commodity1} onChange={e => setCommodity1(e.target.value)}>
                  {COMMODITIES.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Market Location</label>
                <select className="select-box" value={market} onChange={e => setMarket(e.target.value)}>
                  {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Month (1 - 12)</label>
                  <input type="number" min="1" max="12" className="input-box" value={month1} onChange={e => setMonth1(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Year</label>
                  <input type="number" className="input-box" value={year1} onChange={e => setYear1(e.target.value)} />
                </div>
              </div>
              <button className="btn-primary" style={{ marginTop: '25px' }} onClick={handlePredictPrice} disabled={isLoading1}>
                {isLoading1 ? 'Predicting...' : 'Predict Retail Price'}
              </button>
            </div>
            <div>
              <div className="result-card">
                <div className="result-subtitle">Expected Retail Price</div>
                <div className="price-display">
                  <span className="currency-label">LKR</span>
                  <span className="price-value">{predictedPrice !== null ? predictedPrice.toFixed(2) : '---'}</span>
                  <span className="price-unit">/ kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`view-section ${activeView === 'market-view' ? 'active' : ''}`}>
          <h1>Find the expected Cheapest Markets</h1>
          <div className="content-grid">
            <div className="card">
              <div className="form-group">
                <label>Agricultural Commodity</label>
                <select className="select-box" value={commodity2} onChange={e => setCommodity2(e.target.value)}>
                  {COMMODITIES.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Month (1 - 12)</label>
                  <input type="number" min="1" max="12" className="input-box" value={month2} onChange={e => setMonth2(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Year</label>
                  <input type="number" className="input-box" value={year2} onChange={e => setYear2(e.target.value)} />
                </div>
              </div>
              <button className="btn-primary" style={{ marginTop: '25px' }} onClick={handleAnalyzeMarkets} disabled={isLoading2}>
                {isLoading2 ? 'Scanning Markets...' : 'Find Cheapest Markets'}
              </button>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>
                Top 3 Cheapest Markets (Retail)
              </div>
              <div className="market-stack">
                {bestMarkets.length > 0 ? (
                  bestMarkets.map((m, index) => (
                    <div className="market-result-card" key={index}>
                      <div className="market-name">{m.market}</div>
                      <div className="market-price-tag" style={{color: '#047857'}}>
                        LKR {m.predicted_price.toFixed(2)} <span>/kg</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="market-result-card" style={{ opacity: 0.5 }}>
                    <div className="market-name">Select parameters & scan...</div>
                    <div className="market-price-tag">LKR --- <span>/kg</span></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}