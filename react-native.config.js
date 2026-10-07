// module.exports = {
//   project: {
//     ios: {},
//     android: {},
//   },
//   assets: ['./packages/assets/fonts'],
// };

module.exports = {
  // Linked into the iOS app bundle. Do not put Apple system fonts (SF Pro) here.
  // Those files live in packages/assets/android-only-fonts and are already copied
  // into the Android asset folders. iOS uses the system SF Pro font instead.
  assets: ['./packages/assets/fonts'],
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null,
        android: null,
      },
    },
  },
};
