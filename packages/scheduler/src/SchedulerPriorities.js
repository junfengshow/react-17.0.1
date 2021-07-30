/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export type PriorityLevel = 0 | 1 | 2 | 3 | 4 | 5;

// TODO: Use symbols?
export const NoPriority = 0;
export const ImmediatePriority = 1;
export const UserBlockingPriority = 2;
export const NormalPriority = 3;
export const LowPriority = 4;
export const IdlePriority = 5;

export const getPriorityStr = (priority) => {
  switch (priority) {
    case NoPriority:
      return 'NoPriority';
    case ImmediatePriority:
      return 'ImmediatePriority';
    case UserBlockingPriority:
      return 'UserBlockingPriority';
    case NormalPriority:
      return 'NormalPriority';
    case LowPriority:
      return 'LowPriority';
    case IdlePriority:
      return 'IdlePriority';
  }
}
