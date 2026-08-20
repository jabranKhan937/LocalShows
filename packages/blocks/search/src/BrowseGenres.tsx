import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {lightTheme, redesignTheme} from '../../utilities/src/Colors';
import FastImage from '../../../components/src/SafeFastImage';

const GENRE_DOT_COLORS = ['#7ec8ff', '#ff2d6b', '#ffe138', '#3dd68c'];
const SCREEN_WIDTH = Dimensions.get('window').width;
const FEED_GUTTER = 16;
const GENRE_GAP = 12;
const GENRE_CARD_WIDTH = (SCREEN_WIDTH - FEED_GUTTER * 2 - GENRE_GAP) / 2;

interface Props {
  navigation: any;
  route?: any;
}

export default class BrowseGenres extends React.Component<Props> {
  getTheme = () => {
    const params =
      this.props.route?.params || this.props.navigation.state?.params || {};
    return params.isDarkMode === false ? lightTheme : redesignTheme;
  };

  getGenres = () => {
    const params =
      this.props.route?.params || this.props.navigation.state?.params || {};
    return Array.isArray(params.genres) ? params.genres : [];
  };

  handleBack = () => {
    this.props.navigation.goBack();
  };

  handleGenrePress = (genreName: string) => {
    if (!genreName) {
      return;
    }
    this.props.navigation.navigate('Search', {selectedGenre: genreName});
  };

  renderGenreCard = (item: any, index: number) => {
    const theme = this.getTheme();
    const styles = createStyles(theme);
    const dotColor = GENRE_DOT_COLORS[index % GENRE_DOT_COLORS.length];
    return (
      <TouchableOpacity
        key={item.id || `${item.name}-${index}`}
        testID="genreCard"
        activeOpacity={0.9}
        style={[styles.genreCard, index % 2 === 0 ? {marginRight: GENRE_GAP} : null]}
        onPress={() => this.handleGenrePress(item.name)}>
        {item.image ? (
          <FastImage
            style={styles.genreImage}
            source={{uri: item.image, priority: FastImage.priority.high}}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View
            style={[
              styles.genreImagePlaceholder,
              {backgroundColor: `${dotColor}22`},
            ]}
          />
        )}
        <View style={styles.genreOverlay} />
        <View style={[styles.genreDot, {backgroundColor: dotColor}]} />
        <Text style={styles.genreName} numberOfLines={2}>
          {String(item.name || '').toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    const theme = this.getTheme();
    const styles = createStyles(theme);
    const genres = this.getGenres();
    return (
      <SafeAreaView style={styles.parentContainer}>
        <StatusBar
          barStyle={theme === lightTheme ? 'dark-content' : 'light-content'}
          backgroundColor={theme.background}
        />
        <View style={styles.headerContainer}>
          <TouchableOpacity
            testID="navigationBackButton"
            style={styles.overlayCircleBtn}
            onPress={this.handleBack}
            activeOpacity={0.8}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="arrow-left" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitleTxt}>GENRES</Text>
        </View>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionLabel}>BROWSE BY GENRE</Text>
          <View style={styles.genreGrid}>
            {genres.map((item: any, index: number) =>
              this.renderGenreCard(item, index),
            )}
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
      paddingHorizontal: FEED_GUTTER,
    },
    scrollContent: {
      paddingBottom: 24,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: FEED_GUTTER,
      paddingBottom: 12,
      paddingTop: 4,
    },
    overlayCircleBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(8, 8, 15, 0.55)',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'rgba(255, 255, 255, 0.14)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    headerTitleTxt: {
      fontWeight: '900',
      fontSize: 28,
      letterSpacing: 0.8,
      color: theme.foreground,
      textTransform: 'uppercase',
    },
    sectionLabel: {
      color: theme.muted,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      marginBottom: 12,
    },
    genreGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    genreCard: {
      width: GENRE_CARD_WIDTH,
      height: 110,
      borderRadius: 14,
      overflow: 'hidden',
      backgroundColor: theme.input,
      marginBottom: GENRE_GAP,
      justifyContent: 'flex-end',
    },
    genreImage: {
      ...StyleSheet.absoluteFillObject,
    },
    genreImagePlaceholder: {
      ...StyleSheet.absoluteFillObject,
    },
    genreOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(8, 8, 15, 0.28)',
    },
    genreDot: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    genreName: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '800',
      letterSpacing: 0.4,
      paddingHorizontal: 12,
      paddingBottom: 12,
    },
  });
