import * as React from "react";
import Svg, { Path } from "react-native-svg";

function FanIcon({ color }: { color: string }) {
  return (
    <Svg width={33} height={32} viewBox="0 0 33 32" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.5 0c-4.512 0-8.167 3.58-8.167 8s3.655 8 8.167 8c4.512 0 8.167-3.58 8.167-8S21.012 0 16.5 0zm4.288 8c0-2.32-1.92-4.2-4.288-4.2-2.368 0-4.287 1.88-4.287 4.2 0 2.32 1.919 4.2 4.287 4.2s4.288-1.88 4.288-4.2zm8.166 18c0-1.28-6.39-4.2-12.454-4.2-6.064 0-12.454 2.92-12.454 4.2v2.2h24.908V26zM.167 26c0-5.32 10.882-8 16.333-8 5.451 0 16.333 2.68 16.333 8v4c0 1.1-.918 2-2.041 2H2.208c-1.123 0-2.041-.9-2.041-2v-4z"
        fill={color}
      />
    </Svg>
  );
}

export default FanIcon;
