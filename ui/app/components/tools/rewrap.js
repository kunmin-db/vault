/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: BUSL-1.1
 */

/* eslint-disable ember/no-empty-glimmer-component-classes */
import Component from '@glimmer/component';

/**
 * @module ToolRewrap
 * ToolRewrap components are components that sys/wrapping/rewrap functionality.  Most of the functionality is passed through as actions from the tool-actions-form and then called back with properties.
 *
 * @example
 * ```js
 * <Tools::Rewrap
 *  @onClear={{action "onClear"}}
 *  @token={{token}}
 *  @rewrap_token={{rewrap_token}}
 *  @bytes={{bytes}}
 *  @errors={{errors}}/>
 * ```
 * @param onClear {Function} - parent action that is passed through. Must be passed as {{action "onClear"}}
 * @param token=null {String} - property passed from parent to child and then passed back up to parent
 * @param rewrap_token {String} - property returned from parent.
 * @param bytes {String} - property returned from parent.
 * @param error=null {Object} - errors passed from parent as default then from child back to parent.
 */

export default class ToolRewrap extends Component {}
