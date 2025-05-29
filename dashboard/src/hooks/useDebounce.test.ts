import { renderHook, act } from '@testing-library/react'; // Changed from '@testing-library/react-hooks'
import useDebounce from './useDebounce';

// Helper to wait for timers - jest.advanceTimersByTime is generally preferred with fake timers
// const waitForDebounce = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));

describe('useDebounce', () => {
  jest.useFakeTimers(); // Use Jest's fake timers

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should update to the new value after the specified delay', () => { // Removed async
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Change the value
    rerender({ value: 'updated', delay: 500 });
    
    // At this point, debounced value should still be 'initial'
    expect(result.current).toBe('initial');

    // Fast-forward time by 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    // Now the debounced value should be 'updated'
    expect(result.current).toBe('updated');
  });

  it('should handle multiple value changes within the delay period', () => { // Removed async
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 500 } }
    );

    expect(result.current).toBe('first');

    rerender({ value: 'second', delay: 500 });
    act(() => { jest.advanceTimersByTime(200); }); // Not enough time
    expect(result.current).toBe('first'); // Still 'first'

    rerender({ value: 'third', delay: 500 });
    act(() => { jest.advanceTimersByTime(200); }); // Still not enough time from 'third' being set
    expect(result.current).toBe('first'); // Still 'first' because the timer for 'second' was cleared and restarted for 'third'
    
    // Fast-forward enough time for 'third' to propagate from its setting point
    act(() => { jest.advanceTimersByTime(300); }); // Total 200 + 300 = 500ms since 'third' was set
    expect(result.current).toBe('third');
  });

  it('should clear timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { unmount } = renderHook(() => useDebounce('test', 500));
    
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1); // Ensure it's called
    clearTimeoutSpy.mockRestore();
  });

  afterEach(() => {
    jest.clearAllTimers(); // Clear all timers after each test
  });

  afterAll(() => {
    jest.useRealTimers(); // Restore real timers
  });
});
