import React from 'react';
import {
  DeviceEventEmitter,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {
  lightTheme,
  PROFILE_THEME_CHANGED_EVENT,
  PROFILE_THEME_STORAGE_KEY,
  redesignTheme,
} from '../../utilities/src/Colors';
import {getStorageData} from '../../../framework/src/Utilities';
import {
  TopCityItem,
  TOP_CITY_SELECTED_EVENT,
} from './EventregistrationController';

interface Props {
  navigation: any;
  route?: any;
}

interface S {
  isDarkMode: boolean;
}

export default class TopCitiesThisWeek extends React.Component<Props, S> {
  themeListener: any = null;

  constructor(props: Props) {
    super(props);
    const params = this.getRouteParams();
    this.state = {
      isDarkMode: params.isDarkMode !== false,
    };
  }

  async componentDidMount() {
    const savedTheme = await getStorageData(PROFILE_THEME_STORAGE_KEY);
    this.setState({isDarkMode: savedTheme !== 'false'});
    if (!this.themeListener) {
      this.themeListener = DeviceEventEmitter.addListener(
        PROFILE_THEME_CHANGED_EVENT,
        (isDarkMode: boolean) => {
          this.setState({isDarkMode});
        },
      );
    }
  }

  componentWillUnmount() {
    if (this.themeListener) {
      this.themeListener.remove();
      this.themeListener = null;
    }
  }

  getRouteParams = () => {
    return this.props.route?.params || this.props.navigation.state?.params || {};
  };

  getTheme = () => {
    return this.state.isDarkMode ? redesignTheme : lightTheme;
  };

  getTopCities = (): TopCityItem[] => {
    const params = this.getRouteParams();
    return Array.isArray(params.topCities) ? params.topCities : [];
  };

  handleBack = () => {
    this.props.navigation.goBack();
  };

  handleSelectCity = (city: TopCityItem) => {
    DeviceEventEmitter.emit(TOP_CITY_SELECTED_EVENT, city);
    this.props.navigation.goBack();
  };

  formatShowCount = (showCount: number | null) => {
    if (showCount === null) {
      return 'Shows';
    }
    return `${showCount} ${showCount === 1 ? 'show' : 'shows'}`;
  };

  renderCityCard = (city: TopCityItem) => {
    const styles = createStyles(this.getTheme());
    return (
      <TouchableOpacity
        key={city.id}
        testID="topCityCard"
        activeOpacity={0.85}
        onPress={() => this.handleSelectCity(city)}
        style={styles.topCityCard}>
        <ImageBackground
          source={{uri: city.imageUri}}
          style={styles.topCityImage}
          imageStyle={styles.topCityImageInner}>
          <View style={styles.topCityOverlay} />
          <View style={styles.topCityTextWrap}>
            <Text style={styles.topCityName}>{city.name.toUpperCase()}</Text>
            <Text style={styles.topCityShows}>
              {this.formatShowCount(city.showCount)}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  render() {
    const theme = this.getTheme();
    const styles = createStyles(theme);
    const topCities = this.getTopCities();
    return (
      <SafeAreaView style={styles.parentContainer}>
        <StatusBar
          barStyle={this.state.isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <View style={styles.headerContainer}>
          <TouchableOpacity
            testID="navigationBackButton"
            style={styles.backCircleBtn}
            onPress={this.handleBack}
            activeOpacity={0.8}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="arrow-left" size={18} color={theme.foreground} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            TOP CITIES THIS WEEK
          </Text>
        </View>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.topCitiesGrid}>
            {topCities.map(city => this.renderCityCard(city))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const createStyles = (theme: typeof redesignTheme) =>
  StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
      paddingHorizontal: 16,
    },
    scrollContent: {
      paddingBottom: 32,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 12,
    },
    backCircleBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    headerTitle: {
      flex: 1,
      fontFamily: 'OpenSans',
      fontWeight: '800',
      fontSize: 16,
      color: theme.foreground,
      letterSpacing: 0.6,
    },
    topCitiesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    topCityCard: {
      width: '48.5%',
      height: 132,
      borderRadius: 14,
      overflow: 'hidden',
      marginBottom: 12,
      backgroundColor: theme.card,
    },
    topCityImage: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    topCityImageInner: {
      borderRadius: 14,
    },
    topCityOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 76,
      backgroundColor: 'rgba(8, 8, 15, 0.55)',
    },
    topCityTextWrap: {
      paddingHorizontal: 12,
      paddingBottom: 12,
      zIndex: 1,
    },
    topCityName: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '800',
      fontFamily: 'OpenSans',
      letterSpacing: 0.4,
    },
    topCityShows: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: '700',
      fontFamily: 'OpenSans',
      marginTop: 2,
    },
  });
