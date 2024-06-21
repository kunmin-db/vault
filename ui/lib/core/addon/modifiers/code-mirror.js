/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: BUSL-1.1
 */

import { action } from '@ember/object';
import { bind } from '@ember/runloop';
import codemirror from 'codemirror';
import Modifier from 'ember-modifier';

import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/json-lint.js';
// right now we only use the ruby and javascript, if you use another mode you'll need to import it.
// https://codemirror.net/mode/
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/javascript/javascript';

export default class CodeMirrorModifier extends Modifier {
  modify(element, positionalArgs, namedArgs) {
    // setup codemirror initially when modifier is installed on the element
    if (!this._editor) {
      this._setup(element, namedArgs);
    } else {
      // this hook also fires any time there is a change to tracked state
      this._editor.setOption('readOnly', namedArgs.readOnly);
      //* Comparing tracked state against editor.getValue *//
      // 1. Parse to so that you can compare values.
      // this is important because editor.getValue will return exactly what is displayed on the editor including new-lines. Whereas nameArg tracked content could have already been modified (e.g. parsed) and may not include new lines.
      const editorValue = JSON.parse(this._editor.getValue());
      const namedArgsContent = JSON.parse(namedArgs.content);
      // 2. in JavaScript two objects are considered equal only if they are the same object. So after parsing to remove excess white space, we stringify them.
      if (JSON.stringify(editorValue) !== JSON.stringify(namedArgsContent)) {
        // every time setValue is called the cursor jumps to the start of the editor so it's pertinent it's only called when necessary.
        this._editor.setValue(namedArgs.content);
      }
    }
  }

  @action
  _onChange(namedArgs, editor) {
    // avoid sending change event after initial setup when editor value is set to content
    if (namedArgs.content !== editor.getValue()) {
      namedArgs.onUpdate(editor.getValue(), this._editor);
    }
  }

  @action
  _onFocus(namedArgs, editor) {
    namedArgs.onFocus(editor.getValue());
  }

  _setup(element, namedArgs) {
    const editor = codemirror(element, {
      // IMPORTANT: `gutters` must come before `lint` since the presence of
      // `gutters` is cached internally when `lint` is toggled
      gutters: namedArgs.gutters || ['CodeMirror-lint-markers'],
      matchBrackets: true,
      lint: { lintOnChange: true },
      showCursorWhenSelecting: true,
      styleActiveLine: true,
      tabSize: 2,
      // all values we can pass into the JsonEditor
      screenReaderLabel: namedArgs.screenReaderLabel || '',
      extraKeys: namedArgs.extraKeys || '',
      lineNumbers: namedArgs.lineNumbers,
      mode: namedArgs.mode || 'application/json',
      readOnly: namedArgs.readOnly || false,
      theme: namedArgs.theme || 'hashi',
      value: namedArgs.content || '',
      viewportMargin: namedArgs.viewportMargin || '',
      autoRefresh: namedArgs.autoRefresh,
    });

    editor.on('change', bind(this, this._onChange, namedArgs));
    editor.on('focus', bind(this, this._onFocus, namedArgs));

    this._editor = editor;

    if (namedArgs.onSetup) {
      namedArgs.onSetup(editor);
    }
  }
}
