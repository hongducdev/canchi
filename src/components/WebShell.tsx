import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useWebDesktop } from '../hooks/useWebDesktop';
import { useTheme } from '../hooks/useTheme';
import { WEB_CONTENT_MAX_WIDTH } from '../lib/platform';
import { WebSidebar } from './WebSidebar';

type Props = {
  children: React.ReactNode;
};

/**
 * Desktop web: fixed sidebar + centered main column.
 * Mobile web / native: passthrough.
 */
export function WebShell({ children }: Props) {
  const desktop = useWebDesktop();
  const { colors } = useTheme();

  if (!desktop) {
    return <>{children}</>;
  }

  return (
    <View style={[styles.row, { backgroundColor: colors.bg }]}>
      <WebSidebar />
      <View style={styles.main}>
        <View style={styles.column}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  main: {
    flex: 1,
    alignItems: 'center',
  },
  column: {
    flex: 1,
    width: '100%',
    maxWidth: WEB_CONTENT_MAX_WIDTH,
  },
});
