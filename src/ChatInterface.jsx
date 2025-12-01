import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Loader2, PieChart, Send, Image as ImageIcon } from 'lucide-react';

// The Gemini calls are no longer needed here, they should be in your backend.
// import { callGeminiChat, callGeminiAnalysis } from './gemini.js';

const ChatInterface = ({ messages, setMessages, addInvoice, invoices, currentUser }) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // This function can be adapted to call your backend for text-based chat
  const handleSend = async () => {
    if (!inputText.trim()) return;
    const userText = inputText;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText, type: 'text' }]);
    setInputText('');
    
    // TODO: Replace with a call to your backend chat endpoint if you have one
    setIsTyping(true);
    // const reply = await callYourBackendChat(userText); 
    const reply = "للأسف، لا أستطيع الرد على الرسائل النصية في الوقت الحالي.";
    setIsTyping(false);
    setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: reply, type: 'text' }]);
  };

  // This function should also call your backend now
  const handleFinancialAnalysis = async () => {
    setIsAnalyzing(true);
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: 'قم بعمل تحليل مالي للفواتير الحالية ✨', type: 'text' }]);
    
    // TODO: Replace with a call to your backend analysis endpoint
    // const analysis = await callYourBackendAnalysis(invoices);
    const analysis = "ميزة التحليل المالي غير متوفرة حالياً، يرجى المحاولة لاحقاً.";
    setIsAnalyzing(false);
    setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: analysis, type: 'text' }]);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // --- This is the new logic to match your ASP.NET backend ---

    // 1. Visually add the user's image to the chat right away
    const imageUrl = URL.createObjectURL(file);
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', image: imageUrl, type: 'image' }]);
    setIsTyping(true);
    
    // 2. Prepare the data for the backend
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 3. Send the file to your backend
      const apiUrl = `${import.meta.env.VITE_API_URL}/Invoices/upload`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        // Headers are not needed for multipart/form-data, fetch adds them automatically
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const result = await response.json();

      // 4. Show the backend's confirmation message
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: result.message, type: 'text' }]);

    } catch (error) {
      console.error("Error uploading file:", error);
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: 'عذراً، حدث خطأ أثناء رفع الصورة.', type: 'text' }]);
    }

    e.target.value = null; // Reset the file input
  };

  // The handleOptionClick function is no longer needed as the backend handles processing.

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="bg-white border-b p-4 shadow-sm flex items-center justify-between">
        <h2 className="font-bold text-gray-700 flex items-center gap-2"><Bot className="text-blue-600" /> المساعد الذكي</h2>
        <button onClick={handleFinancialAnalysis} disabled={isAnalyzing} className="flex items-center gap-2 text-xs md:text-sm bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all disabled:opacity-50">
          {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <PieChart size={16} />}
          <span className="hidden md:inline">تحليل البيانات ✨</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
                {msg.sender === 'user' ? <img src={currentUser.profilePic} alt="You" className="w-full h-full rounded-full object-cover" /> : <Sparkles size={18} className="text-white" />}
              </div>
              <div className="flex flex-col gap-1">
                <div className={`p-3 md:p-4 rounded-2xl shadow-sm text-sm md:text-base ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tl-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tr-none'}`}>
                  {msg.type === 'text' && <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>}
                  {msg.type === 'image' && <img src={msg.image} alt="Uploaded" className="max-w-full rounded-lg border border-white/20 max-h-60 object-cover shadow-sm" />}
                  {/* The 'options' message type is removed as it's no longer part of the flow */}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start w-full">
            <div className="flex flex-row gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0"><Loader2 size={18} className="text-indigo-600 animate-spin" /></div>
              <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tr-none shadow-sm flex items-center"><span className="text-gray-500 text-xs animate-pulse">يفكر...</span></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 md:p-4 bg-white border-t">
        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg transition-colors" title="رفع صورة">
            <ImageIcon size={20} />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اسألني عن الفواتير أو ارفع صورة..."
            className="flex-1 bg-transparent border-none outline-none text-gray-700 px-2"
          />
          <button onClick={handleSend} disabled={!inputText.trim()} className={`p-2 rounded-lg transition-all ${inputText.trim() ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
