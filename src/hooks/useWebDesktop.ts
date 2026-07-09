import { useWindowDimensions } from 'react-native';
import { isWeb, WEB_DESKTOP_MIN_WIDTH } from '../lib/platform';

/** True on browser viewports wide enough for the desktop sidebar shell. */
export function useWebDesktop(): boolean {
  const { width } = useWindowDimensions();
  return isWeb && width >= WEB_DESKTOP_MIN_WIDTH;
}
