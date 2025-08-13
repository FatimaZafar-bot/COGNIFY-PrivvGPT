import { useRef, useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

export default function Chat() {
  const fileInputRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState(["Welcome Chat"]);
  const [activeChatIndex, setActiveChatIndex] = useState(0);
  const [userFirstName, setUserFirstName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false); // New: loading state
  const [isAssistantReady, setIsAssistantReady] = useState(false); // New: assistant ready state

  useEffect(() => {
    const activeUser = JSON.parse(localStorage.getItem('activeUser'));
    if (activeUser) {
      setUserFirstName(activeUser.firstName);
      setMessages([{ sender: 'assistant', text: `Hey ${activeUser.firstName}!! How can I help you?` }]);
    }
  }, []);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      setIsProcessing(true); // Start loading
      setIsAssistantReady(false);

      const response = await fetch('http://localhost:8000/upload/', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      setIsProcessing(false); // Stop loading

      if (response.ok) {
        alert(`Files uploaded successfully! Processed ${result.total_chunks} chunks.`);
        setIsAssistantReady(true);
        setMessages(prev => [...prev, { sender: 'assistant', text: 'Files processed successfully! I am ready to answer your questions.' }]);
      } else {
        alert(result.error || 'File upload failed.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setIsProcessing(false);
      alert('File upload failed due to network error.');
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);

    try {
      const formData = new FormData();
      formData.append('question', input);

      const response = await fetch('http://localhost:8001/ask/', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (response.ok) {
        setMessages([...newMessages, { sender: 'assistant', text: result.answer }]);
      } else {
        setMessages([...newMessages, { sender: 'assistant', text: result.error || 'Error processing your question.' }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, { sender: 'assistant', text: 'Network error. Please try again.' }]);
    }

    setInput('');
  };

  const handleNewChat = () => {
    const newChatName = `Chat ${chatHistory.length + 1}`;
    setChatHistory([...chatHistory, newChatName]);
    setMessages([{ sender: 'assistant', text: `Hello! This is ${newChatName}.` }]);
    setUploadedFiles([]);
    setActiveChatIndex(chatHistory.length);
    setIsAssistantReady(false); // Reset readiness when starting a new chat
  };

  const handleSwitchChat = (index) => {
    setActiveChatIndex(index);
    setMessages([{ sender: 'assistant', text: `Switched to ${chatHistory[index]}` }]);
    setUploadedFiles([]);
    setIsAssistantReady(false); // Reset readiness when switching chats
  };

  const handleClearFiles = () => {
    setUploadedFiles([]);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('activeUser');
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'} bg-[#213664] text-white p-6 overflow-hidden flex flex-col`}>
        <h2 className="text-2xl font-bold mb-4">Assistant</h2>

        <button onClick={handleNewChat} className="w-full bg-white text-[#213664] py-2 px-4 rounded mb-6 text-sm hover:bg-gray-100 transition">
          + New Chat
        </button>

        <div className="mb-6">
          <h3 className="text-sm uppercase mb-2 text-gray-300">Chat History</h3>
          <ul className="space-y-2 text-sm">
            {chatHistory.map((chat, idx) => (
              <li
                key={idx}
                onClick={() => handleSwitchChat(idx)}
                className={`cursor-pointer px-2 py-1 rounded ${idx === activeChatIndex ? 'bg-white text-[#213664]' : 'hover:bg-white/20'}`}
              >
                {chat}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm uppercase text-gray-300">Saved Files</h3>
            {uploadedFiles.length > 0 && (
              <button onClick={handleClearFiles} className="text-xs text-red-300 hover:underline">
                Clear
              </button>
            )}
          </div>
          <ul className="text-sm space-y-1">
            {uploadedFiles.length === 0 && (
              <li className="text-white/50 italic">No files uploaded</li>
            )}
            {uploadedFiles.map((file, idx) => (
              <li key={idx} className="truncate text-white/80">{file.name}</li>
            ))}
          </ul>
        </div>

        <div className="border-t border-white/20 pt-4 text-sm mt-auto">
          <p className="text-white">User: <strong>{userFirstName}</strong></p>
          <p className="text-white/80 mt-1 mb-3">Logged in</p>
          <button onClick={handleLogout} className="w-full text-left text-red-300 hover:underline text-sm">
            Logout
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 bg-[url('/background.jpg')] bg-cover bg-center flex flex-col justify-between p-6 text-white transition-all duration-300 ${isSidebarOpen ? '' : 'pl-4'}`}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute top-4 left-4 bg-white text-[#213664] rounded-full p-2 shadow z-50">
          <Menu size={20} />
        </button>

        <div className="flex flex-col flex-grow border-2 border-white/30 rounded-2xl p-6 backdrop-blur-md bg-black/30 shadow-lg mt-10">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => fileInputRef.current.click()} className="bg-white text-black px-6 py-2 rounded-full shadow hover:bg-gray-200 transition">
              Upload File (.pdf, .docx, .txt) ...
            </button>
            <span className="text-sm text-white">{userFirstName}</span>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.docx,.txt" multiple className="hidden" />
          </div>

          {isProcessing && (
            <div className="text-center text-yellow-300 mb-4 italic">Processing files... Please wait.</div>
          )}

          {isAssistantReady && (
            <div className="text-center text-green-300 mb-4 italic">Files processed! Assistant is ready to answer.</div>
          )}

          {uploadedFiles.length > 0 && (
            <div className="bg-white/20 border border-white/30 rounded-lg p-3 mb-4 max-h-28 overflow-y-auto text-sm space-y-1">
              <strong className="block text-white mb-2 italic">Uploaded Files:</strong>
              {uploadedFiles.map((file, idx) => (
                <div key={idx} className="truncate text-white/90">{file.name}</div>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={`max-w-[80%] w-fit p-4 rounded-xl shadow ${msg.sender === 'assistant' ? 'bg-white text-black italic' : 'bg-[#213664] text-white self-end ml-auto'}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Type your query here ..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-full border-none outline-none text-black"
              disabled={!isAssistantReady} // Disable input until files are processed
            />
            <button
              onClick={handleSend}
              className={`bg-[#213664] text-white px-6 py-3 rounded-full hover:opacity-80 transition ${!isAssistantReady ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isAssistantReady}
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
