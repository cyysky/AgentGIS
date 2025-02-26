import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToAI } from '../services/aiService';
import '../styles/ChatBox.css';

const ChatBox = ({ apiSettings, onResponse, onClearMap }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = {
      role: 'user',
      content: input
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Check for map control commands
      if (input.toLowerCase() === 'clear map') {
        onClearMap();
        setMessages(prevMessages => [
          ...prevMessages, 
          { role: 'assistant', content: 'Map has been cleared.' }
        ]);
        setIsLoading(false);
        return;
      }
      
      const response = await sendMessageToAI({
        messages: [...messages, userMessage],
        apiSettings
      });
      
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: response.text }
      ]);
      
      // If the response contains map data, process it
      if (response.mapData) {
        onResponse(response);
      }
    } catch (error) {
      console.error('Error sending message to AI:', error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          role: 'assistant', 
          content: `Error: ${error.message || 'Failed to get response from AI'}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-header">
        <h3>AI Assistant</h3>
        <button 
          onClick={() => {
            setMessages([]);
            onClearMap();
          }}
          className="clear-button"
        >
          Clear Chat
        </button>
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>Ask me anything about land data in Kota Kinabalu!</p>
            <div className="example-queries">
              <p>Examples:</p>
              <ul>
                <li>"Show me the land titles around Lucky Garden"</li>
                <li>"Find all primary schools in Kota Kinabalu"</li>
                <li>"What land parcels are available for commercial development near the city center?"</li>
              </ul>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
            >
              <div className="message-content">
                {msg.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="message ai-message">
            <div className="loading-indicator">
              <span>●</span><span>●</span><span>●</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your query..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;