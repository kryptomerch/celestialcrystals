import * as vscode from 'vscode';
import { callAI, AIRequest } from './api';

export function activate(context: vscode.ExtensionContext) {
  console.log('Cline AI Bot extension is now active!');

  let panel: vscode.WebviewPanel | undefined = undefined;

  let disposable = vscode.commands.registerCommand('clineBot.start', () => {
    if (panel) {
      panel.reveal(vscode.ViewColumn.One);
    } else {
      panel = vscode.window.createWebviewPanel(
        'clineBot',
        'Cline AI Bot',
        vscode.ViewColumn.One,
        {
          enableScripts: true
        }
      );

      panel.webview.html = getWebviewContent();

      panel.webview.onDidReceiveMessage(
        async (message: { command: string; text?: string }) => {
          switch (message.command) {
            case 'sendMessage':
              const apiKey = await getApiKey();
              if (!apiKey) {
                panel?.webview.postMessage({ command: 'showError', text: 'API key not set. Please set it in settings.' });
                return;
              }
              try {
                const aiRequest: AIRequest = {
                  model: 'gpt-4',
                  messages: [{ role: 'user', content: message.text || '' }],
                  max_tokens: 1000,
                  temperature: 0.7
                };
                const response = await callAI(aiRequest, apiKey);
                panel?.webview.postMessage({ command: 'receiveMessage', text: response });
              } catch (error: any) {
                panel?.webview.postMessage({ command: 'showError', text: error.message });
              }
              break;
          }
        },
        undefined,
        context.subscriptions
      );

      panel.onDidDispose(() => {
        panel = undefined;
      }, null, context.subscriptions);
    }
  });

  context.subscriptions.push(disposable);
}

async function getApiKey(): Promise<string | undefined> {
  // For now, prompt user to enter API key. Later can be stored in settings.
  const key = await vscode.window.showInputBox({
    prompt: 'Enter your OpenAI API key',
    ignoreFocusOut: true,
    password: true
  });
  return key;
}

function getWebviewContent() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Cline AI Bot</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 10px;
          display: flex;
          flex-direction: column;
          height: 100vh;
        }
        #messages {
          flex-grow: 1;
          overflow-y: auto;
          border: 1px solid #ccc;
          padding: 10px;
          margin-bottom: 10px;
        }
        #inputArea {
          display: flex;
        }
        #inputBox {
          flex-grow: 1;
          padding: 8px;
          font-size: 14px;
        }
        #sendButton {
          padding: 8px 12px;
          font-size: 14px;
        }
        .message {
          margin-bottom: 10px;
        }
        .user {
          color: blue;
        }
        .bot {
          color: green;
        }
        .error {
          color: red;
        }
      </style>
    </head>
    <body>
      <div id="messages"></div>
      <div id="inputArea">
        <input type="text" id="inputBox" placeholder="Type your message here..." />
        <button id="sendButton">Send</button>
      </div>
      <script>
        const vscode = acquireVsCodeApi();
        const messagesDiv = document.getElementById('messages');
        const inputBox = document.getElementById('inputBox');
        const sendButton = document.getElementById('sendButton');

        function appendMessage(text, className) {
          const div = document.createElement('div');
          div.textContent = text;
          div.className = 'message ' + className;
          messagesDiv.appendChild(div);
          messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        sendButton.addEventListener('click', () => {
          const text = inputBox.value.trim();
          if (text) {
            appendMessage('You: ' + text, 'user');
            vscode.postMessage({ command: 'sendMessage', text: text });
            inputBox.value = '';
          }
        });

        window.addEventListener('message', event => {
          const message = event.data;
          switch (message.command) {
            case 'receiveMessage':
              appendMessage('AI: ' + message.text, 'bot');
              break;
            case 'showError':
              appendMessage('Error: ' + message.text, 'error');
              break;
          }
        });

        inputBox.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            sendButton.click();
          }
        });
      </script>
    </body>
    </html>
  `;
}

export function deactivate() {}
