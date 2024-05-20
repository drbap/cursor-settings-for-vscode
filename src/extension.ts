/*-------------------------------------------------------------------------------
 *  Copyright (c) 2024 Bernardo Pires (@drbap).
 *  Licensed under the MIT License.
 *-------------------------------------------------------------------------------
 */

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	const cursorStyles = ['block', 'block-outline', 'line', 'line-thin', 'underline', 'underline-thin'];
	const cursorBlinking = ['blink', 'phase', 'smooth', 'expand', 'solid'];
	const cursorWidth = [1, 2, 3, 4, 5];

	const sb = vscode.window.createStatusBarItem('cursor-settings', vscode.StatusBarAlignment.Right, 20000);

	let commandId = 'cursor-settings.startQuickPick';

	let disposable = vscode.commands.registerCommand(commandId, async () => {

		const settings = vscode.workspace.getConfiguration();

		const cursorSettings = [
			{ prop: '', label: 'editor cursor style', description: '', value: 'block', arrValues: cursorStyles, kind: vscode.QuickPickItemKind.Separator },
			{ prop: 'editor.cursorStyle', label: 'Line', description: '(default)', value: 'line', arrValues: cursorStyles },
			{ prop: 'editor.cursorStyle', label: 'Block', description: '', value: 'block', arrValues: cursorStyles },
			{ prop: 'editor.cursorStyle', label: 'Underline', description: '', value: 'underline', arrValues: cursorStyles },
			{ prop: 'editor.cursorStyle', label: 'Block-Outline', description: '', value: 'block-outline', arrValues: cursorStyles },
			{ prop: 'editor.cursorStyle', label: 'Line-Thin', description: '', value: 'line-thin', arrValues: cursorStyles },
			{ prop: 'editor.cursorStyle', label: 'Underline-Thin', description: '', value: 'underline-thin', arrValues: cursorStyles },
			{ prop: '', label: 'editor cursor blinking', description: '', value: '', arrValues: cursorBlinking, kind: vscode.QuickPickItemKind.Separator },
			{ prop: 'editor.cursorBlinking', label: 'Blink', description: '(default)', value: 'blink', arrValues: cursorBlinking },
			{ prop: 'editor.cursorBlinking', label: 'Solid', description: '', value: 'solid', arrValues: cursorBlinking },
			{ prop: 'editor.cursorBlinking', label: 'Phase', description: '', value: 'phase', arrValues: cursorBlinking },
			{ prop: 'editor.cursorBlinking', label: 'Smooth', description: '', value: 'smooth', arrValues: cursorBlinking },
			{ prop: 'editor.cursorBlinking', label: 'Expand', description: '', value: 'expand', arrValues: cursorBlinking },
			{ prop: '', label: 'editor cursor width', description: '', value: '', arrValues: cursorBlinking, kind: vscode.QuickPickItemKind.Separator },
			{ prop: 'editor.cursorWidth', label: 'Cursor Width 2', description: '(default)', value: 2, arrValues: cursorWidth },
			{ prop: 'editor.cursorWidth', label: 'Cursor Width 3', description: '', value: 3, arrValues: cursorWidth },
			{ prop: 'editor.cursorWidth', label: 'Cursor Width 4', description: '', value: 4, arrValues: cursorWidth },
			{ prop: 'editor.cursorWidth', label: 'Cursor Width 5', description: '', value: 5, arrValues: cursorWidth },
		];

		const selection = await vscode.window.showQuickPick(cursorSettings, {
			placeHolder: 'Select Cursor Settings'
		});

		if ((selection !== undefined)) {
			updateCS(selection.prop, selection.value, settings, selection.arrValues);
			// Check active editor
			focusEditor();
		} else {

		}
	});

	sb.command = commandId;
	sb.text = 'Cursor';
	sb.tooltip = 'Cursor Settings';
	sb.color = new vscode.ThemeColor('statusBar.foreground');
	sb.show();

	context.subscriptions.push(disposable);
	context.subscriptions.push(sb);

}

function updateCS(prop: string, val: string | number, s: vscode.WorkspaceConfiguration, arr: (string | number)[]): void {
	if (typeof val === 'string') {
		if (arr.includes(val)) {
			s.update(prop, val, vscode.ConfigurationTarget.Global);
			if (vscode.workspace.name !== undefined) {
				s.update(prop, val, vscode.ConfigurationTarget.Workspace);
			}
		}
	} else if (typeof val === 'number') {
		if (arr.includes(val)) {
			s.update(prop, val, vscode.ConfigurationTarget.Global);
			s.update('editor.cursorStyle', 'line', vscode.ConfigurationTarget.Global);
			if (vscode.workspace.name !== undefined) {
				s.update(prop, val, vscode.ConfigurationTarget.Workspace);
				s.update('editor.cursorStyle', 'line', vscode.ConfigurationTarget.Workspace);
			}
		}
	} else {
		vscode.window.showErrorMessage("Invalid cursor setting value");
	}

}

function focusEditor() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	} else {
		// Focus -> editor
		vscode.commands.executeCommand("workbench.action.focusFirstEditorGroup");
	}
}

export function deactivate() { }
