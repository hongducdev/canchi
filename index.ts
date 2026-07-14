import 'expo-router/entry';
import { Platform } from 'react-native';
import {
  registerWidgetConfigurationScreen,
  registerWidgetTaskHandler,
} from 'react-native-android-widget';
import { AnniversaryWidgetConfigurationScreen } from './src/widgets/AnniversaryWidgetConfigurationScreen';
import { widgetTaskHandler } from './src/widgets/widget-task-handler';

if (Platform.OS === 'android') {
  registerWidgetTaskHandler(widgetTaskHandler);
  registerWidgetConfigurationScreen(AnniversaryWidgetConfigurationScreen);
}
