import { useState } from 'react';
import './css/AIHealthPage.css';
import Navigation from '../components/Navigation';

function AIHealthPage({}) {
 

  return (
    <div className="ai-health-page">
     

      <div className="ai-health-container">
        <div className="page-header">
          <h2>🤖 AI Destekli Sağlık Analizi</h2>
          <p className="page-desc">
            Evcil hayvanınızın fotoğrafını yükleyerek yapay zeka tabanlı sağlık analizi
            alın
          </p>
        </div>

        <div className="ai-content">
          <div className="upload-section">
            <div className="card">
              <h3>Fotoğraf Yükle</h3>

              <div className="ai-model-select">
                <label className="form-label">AI Model Seçimi</label>
                <select
                  className="form-select"
                  // value={aiModel}
                  // onChange={(e) => setAiModel(e.target.value)}
                  // disabled={!user.isPremium && aiModel !== 'gpt-3.5'}
                  data-testid="ai-model-select"
                >
                  <option value="gpt-3.5">GPT-3.5 (Ücretsiz)</option>
                  <option value="gpt-4" > 
                    GPT-4 (Premium) 
                  </option>
                </select>
                {/* User premium mu diye if else  */}
                  <p className="premium-note">
                    🔒 Gelişmiş AI modelleri için{' '}
                    <span
                      className="premium-link"
                    >
                      premium'a geçin
                    </span>
                  </p>
                {/* User premium mu diye if else  */}
              </div>

              {/* {userPets.length > 0 && ( */}
                <div className="form-group">
                  <label className="form-label">Evcil Hayvan Seç (Opsiyonel)</label>
                  <select
                    className="form-select"
                    // value={selectedPet}
                    // onChange={(e) => setSelectedPet(e.target.value)}
                    data-testid="pet-select"
                  >
                    <option value="">Seçiniz</option>
                    {/* {userPets.map((pet) => ( */}
                      <option key="1" value="Pamuk">
                        Pamuk ('Kopek')
                      </option>
                    {/* user petlerine map yapma */}
                  </select>
                </div>
              {/* User peti var mi diye bakma if else */}

              <div className="file-upload">
                <input
                  type="file"
                  accept="image/*"
                  className="file-upload-input"
                  // onChange={handleImageUpload}
                  data-testid="image-upload-input"
                />
                <label className="file-upload-label">
                  {/* {uploadedImage ? ( */}
                    <img src="image src" alt="Uploaded" className="uploaded-preview" />
                   {/* : ( */}
                    <>
                      <span className="upload-icon">📷</span>
                      <div>
                        <div className="upload-text">Fotoğraf Yükle</div>
                        <div className="upload-hint">
                          Tıklayarak veya sürükleyerek fotoğraf yükleyin
                        </div>
                      </div>
                    </>
                  {/* )} */}
                </label>
              </div>

              <div className="upload-actions">
                {/* {uploadedImage && ( */}
                  <button
                    className="btn-secondary"
                    // onClick={resetAnalysis}
                    data-testid="reset-btn"
                  >
                    Sıfırla
                  </button>
                {/* )} */}
                <button
                  className="btn-primary btn-full"
                  // onClick={handleAnalyze}
                  // disabled={analyzing || !uploadedImage}
                  data-testid="analyze-btn"
                >
                  {/* {analyzing ? 'Analiz Ediliyor...' : '🔍 Analiz Et'} */}
                </button>
              </div>
            </div>

            <div className="card info-card">
              <h4>💡 Nasıl Çalışır?</h4>
              <ul className="info-list">
                <li>Evcil hayvanınızın net bir fotoğrafını çekin</li>
                <li>Fotoğrafı yukarıdaki alana yükleyin</li>
                <li>AI modelimiz fotoğrafı analiz edecek</li>
                <li>Sağlık durumu hakkında rapor alın</li>
              </ul>
              <div className="info-warning">
                <span>⚠️</span>
                <p>
                  Bu analiz kesin tanı değildir. Sağlık sorunu için mutlaka veterinere
                  danışın.
                </p>
              </div>
            </div>
          </div>

          <div className="results-section">
            {/* {analyzing && ( */}
              <div className="card analyzing-card">
                <div className="spinner"></div>
                <h3>Fotoğraf Analiz Ediliyor...</h3>
                <p>Yapay zeka modelimiz fotoğrafınızı inceliyor</p>
              </div>
            {/* )} */}

            {/* {analysis && !analyzing && ( */}
              <div className="card analysis-result">
                <div className="result-header">
                  <h3>📊 Analiz Sonucu</h3>
                  <span className="result-badge">analiz modeli</span>
                </div>

                <div className="result-info">
                  <div className="info-row">
                    <span className="info-label">Tarih:</span>
                    <span>Analiz saati</span>
                  </div>
                  {/* {analysis.petName !== 'Bilinmiyor' && ( */}
                    <div className="info-row">
                      <span className="info-label">Evcil Hayvan:</span>
                      <span>hayvan ismi</span>
                    </div>
                  {/* )} */}
                  <div className="info-row">
                    <span className="info-label">Sağlık Durumu:</span>
                    <span className="status-badge status-good">
                      {/* ✅ {analysis.healthStatus} */}
                    </span>
                  </div>
                </div>

                <div className="findings-section">
                  <h4>Bulgular</h4>
                  {/* {analysis.findings.map((finding, idx) => ( */}
                    <div key="4" className={`finding-item finding-statuleri`}>
                      <div className="finding-header">
                        <span className="finding-icon">
                          {/* {finding.status === 'positive'
                            ? '✅'
                            : finding.status === 'neutral'
                            ? '🔵'
                            : '⚠️'} */}
                        </span>
                        <strong>kategori</strong>
                      </div>
                      <p>bulununan sorun aciklamasi</p>
                    </div>
                  {/* ))} */}
                </div>

                <div className="recommendations-section">
                  <h4>Öneriler</h4>
                  <ul className="recommendations-list">
                    {/* {analysis.recommendations.map((rec, idx) => ( */}
                      <li key="2">rec</li>
                    {/* ))} */}
                  </ul>
                </div>

                <div className="warning-section">
                  <span className="warning-icon">⚠️</span>
                  <p>analiz uyarisi</p>
                </div>

                <button
                  className="btn-primary btn-full"
                  // onClick={() => onNavigate('vet-finder')}
                  data-testid="find-vet-btn"
                >
                  🏥 Veteriner Bul
                </button>
              </div>
            {/* )} */}

            {/* {!analyzing && !analysis && ( */}
              <div className="card empty-results">
                <span className="empty-icon">🔍</span>
                <h3>Henüz Analiz Yapılmadı</h3>
                <p>Fotoğraf yükleyip analiz et butonuna tıklayın</p>
              </div>
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIHealthPage;


