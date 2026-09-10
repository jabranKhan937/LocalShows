import React from 'react';
// Customizable Area Start
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import FastImage from '../../../components/src/SafeFastImage';
import { leftArrow } from './assets';
// Customizable Area End

import AllEventScreen from './AllEventScreen';
import { Props } from './AllEventController';

export default class ArtistsToWatchAllScreen extends AllEventScreen {
  constructor(props: Props) {
    super(props);
    const cachedBands = this.getAllBandsListRecords();
    if (cachedBands.length > 0) {
      this.state = {
        ...this.state,
        allBandsList: cachedBands,
      };
    }
  }

  async componentDidMount() {
    this.isComponentMounted = true;
    this.loadHomeTheme();
    this.restoreHomeFeedCacheIfNeeded();
    this.getAllBandsList();
  }

  async componentWillUnmount() {
    this.isComponentMounted = false;
  }

  getAllArtists = () => {
    return this.getArtistsToWatch(null);
  };

  renderAllArtistAvatar = (artist: { id: string; image?: string }) => {
    const uri = this.resolveHomeFeedImageUrl(artist.image);
    if (!uri || this.failedArtistImageIds.has(artist.id)) {
      return (
        <View
          testID="allArtistPlaceholder"
          style={this.styles.artistAllAvatarPlaceholder}
        >
          <Icon name="music" size={22} color={this.getHomeTheme().primary} />
        </View>
      );
    }
    return (
      <FastImage
        style={this.styles.artistAllAvatar}
        source={{ uri, priority: FastImage.priority.high }}
        resizeMode={FastImage.resizeMode.cover}
        onError={() => {
          this.failedArtistImageIds.add(artist.id);
          this.forceUpdate();
        }}
      />
    );
  };

  renderAllArtistRow = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        testID={`allArtistRow-${item.id}`}
        style={this.styles.artistAllRow}
        onPress={() => this.handleArtistToWatchPress(item)}
        activeOpacity={0.7}
      >
        <View style={this.styles.artistAllAvatarWrap}>
          {this.renderAllArtistAvatar(item)}
        </View>
        <View style={this.styles.artistAllTextWrap}>
          <Text style={this.styles.artistAllName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={this.styles.artistAllMeta}>
            {item.upcomingCount > 0 ? `${item.upcomingCount} upcoming` : ''}
          </Text>
        </View>
        <Icon
          name="chevron-right"
          size={18}
          color={this.getHomeTheme().muted}
        />
      </TouchableOpacity>
    );
  };

  render() {
    const artists = this.getAllArtists();
    return (
      <SafeAreaView
        style={this.styles.container}
        edges={['top', 'left', 'right']}
      >
        <StatusBar
          barStyle={this.state.isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={this.getHomeTheme().background}
        />
        <View style={this.styles.artistAllHeader}>
          <TouchableOpacity
            testID="allArtistsBackButton"
            style={this.styles.artistAllBackButton}
            onPress={this.goBack}
          >
            <Image source={leftArrow} style={this.styles.feedHeaderBackIcon} />
          </TouchableOpacity>
          <Text style={this.styles.artistAllHeaderTitle}>ARTISTS TO WATCH</Text>
          <View style={this.styles.artistAllBackButton} />
        </View>
        <FlatList
          testID="allArtistsList"
          data={artists}
          keyExtractor={(item, index) =>
            item?.id != null && item.id !== ''
              ? String(item.id)
              : `artist-${index}`
          }
          renderItem={this.renderAllArtistRow}
          contentContainerStyle={this.styles.artistAllListContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            this.getAllBandsListRecords().length === 0 ? (
              <ActivityIndicator
                testID="allArtistsLoading"
                size="large"
                color={this.getHomeTheme().primary}
                style={{ marginTop: 48 }}
              />
            ) : (
              <Text style={this.styles.artistAllEmpty}>No artists found</Text>
            )
          }
        />
        {this.renderLoginModal()}
      </SafeAreaView>
    );
  }
}
