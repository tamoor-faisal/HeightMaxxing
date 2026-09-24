import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme';
import { heightFraction } from '../utils/height';

type Props = {
  actualCm: number;
  freeCm: number;
  proCm: number;
  size?: number;
};

const DOT_COUNT = 56;

export default function HeightRing({ actualCm, freeCm, proCm, size = 266 }: Props) {
  const cx = 150;
  const cy = 150;
  const r = 118;
  const dotR = 4.2;

  const actualFrac = heightFraction(actualCm, proCm);
  const freeFrac = heightFraction(freeCm, proCm);

  const dots = [];
  for (let i = 0; i < DOT_COUNT; i++) {
    const frac = i / DOT_COUNT;
    const angle = frac * 2 * Math.PI - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    let color: string;
    if (frac <= actualFrac) color = colors.blue;
    else if (frac <= freeFrac) color = colors.green;
    else color = colors.gold;
    dots.push(<Circle key={i} cx={x} cy={y} r={dotR} fill={color} />);
  }

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg viewBox="0 0 300 300" width={size} height={size}>
        {dots}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
