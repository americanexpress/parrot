/*
 * Copyright (c) 2018 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';

function App() {
  const STATIC_OPTIONS = useMemo(() => ({
    onOpen: () => console.log('opened'),
  }), []);

  const [messages, setMessages] = useState([]);
  const [
    sendMessage,
    lastMessage,
    readyState,
    getWebSocket,
  ] = useWebSocket('ws://localhost:3001/ws/pirate-chat', STATIC_OPTIONS);
  const inputRef = useRef(null);

  const handleSend = () => {
    sendMessage(JSON.stringify({ user: 'Me', message: inputRef.current.value }));

    inputRef.current.value = '';
    inputRef.current.focus();
  };

  useEffect(() => {
    if (lastMessage !== null) {
      const currentWebsocketUrl = getWebSocket().url;
      console.log('received a message from ', lastMessage, currentWebsocketUrl);

      setMessages((prev) => {
        const message = JSON.parse(lastMessage.data);

        if (message.user) {
          return prev.concat(message)
        }

        return prev;
      });
    }
  }, [lastMessage]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div style={{ border: '1px solid black' }}>
      <div style={{ padding: '1rem' }}>
        {
          messages.map((message) => {
            console.log('message', message)
            return (
              <div>
                <strong>{`${message.user}: `}</strong>
                <span>{message.message}</span>
              </div>
            );
          })
        }
      </div>
      <div style={{ display: 'flex' }}>
        <textarea
          ref={inputRef}
          style={{
            flexGrow: '1',
            margin: '0',
          }}
        />
        <button
          type="button"
          onClick={handleSend}
          style={{
            height: '65px',
            margin: '0',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
