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

export default class HotVenuesAllScreen extends AllEventScreen {
  constructor(props: Props) {
    super(props);
  }

  async componentDidMount() {
    this.isComponentMounted = true;
    this.loadHomeTheme();
    this.restoreHomeFeedCacheIfNeeded();
    this.getAllBandsList();
    this.getHotVenuesAPI();
  }

  async componentWillUnmount() {
    this.isComponentMounted = false;
  }

  getAllHotVenues = () => {
    return this.getHotVenues();
  };

  renderAllVenueThumb = (venue: {
    id: string;
    image?: string;
    name?: string;
    city?: string;
  }) => {
    const uri = this.getHotVenueImageUri(venue);
    if (!uri) {
      return (
        <View
          testID="allVenuePlaceholder"
          style={this.styles.venueAllThumbPlaceholder}
        >
          <Icon name="map-pin" size={18} color={this.getHomeTheme().primary} />
        </View>
      );
    }
    return (
      <FastImage
        style={this.styles.venueAllThumb}
        source={{ uri, priority: FastImage.priority.high }}
        resizeMode={FastImage.resizeMode.cover}
        onError={() => this.handleHotVenueImageError(venue)}
      />
    );
  };

  renderAllVenueRow = ({ item }: { item: any }) => {
    const showLabel =
      item.showCount === 1 ? '1 show' : `${item.showCount} shows`;
    const meta = item.city ? `${item.city} • ${showLabel}` : showLabel;
    return (
      <TouchableOpacity
        testID={`allVenueRow-${item.id}`}
        style={this.styles.artistAllRow}
        onPress={() => {
          void this.handleHotVenuePress(item);
        }}
        activeOpacity={0.7}
      >
        <View style={this.styles.venueAllThumbWrap}>
          {this.renderAllVenueThumb(item)}
        </View>
        <View style={this.styles.artistAllTextWrap}>
          <Text style={this.styles.artistAllName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={this.styles.artistAllMeta} numberOfLines={1}>
            {meta}
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
    const venues = this.getAllHotVenues();
    const waitingForVenues =
      venues.length === 0 &&
      (!Array.isArray(this.state.hotVenues) ||
        this.state.hotVenues.length === 0) &&
      this.getDiscoveryShows().length === 0;
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
            testID="allVenuesBackButton"
            style={this.styles.artistAllBackButton}
            onPress={this.goBack}
          >
            <Image source={leftArrow} style={this.styles.feedHeaderBackIcon} />
          </TouchableOpacity>
          <Text style={this.styles.artistAllHeaderTitle}>HOT VENUES</Text>
          <View style={this.styles.artistAllBackButton} />
        </View>
        <FlatList
          testID="allVenuesList"
          data={venues}
          keyExtractor={(item, index) =>
            item?.id != null && item.id !== ''
              ? String(item.id)
              : `venue-${index}`
          }
          renderItem={this.renderAllVenueRow}
          contentContainerStyle={this.styles.artistAllListContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            waitingForVenues ? (
              <ActivityIndicator
                testID="allVenuesLoading"
                size="large"
                color={this.getHomeTheme().primary}
                style={{ marginTop: 48 }}
              />
            ) : (
              <Text style={this.styles.artistAllEmpty}>No venues found</Text>
            )
          }
        />
        {this.renderLoginModal()}
      </SafeAreaView>
    );
  }
}
