// App.jsx
import React, { useState, useEffect } from 'react';
import { CourierProvider } from "@trycourier/react-provider";
import { useInbox } from "@trycourier/react-hooks";
import './App.css';

// Main App component
function App() {
  return (
    <CourierProvider userId="qRtwWd-wQ7CgmWo6TXethw" clientKey="MzM5NTExYjktNTYxOC00ZDQwLTkzZDEtZGQwZGY5MThmN2Mz">
      <div className="app-container">
        <h1>Custom Courier Inbox</h1>
        <CustomInbox />
      </div>
    </CourierProvider>
  );
}

// Custom Inbox component with split-pane layout
function CustomInbox() {
  const inbox = useInbox();
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch messages when component mounts
    const loadMessages = async () => {
      setLoading(true);
      await inbox.fetchMessages();
      setLoading(false);
    };
    
    loadMessages();
  }, []);

  // Find the selected message from the messages array
  const selectedMessage = inbox.messages?.find(msg => msg.messageId === selectedMessageId);

  // Handler for clicking on a message in the list
  const handleMessageClick = (message) => {
    setSelectedMessageId(message.messageId);
    
    // Mark as read if not already read
    if (!message.read) {
      inbox.markMessageRead(message.messageId);
    }
    
    // Mark as opened
    inbox.markMessageOpened(message.messageId);
  };

  // Handler for marking a message as unread
  const handleMarkUnread = (e, messageId) => {
    e.stopPropagation();
    inbox.markMessageUnread(messageId);
  };

  // Handler for archiving a message
  const handleArchive = (e, messageId) => {
    e.stopPropagation();
    inbox.markMessageArchived(messageId);
  };

  return (
    <div className="inbox-container">
      {/* Left side - Message List */}
      <div className="message-list">
        <div className="message-list-header">
          <h2>Messages</h2>
          <span className="unread-count">
            {inbox.unreadMessageCount || 0} unread
          </span>
        </div>
        
        {loading ? (
          <div className="loading">Loading messages...</div>
        ) : inbox.messages?.length ? (
          <ul>
            {inbox.messages.map((message) => (
              <li 
                key={message.messageId}
                className={`message-item ${message.read ? '' : 'unread'} ${selectedMessageId === message.messageId ? 'selected' : ''}`}
                onClick={() => handleMessageClick(message)}
              >
                <div className="message-item-content">
                  <h3>{message.title || 'No Title'}</h3>
                  <div className="message-date">
                    {new Date(message.created).toLocaleDateString()}
                  </div>
                </div>
                <div className="message-actions">
                  {message.read ? (
                    <button 
                      onClick={(e) => handleMarkUnread(e, message.messageId)}
                      className="action-button"
                    >
                      Mark Unread
                    </button>
                  ) : null}
                  <button 
                    onClick={(e) => handleArchive(e, message.messageId)}
                    className="action-button"
                  >
                    Archive
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">No messages to display</div>
        )}
      </div>

      {/* Right side - Message Detail */}
      <div className="message-detail">
        {selectedMessage ? (
          <div className="message-content">
            <div className="message-header">
              <h2>{selectedMessage.title || 'No Title'}</h2>
              <div className="message-metadata">
                Received: {new Date(selectedMessage.created).toLocaleString()}
              </div>
            </div>
            <div className="message-body">
              <p>{selectedMessage.preview || 'No content available'}</p>
              
              {/* Display message data if available and not empty */}
              {selectedMessage.data && Object.keys(selectedMessage.data).length > 0 && (
                <div className="message-data">
                  <h3>Additional Data:</h3>
                  <pre>{JSON.stringify(selectedMessage.data, null, 2)}</pre>
                </div>
              )}
              
              {/* Display message actions if available */}
              {selectedMessage.actions && selectedMessage.actions.length > 0 && (
                <div className="message-actions-container">
                  <h3>Actions:</h3>
                  <div className="action-buttons">
                    {selectedMessage.actions.map((action, index) => (
                      <a 
                        key={index}
                        href={action.href}
                        className="action-link-button"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {action.content}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="empty-detail">
            <p>Select a message to view its contents</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;