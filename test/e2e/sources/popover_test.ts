// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import {assert} from 'chai';

import {click, getBrowserAndPages, waitFor} from '../../shared/helper.js';
import {describe, it} from '../../shared/mocha-extensions.js';
import {addBreakpointForLine, openSourceCodeEditorForFile, RESUME_BUTTON} from '../helpers/sources-helpers.js';

describe('Sources Tab', async function() {
  it('shows correct preview for `object.foo` member expressions', async () => {
    const {target, frontend} = getBrowserAndPages();

    await openSourceCodeEditorForFile('popover.js', 'popover.html');
    await addBreakpointForLine(frontend, 5);

    const scriptEvaluation = target.evaluate('f1();');
    const lastElement = await waitFor('.cm-executionLine > span:last-child');
    await lastElement.hover();

    const popover = await waitFor('[data-stable-name-for-test="object-popover-content"]');
    const value = await waitFor('.object-value-number', popover).then(e => e.evaluate(node => node.textContent));
    assert.strictEqual(value, '1');

    await click(RESUME_BUTTON);
    await scriptEvaluation;
  });

  it('shows correct preview for `array[1].foo` member expressions', async () => {
    const {target, frontend} = getBrowserAndPages();

    await openSourceCodeEditorForFile('popover.js', 'popover.html');
    await addBreakpointForLine(frontend, 9);

    const scriptEvaluation = target.evaluate('f2();');
    const lastElement = await waitFor('.cm-executionLine > span:last-child');
    await lastElement.hover();

    const popover = await waitFor('[data-stable-name-for-test="object-popover-content"]');
    const value = await waitFor('.object-value-number', popover).then(e => e.evaluate(node => node.textContent));
    assert.strictEqual(value, '5');

    await click(RESUME_BUTTON);
    await scriptEvaluation;
  });

  it('shows correct preview for `array[i][0]` member expressions', async () => {
    const {target, frontend} = getBrowserAndPages();

    await openSourceCodeEditorForFile('popover.js', 'popover.html');
    await addBreakpointForLine(frontend, 13);

    const scriptEvaluation = target.evaluate('f3(3);');
    const lastElement = await waitFor('.cm-executionLine > span:last-child');
    await lastElement.hover();

    const popover = await waitFor('[data-stable-name-for-test="object-popover-content"]');
    const value = await waitFor('.object-value-number', popover).then(e => e.evaluate(node => node.textContent));
    assert.strictEqual(value, '42');

    await click(RESUME_BUTTON);
    await scriptEvaluation;
  });
});
