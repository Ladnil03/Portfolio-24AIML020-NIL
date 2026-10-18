/**
 * lazyWithMinDelay
 * Wraps dynamic import() with a minimum delay promise (e.g. 300ms)
 * to avoid flashing/flickering loading skeletons on ultra-fast networks.
 *
 * @param {() => Promise<{ default: React.ComponentType<any> }>} factory
 * @param {number} minDelayMs
 * @returns {() => Promise<{ default: React.ComponentType<any> }>}
 */
export function lazyWithMinDelay(factory, minDelayMs = 300) {
  return () =>
    Promise.all([
      factory(),
      new Promise((resolve) => setTimeout(resolve, minDelayMs)),
    ]).then(([moduleExports]) => moduleExports);
}
