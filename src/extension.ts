import * as vscode from 'vscode';
import { buildFullTypeGuardFunction } from './type-guard-generator';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.type-guard-generator', function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			const textSelection: string = document.getText(selection);
			const generated = buildFullTypeGuardFunction(textSelection)

			editor.edit(editBuilder => {
				editBuilder.insert(selection.end, `\n\n${generated}`)
			});
		}
	});

	context.subscriptions.push(disposable);
}