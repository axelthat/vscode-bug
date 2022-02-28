import * as vscode from "vscode";
import { WebProvider } from "./webprovider";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(WebProvider.register(context));
}

export function deactivate() {}
