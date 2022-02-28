import * as vscode from "vscode";

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export class WebProvider implements vscode.CustomTextEditorProvider {
  private static readonly viewType = "web.open";

  public static register(context: vscode.ExtensionContext) {
    const provider = new WebProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      WebProvider.viewType,
      provider
    );

    return providerRegistration;
  }

  constructor(private readonly context: vscode.ExtensionContext) {}

  public resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    const webview = webviewPanel.webview;
    webview.options = {
      enableScripts: true,
    };

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "ui/dist",
        "assets/index.js"
      )
    );
    const scriptVendorUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "ui/dist",
        "assets/vendor.js"
      )
    );
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "ui/dist",
        "assets/index.css"
      )
    );

    const nonce = getNonce();

    webviewPanel.webview.html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Svelte + Vite App</title>
    <script type="module" nonce="${nonce}" crossorigin src="${scriptUri}"></script>
    <link rel="modulepreload" nonce="${nonce}" href="${scriptVendorUri}">
    <link rel="stylesheet" href="${cssUri}">
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>`;
  }
}
