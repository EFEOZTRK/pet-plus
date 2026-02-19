import { useState } from "react";
import "./css/AiHealthPage.css";
import ReactMarkdown from "react-markdown";

const AiHealthPage = () => {
  
  //Ui states for the image upload
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  // User message input field state
  const [message, setMessage] = useState("");
  // Chat history state for both frontend render and backend chat context
  const [chatHistory, setChatHistory] = useState([
  {
  role: "system",
  content: `
  You are a veterinary assistant.
  Format answers clearly using:
  - short paragraphs
  - bullet points
  - bold section titles
  Avoid long blocks of text.
  `
  },
  {
    role: "assistant",
    content: "Hello! You can ask your questions about your pet here 🐾.."
  }
  ]);
  const [remainingTokens, setRemainingTokens] = useState(null);
  const [loading, setLoading] = useState(false);

  //Setter for uploaded image
  const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // basic validation
  if (!file.type.startsWith("image/")) {
    setUploadError("Please select a valid image");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setUploadError("The photo cannot be larger than 5MB");
    return;
  }

  setUploadError("");
  setUploadedImage(file);
  setImagePreview(URL.createObjectURL(file));
  };
  // Simple reset function for image upload
  const resetImage = () => {
  setUploadedImage(null);
  setImagePreview(null);
  };
  // Setter for user message input
  const handleInputChange = (e) => {
  setMessage(e.target.value);
  };

  // Message send function
  const handleSendMessage = async () => {
  const trimmedMessage = message.trim();
  if (!trimmedMessage && !uploadedImage) return;

  //Update the ui with the user message first.
    const newUserMessage = {
    role: "user",
    content: trimmedMessage || "Please analyze the uploaded photo.",
    // image: uploadedImage || null
    };

    setChatHistory((prev) => [...prev, newUserMessage]);
    setMessage("");
    setLoading(true);

    try {
    let res;

    // IMAGE EXISTS → FormData
      const cleanMessages = chatHistory.map(({ role, content }) => ({
      role,
      content
    }));


    if (uploadedImage) {
      const formData = new FormData();
      formData.append("image", uploadedImage); // actual File
      formData.append(
        "messages",
        JSON.stringify([...cleanMessages, newUserMessage])
      );

      res = await fetch("http://localhost:3000/ai-health", {
        method: "POST",
        credentials: "include",
        body: formData
      });
    }
    // TEXT ONLY → JSON
    else {
      res = await fetch("http://localhost:3000/ai-health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          messages: [...chatHistory, newUserMessage]
        })
      });
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.msg);
    }

    setChatHistory((prev) => [
      ...prev,
      { role: "assistant", content: data.message }
    ]);

    setRemainingTokens(data.remainingTokens);
    setUploadedImage(null); // clear after successful send
    setImagePreview(null);

  } catch (err) {
    setChatHistory((prev) => [
      ...prev,
      { role: "assistant", content: `⚠️ ${err.message}` }
    ]);
  } finally {
    setLoading(false);
  }
  }

  console.log(imagePreview);
  

  return (
    <div className="ai-health-page">
      <div className="ai-health-container">

        {/* HEADER */}
        <div className="page-header">
          <h2>🤖 AI-Powered Health Analysis</h2>
          <p className="page-desc">
            Upload a photo of your pet to get an AI-based health analysis
          </p>
        </div>

        {/* MAIN LAYOUT */}
        <div className="ai-content">

          {/* LEFT PANEL */}
          <div className="upload-section">
          <div className="card">
        <h3>Upload Photo</h3>

        <div className="file-upload">
          <input
            id="pet-photo-upload"
            type="file"
            accept="image/*"
            onChange={(e) =>handleImageUpload(e)} // you already have this
          />

          <label htmlFor="pet-photo-upload">
            {uploadedImage ? (
              <img src={imagePreview} alt="preview" className="uploaded-preview" />
            ) : (
              <>
                <span className="upload-icon">📷</span>
                <span>Upload Photo</span>
              </>
            )}
          </label>
        </div>

        {uploadedImage && (
          <div className="upload-actions">
            <button
              className="btn-secondary"
              onClick={resetImage}
            >
              Reset
            </button>
          </div>
        )}
        <div>{uploadError && uploadError}</div>
      </div>

        <div className="card info-card">
          <h4>💡 How It Works?</h4>
          <ul>
            <li>Upload a clear photo of your pet</li>
            <li>Ask a question in the chat</li>
            <li>AI analyzes the photo with your message</li>
            <li>Review the recommendations</li>
          </ul>

          <div className="info-warning">
            ⚠️ This analysis is not a definitive diagnosis.
            Always consult a veterinarian for health concerns.
          </div>
        </div>
      </div>

          {/* RIGHT PANEL */}
          <div className="results-section">

            {/* ANALYSIS RESULT
            {!analysis && !analyzing && (
              <div className="card empty-results">
                <span className="empty-icon">🔍</span>
                <h3>Henüz Analiz Yapılmadı</h3>
                <p>Fotoğraf yükleyip analiz et butonuna tıklayın</p>
              </div>
            )} */}

            {/* {analyzing && (
              <div className="card analyzing-card">
                <div className="spinner"></div>
                <h3>Fotoğraf Analiz Ediliyor...</h3>
              </div>
            )}

            {analysis && (
              <div className="card analysis-result">
                <h3>📊 Analiz Sonucu</h3>
                <p>Sağlık durumu ve öneriler burada olacak</p>
                <button className="btn-primary btn-full">
                  🏥 Veteriner Bul
                </button>
              </div>
            )} */}

            {/* CHAT PANEL */}
            <div className="card chat-panel">
              <div className="chat-header">
                <h3>🤖 AI Chat</h3>
                {remainingTokens !== null && (
                  <span className="token-badge">
                  🪙 {remainingTokens}
                </span>
                )}
              </div>

              <div className="chat-messages">
                <div className="chat-messages">
                {chatHistory.filter((f)=> f.role!== "system" ).map((msg, index) => (
              <div
                key={index}
                className={`chat-bubble ${msg.role === "user" ? "user" : "assistant"}`}
                >
                  <ReactMarkdown>
                {msg.content}
                </ReactMarkdown>
                </div>
                ))}

             {loading && (
                <div className="chat-bubble assistant">
                 Writing...
                </div>
              )}
                </div>
              </div>

              <div className="chat-input">
                <input
                  type="text"
                  placeholder={`${ uploadedImage ? "Ask a question about the photo" : "Ask a question about your pet..."}`}
                  value={message}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />

                  <button onClick={handleSendMessage} disabled={loading}>
                    {uploadedImage ? "Analyze & Send" : "Send"}
                  </button>
                </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};


export default AiHealthPage;
