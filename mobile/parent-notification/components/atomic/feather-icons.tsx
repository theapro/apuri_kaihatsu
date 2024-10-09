import Feather from '@expo/vector-icons/Feather';
import {type IconProps} from '@expo/vector-icons/build/createIconSet';
import {type ComponentProps} from 'react';

export function TabBarIconFeather({style, ...rest}: IconProps<ComponentProps<typeof Feather>['name']>) {
  return <Feather size={28} style={[{marginBottom: -3}, style]} {...rest} />;
}
