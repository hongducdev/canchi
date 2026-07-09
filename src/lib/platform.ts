import { Platform } from 'react-native';

export const WEB_DESKTOP_MIN_WIDTH = 960;

export const isWeb = Platform.OS === 'web';

/** Content column width on desktop web. */
export const WEB_CONTENT_MAX_WIDTH = 760;
