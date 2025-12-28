import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const HapticButton: React.FC<TouchableOpacityProps> = ({ 
  onPress, 
  children,
  ...props 
}) => {
  const handlePress = (event: any) => {
    HapticFeedback.trigger('impactLight', hapticOptions);
    if (onPress) onPress(event);
  };

  return (
    <TouchableOpacity {...props} onPress={handlePress}>
      {children}
    </TouchableOpacity>
  );
};