import React from 'react';
// Customizable Area Start
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Svg, { Path } from 'react-native-svg';
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

  renderAllArtistsLoginModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.loginPopup}
      >
        <View
          style={[
            this.styles.centeredView,
            { backgroundColor: 'rgba(8, 8, 15, 0.72)' },
          ]}
        >
          <View style={this.styles.modalView}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={this.styles.closeBtn}
              testID="allArtistsLoginClose"
              onPress={this.handleCloseBtn}
            >
              <Svg
                width={14}
                height={14}
                viewBox="0 0 14 14"
                fill={this.getHomeTheme().foreground}
              >
                <Path
                  d="M13.3.71a.996.996 0 00-1.41 0L7 5.59 2.11.7A.996.996 0 10.7 2.11L5.59 7 .7 11.89a.996.996 0 101.41 1.41L7 8.41l4.89 4.89a.996.996 0 101.41-1.41L8.41 7l4.89-4.89c.38-.38.38-1.02 0-1.4z"
                  fill={this.getHomeTheme().foreground}
                />
              </Svg>
            </TouchableOpacity>
            <Text style={this.styles.welcomeToPopupText}>Welcome to</Text>
            <Text style={this.styles.localShowsPopupText}>Local Shows</Text>
            <Text style={this.styles.loginFirstPopupText}>
              You have to Log in first to access the events.
            </Text>
            <TouchableOpacity
              testID="allArtistsCreateAccountBtn"
              onPress={() => this.moveToLoginScreen('signup')}
            >
              <Text style={this.styles.createAccountPopupText}>
                Create new account
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="allArtistsLoginBtn"
              style={this.styles.loginBtnPopupText}
              onPress={() => this.moveToLoginScreen('login')}
            >
              <Text style={this.styles.loginTxtPopupText}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
        {this.renderAllArtistsLoginModal()}
      </SafeAreaView>
    );
  }
}
