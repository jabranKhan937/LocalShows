import React from 'react';
// Customizable Area Start
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  StatusBar,
  TextInput,
  Modal,
  ActivityIndicator,
  FlatList,
  Pressable,
  Dimensions,
} from 'react-native';
                                                                                                                                                                                                                                                                                                           
import { leftArrowWhite, defaultProfile, editIcon } from './assets';
import { leftArrow, usFlag } from '../../email-account-registration/src/assets';
import Feather from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
                                                                                    
import {
  lightTheme,
  redesignTheme,
} from '../../utilities/src/Colors';
import FastImage from '../../../components/src/SafeFastImage';
import { SafeAreaView } from 'react-native-safe-area-context';
// Customizable Area End
                                                                                                                                                                                                          
import UserProfileBasicController from './UserProfileBasicController';
                             
export default class CreateYourProfile extends UserProfileBasicController {
  // Customizable Area Start.
  get styles() {
    return this.state.isDarkMode ? darkEditStyles : lightEditStyles;
  }

  abbreviateDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  renderAffiliateItem = ({ item }: { item: string }) => (
    <View style={this.styles.selectedAffiliate}>
      <Text style={this.styles.selectedAffiliateText}>{item}</Text>
      <Feather
        testID="btnRemoveAffiliate"
        name="x"
        size={17}
        color={this.getProfileTheme().primary}
        onPress={() => this.handleRemoveAffiliate(item)}
      />
    </View>
  );
                                 
  renderInfluenceItem = ({ item }: { item: string }) => (
    <View style={this.styles.selectedAffiliate}>
      <Text style={this.styles.selectedAffiliateText}>{item}</Text>
      <Feather
        testID="btnRemoveInfluence"
        name="x"
        size={17}
        color={this.getProfileTheme().primary}
        onPress={() => this.handleRemoveInfluence(item)}
      />
    </View>
  );
                                   
  renderBackBtnAndHeader = () => {
    const editMode =
      this.state.editMode ||
      this.props.navigation?.state?.params?.editMode ||
      (this.props as any).route?.params?.editMode ||
      false;

    return (
      <SafeAreaView
        edges={['top']}
        style={this.styles.bannerOverlay}
        pointerEvents="box-none"
      >
        <View style={this.styles.bannerOverlayInner} pointerEvents="box-none">
          <TouchableOpacity
            testID="navigationBackButton"
            style={this.styles.overlayCircleBtn}
            onPress={() => {
              this.props.navigation.goBack();
            }}
            activeOpacity={0.8}
          >
            <Feather name="chevron-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text
            testID="testLabel"
            style={this.styles.overlayTitle}
            numberOfLines={1}
          >
            {editMode ? 'Edit Profile' : 'Create your profile'}
          </Text>
          <View style={this.styles.overlaySideSpacer} />
        </View>
      </SafeAreaView>
    );
  };

  getEditCoverSource = () => {
    const coverUri = (this.state.coverPic || '').trim();
    if (coverUri !== '' && coverUri !== 'null' && coverUri !== 'undefined') {
      return { uri: coverUri, priority: FastImage.priority.high };
    }
    return require('../../../mobile/assets/images/profile_concert_bg.png');
  };

  renderImageSection = () => {
    return (
      <View style={this.styles.heroWrap}>
        <View style={this.styles.bannerWrap}>
          <FastImage
            source={this.getEditCoverSource()}
            style={this.styles.bannerImage}
            resizeMode={FastImage.resizeMode.cover}
          />
          {this.renderBackBtnAndHeader()}
          <TouchableOpacity
            testID="coverPicButton"
            style={this.styles.coverPicBtn}
            onPress={() => {
              this.handleProfilePic('cover');
            }}
          >
            <Feather name="edit-2" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={this.styles.avatarRow}>
          <View style={this.styles.avatarWrap}>
            <View style={this.styles.profileImageContainer}>
              <FastImage
                source={
                  this.state.profilePic
                    ? {
                        uri: this.state.profilePic,
                        priority: FastImage.priority.high,
                      }
                    : defaultProfile
                }
                style={this.styles.profileImage}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
            <TouchableOpacity
              testID="profilePicButton"
              style={this.styles.profilePicBtn}
              onPress={() => {
                this.handleProfilePic('profile');
              }}
            >
              <Feather name="edit-2" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
                                                                                                           
  renderAdmin = () => {
    return (
      <>
        {/* <Text style={[this.styles.text, this.styles.textInputLabel]}>
          Administrator Name
        </Text>
        <TextInput
          testID="adminNameTextInput"
          placeholder="Enter admin name"
          placeholderTextColor={this.getProfileTheme().muted}
          style={this.styles.textInput}
          value={this.state.adminName}
          onChangeText={name => this.setState({ adminName: name })}
        /> */}
        <Text
          style={[
            this.styles.text,
            this.styles.errorText,
            {
              marginBottom: this.state.nameError !== '' ? 10 : 0,
            },
          ]}
        >
          {this.state.nameError}
        </Text>
      </>
    );
  };
                                                                            
  renderTitle = () => {
    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel]}>Title</Text>
        <TextInput
          testID="titleTextInput"
          placeholder="Enter title"
          placeholderTextColor={this.getProfileTheme().muted}
          style={this.styles.textInput}
          value={this.state.title}
          onChangeText={title => this.setState({ title })}
        />
      </>
    );
  };

  renderAccountType = () => {
    if (!this.state.accountType) {
      return null;
    }
    const isVenue = this.state.userRole === 'venue';

    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel, { marginTop: 20 }]}>
          {'Account Type'}
        </Text>
        <View
          style={[
            this.styles.textInput,
            this.styles.selector,
            { backgroundColor: this.getProfileTheme().input, opacity: 0.7 },
            isVenue && { pointerEvents: 'none' as const },
          ]}
        >
          <Text
            style={[
              this.styles.text,
              { marginHorizontal: 10, color: this.getProfileTheme().foreground },
            ]}
          >
            {this.getAccountTypeDisplayLabel(this.state.accountType)}
          </Text>
        </View>
      </>
    );
  };

  renderVenueType = () => {
    return (
      <>

 <>
        <Text style={[this.styles.text, this.styles.textInputLabel, { marginTop: 20 }]}>
          {'Account Type'}
        </Text>
        <View
          style={[
            this.styles.textInput,
            this.styles.selector,
            { backgroundColor: this.getProfileTheme().input, opacity: 0.7 }
          ]}
        >
          <Text
            style={[
              this.styles.text,
              { marginHorizontal: 10, color: this.getProfileTheme().foreground },
            ]}
          >

Business
          </Text>
        </View>
      </>

        <Text style={[this.styles.text, this.styles.textInputLabel, { marginTop: 20 }]}>
          {'Category'}
        </Text>
        <View
          style={[
            this.styles.textInput,
            this.styles.selector,
            { backgroundColor: this.getProfileTheme().input, opacity: 0.7 },
          ]}
        >
          <Text
            style={[
              this.styles.text,
              { marginHorizontal: 10, color: this.getProfileTheme().foreground },
            ]}
          >
            {this.getAccountTypeDisplayLabel(this.state.accountType)}
          </Text>
        </View>
      </>
    );
  };

  renderDescribeWhatYouDoLink = () => {
    if (this.state.userRole !== 'band') {
      return null;
    }

    return (
      <TouchableOpacity
        testID="describeWhatYouDoLink"
        style={{ marginTop: 15, marginBottom: 10 }}
        onPress={() => {
          this.props.navigation.navigate('CategoriesSubCategories', {
            navigationBarTitleText: 'Categories & Subcategories',
          });
        }}
      >
        <Text style={{ color: this.getProfileTheme().primary, fontSize: 16, fontWeight: '600' }}>
          Describe what you do
        </Text>
      </TouchableOpacity>
    );
  };

  renderCategory = () => {
    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel, { marginTop: 20 }]}>
          Category
        </Text>
        {Platform.OS === 'ios' ? (
          <TouchableOpacity
            testID="btnCategoryPicker"
            style={[this.styles.textInput, this.styles.selector]}
            onPress={() => {
              this.setState({
                showPickerModal: true,
                modalValues: ['Band', 'Artist'],
              });
              this.modalCallback = (bandType: 'Band' | 'Artist') => {
                this.setState({
                  bandType,
                  showPickerModal: false,
                  modalValues: [],
                });
              };
            }}
          >
            <Text style={[this.styles.text, { marginHorizontal: 10 }]}>
              {this.state.bandType}
            </Text>
            <Image
              source={leftArrowWhite}
              style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]}
            />
          </TouchableOpacity>
        ) : (
          <View
            style={[
              this.styles.textInput,
              this.styles.selector,
              {
                paddingHorizontal: 0,
              },
            ]}
          >
            <Picker
              testID="categoryPicker"
              style={[this.styles.textInput, this.styles.selector]}
              itemStyle={this.styles.text}
              selectedValue={this.state.bandType}
              onValueChange={bandType =>
                this.setState({
                  bandType,
                  selectedCategoryName: '',
                  selectedCategoryID: '',
                  selectedSubCategoryName: [],
                })
              }
            >
              <Picker.Item label={'Band'} value={'Band'} />
              <Picker.Item label={'Artist'} value={'Artist'} />
            </Picker>
            <Image
              source={leftArrowWhite}
              style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]}
            />
          </View>
        )}
      </>
    );
  };

  renderWhatKindOf = () => {
    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel, { marginTop: 20 }]}>
          {`What kind of ${this.state.bandType}?`}
        </Text>
        {Platform.OS === 'ios' ? (
          <TouchableOpacity
            testID="btnCategoryListPicker"
            style={[this.styles.textInput, this.styles.selector]}
            onPress={() => {
              this.setState({ categoryPickerModal: true });
            }}
          >
            <Text style={[this.styles.text, { marginHorizontal: 10 }]}>
              {this.state.selectedCategoryName || 'Select'}
            </Text>
            <Image
              source={leftArrowWhite}
              style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]}
            />
          </TouchableOpacity>
        ) : (
          <View
            style={[
              this.styles.textInput,
              this.styles.selector,
              {
                paddingHorizontal: 0,
              },
            ]}
          >
            <Picker
              testID="categoryListPicker"
              style={[this.styles.textInput, this.styles.selector]}
              itemStyle={this.styles.text}
              selectedValue={this.state.selectedCategoryName}
              onValueChange={(item: string) =>
                this.handleCategorySelection(item)
              }
            >
              <Picker.Item label={'Select'} value={''} />
              {this.state.categoriesList.map(item => (
                <Picker.Item
                  key={item.id}
                  label={item.attributes.name}
                  value={item.attributes.name}
                />
              ))}
            </Picker>
            <Image
              source={leftArrowWhite}
              style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]}
            />
          </View>
        )}
      </>
    );
  };

  renderType = () => {
    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel, { marginTop: 20 }]}>
          {`${this.state.selectedCategoryName} Type`}
        </Text>
        {Platform.OS === 'ios' ? (
          <TouchableOpacity
            testID="btnSubCategoryListPicker"
            style={[this.styles.textInput, this.styles.selector]}
            onPress={() => {
              this.setState({ subCategoryPickerModal: true });
            }}
          >
            <Text style={[this.styles.text, { marginHorizontal: 10 }]}>
              {'Select'}
            </Text>
            <Image
              source={leftArrowWhite}
              style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]}
            />
          </TouchableOpacity>
        ) : (
          <View
            style={[
              this.styles.textInput,
              this.styles.selector,
              {
                paddingHorizontal: 0,
              },
            ]}
          >
            <Picker
              testID="subCategoryListPicker"
              style={[this.styles.textInput, this.styles.selector]}
              itemStyle={this.styles.text}
              onValueChange={(item: string) =>
                this.handleSubCategorySelection(item)
              }
            >
              <Picker.Item label={'Select'} value={''} />
              {this.state.subCategoriesList.map(item => (
                <Picker.Item
                  key={item.id}
                  label={item.attributes.name}
                  value={item.attributes.name}
                />
              ))}
            </Picker>
            <Image
              source={leftArrowWhite}
              style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]}
            />
          </View>
        )}
        {this.renderSelectedType()}
      </>
    );
  };

  renderSelectedType = () => {
    return (
      <>
        <FlatList
          testID="subCategoryFlatlist"
          data={this.state.selectedSubCategoryName}
          numColumns={20}
          columnWrapperStyle={{ flexWrap: 'wrap' }}
          renderItem={({ item }) => {
            return (
              <View style={this.styles.rowItem}>
                <Text
                  style={[
                    this.styles.label,
                    { fontWeight: '400', color: this.getProfileTheme().primary, marginTop: 1 },
                  ]}
                >
                  {item}
                </Text>
                <TouchableOpacity
                  testID="closeSubCatBtn"
                  onPress={() => {
                    this.handleRemoveSubCategory(item);
                  }}
                >
                  <Image
                    source={require('../../../mobile/assets/images/close.png')}
                    style={this.styles.crossBtn}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={(item: any) => item.id}
        />
      </>
    );
  };

  renderBusinessHours = () => {
    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel, { marginTop: 20 }]}>
          Business hours
        </Text>
        <FlatList
          testID="businessHoursFlatlist"
          data={this.abbreviateDays}
          numColumns={20}
          columnWrapperStyle={{ flexWrap: 'wrap' }}
          renderItem={({ item }) => {
            const isSelected = this.state.selectedBusinessDays.includes(item);
            return (
              <View style={this.styles.daysItem}>
                <TouchableOpacity
                  testID={isSelected ? 'selectedDay' : 'unselectedDay'}
                  style={[
                    this.styles.checkbox,
                    isSelected && this.styles.checkboxChecked,
                  ]}
                  onPress={() => this.handleBusinessDayToggle(item)}
                >
                  {isSelected && (
                    <Feather name="check" size={14} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
                <Text
                  style={[
                    this.styles.label,
                    { fontWeight: '400', marginTop: 1, width: '80%' },
                  ]}
                >
                  {item}
                </Text>
              </View>
            );
          }}
          keyExtractor={(item: string, index: number) =>
            item || index.toString()
          }
        />
      </>
    );
  };

  renderOpenCloseHours = () => {
    return (
      <View style={{ flexDirection: 'row', flex: 2 }}>
        <View style={{ flex: 1, marginRight: 20 }}>
          <Text style={[this.styles.text, this.styles.textInputLabel, { marginTop: 20 }]}>
            Open at
          </Text>
          {Platform.OS === 'ios' ? (
            <>{this.renderOpenAtPickeriOS()}</>
          ) : (
            <>{this.renderOpenAtPickerAndroid()}</>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[this.styles.text, this.styles.textInputLabel, { marginTop: 20 }]}>
            Close at
          </Text>
          {Platform.OS === 'ios' ? (
            <>{this.renderCloseAtPickeriOS()}</>
          ) : (
            <>{this.renderCloseAtPickerAndroid()}</>
          )}
        </View>
      </View>
    );
  };

  renderOpenAtPickeriOS = () => {
    return (
      <TouchableOpacity
        testID="btnOpenAtPicker"
        style={[this.styles.textInput, this.styles.selector]}
        onPress={() => {
          this.setState({ openAtPickerModal: true });
        }}
      >
        <Text style={[this.styles.text, { marginHorizontal: 10 }]}>
          {this.state.openAt || 'Select'}
        </Text>
        <Image
          source={leftArrowWhite}
          style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]}
        />
      </TouchableOpacity>
    );
  };

  renderOpenAtPickerAndroid = () => {
    return (
      <View
        style={[
          this.styles.textInput,
          this.styles.selector,
          {
            paddingHorizontal: 0,
          },
        ]}
      >
        <Picker
          testID="openAtPicker"
          style={[this.styles.textInput, this.styles.selector]}
          itemStyle={this.styles.text}
          onValueChange={(item: string) => this.handleOpenAtSelection(item)}
          selectedValue={this.state.openAt}
        >
          <Picker.Item label={'Select'} value={''} />
          {this.state.openTimeSlots.map(item => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
        <Image
          source={leftArrowWhite}
          style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]}
        />
      </View>
    );
  };

  renderCloseAtPickeriOS = () => {
    return (
      <TouchableOpacity
        testID="btncloseAtPicker"
        style={[
          this.styles.textInput,
          this.styles.selector,
          { opacity: this.state.openAt ? 1 : 0.5 },
        ]}
        onPress={() => {
          if (this.state.openAt) {
            this.setState({ closeAtPickerModal: true });
          }
        }}
        disabled={!this.state.openAt}
      >
        <Text style={[this.styles.text, { marginHorizontal: 10 }]}>
          {this.state.closeAt || 'Select'}
        </Text>
        <Image
          source={leftArrowWhite}
          style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]}
        />
      </TouchableOpacity>
    );
  };

  renderCloseAtPickerAndroid = () => {
    return (
      <View
        style={[
          this.styles.textInput,
          this.styles.selector,
          {
            paddingHorizontal: 0,
          },
        ]}
      >
        <Picker
          testID="closeAtPicker"
          style={[this.styles.textInput, this.styles.selector]}
          itemStyle={this.styles.text}
          onValueChange={(item: string) => this.handleCloseAtSelection(item)}
          selectedValue={this.state.closeAt}
          enabled={this.state.openAt !== ''}
        >
          <Picker.Item label={'Select'} value={''} />
          {this.state.closeTimeSlots.map(item => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
        <Image
          source={leftArrowWhite}
          style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]}
        />
      </View>
    );
  };

  renderAddress = () => {
    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel, { marginTop: 20 }]}>
          Address
        </Text>
        <TextInput
          testID="addressTextInput"
          placeholder="Enter address"
          placeholderTextColor={this.getProfileTheme().muted}
          style={this.styles.textInput}
          value={this.state.address}
          onChangeText={address => this.setState({ address })}
        />
        <Text
          style={[
            this.styles.text,
            this.styles.errorText,
            {
              marginBottom: this.state.addressError !== '' ? 10 : 0,
            },
          ]}
        >
          {this.state.addressError}
        </Text>
      </>
    );
  };

  renderZipCode = () => {
    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel, { marginTop: 0 }]}>
          Zip Code
        </Text>
        <TextInput
          testID="zipCodeTextInput"
          placeholder="Enter zip code"
          placeholderTextColor={this.getProfileTheme().muted}
          style={this.styles.textInput}
          value={this.state.zipCode}
          onChangeText={zipCode => this.handleZipCode(zipCode)}
          keyboardType="numeric"
          maxLength={10}
        />
        <Text
          style={[
            this.styles.text,
            this.styles.errorText,
            {
              marginBottom: this.state.zipCodeError !== '' ? 10 : 0,
            },
          ]}
        >
          {this.state.zipCodeError}
        </Text>
      </>
    );
  };

  renderCapacity = () => {
    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel]}>
          Maximum capacity (people)
        </Text>
        <TextInput
          testID="capacityTextInput"
          placeholder="Enter capacity"
          placeholderTextColor={this.getProfileTheme().muted}
          style={this.styles.textInput}
          value={this.state.capacity}
          onChangeText={capacity => this.handleCapacity(capacity)}
          keyboardType="numeric"
        />
        <Text
          style={[
            this.styles.text,
            this.styles.errorText,
            {
              marginBottom: this.state.capacityError !== '' ? 10 : 0,
            },
          ]}
        >
          {this.state.capacityError}
        </Text>
      </>
    );
  };

  renderOfficialWebsite = () => {
    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel, { marginTop: 10 }]}>
          Official Website
        </Text>
        <TextInput
          testID="websiteTextInput"
          placeholder="Enter web address"
          placeholderTextColor={this.getProfileTheme().muted}
          style={this.styles.textInput}
          value={this.state.website}
          onChangeText={website => this.setState({ website })}
        />
        <Text
          style={[
            this.styles.text,
            this.styles.errorText,
            {
              marginBottom: this.state.websiteError !== '' ? 10 : 0,
            },
          ]}
        >
          {this.state.websiteError}
        </Text>
      </>
    );
  };

  renderEmailId = () => {
    const editMode =
      this.state.editMode ||
      this.props.navigation?.state?.params?.editMode ||
      (this.props as any).route?.params?.editMode ||
      false;

    return (
      <>
       <View style={{ marginTop: 20,marginBottom: -20 }}>
         <Text style={[this.styles.text, this.styles.textInputLabel]}>Email address</Text>
        <TextInput
          testID="emailTextInput"
          placeholder="Enter your email address"
          placeholderTextColor={this.getProfileTheme().muted}
          style={[this.styles.textInput, editMode && this.styles.disabledInput]}
          value={this.state.email}
          editable={!editMode}
          onChangeText={editMode ? undefined : (email) => this.handleEmail(email.replace(' ', ''))}
        />
        {editMode && (
          <Text style={[this.styles.text, this.styles.emailSecurityText]}>
            You cannot change the email for security reasons, if you need to change the email, please contact us
          </Text>
        )}
        <Text style={[this.styles.text, this.styles.errorText]}>
          {this.state.emailError}
        </Text>
       </View>
      </>
    );
  };

  renderPhoneBand = () => {
    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel]}>Cell phone</Text>
        {Platform.OS === 'ios' ? (
          <View>
            <TextInput
              testID="phoneTextInputBand"
              style={[this.styles.textInput, this.styles.textInputPhone]}
              keyboardType="numeric"
              value={this.state.phoneNumber}
              onChangeText={phone => this.handlePhoneNumber(phone)}
              maxLength={10}
            />
            {this.renderCountryCodeiOS()}
          </View>
        ) : (
          this.renderCountryCodeAndroid()
        )}
        <Text style={[this.styles.text, this.styles.errorText]}>
          {this.state.phoneError}
        </Text>
      </>
    );
  };

  renderCountryCodeiOS = () => {
    const hasFlag =
      this.state.selectedCountryCode &&
      Object.keys(this.state.selectedCountryCode).length > 0;
    const code =
      this.state.selectedCountryCode &&
      Object.keys(this.state.selectedCountryCode).length > 0
        ? `+${this.state.selectedCountryCode.attributes.country_code}`
        : '';
    return (
      <TouchableOpacity
        testID="btnCountryCodeSelect"
        style={this.styles.countryCodeContainer}
        onPress={this.handleShowCountryCode}
      >
        <Image
          source={
            hasFlag
              ? { uri: this.state.selectedCountryCode.attributes.map_url }
              : usFlag
          }
          style={this.styles.usFlag}
        />
        <Image
          source={leftArrowWhite}
          style={[
            this.styles.downArrow,
            this.styles.countryCodeArrow,
            { tintColor: this.getProfileTheme().primary },
          ]}
        />
        <Text style={[this.styles.text, this.styles.textCountryCode]}>{code}</Text>
      </TouchableOpacity>
    );
  };

  renderCountryCodeAndroid = () => {
    const hasFlag =
      this.state.selectedCountryCode &&
      Object.keys(this.state.selectedCountryCode).length > 0;
    const code =
      this.state.selectedCountryCode &&
      Object.keys(this.state.selectedCountryCode).length > 0
        ? `+${this.state.selectedCountryCode.attributes.country_code}`
        : '';
    return (
      <View>
        <TextInput
          testID="phoneTextInput"
          style={[this.styles.textInput, this.styles.textInputPhone]}
          keyboardType="numeric"
          value={this.state.phoneNumber}
          onChangeText={phone => this.handlePhoneNumber(phone)}
          maxLength={10}
        />
        <TouchableOpacity
          testID="btnCountryCodeSelectAndroid"
          style={this.styles.countryCodeContainer}
          onPress={() => {
            this.setState({ countryCodeClickedAndroid: true });
          }}
        >
          <Image
            source={
              hasFlag
                ? { uri: this.state.selectedCountryCode.attributes.map_url }
                : usFlag
            }
            style={this.styles.usFlag}
          />
          <Image
            source={leftArrowWhite}
            style={[
              this.styles.downArrow,
              this.styles.countryCodeArrow,
              { tintColor: this.getProfileTheme().primary },
            ]}
          />
          <Text style={[this.styles.text, this.styles.textCountryCode]}>{code}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderCountryCodeModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.countryCodeClicked}
      >
        <TouchableWithoutFeedback
          testID="hideCountryCodeModal"
          onPress={this.hideCountryCodeModal}
        >
          <View style={this.styles.centeredView}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  this.styles.modalView,
                  { borderTopStartRadius: 20, padding: 15 },
                ]}
              >
                <Picker
                  testID="countryCodePickerModal"
                  selectedValue={this.state.selectedCountryCode}
                  onValueChange={this.handleCountryCodeValueiOS}
                >
                  {this.state.countryCodesList.map((item: any) => (
                    <Picker.Item
                      key={item.id}
                      label={`${item.attributes.name} (+${item.attributes.country_code})`}
                      value={item}
                    />
                  ))}
                </Picker>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  renderSocialMedia = () => {
    return (
      <>
        <Text style={[this.styles.text, this.styles.socialMediaHeading]}>
          Social Media
        </Text>
        <Text style={[this.styles.text, this.styles.textInputLabel, { marginTop: 20 }]}>
          Instagram
        </Text>
        <Pressable
          testID="InstaInputBtn"
          onPress={() => {
            this.InstaInputRef.current.focus();
          }}
          style={{
            width: '100%',
            paddingHorizontal: 10,
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: '#C5C5FF',
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: this.getProfileTheme().foreground,
            }}
          >
            {'https://www.instagram.com/'.trim()}
          </Text>
          <TextInput
            ref={this.InstaInputRef}
            testID="instagramTextInput"
            placeholder="UserName"
            placeholderTextColor={this.getProfileTheme().muted}
            onChangeText={instagram => this.setState({ instagram })}
            value={this.state.instagram}
            style={{ flex: 1, fontSize: 16, color: this.getProfileTheme().foreground }}
          />
        </Pressable>
        {this.state.instagramLinkError !== '' && (
          <Text
            style={[
              this.styles.text,
              this.styles.errorText,
              {
                marginBottom: this.state.instagramLinkError !== '' ? 10 : 0,
              },
            ]}
          >
            {this.state.instagramLinkError}
          </Text>
        )}
        <Text style={[this.styles.text, this.styles.textInputLabel, { marginTop: 20 }]}>
          Facebook
        </Text>
                                         
        <Pressable
          testID="FBInputBtn"
          onPress={() => {
            this.FBInputRef.current.focus();
          }}
          style={{
            width: '100%',
            paddingHorizontal: 10,
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: '#C5C5FF',
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: this.getProfileTheme().foreground,
            }}
          >
            {'https://www.facebook.com/'.trim()}
          </Text>
          <TextInput
            ref={this.FBInputRef}
            testID="facebookTextInput"
            value={this.state.facebook}
            placeholder="UserName"
            placeholderTextColor={this.getProfileTheme().muted}
            onChangeText={facebook => this.setState({ facebook })}
            style={{
              flex: 1,
              fontSize: 16,
              color: this.getProfileTheme().foreground,
            }}
          />
        </Pressable>
        {this.state.facebookLinkError !== '' && (
          <Text
            style={[
              this.styles.text,
              this.styles.errorText,
              {
                marginBottom: this.state.facebookLinkError !== '' ? 10 : 0,
              },
            ]}
          >
            {this.state.facebookLinkError}
          </Text>
        )}
        <Text style={[this.styles.text, this.styles.textInputLabel, { marginTop: 20 }]}>
          LinkedIn
        </Text>

        <Pressable
          testID="LdinInputBtn"
          onPress={() => {
            this.LdinInputRef.current.focus();
          }}
          style={{
            width: '100%',
            paddingHorizontal: 10,
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: '#C5C5FF',
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: this.getProfileTheme().foreground,
            }}
          >
            {'https://www.linkedin.com/in/'.trim()}
          </Text>
          <TextInput
            ref={this.LdinInputRef}
            testID="linkedinTextInput"
            placeholder="UserName"
            placeholderTextColor={this.getProfileTheme().muted}
            value={this.state.linkedin}
            onChangeText={linkedin => this.setState({ linkedin })}
            style={{ flex: 1, fontSize: 16, color: this.getProfileTheme().foreground }}
          />
        </Pressable>
        {this.state.linkedInLinkError !== '' && (
          <Text
            style={[
              this.styles.text,
              this.styles.errorText,
              {
                marginBottom: this.state.linkedInLinkError !== '' ? 10 : 0,
              },
            ]}
          >
            {this.state.linkedInLinkError}
          </Text>
        )}
      </>
    );
  };

  renderAboutUs = () => {
    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel, { marginTop: 20 }]}>
          Bio / About us{' '}
          <Text style={{ fontWeight: 'normal' }}>(max 2,000 characters)</Text>
        </Text>
        <TextInput
          testID="aboutUsTxtInput"
          placeholder="About you"
          placeholderTextColor={this.getProfileTheme().muted}
          style={[this.styles.textInput, this.styles.textInputBio]}
          value={this.state.aboutUs}
          onChangeText={aboutUs => this.setState({ aboutUs })}
          multiline
        />
        <Text
          style={[
            this.styles.text,
            this.styles.errorText,
            {
              marginBottom: this.state.aboutUsError !== '' ? 10 : 0,
            },
          ]}
        >
          {this.state.aboutUsError}
        </Text>
      </>
    );
  };

  renderInfluences = () => {
    // Hide Influences section for venue users
    if (this.state.userRole === 'venue') {
      return null;
    }

    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel]}>Influences</Text>

        <View style={this.styles.rosterInputContainer}>
          <TextInput
            testID="influencesTextInput"
            placeholder="Enter your influences"
            placeholderTextColor={this.getProfileTheme().muted}
            style={this.styles.rosterInput}
            value={this.state.influenceText}
            onChangeText={text =>
              this.setState({ influenceText: text.replace('  ', ' ') })
            }
            onSubmitEditing={this.handleArtistSelection}
          />
          {this.state.influenceText.trim() !== '' && (
            <TouchableOpacity
              testID="saveInfluenceBtn"
              style={this.styles.rosterSaveButton}
              onPress={this.handleArtistSelection}
            >
              <Text style={this.styles.rosterSaveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>

        {this.state.influencesList && this.state.influencesList.length > 0 && (
          <View style={this.styles.selectionsContainer}>
            <FlatList
              testID="influencesFlatList"
              data={this.state.influencesList}
              renderItem={this.renderInfluenceItem}
              scrollEnabled={false}
              numColumns={20}
              columnWrapperStyle={{ flexWrap: 'wrap' }}
              keyExtractor={(item, index) => `influence-${index}-${item}`}
            />
          </View>
        )}
      </>
    );
  };

  renderAffiliates = () => {
    // Hide Affiliates section for venue users
    if (this.state.userRole === 'venue') {
      return null;
    }

    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel, { marginTop: 20 }]}>
          Affiliates
        </Text>
        <View style={this.styles.rosterInputContainer}>
          <TextInput
            testID="affiliateTextInput"
            placeholder="Enter your affiliates"
            placeholderTextColor={this.getProfileTheme().muted}
            style={this.styles.rosterInput}
            value={this.state.affiliateText}
            onChangeText={text =>
              this.setState({ affiliateText: text.replace('  ', ' ') })
            }
            onSubmitEditing={this.handleAddAffiliatesItem}
          />
          {this.state.affiliateText.trim() !== '' && (
            <TouchableOpacity
              testID="saveAffiliateBtn"
              style={this.styles.rosterSaveButton}
              onPress={this.handleAddAffiliatesItem}
            >
              <Text style={this.styles.rosterSaveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
        {this.state.affiliatesList && this.state.affiliatesList.length > 0 && (
          <View style={this.styles.selectionsContainer}>
            <FlatList
              testID="affiliateFlatList"
              data={this.state.affiliatesList}
              renderItem={this.renderAffiliateItem}
              scrollEnabled={false}
              numColumns={20}
              columnWrapperStyle={{ flexWrap: 'wrap' }}
              keyExtractor={(item, index) => `affiliate-${index}-${item}`}
            />
          </View>
        )}
      </>
    );
  };

  renderCountry = () => {
    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel, { marginTop: 20 }]}>
          Country
        </Text>
        {Platform.OS === 'ios' ? (
          <>{this.renderCountryPickerIOS()}</>
        ) : (
          <>{this.renderCountryPickerAndroid()}</>
        )}
        <Text style={[this.styles.text, this.styles.errorText]}>
          {this.state.countryError}
        </Text>
      </>
    );
  };

  renderCountryPickerIOS = () => {
    return (
      <TouchableOpacity
        testID="countrySelectButton"
        style={[this.styles.textInput, this.styles.selector]}
        onPress={this.handleCountryClick}
      >
        <Text style={[this.styles.text, { marginHorizontal: 10 }]}>
          {this.state.selectedCountry || 'Select a country'}
        </Text>
        <Image
          source={leftArrowWhite}
          style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]}
        />
      </TouchableOpacity>
    );
  };

  renderCountryPickerAndroid = () => {
    return (
      <View
        style={[
          this.styles.textInput,
          this.styles.selector,
          {
            paddingHorizontal: 0,
          },
        ]}
      >
        <Picker
          testID="countryAndroidPicker"
          style={[this.styles.textInput, this.styles.selector]}
          itemStyle={[this.styles.text]}
          selectedValue={this.state.selectedCountry}
          onValueChange={(country: string) => {
            this.onCountrySelect(country);
          }}
        >
          <Picker.Item label={'Select a country'} value={''} />
          {this.state.countriesList.map(
            ({
              country_code,
              country_name,
            }: {
              country_code: string;
              country_name: string;
            }) => (
              <Picker.Item
                label={country_name}
                value={country_name}
                key={country_code}
              />
            ),
          )}
        </Picker>
        <Image
          source={leftArrowWhite}
          style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]}
        />
      </View>
    );
  };

  renderState = () => {
    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel]}>State</Text>
        {Platform.OS === 'ios' ? (
          <>{this.renderStatePickerIOS()}</>
        ) : (
          <>{this.renderStatePickerAndroid()}</>
        )}
        <Text style={[this.styles.text, this.styles.errorText]}>
          {this.state.stateError}
        </Text>
      </>
    );
  };

  renderStatePickerIOS = () => {
    return (
      <TouchableOpacity
        testID="stateSelectButton"
        style={[
          this.styles.textInput,
          this.styles.selector,
          {
            opacity: this.dynamicOpacity(
              this.state.selectedCountry !== '' &&
                this.state.selectedCountry === 'United States',
            ),
          },
        ]}
        disabled={
          this.state.selectedCountry === '' ||
          this.state.selectedCountry !== 'United States'
        }
        onPress={this.handleStateClick}
      >
        <Text style={[this.styles.text, { marginHorizontal: 10 }]}>
          {this.state.selectedState
            ? this.state.states.filter(
                ({ key }) => key === this.state.selectedState,
              )[0]?.name
            : 'Select a state'}
        </Text>
        <Image
          source={leftArrowWhite}
          style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]}
        />
      </TouchableOpacity>
    );
  };

  renderStatePickerAndroid = () => {
    return (
      <View
        style={[
          this.styles.textInput,
          this.styles.selector,
          {
            paddingHorizontal: 0,
            opacity: this.dynamicOpacity(
              this.state.selectedCountry !== '' &&
                this.state.selectedCountry === 'United States',
            ),
          },
        ]}
      >
        <Picker
          testID="statePicker"
          style={[this.styles.textInput, this.styles.selector]}
          itemStyle={[this.styles.text]}
          selectedValue={this.state.selectedState}
          onValueChange={(state: string) => {
            this.onSelectState(state);
          }}
          enabled={
            this.state.selectedCountry !== '' &&
            this.state.selectedCountry === 'United States'
          }
        >
          <Picker.Item label={'Select a state'} value={''} />
          {this.state.states.map(
            ({ key, name }: { key: string; name: string }) => (
              <Picker.Item label={name} value={key} key={key} />
            ),
          )}
        </Picker>
        <Image
          source={leftArrowWhite}
          style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]}
        />
      </View>
    );
  };

  renderCity = () => {
    return (
      <>
        <Text style={[this.styles.textInputLabel, this.styles.text]}>City</Text>
        {Platform.OS === 'ios' ? (
          <>{this.renderCityPickerIOS()}</>
        ) : (
          <>{this.renderCityPickerAndroid()}</>
        )}
        <Text style={[this.styles.text, this.styles.errorText]}>
          {this.state.cityError}
        </Text>
      </>
    );
  };

  renderCityPickerIOS = () => {
    return (
      <TouchableOpacity
        style={[
          this.styles.textInput,
          this.styles.selector,
          { opacity: this.dynamicOpacity(this.state.selectedState) },
        ]}
        onPress={this.handleCityClick}
        disabled={this.state.selectedState === ''}
        testID="citySelectButton"
      >
        <Text style={[this.styles.text, { marginHorizontal: 10 }]}>
          {this.state.selectedCity || 'Select a city'}
        </Text>
        <Image
          source={leftArrowWhite}
          style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]}
        />
      </TouchableOpacity>
    );
  };

  renderCityPickerAndroid = () => {
    return (
      <View
        style={[
          this.styles.selector,
          this.styles.textInput,
          {
            paddingHorizontal: 0,
            opacity: this.state.selectedState ? 1 : 0.5,
          },
        ]}
      >
        <Picker
          testID="cityPicker"
          style={[this.styles.selector, this.styles.textInput]}
          itemStyle={[this.styles.text]}
          selectedValue={this.state.selectedCity}
          onValueChange={(city: string) => {
            this.handleSelectedCity(city);
          }}
          enabled={this.state.selectedState !== ''}
        >
          <Picker.Item label={'Select a city'} value={''} />
          {this.state.cities?.map((name: string) => (
            <Picker.Item label={name} value={name} key={name} />
          ))}
        </Picker>
        <Image
          source={leftArrowWhite}
          style={[this.styles.downArrow, { tintColor: this.getProfileTheme().primary }]}
        />
      </View>
    );
  };

  renderCancel = () => {
    // Use state editMode (set in componentDidMount) with fallback to navigation params
    const editMode =
      this.state.editMode ||
      this.props.navigation?.state?.params?.editMode ||
      (this.props as any).route?.params?.editMode ||
      false;

    return (
      <>
        {editMode && (
          <TouchableOpacity
            style={{
              marginTop: 25,
            }}
            testID="cancelButton"
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <Text style={this.styles.cancelTxt}>Cancel</Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  renderCountryPopup = () => {
    return (
      <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
        >
          <View style={this.styles.centerView}>
            <View style={this.styles.modalViewContainer}>
              <Text style={this.styles.textOutsideCountry}>
                Are you outside the US?
              </Text>
              <Text style={[this.styles.text, this.styles.textOnlySupportCountry]}>
                We only support the United States right now.
              </Text>
              <TouchableOpacity
                testID="btnAccept"
                style={this.styles.continueBtn}
                onPress={this.hideCountryCodeDropdown}
              >
                <Text style={[this.styles.text, this.styles.textContinueBtn]}>
                  Accept
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    );
  };

  renderCountryModal = () => {
    return (
      <>
        <Modal
          animationType="slide"
          visible={this.state.countryClicked}
          transparent={true}
        >
          <TouchableWithoutFeedback
            testID="hideCountryModal"
            onPress={this.hideModalCountry}
          >
            <View style={[this.styles.centeredView]}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    this.styles.modalView,
                    { borderTopStartRadius: 20, padding: 15 },
                  ]}
                >
                  <Picker
                    testID="countryPickerModal"
                    onValueChange={(country: string) => {
                      this.handleSelectedCountryiOS(country);
                    }}
                    selectedValue={this.state.selectedCountry}
                  >
                    {this.state.countriesList.map(
                      ({
                        country_code,
                        country_name,
                      }: {
                        country_code: string;
                        country_name: string;
                      }) => (
                        <Picker.Item
                          key={country_code}
                          value={country_name}
                          label={country_name}
                        />
                      ),
                    )}
                  </Picker>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </>
    );
  };

  renderStateModal = () => {
    return (
      <>
        <Modal
          animationType="slide"
          visible={this.state.stateClicked}
          transparent={true}
        >
          <TouchableWithoutFeedback
            testID="hideStateModal"
            onPress={this.hideModalState}
          >
            <View style={[this.styles.centeredView]}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    this.styles.modalView,
                    { borderTopStartRadius: 20, padding: 15 },
                  ]}
                >
                  <Picker
                    testID="statePickerModal"
                    onValueChange={(state: string) => {
                      this.handleSelectedStateIOS(state);
                    }}
                    selectedValue={this.state.selectedState}
                  >
                    {this.state.states.map(
                      ({ key, name }: { key: string; name: string }) => (
                        <Picker.Item key={key} value={key} label={name} />
                      ),
                    )}
                  </Picker>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </>
    );
  };

  renderCityModal = () => {
    return (
      <>
        <Modal
          animationType="slide"
          visible={this.state.cityClicked}
          transparent={true}
        >
          <TouchableWithoutFeedback
            testID="hideCityModal"
            onPress={this.hideModalCity}
          >
            <View style={this.styles.centeredView}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    this.styles.modalView,
                    { borderTopStartRadius: 20, padding: 15 },
                  ]}
                >
                  <Picker
                    testID="cityPickerModal"
                    selectedValue={this.state.selectedCity}
                    onValueChange={(city: string) => {
                      this.handleSelectedCityIOS(city);
                    }}
                  >
                    {this.state.cities?.map((name: string) => (
                      <Picker.Item key={name} value={name} label={name} />
                    ))}
                  </Picker>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </>
    );
  };

  renderRulesRegulation = () => {
    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel]}>
          {'Rules / Regulations'}
          <Text style={{ fontWeight: '400' }}>
            {' (max. 2,000 characters)'}
          </Text>
        </Text>
        <TextInput
          testID="rulesRegulationInputText"
          placeholder="Enter rules / regulations"
          style={this.styles.textInput}
          multiline
          placeholderTextColor={this.getProfileTheme().muted}
          value={this.state.rulesRegulations}
          maxLength={300}
          onChangeText={rulesRegulations =>
            this.handleRulesRegulationsSelection(rulesRegulations)
          }
        />
      </>
    );
  };

  renderFeatures = () => {
    return (
      <FlatList
        testID="showFeaturesFlatlist"
        data={this.state.featureList}
        contentContainerStyle={{ marginTop: 20 }}
        numColumns={2}
        keyExtractor={(item: any) => item}
        renderItem={({ item }) => {
          return (
            <View style={this.styles.showFeatureItem}>
              {true ? (
                <TouchableOpacity
                  testID="unselectedShowFeature"
                  style={this.styles.checkbox}
                  onPress={() => {}}
                />
              ) : (
                <TouchableOpacity
                  testID="selectedShowFeature"
                  onPress={() => {}}
                >
                  <Image
                    source={require('../../../mobile/assets/images/checkbox.png')}
                    style={[this.styles.backBtn, { marginRight: 10 }]}
                  />
                </TouchableOpacity>
              )}
              <Text
                style={[
                  this.styles.label,
                  { fontWeight: '400', marginTop: 1, width: '80%' },
                ]}
              >
                {item}
              </Text>
            </View>
          );
        }}
      />
    );
  };

  renderRulesAndRegulationsIcons = () => {
    // Only show rules and regulations for venue userRole
    if (this.state.userRole !== 'venue') {
      console.log(
        '⚠️ Not rendering rules and regulations: Only shown for venue userRole',
      );
      console.log('🔍 userRole:', this.state.userRole);
      return null;
    }

    // Don't show rules and regulations for certain account types (Record_Label, Promoter, Booking_Agent, Agency)
    if (this.shouldHideRulesAndRegulationsTab()) {
      console.log(
        '⚠️ Not rendering rules and regulations: Account type requires rosters only',
      );
      console.log('🔍 accountType:', this.state.accountType);
      return null;
    }

    // Show in both create and edit mode for venue users

    console.log('🔍 ========== renderRulesAndRegulationsIcons ==========');
    console.log('🔍 userRole:', this.state.userRole);
    console.log('🔍 Rules array exists?', !!this.state.rulesAndRegulations);
    console.log('🔍 Rules count:', this.state.rulesAndRegulations?.length || 0);
    console.log('🔍 Selected IDs:', this.state.selectedRulesAndRegulationsIds);
    console.log(
      '🔍 Selected count:',
      this.state.selectedRulesAndRegulationsIds?.length || 0,
    );
    console.log(
      '🔍 shouldHideRulesAndRegulationsTab:',
      this.shouldHideRulesAndRegulationsTab(),
    );
    console.log('🔍 accountType:', this.state.accountType);
    console.log('🔍 editMode:', this.state.editMode);

    // Check if we have saved texts even if rules API failed
    const hasSavedTexts =
      this.state.selectedRulesAndRegulationsIds &&
      this.state.selectedRulesAndRegulationsIds.length > 0;

    // Don't show if no rules are loaded AND no saved texts
    if (
      (!this.state.rulesAndRegulations ||
        this.state.rulesAndRegulations.length === 0) &&
      !hasSavedTexts
    ) {
      console.log('⚠️ Not rendering: No rules loaded and no saved texts');
      console.log('⚠️ Rules state:', this.state.rulesAndRegulations);
      console.log(
        '⚠️ Selected IDs:',
        this.state.selectedRulesAndRegulationsIds,
      );
      return null;
    }

    // If we have saved texts but no rules from API, the fallback should have created display rules
    // So we should be able to show them

    // Always show rules section if rules are loaded (removed account type restriction)
    console.log('✅ Rendering Rules and Regulations section');
    console.log('✅ Rules to render:', this.state.rulesAndRegulations.length);
    console.log(
      '✅ Selected IDs for rendering:',
      this.state.selectedRulesAndRegulationsIds,
    );
    console.log('🔍 ===================================================');

    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel, { marginTop: -20 }]}>
          Rules and Regulations
        </Text>

        <FlatList
          data={this.state.rulesAndRegulations}
          renderItem={({ item }: { item: any }) => {
            // Handle both item.id and item.attributes.id structures
            const ruleId = item.id || item.attributes?.id;
            const ruleTitle = item.title || item.attributes?.title;
            const isSelected =
              this.state.selectedRulesAndRegulationsIds.indexOf(ruleId) !== -1;

            console.log(
              `🔍 Rendering rule: ID=${ruleId}, Title="${ruleTitle}", Selected=${isSelected}`,
            );

            return (
              <View style={this.styles.rulesItem}>
                <TouchableOpacity
                  style={[
                    this.styles.checkboxTouchable,
                    isSelected && this.styles.checkboxChecked,
                  ]}
                  testID={`ruleCheckbox_${ruleId}`}
                  onPress={() => this.handleToggleRuleSelection(ruleId)}
                >
                  {isSelected ? (
                    <Feather name="check" size={14} color="#FFFFFF" />
                  ) : null}
                </TouchableOpacity>
                <Text style={this.styles.rulesItemText}>
                  {ruleTitle || 'No Title'}
                </Text>
              </View>
            );
          }}
          keyExtractor={(item: any) =>
            (item.id || item.attributes?.id || Math.random()).toString()
          }
          contentContainerStyle={this.styles.rulesListContainer}
        />

        {/* Custom Rules Input - at the end of list */}
        <View style={this.styles.rosterInputContainer}>
          <TextInput
            testID="customRuleTextInput"
            placeholder="Enter custom rule or regulation"
            placeholderTextColor={this.getProfileTheme().muted}
            style={this.styles.rosterInput}
            value={this.state.customRuleTxt}
            onChangeText={text =>
              this.setState({ customRuleTxt: text.replace('  ', ' ') })
            }
            onSubmitEditing={this.handleAddCustomRule}
          />
          {this.state.customRuleTxt.trim() !== '' && (
            <TouchableOpacity
              testID="saveCustomRuleBtn"
              style={this.styles.rosterSaveButton}
              onPress={this.handleAddCustomRule}
            >
              <Text style={this.styles.rosterSaveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  };

  renderRoster = () => {
    // Show in both create and edit mode if shouldHideRulesAndRegulationsTab is true
    if (!this.shouldHideRulesAndRegulationsTab()) {
      return null;
    }

    return (
      <>
        <Text style={[this.styles.text, this.styles.textInputLabel, { marginTop: -20 }]}>
          Roster
        </Text>
        <View style={this.styles.rosterInputContainer}>
          <TextInput
            testID="rosterTextInput"
            placeholder="E.g. Aerosmith"
            placeholderTextColor={this.getProfileTheme().muted}
            style={this.styles.rosterInput}
            value={this.state.rosterTxt}
            onChangeText={text =>
              this.setState({ rosterTxt: text.replace('  ', ' ') })
            }
            onSubmitEditing={this.handleAddRosterItem}
          />
          {this.state.rosterTxt.trim() !== '' && (
            <TouchableOpacity
              testID="saveRosterBtn"
              style={this.styles.rosterSaveButton}
              onPress={this.handleAddRosterItem}
            >
              <Text style={this.styles.rosterSaveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
        {this.state.roster && this.state.roster.length > 0 && (
          <View style={this.styles.selectionsContainer}>
            <FlatList
              data={this.state.roster}
              renderItem={({ item }: { item: string }) => (
                <View style={this.styles.selectedAffiliate}>
                  <Text style={this.styles.selectedAffiliateText}>{item}</Text>
                  <Feather
                    name="x"
                    size={17}
                    color={this.getProfileTheme().primary}
                    onPress={() => this.handleRemoveRosterItem(item)}
                  />
                </View>
              )}
              scrollEnabled={false}
              numColumns={20}
              columnWrapperStyle={{ flexWrap: 'wrap' }}
              keyExtractor={(item, index) => `roster-${index}-${item}`}
            />
          </View>
        )}
      </>
    );
  };
  // Customizable Area End

  render() {
    // Customizable Area Start
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, backgroundColor: this.getProfileTheme().background }}
      >
        <View style={this.styles.container}>
          <ScrollView
            style={this.styles.contentContainer}
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="never"
            automaticallyAdjustContentInsets={false}
            contentInset={{ top: 0 }}
            contentContainerStyle={{ paddingTop: 0 }}
          >
            <View style={this.styles.contentContainer}>
              <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
              />
              {this.renderImageSection()}
              <View style={this.styles.bottomContainer}>
                <View style={this.styles.formContent}>
                  {this.renderAdmin()}
                  {this.renderTitle()}
                  {this.state.editMode && this.renderEmailId()}
                  {this.state.userRole === 'venue' && this.renderVenueType()}
                  {this.state.userRole !== 'venue' && this.renderAccountType()}
                  {this.state.userRole !== 'venue' && this.renderCategory()}
                  {/* {this.state.userRole !== 'venue' && this.renderWhatKindOf()}
                  {this.state.userRole !== 'venue' && this.renderType()} */}
                  {this.state.userRole === 'venue' &&
                    this.renderBusinessHours()}
                  {this.state.userRole === 'venue' &&
                    this.renderOpenCloseHours()}
                  {this.renderAddress()}
                  {this.renderZipCode()}
                  {this.state.userRole === 'venue' && this.renderCapacity()}
                  {this.renderOfficialWebsite()}
                  {this.renderPhoneBand()}
                  {this.renderCountryCodeModal()}
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.countryCodeClickedAndroid}
                  >
                    <View style={this.styles.countryCodeAndroidModal}>
                      <View style={this.styles.countryCodeAndroidModalView}>
                        <ScrollView>
                          {this.state.countryCodesList.map((item: any) => (
                            <TouchableOpacity
                              testID="countryCode"
                              key={item.attributes.country_code}
                              style={{ marginVertical: 15 }}
                              onPress={() =>
                                this.handleCountrycodeValueAndroid(item)
                              }
                            >
                              <Text
                                style={{
                                  color: 'black',
                                }}
                              >{`${item.attributes.name} (+${item.attributes.country_code})`}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </View>
                  </Modal>
                  {this.renderSocialMedia()}
                  {this.renderAboutUs()}
                  {this.renderInfluences()}
                  {this.renderAffiliates()}
                  {this.renderCountry()}
                  {this.renderState()}
                  {this.renderCity()}
                  {/* {this.state.userRole === 'venue' &&
                    this.renderRulesRegulation()} */}
                  {this.state.userRole === 'venue' && this.renderFeatures()}
                  {this.renderRulesAndRegulationsIcons()}
                  {this.renderRoster()}
                  {this.renderCancel()}
                  <TouchableOpacity
                    testID="saveBtn"
                    style={this.styles.saveButton}
                    onPress={() => {
                      // this.props.navigation.goBack()
                      this.createBandProfile();
                    }}
                  >
                    <Text style={this.styles.textStyle}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.showPickerModal}
            >
              <TouchableWithoutFeedback
                testID="hidePickerModal"
                onPress={this.hideModalPicker}
              >
                <View style={[this.styles.centeredView]}>
                  <TouchableWithoutFeedback>
                    <View
                      style={[
                        this.styles.modalView,
                        { borderTopStartRadius: 20, padding: 15 },
                      ]}
                    >
                      <Picker
                        testID="pickerModal"
                        selectedValue={this.state.selectedCity}
                        onValueChange={value => this.modalCallback(value)}
                      >
                        {this.state.modalValues.map((name: string) => (
                          <Picker.Item key={name} value={name} label={name} />
                        ))}
                      </Picker>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.categoryPickerModal}
            >
              <TouchableWithoutFeedback
                testID="hideCategoryModal"
                onPress={this.hideModalCategory}
              >
                <View style={[this.styles.centeredView]}>
                  <TouchableWithoutFeedback>
                    <View
                      style={[
                        this.styles.modalView,
                        { borderTopStartRadius: 20, padding: 15 },
                      ]}
                    >
                      <Picker
                        testID="categoryPickerModal"
                        selectedValue={this.state.selectedCategoryName}
                        onValueChange={(item: string) =>
                          this.handleCategorySelection(item)
                        }
                      >
                        {this.state.categoriesList.map(item => (
                          <Picker.Item
                            key={item.id}
                            label={item.attributes.name}
                            value={item.attributes.name}
                          />
                        ))}
                      </Picker>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.subCategoryPickerModal}
            >
              <TouchableWithoutFeedback
                testID="hideSubCategoryModal"
                onPress={this.hideModalSubCategory}
              >
                <View style={[this.styles.centeredView]}>
                  <TouchableWithoutFeedback>
                    <View
                      style={[
                        this.styles.modalView,
                        { borderTopStartRadius: 20, padding: 15 },
                      ]}
                    >
                      <Picker
                        testID="subCategoryPickerModal"
                        onValueChange={(item: string) =>
                          this.handleSubCategorySelection(item)
                        }
                      >
                        {this.state.subCategoriesList.map(item => (
                          <Picker.Item
                            key={item.id}
                            label={item.attributes.name}
                            value={item.attributes.name}
                          />
                        ))}
                      </Picker>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
            {/* Open At Picker Modal for iOS */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.openAtPickerModal}
            >
              <TouchableWithoutFeedback
                testID="hideOpenAtModal"
                onPress={() => this.setState({ openAtPickerModal: false })}
              >
                <View style={[this.styles.centeredView]}>
                  <TouchableWithoutFeedback>
                    <View
                      style={[
                        this.styles.modalView,
                        { borderTopStartRadius: 20, padding: 15 },
                      ]}
                    >
                      <Picker
                        testID="openAtPickerModal"
                        selectedValue={this.state.openAt}
                        onValueChange={(item: string) =>
                          this.handleOpenAtSelection(item)
                        }
                      >
                        <Picker.Item label={'Select'} value={''} />
                        {this.state.openTimeSlots.map(item => (
                          <Picker.Item key={item} label={item} value={item} />
                        ))}
                      </Picker>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
            {/* Close At Picker Modal for iOS */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.closeAtPickerModal}
            >
              <TouchableWithoutFeedback
                testID="hideCloseAtModal"
                onPress={() => this.setState({ closeAtPickerModal: false })}
              >
                <View style={[this.styles.centeredView]}>
                  <TouchableWithoutFeedback>
                    <View
                      style={[
                        this.styles.modalView,
                        { borderTopStartRadius: 20, padding: 15 },
                      ]}
                    >
                      <Picker
                        testID="closeAtPickerModal"
                        selectedValue={this.state.closeAt}
                        onValueChange={(item: string) =>
                          this.handleCloseAtSelection(item)
                        }
                      >
                        <Picker.Item label={'Select'} value={''} />
                        {this.state.closeTimeSlots.map(item => (
                          <Picker.Item key={item} label={item} value={item} />
                        ))}
                      </Picker>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </ScrollView>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.showCameraGalleryPopup}
            statusBarTranslucent
            presentationStyle="overFullScreen"
            onRequestClose={this.handleCameraGalleryCancelPopup}
          >
            <View style={this.styles.photoSheetOverlay}>
              <TouchableOpacity
                activeOpacity={1}
                style={this.styles.photoSheetBackdrop}
                onPress={this.handleCameraGalleryCancelPopup}
              />
              <View style={this.styles.photoSheetWrap}>
                <View style={this.styles.galleryOptions}>
                  <View style={this.styles.photoSheetHandle} />
                  <Text style={this.styles.photoSheetTitle}>Update photo</Text>
                  <TouchableOpacity
                    testID="cameraOption"
                    style={this.styles.photoSheetRow}
                    onPress={this.handleCamera}
                    activeOpacity={0.8}
                  >
                    <Feather
                      name="camera"
                      size={18}
                      color={this.getProfileTheme().foreground}
                    />
                    <Text style={this.styles.takeChoosePhoto}>Take photo</Text>
                  </TouchableOpacity>
                  <View style={this.styles.photoSheetDivider} />
                  <TouchableOpacity
                    testID="galleryOption"
                    style={this.styles.photoSheetRow}
                    onPress={this.handleGallery}
                    activeOpacity={0.8}
                  >
                    <Feather
                      name="image"
                      size={18}
                      color={this.getProfileTheme().foreground}
                    />
                    <Text style={this.styles.takeChoosePhoto}>Choose photo</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  testID="cancelOption"
                  style={this.styles.cancelPhotoOption}
                  onPress={this.handleCameraGalleryCancelPopup}
                  activeOpacity={0.8}
                >
                  <Text style={this.styles.cancelPhotoText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {this.renderCountryPopup()}
          {this.renderCountryModal()}
          {this.renderStateModal()}
          {this.renderCityModal()}
          {this.state.isLoading && (
            <View style={this.styles.loadingContainer}>
              <ActivityIndicator size={'large'} color={this.getProfileTheme().primary} />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    );
    // Customizable Area End
  }
  // Customizable Area Start
  // Customizable Area End
}
// Customizable Area Start
const EDIT_BANNER_HEIGHT = Math.round(Dimensions.get('window').height * 0.28);

const createEditProfileStyles = (theme: typeof redesignTheme) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  headerIcon: {
    width: 12,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 20,
    color: theme.foreground,
    textAlign: 'center',
  },
  heroWrap: {
    backgroundColor: theme.background,
    marginBottom: 8,
  },
  bannerWrap: {
    width: '100%',
    height: EDIT_BANNER_HEIGHT,
    backgroundColor: theme.input,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: EDIT_BANNER_HEIGHT,
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bannerOverlayInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
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
    zIndex: 2,
  },
  overlaySideSpacer: {
    width: 36,
    height: 36,
  },
  overlayTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -42,
  },
  avatarWrap: {
    width: 92,
    height: 92,
  },
  editProfilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.editButtonBorder,
    backgroundColor: theme.editButton,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 8,
    maxWidth: '62%',
  },
  editProfilePillText: {
    color: theme.editButtonText,
    fontWeight: '600',
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: theme.background,
  },
  topBackdrop: {
    backgroundColor: theme.input,
    height: EDIT_BANNER_HEIGHT,
    width: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverImage: {
    width: '100%',
    height: EDIT_BANNER_HEIGHT,
  },
  heroOverlay: {
    position: 'absolute',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: theme.background,
    width: '100%',
    paddingBottom: 20,
  },
  formContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  profileImageContainer: {
    backgroundColor: theme.background,
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 86,
    height: 86,
    resizeMode: 'cover',
    borderRadius: 43,
  },
  coverImageButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  bandNameText: {
    alignSelf: 'center',
    color: 'white',
    fontWeight: '800',
    fontSize: 22,
    letterSpacing: 0.4,
    marginTop: 16,
  },
  locationContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  locationImage: {},
  text: {
    fontFamily: 'OpenSans',
    alignSelf: 'flex-start',
    color: theme.foreground,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    paddingTop: 2,
  },
  textInputLabel: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
    color: theme.foreground,
    height: 50,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: theme.input,
    opacity: 1,
  },
  emailSecurityText: {
    fontSize: 12,
    color: theme.muted,
    marginTop: 6,
  },
  textInputBio: {
    height: 150,
    textAlignVertical: 'top',
  },
  selector: {
    height: 50,
    justifyContent: 'center',
  },
  downArrow: {
    position: 'absolute',
    right: 15,
    marginRight: 5,
    width: 8,
    backgroundColor: theme.background,
    transform: [{ rotate: '-90deg' }],
    resizeMode: 'contain',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centerView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#33415580',
  },
  textInputPhone: {
    paddingLeft: 110,
  },
  countryCodeContainer: {
    position: 'absolute',
    left: 10,
    top: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  usFlag: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  countryCodeArrow: {
    position: 'relative',
    right: 0,
    marginLeft: 10,
    backgroundColor: 'transparent',
  },
  textCountryCode: {
    alignSelf: 'center',
    marginLeft: 10,
  },
  modalViewContainer: {
    height: '30%',
    justifyContent: 'space-between',
    backgroundColor: theme.background,
    borderTopEndRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 100,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffffdd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#33415580',
  },
  modalView: {
    height: '30%',
    justifyContent: 'space-between',
    backgroundColor: theme.background,
    borderTopEndRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 100,
  },
  saveButton: {
    backgroundColor: theme.primary,
    borderRadius: 24,
    height: 56,
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 20,
  },
  selectionsContainer: {},
  rosterInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  rosterInput: {
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: theme.border,
    backgroundColor: theme.card,
    height: 50,
    fontSize: 16,
    marginRight: 10,
  },
  rosterSaveButton: {
    backgroundColor: theme.primary,
    borderRadius: 10,
    paddingHorizontal: 20,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rosterSaveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectedAffiliate: {
    backgroundColor: theme.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 14,
    flexDirection: 'row',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginRight: 5,
    marginTop: 10,
  },
  selectedAffiliateText: {
    color: theme.primary,
    paddingRight: 5,
  },
  socialMediaHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  separator: {
    backgroundColor: '#E2E8F0',
    height: 1,
  },
  rowItem: {
    flexDirection: 'row',
    borderRadius: 15,
    backgroundColor: theme.primarySoft,
    paddingVertical: 5,
    marginRight: 10,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  crossBtn: {
    marginLeft: 10,
    tintColor: theme.primary,
    width: 10,
    height: 10,
    resizeMode: 'contain',
    marginTop: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.foreground,
    marginTop: 20,
  },
  textOutsideCountry: {
    fontWeight: '700',
    fontSize: 26,
    lineHeight: 28,
    marginVertical: 10,
    color: theme.foreground,
  },
  textOnlySupportCountry: {
    fontSize: 18,
  },
  continueBtn: {
    backgroundColor: theme.primary,
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  textContinueBtn: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    alignSelf: 'center',
  },
  backBtn: {
    position: 'absolute',
    marginLeft: 20,
    paddingTop: 10,
  },
  topContainer: {
    flex: 1,
    height: 320,
    width: '100%',
  },
  coverPicBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    position: 'absolute',
    right: 14,
    bottom: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 8, 15, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  editIcon: {
    width: 20,
    height: 20,
  },
  profilePicBtn: {
    borderRadius: 16,
    backgroundColor: theme.primary,
    width: 32,
    height: 32,
    position: 'absolute',
    right: -2,
    bottom: -2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  cancelTxt: {
    color: theme.primary,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: '4%',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  galleryOptions: {
    borderRadius: 16,
    backgroundColor: theme.card,
    alignItems: 'stretch',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.border,
  },
  photoSheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(8, 8, 15, 0.72)',
    zIndex: 9999,
    elevation: 9999,
  },
  photoSheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  photoSheetWrap: {
    paddingHorizontal: 16,
    paddingBottom: 118,
    zIndex: 2,
  },
  photoSheetDivider: {
    backgroundColor: theme.border,
    height: 1,
    marginHorizontal: 16,
  },
  photoSheetHandle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.border,
    marginTop: 10,
    marginBottom: 8,
  },
  photoSheetTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.muted,
    textAlign: 'center',
    marginBottom: 6,
  },
  photoSheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  takeChoosePhoto: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.foreground,
    marginLeft: 10,
  },
  cancelPhotoOption: {
    borderRadius: 16,
    backgroundColor: theme.card,
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  cancelPhotoText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.primary,
    marginVertical: 16,
  },
  daysItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '20%',
    marginTop: 10,
  },
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 1.5,
    borderRadius: 5,
    borderColor: theme.muted,
    backgroundColor: 'transparent',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: theme.primary,
    backgroundColor: theme.primary,
  },
  showFeatureItem: {
    flexDirection: 'row',
    width: '50%',
    marginTop: 10,
  },
  countryCodeAndroidModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080',
  },
  countryCodeAndroidModalView: {
    width: '90%',
    maxHeight: '95%',
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  rulesListContainer: {
    paddingVertical: 10,
  },
  rulesItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  rulesItemText: {
    fontSize: 16,
    color: theme.foreground,
    fontFamily: 'OpenSans',
    flex: 1,
    marginLeft: 10,
  },
  checkboxTouchable: {
    height: 20,
    width: 20,
    borderWidth: 1.5,
    borderRadius: 5,
    borderColor: theme.muted,
    backgroundColor: 'transparent',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});

const darkEditStyles = createEditProfileStyles(redesignTheme);
const lightEditStyles = createEditProfileStyles(lightTheme);
// Customizable Area End.                                                                                                              
                                     