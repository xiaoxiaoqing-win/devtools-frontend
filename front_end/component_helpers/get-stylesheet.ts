// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import * as Root from '../root/root.js';
import * as ThemeSupport from '../theme_support/theme_support.js';

const sheetsCache = new Map<string, {sheets: CSSStyleSheet[], enableLegacyPatching: boolean}>();

/**
 * Helper for importing a legacy stylesheet into a component.
 *
 * Given a path to a stylesheet, it returns a CSSStyleSheet that can then be
 * adopted by your component.
 *
 * Pass `enableLegacyPatching: true` to turn on the legacy dark mode theming and be
 * returned both the original stylesheet and the new patched rules for dark mode.
 */
export function getStyleSheets(path: string, {enableLegacyPatching = false} = {}): CSSStyleSheet[] {
  const cachedResult = sheetsCache.get(path);
  if (cachedResult && cachedResult.enableLegacyPatching === enableLegacyPatching) {
    return cachedResult.sheets;
  }

  const content = Root.Runtime.cachedResources.get(path) || '';
  if (!content) {
    throw new Error(`${path} not preloaded.`);
  }

  const originalStylesheet = new CSSStyleSheet();
  originalStylesheet.replaceSync(content);

  const themeStyleSheet = ThemeSupport.ThemeSupport.instance().themeStyleSheet(path, content);
  if (!enableLegacyPatching || !themeStyleSheet) {
    sheetsCache.set(path, {enableLegacyPatching, sheets: [originalStylesheet]});
    return [originalStylesheet];
  }

  const patchedStyleSheet = new CSSStyleSheet();

  patchedStyleSheet.replaceSync(themeStyleSheet + '\n' + Root.Runtime.Runtime.resolveSourceURL(path + '.theme'));
  sheetsCache.set(path, {enableLegacyPatching, sheets: [originalStylesheet, patchedStyleSheet]});

  return [originalStylesheet, patchedStyleSheet];
}

/*
 * The getStylesheet helper in components reads styles out of the runtime cache.
 * In a proper build this is populated but in test runs because we don't load
 * all of DevTools it's not. Therefore we fetch all the CSS files and populate
 * the cache before any tests are run.
 *
 * The out/Release/gen/front_end URL is prepended so within the Karma config we can proxy
 * them through to the right place, respecting Karma's ROOT_DIRECTORY setting.
 */
export const CSS_RESOURCES_TO_LOAD_INTO_RUNTIME = [
  'ui/checkboxTextLabel.css',
  'ui/closeButton.css',
  'ui/confirmDialog.css',
  'ui/dialog.css',
  'ui/dropTarget.css',
  'ui/emptyWidget.css',
  'ui/filter.css',
  'ui/glassPane.css',
  'ui/infobar.css',
  'ui/inlineButton.css',
  'ui/inspectorCommon.css',
  'ui/inspectorScrollbars.css',
  'ui/themeColors.css',
  'ui/inspectorSyntaxHighlight.css',
  'ui/inspectorSyntaxHighlightDark.css',
  'ui/inspectorViewTabbedPane.css',
  'ui/listWidget.css',
  'ui/popover.css',
  'ui/progressIndicator.css',
  'ui/radioButton.css',
  'ui/remoteDebuggingTerminatedScreen.css',
  'ui/reportView.css',
  'ui/rootView.css',
  'ui/searchableView.css',
  'ui/slider.css',
  'ui/smallBubble.css',
  'ui/softContextMenu.css',
  'ui/softDropDown.css',
  'ui/softDropDownButton.css',
  'ui/splitWidget.css',
  'ui/toolbar.css',
  'ui/suggestBox.css',
  'ui/tabbedPane.css',
  'ui/targetCrashedScreen.css',
  'ui/textButton.css',
  'ui/textPrompt.css',
  'ui/tooltip.css',
  'ui/treeoutline.css',
  'ui/viewContainers.css',
  'panels/elements/layoutPane.css',
  'components/imagePreview.css',
  'components/jsUtils.css',
  'persistence/editFileSystemView.css',
  'persistence/workspaceSettingsTab.css',
  'mobile_throttling/throttlingSettingsTab.css',
  'panels/emulation/deviceModeToolbar.css',
  'panels/emulation/deviceModeView.css',
  'panels/emulation/devicesSettingsTab.css',
  'panels/emulation/inspectedPagePlaceholder.css',
  'panels/emulation/locationsSettingsTab.css',
  'panels/emulation/mediaQueryInspector.css',
  'panels/emulation/sensors.css',
  'inline_editor/colorSwatch.css',
  'inspector_main/nodeIcon.css',
  'inspector_main/renderingOptions.css',
  'data_grid/dataGrid.css',
  'panels/help/releaseNote.css',
  'object_ui/customPreviewComponent.css',
  'object_ui/objectPopover.css',
  'object_ui/objectPropertiesSection.css',
  'object_ui/objectValue.css',
  'panels/console/consoleContextSelector.css',
  'panels/console/consolePinPane.css',
  'panels/console/consolePrompt.css',
  'panels/console/consoleSidebar.css',
  'panels/console/consoleView.css',
  'cm/codemirror.css',
  'text_editor/autocompleteTooltip.css',
  'text_editor/cmdevtools.css',
  'text_editor/cmdevtools.darkmode.css',
  'resources/serviceWorkerUpdateCycleView.css',
];
