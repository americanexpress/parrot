/*
 * Copyright 2019 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import { renderHook, act } from '@testing-library/react-hooks';

import useDevTools from '../../../src/app/hooks/useDevTools';

describe('useDevTools', () => {
  it('should return default state and handler', () => {
    expect.assertions(1);

    const { result } = renderHook(() => useDevTools());

    expect(result.current).toMatchObject({
      showSettings: expect.any(Boolean),
      toggleSettings: expect.any(Function),
    });
  });

  it('should toggle showSettings', () => {
    expect.assertions(2);

    const { result } = renderHook(() => useDevTools());

    expect(result.current.showSettings).toEqual(false);

    act(() => {
      result.current.toggleSettings();
    });

    expect(result.current.showSettings).toEqual(true);
  });
});
