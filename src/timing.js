/**
 * @module timing
 * Timing utilities: debounce and throttle.
 */

/**
 * Creates a debounced version of the provided function.
 *
 * The debounced function delays invoking `fn` until `delay` milliseconds
 * have passed since the last time it was invoked. The debounced function
 * has a `cancel()` method to cancel any pending invocation.
 *
 * **Leading vs trailing behavior:** By default this is a trailing debounce —
 * the function executes after the calls stop. If `options.leading` is `true`,
 * the function also fires on the first call (leading edge). If `options.trailing`
 * is explicitly set to `false`, only leading calls execute.
 *
 * @param {Function} fn - The function to debounce.
 * @param {number} delay - Milliseconds to wait before invoking `fn`.
 * @param {object} [options={}] - Optional configuration.
 * @param {boolean} [options.leading=false] - Fire on the leading edge.
 * @param {boolean} [options.trailing=true] - Fire on the trailing edge.
 * @returns {Function} The debounced function with a `cancel()` method.
 * @throws {TypeError} If `fn` is not a function or `delay` is not a non-negative number.
 *
 * @example
 * const debouncedSave = debounce(save, 300);
 * input.addEventListener('input', debouncedSave);
 * // Cancel a pending call
 * debouncedSave.cancel();
 */
export function debounce(fn, delay, options = {}) {
  if (typeof fn !== 'function') {
    throw new TypeError('debounce: first argument must be a function');
  }
  if (typeof delay !== 'number' || delay < 0 || !isFinite(delay)) {
    throw new TypeError('debounce: delay must be a non-negative finite number');
  }

  const { leading = false, trailing = true } = options;

  let timerId = null;
  let lastArgs = null;
  let lastThis = null;
  let isFirstCall = true;

  function debounced(...args) {
    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;

    const shouldFireLeading = leading && isFirstCall;
    isFirstCall = false;

    if (timerId !== null) {
      clearTimeout(timerId);
    }

    if (shouldFireLeading) {
      fn.apply(lastThis, lastArgs);
      if (!trailing) {
        // Reset so the next sequence can fire leading again
        timerId = setTimeout(() => {
          timerId = null;
          isFirstCall = true;
        }, delay);
        return;
      }
    }

    timerId = setTimeout(() => {
      timerId = null;
      isFirstCall = true;
      if (trailing) {
        fn.apply(lastThis, lastArgs);
      }
    }, delay);
  }

  /**
   * Cancels any pending debounced invocation.
   */
  debounced.cancel = function () {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
    isFirstCall = true;
  };

  return debounced;
}

/**
 * Creates a throttled version of the provided function.
 *
 * The throttled function ensures `fn` is invoked at most once per `delay`
 * milliseconds. The first call fires immediately (leading edge). An additional
 * trailing call is made after the delay if further calls occurred during the
 * throttle window. This behavior can be configured via `options`.
 *
 * **Execution behavior (defaults):**
 * - Leading: `true` — fires immediately on first call.
 * - Trailing: `true` — fires once more after the delay if calls were made
 *   during the throttle period.
 *
 * @param {Function} fn - The function to throttle.
 * @param {number} delay - Minimum milliseconds between invocations.
 * @param {object} [options={}] - Optional configuration.
 * @param {boolean} [options.leading=true] - Fire on the leading edge.
 * @param {boolean} [options.trailing=true] - Fire on the trailing edge.
 * @returns {Function} The throttled function with a `cancel()` method.
 * @throws {TypeError} If `fn` is not a function or `delay` is not a non-negative number.
 *
 * @example
 * const throttledScroll = throttle(handleScroll, 100);
 * window.addEventListener('scroll', throttledScroll);
 * throttledScroll.cancel();
 */
export function throttle(fn, delay, options = {}) {
  if (typeof fn !== 'function') {
    throw new TypeError('throttle: first argument must be a function');
  }
  if (typeof delay !== 'number' || delay < 0 || !isFinite(delay)) {
    throw new TypeError('throttle: delay must be a non-negative finite number');
  }

  const { leading = true, trailing = true } = options;

  let timerId = null;
  let lastCallTime = null;
  let lastArgs = null;
  let lastThis = null;

  function invokeTrailing() {
    timerId = null;
    if (trailing && lastArgs !== null) {
      fn.apply(lastThis, lastArgs);
      lastCallTime = Date.now();
      lastArgs = null;
      lastThis = null;
    }
  }

  function throttled(...args) {
    const now = Date.now();
    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;

    // First ever call
    if (lastCallTime === null && !leading) {
      lastCallTime = now;
    }

    const remaining = lastCallTime !== null ? delay - (now - lastCallTime) : 0;

    if (remaining <= 0 || remaining > delay) {
      // Can fire now
      if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
      }
      lastCallTime = now;
      lastArgs = null;
      lastThis = null;
      fn.apply(this, args);
    } else if (timerId === null && trailing) {
      timerId = setTimeout(invokeTrailing, remaining);
    }
  }

  /**
   * Cancels any pending trailing invocation.
   */
  throttled.cancel = function () {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
    lastCallTime = null;
    lastArgs = null;
    lastThis = null;
  };

  return throttled;
}
