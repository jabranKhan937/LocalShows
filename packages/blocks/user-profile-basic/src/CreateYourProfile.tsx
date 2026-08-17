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
  SafeAreaView,
  TextInput,
  Modal,
  ActivityIndicator,
  FlatList,
  Pressable,
} from 'react-native';
                                                                                                                                                                                                                                                                                                           
import { leftArrowWhite, defaultProfile, editIcon } from './assets';
import { leftArrow, usFlag } from '../../email-account-registration/src/assets';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
                                                                                    
import { colors } from '../../utilities/src/Colors';
import FastImage from '../../../components/src/SafeFastImage';
// Customizable Area End
                                                                                                                                                                                                          
import UserProfileBasicController from './UserProfileBasicController';
                             
export default class CreateYourProfile extends UserProfileBasicController {
  // Customizable Area Start.                                   
  abbreviateDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  renderAffiliateItem = ({ item }: { item: string }) => (
    <View style={styles.selectedAffiliate}>
      <Text style={styles.selectedAffiliateText}>{item}</Text>
      <Feather
        testID="btnRemoveAffiliate"
        name="x"
        size={17}
        color="#4949EE"
        onPress={() => this.handleRemoveAffiliate(item)}
      />
    </View>
  );
                                 
  renderInfluenceItem = ({ item }: { item: string }) => (
    <View style={styles.selectedAffiliate}>
      <Text style={styles.selectedAffiliateText}>{item}</Text>
      <Feather
        testID="btnRemoveInfluence"
        name="x"
        size={17}
        color="#4949EE"
        onPress={() => this.handleRemoveInfluence(item)}
      />
    </View>
  );
                                   
  renderBackBtnAndHeader = () => {
    // Use state editMode (set in componentDidMount) with fallback to navigation params
    const editMode =
      this.state.editMode ||
      this.props.navigation?.state?.params?.editMode ||
      (this.props as any).route?.params?.editMode ||
      false;
    console.log('now check props', editMode);

    return (
      <>
        <TouchableOpacity
          testID="navigationBackButton"
          style={styles.backBtn}
          onPress={() => {
            this.props.navigation.goBack();
          }}
        >
          <Image source={leftArrow} style={styles.headerIcon} />
        </TouchableOpacity>
        <Text testID="testLabel" style={styles.headerTitle}>
          {editMode ? 'Edit Profile' : 'Create your profile'}
        </Text>
      </>
    );
  };
                       
  renderImageSection = () => {
    return (
      <View style={[styles.topBackdrop, { marginTop: 20 }]}>
        <View style={styles.topContainer}>
          <Image
            source={{ uri: this.state.coverPic }}
            style={styles.topBackdrop}
          ></Image>
          <TouchableOpacity
            testID="coverPicButton"
            style={styles.coverPicBtn}
            onPress={() => {
              this.handleProfilePic('cover');
            }}
          >
            <Image source={editIcon} style={styles.editIcon} />
          </TouchableOpacity>
        </View>
        <View style={{ position: 'absolute' }}>
          <View style={styles.profileImageContainer}>
            <FastImage
              source={
                this.state.profilePic
                  ? {
                      uri: this.state.profilePic,
                      priority: FastImage.priority.high,
                    }
                  : defaultProfile
              }
              style={styles.profileImage}
              resizeMode={FastImage.resizeMode.cover}
            />
            <TouchableOpacity
              testID="profilePicButton"
              style={styles.profilePicBtn}
              onPress={() => {
                this.handleProfilePic('profile');
              }}
            >
              <Image source={editIcon} style={styles.editIcon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.bandNameText}>{this.state.firstName}</Text>
          <View style={styles.locationContainer}>
            <Icon name="map-marker" size={20} color="white" />
            <Text style={styles.locationText}>{this.getLocation()}</Text>
          </View>
        </View>
      </View>
    );
  };
                                                                                                           
  renderAdmin = () => {
    return (
      <>
        {/* <Text style={[styles.text, styles.textInputLabel]}>
          Administrator Name
        </Text>
        <TextInput
          testID="adminNameTextInput"
          placeholder="Enter admin name"
          placeholderTextColor="#CBD5E1"
          style={styles.textInput}
          value={this.state.adminName}
          onChangeText={name => this.setState({ adminName: name })}
        /> */}
        <Text
          style={[
            styles.text,
            styles.errorText,
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
        <Text style={[styles.text, styles.textInputLabel]}>Title</Text>
        <TextInput
          testID="titleTextInput"
          placeholder="Enter title"
          placeholderTextColor="#CBD5E1"
          style={styles.textInput}
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
        <Text style={[styles.text, styles.textInputLabel, { marginTop: 20 }]}>
          {'Account Type'}
        </Text>
        <View
          style={[
            styles.textInput,
            styles.selector,
            { backgroundColor: '#F1F5F9', opacity: 0.7 },
            isVenue && { pointerEvents: 'none' as const },
          ]}
        >
          <Text
            style={[
              styles.text,
              { marginHorizontal: 10, color: colors(false).text },
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
        <Text style={[styles.text, styles.textInputLabel, { marginTop: 20 }]}>
          {'Account Type'}
        </Text>
        <View
          style={[
            styles.textInput,
            styles.selector,
            { backgroundColor: '#F1F5F9', opacity: 0.7 }
          ]}
        >
          <Text
            style={[
              styles.text,
              { marginHorizontal: 10, color: colors(false).text },
            ]}
          >

Business
          </Text>
        </View>
      </>

        <Text style={[styles.text, styles.textInputLabel, { marginTop: 20 }]}>
          {'Category'}
        </Text>
        <View
          style={[
            styles.textInput,
            styles.selector,
            { backgroundColor: '#F1F5F9', opacity: 0.7 },
          ]}
        >
          <Text
            style={[
              styles.text,
              { marginHorizontal: 10, color: colors(false).text },
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
        <Text style={{ color: '#4949EE', fontSize: 16, fontWeight: '600' }}>
          Describe what you do
        </Text>
      </TouchableOpacity>
    );
  };

  renderCategory = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel, { marginTop: 20 }]}>
          Category
        </Text>
        {Platform.OS === 'ios' ? (
          <TouchableOpacity
            testID="btnCategoryPicker"
            style={[styles.textInput, styles.selector]}
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
            <Text style={[styles.text, { marginHorizontal: 10 }]}>
              {this.state.bandType}
            </Text>
            <Image
              source={leftArrowWhite}
              style={[styles.downArrow, { tintColor: '#3333CC' }]}
            />
          </TouchableOpacity>
        ) : (
          <View
            style={[
              styles.textInput,
              styles.selector,
              {
                paddingHorizontal: 0,
              },
            ]}
          >
            <Picker
              testID="categoryPicker"
              style={[styles.textInput, styles.selector]}
              itemStyle={styles.text}
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
              style={[styles.downArrow, { tintColor: '#3333CC' }]}
            />
          </View>
        )}
      </>
    );
  };

  renderWhatKindOf = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel, { marginTop: 20 }]}>
          {`What kind of ${this.state.bandType}?`}
        </Text>
        {Platform.OS === 'ios' ? (
          <TouchableOpacity
            testID="btnCategoryListPicker"
            style={[styles.textInput, styles.selector]}
            onPress={() => {
              this.setState({ categoryPickerModal: true });
            }}
          >
            <Text style={[styles.text, { marginHorizontal: 10 }]}>
              {this.state.selectedCategoryName || 'Select'}
            </Text>
            <Image
              source={leftArrowWhite}
              style={[styles.downArrow, { tintColor: '#3333CC' }]}
            />
          </TouchableOpacity>
        ) : (
          <View
            style={[
              styles.textInput,
              styles.selector,
              {
                paddingHorizontal: 0,
              },
            ]}
          >
            <Picker
              testID="categoryListPicker"
              style={[styles.textInput, styles.selector]}
              itemStyle={styles.text}
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
              style={[styles.downArrow, { tintColor: '#3333CC' }]}
            />
          </View>
        )}
      </>
    );
  };

  renderType = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel, { marginTop: 20 }]}>
          {`${this.state.selectedCategoryName} Type`}
        </Text>
        {Platform.OS === 'ios' ? (
          <TouchableOpacity
            testID="btnSubCategoryListPicker"
            style={[styles.textInput, styles.selector]}
            onPress={() => {
              this.setState({ subCategoryPickerModal: true });
            }}
          >
            <Text style={[styles.text, { marginHorizontal: 10 }]}>
              {'Select'}
            </Text>
            <Image
              source={leftArrowWhite}
              style={[styles.downArrow, { tintColor: '#3333CC' }]}
            />
          </TouchableOpacity>
        ) : (
          <View
            style={[
              styles.textInput,
              styles.selector,
              {
                paddingHorizontal: 0,
              },
            ]}
          >
            <Picker
              testID="subCategoryListPicker"
              style={[styles.textInput, styles.selector]}
              itemStyle={styles.text}
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
              style={[styles.downArrow, { tintColor: '#3333CC' }]}
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
              <View style={styles.rowItem}>
                <Text
                  style={[
                    styles.label,
                    { fontWeight: '400', color: '#3333CC', marginTop: 1 },
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
                    style={styles.crossBtn}
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
        <Text style={[styles.text, styles.textInputLabel, { marginTop: 20 }]}>
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
              <View style={styles.daysItem}>
                <TouchableOpacity
                  testID={isSelected ? 'selectedDay' : 'unselectedDay'}
                  style={styles.checkbox}
                  onPress={() => this.handleBusinessDayToggle(item)}
                >
                  {isSelected && (
                    <Image
                      source={require('../../../mobile/assets/images/checkbox.png')}
                      style={styles.checkboxImage}
                    />
                  )}
                </TouchableOpacity>
                <Text
                  style={[
                    styles.label,
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
          <Text style={[styles.text, styles.textInputLabel, { marginTop: 20 }]}>
            Open at
          </Text>
          {Platform.OS === 'ios' ? (
            <>{this.renderOpenAtPickeriOS()}</>
          ) : (
            <>{this.renderOpenAtPickerAndroid()}</>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.text, styles.textInputLabel, { marginTop: 20 }]}>
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
        style={[styles.textInput, styles.selector]}
        onPress={() => {
          this.setState({ openAtPickerModal: true });
        }}
      >
        <Text style={[styles.text, { marginHorizontal: 10 }]}>
          {this.state.openAt || 'Select'}
        </Text>
        <Image
          source={leftArrowWhite}
          style={[styles.downArrow, { tintColor: '#3333CC' }]}
        />
      </TouchableOpacity>
    );
  };

  renderOpenAtPickerAndroid = () => {
    return (
      <View
        style={[
          styles.textInput,
          styles.selector,
          {
            paddingHorizontal: 0,
          },
        ]}
      >
        <Picker
          testID="openAtPicker"
          style={[styles.textInput, styles.selector]}
          itemStyle={styles.text}
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
          style={[styles.downArrow, { tintColor: '#3333CC' }]}
        />
      </View>
    );
  };

  renderCloseAtPickeriOS = () => {
    return (
      <TouchableOpacity
        testID="btncloseAtPicker"
        style={[
          styles.textInput,
          styles.selector,
          { opacity: this.state.openAt ? 1 : 0.5 },
        ]}
        onPress={() => {
          if (this.state.openAt) {
            this.setState({ closeAtPickerModal: true });
          }
        }}
        disabled={!this.state.openAt}
      >
        <Text style={[styles.text, { marginHorizontal: 10 }]}>
          {this.state.closeAt || 'Select'}
        </Text>
        <Image
          source={leftArrowWhite}
          style={[styles.downArrow, { tintColor: '#3333CC' }]}
        />
      </TouchableOpacity>
    );
  };

  renderCloseAtPickerAndroid = () => {
    return (
      <View
        style={[
          styles.textInput,
          styles.selector,
          {
            paddingHorizontal: 0,
          },
        ]}
      >
        <Picker
          testID="closeAtPicker"
          style={[styles.textInput, styles.selector]}
          itemStyle={styles.text}
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
          style={[styles.downArrow, { tintColor: '#3333CC' }]}
        />
      </View>
    );
  };

  renderAddress = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel, { marginTop: 20 }]}>
          Address
        </Text>
        <TextInput
          testID="addressTextInput"
          placeholder="Enter address"
          placeholderTextColor="#CBD5E1"
          style={styles.textInput}
          value={this.state.address}
          onChangeText={address => this.setState({ address })}
        />
        <Text
          style={[
            styles.text,
            styles.errorText,
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
        <Text style={[styles.text, styles.textInputLabel, { marginTop: 0 }]}>
          Zip Code
        </Text>
        <TextInput
          testID="zipCodeTextInput"
          placeholder="Enter zip code"
          placeholderTextColor="#CBD5E1"
          style={styles.textInput}
          value={this.state.zipCode}
          onChangeText={zipCode => this.handleZipCode(zipCode)}
          keyboardType="numeric"
          maxLength={10}
        />
        <Text
          style={[
            styles.text,
            styles.errorText,
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
        <Text style={[styles.text, styles.textInputLabel]}>
          Maximum capacity (people)
        </Text>
        <TextInput
          testID="capacityTextInput"
          placeholder="Enter capacity"
          placeholderTextColor="#CBD5E1"
          style={styles.textInput}
          value={this.state.capacity}
          onChangeText={capacity => this.handleCapacity(capacity)}
          keyboardType="numeric"
        />
        <Text
          style={[
            styles.text,
            styles.errorText,
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
        <Text style={[styles.text, styles.textInputLabel, { marginTop: 10 }]}>
          Official Website
        </Text>
        <TextInput
          testID="websiteTextInput"
          placeholder="Enter web address"
          placeholderTextColor="#CBD5E1"
          style={styles.textInput}
          value={this.state.website}
          onChangeText={website => this.setState({ website })}
        />
        <Text
          style={[
            styles.text,
            styles.errorText,
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
         <Text style={[styles.text, styles.textInputLabel]}>Email address</Text>
        <TextInput
          testID="emailTextInput"
          placeholder="Enter your email address"
          placeholderTextColor="#CBD5E1"
          style={[styles.textInput, editMode && styles.disabledInput]}
          value={this.state.email}
          editable={!editMode}
          onChangeText={editMode ? undefined : (email) => this.handleEmail(email.replace(' ', ''))}
        />
        {editMode && (
          <Text style={[styles.text, styles.emailSecurityText]}>
            You cannot change the email for security reasons, if you need to change the email, please contact us
          </Text>
        )}
        <Text style={[styles.text, styles.errorText]}>
          {this.state.emailError}
        </Text>
       </View>
      </>
    );
  };

  renderPhoneBand = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>Cell phone</Text>
        {Platform.OS === 'ios' ? (
          <View>
            <TextInput
              testID="phoneTextInputBand"
              style={[styles.textInput, styles.textInputPhone]}
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
        <Text style={[styles.text, styles.errorText]}>
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
        style={styles.countryCodeContainer}
        onPress={this.handleShowCountryCode}
      >
        <Image
          source={
            hasFlag
              ? { uri: this.state.selectedCountryCode.attributes.map_url }
              : usFlag
          }
          style={styles.usFlag}
        />
        <Image
          source={leftArrowWhite}
          style={[
            styles.downArrow,
            styles.countryCodeArrow,
            { tintColor: '#3333CC' },
          ]}
        />
        <Text style={[styles.text, styles.textCountryCode]}>{code}</Text>
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
          style={[styles.textInput, styles.textInputPhone]}
          keyboardType="numeric"
          value={this.state.phoneNumber}
          onChangeText={phone => this.handlePhoneNumber(phone)}
          maxLength={10}
        />
        <TouchableOpacity
          testID="btnCountryCodeSelectAndroid"
          style={styles.countryCodeContainer}
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
            style={styles.usFlag}
          />
          <Image
            source={leftArrowWhite}
            style={[
              styles.downArrow,
              styles.countryCodeArrow,
              { tintColor: '#3333CC' },
            ]}
          />
          <Text style={[styles.text, styles.textCountryCode]}>{code}</Text>
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
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalView,
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
        <Text style={[styles.text, styles.socialMediaHeading]}>
          Social Media
        </Text>
        <Text style={[styles.text, styles.textInputLabel, { marginTop: 20 }]}>
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
              color: colors(false).text,
            }}
          >
            {'https://www.instagram.com/'.trim()}
          </Text>
          <TextInput
            ref={this.InstaInputRef}
            testID="instagramTextInput"
            placeholder="UserName"
            placeholderTextColor="#CBD5E1"
            onChangeText={instagram => this.setState({ instagram })}
            value={this.state.instagram}
            style={{ flex: 1, fontSize: 16, color: colors(false).text }}
          />
        </Pressable>
        {this.state.instagramLinkError !== '' && (
          <Text
            style={[
              styles.text,
              styles.errorText,
              {
                marginBottom: this.state.instagramLinkError !== '' ? 10 : 0,
              },
            ]}
          >
            {this.state.instagramLinkError}
          </Text>
        )}
        <Text style={[styles.text, styles.textInputLabel, { marginTop: 20 }]}>
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
              color: colors(false).text,
            }}
          >
            {'https://www.facebook.com/'.trim()}
          </Text>
          <TextInput
            ref={this.FBInputRef}
            testID="facebookTextInput"
            value={this.state.facebook}
            placeholder="UserName"
            placeholderTextColor="#CBD5E1"
            onChangeText={facebook => this.setState({ facebook })}
            style={{
              flex: 1,
              fontSize: 16,
              color: colors(false).text,
            }}
          />
        </Pressable>
        {this.state.facebookLinkError !== '' && (
          <Text
            style={[
              styles.text,
              styles.errorText,
              {
                marginBottom: this.state.facebookLinkError !== '' ? 10 : 0,
              },
            ]}
          >
            {this.state.facebookLinkError}
          </Text>
        )}
        <Text style={[styles.text, styles.textInputLabel, { marginTop: 20 }]}>
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
              color: colors(false).text,
            }}
          >
            {'https://www.linkedin.com/in/'.trim()}
          </Text>
          <TextInput
            ref={this.LdinInputRef}
            testID="linkedinTextInput"
            placeholder="UserName"
            placeholderTextColor="#CBD5E1"
            value={this.state.linkedin}
            onChangeText={linkedin => this.setState({ linkedin })}
            style={{ flex: 1, fontSize: 16, color: colors(false).text }}
          />
        </Pressable>
        {this.state.linkedInLinkError !== '' && (
          <Text
            style={[
              styles.text,
              styles.errorText,
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
        <Text style={[styles.text, styles.textInputLabel, { marginTop: 20 }]}>
          Bio / About us{' '}
          <Text style={{ fontWeight: 'normal' }}>(max 2,000 characters)</Text>
        </Text>
        <TextInput
          testID="aboutUsTxtInput"
          placeholder="About you"
          placeholderTextColor="#CBD5E1"
          style={[styles.textInput, styles.textInputBio]}
          value={this.state.aboutUs}
          onChangeText={aboutUs => this.setState({ aboutUs })}
          multiline
        />
        <Text
          style={[
            styles.text,
            styles.errorText,
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
        <Text style={[styles.text, styles.textInputLabel]}>Influences</Text>

        <View style={styles.rosterInputContainer}>
          <TextInput
            testID="influencesTextInput"
            placeholder="Enter your influences"
            placeholderTextColor="#CBD5E1"
            style={styles.rosterInput}
            value={this.state.influenceText}
            onChangeText={text =>
              this.setState({ influenceText: text.replace('  ', ' ') })
            }
            onSubmitEditing={this.handleArtistSelection}
          />
          {this.state.influenceText.trim() !== '' && (
            <TouchableOpacity
              testID="saveInfluenceBtn"
              style={styles.rosterSaveButton}
              onPress={this.handleArtistSelection}
            >
              <Text style={styles.rosterSaveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>

        {this.state.influencesList && this.state.influencesList.length > 0 && (
          <View style={styles.selectionsContainer}>
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
        <Text style={[styles.text, styles.textInputLabel, { marginTop: 20 }]}>
          Affiliates
        </Text>
        <View style={styles.rosterInputContainer}>
          <TextInput
            testID="affiliateTextInput"
            placeholder="Enter your affiliates"
            placeholderTextColor="#CBD5E1"
            style={styles.rosterInput}
            value={this.state.affiliateText}
            onChangeText={text =>
              this.setState({ affiliateText: text.replace('  ', ' ') })
            }
            onSubmitEditing={this.handleAddAffiliatesItem}
          />
          {this.state.affiliateText.trim() !== '' && (
            <TouchableOpacity
              testID="saveAffiliateBtn"
              style={styles.rosterSaveButton}
              onPress={this.handleAddAffiliatesItem}
            >
              <Text style={styles.rosterSaveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
        {this.state.affiliatesList && this.state.affiliatesList.length > 0 && (
          <View style={styles.selectionsContainer}>
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
        <Text style={[styles.text, styles.textInputLabel, { marginTop: 20 }]}>
          Country
        </Text>
        {Platform.OS === 'ios' ? (
          <>{this.renderCountryPickerIOS()}</>
        ) : (
          <>{this.renderCountryPickerAndroid()}</>
        )}
        <Text style={[styles.text, styles.errorText]}>
          {this.state.countryError}
        </Text>
      </>
    );
  };

  renderCountryPickerIOS = () => {
    return (
      <TouchableOpacity
        testID="countrySelectButton"
        style={[styles.textInput, styles.selector]}
        onPress={this.handleCountryClick}
      >
        <Text style={[styles.text, { marginHorizontal: 10 }]}>
          {this.state.selectedCountry || 'Select a country'}
        </Text>
        <Image
          source={leftArrowWhite}
          style={[styles.downArrow, { tintColor: '#3333CC' }]}
        />
      </TouchableOpacity>
    );
  };

  renderCountryPickerAndroid = () => {
    return (
      <View
        style={[
          styles.textInput,
          styles.selector,
          {
            paddingHorizontal: 0,
          },
        ]}
      >
        <Picker
          testID="countryAndroidPicker"
          style={[styles.textInput, styles.selector]}
          itemStyle={[styles.text]}
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
          style={[styles.downArrow, { tintColor: '#3333CC' }]}
        />
      </View>
    );
  };

  renderState = () => {
    return (
      <>
        <Text style={[styles.text, styles.textInputLabel]}>State</Text>
        {Platform.OS === 'ios' ? (
          <>{this.renderStatePickerIOS()}</>
        ) : (
          <>{this.renderStatePickerAndroid()}</>
        )}
        <Text style={[styles.text, styles.errorText]}>
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
          styles.textInput,
          styles.selector,
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
        <Text style={[styles.text, { marginHorizontal: 10 }]}>
          {this.state.selectedState
            ? this.state.states.filter(
                ({ key }) => key === this.state.selectedState,
              )[0]?.name
            : 'Select a state'}
        </Text>
        <Image
          source={leftArrowWhite}
          style={[styles.downArrow, { tintColor: '#3333CC' }]}
        />
      </TouchableOpacity>
    );
  };

  renderStatePickerAndroid = () => {
    return (
      <View
        style={[
          styles.textInput,
          styles.selector,
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
          style={[styles.textInput, styles.selector]}
          itemStyle={[styles.text]}
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
          style={[styles.downArrow, { tintColor: '#3333CC' }]}
        />
      </View>
    );
  };

  renderCity = () => {
    return (
      <>
        <Text style={[styles.textInputLabel, styles.text]}>City</Text>
        {Platform.OS === 'ios' ? (
          <>{this.renderCityPickerIOS()}</>
        ) : (
          <>{this.renderCityPickerAndroid()}</>
        )}
        <Text style={[styles.text, styles.errorText]}>
          {this.state.cityError}
        </Text>
      </>
    );
  };

  renderCityPickerIOS = () => {
    return (
      <TouchableOpacity
        style={[
          styles.textInput,
          styles.selector,
          { opacity: this.dynamicOpacity(this.state.selectedState) },
        ]}
        onPress={this.handleCityClick}
        disabled={this.state.selectedState === ''}
        testID="citySelectButton"
      >
        <Text style={[styles.text, { marginHorizontal: 10 }]}>
          {this.state.selectedCity || 'Select a city'}
        </Text>
        <Image
          source={leftArrowWhite}
          style={[styles.downArrow, { tintColor: '#3333CC' }]}
        />
      </TouchableOpacity>
    );
  };

  renderCityPickerAndroid = () => {
    return (
      <View
        style={[
          styles.selector,
          styles.textInput,
          {
            paddingHorizontal: 0,
            opacity: this.state.selectedState ? 1 : 0.5,
          },
        ]}
      >
        <Picker
          testID="cityPicker"
          style={[styles.selector, styles.textInput]}
          itemStyle={[styles.text]}
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
          style={[styles.downArrow, { tintColor: '#3333CC' }]}
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
            <Text style={styles.cancelTxt}>Cancel</Text>
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
          <View style={styles.centerView}>
            <View style={styles.modalViewContainer}>
              <Text style={styles.textOutsideCountry}>
                Are you outside the US?
              </Text>
              <Text style={[styles.text, styles.textOnlySupportCountry]}>
                We only support the United States right now.
              </Text>
              <TouchableOpacity
                testID="btnAccept"
                style={styles.continueBtn}
                onPress={this.hideCountryCodeDropdown}
              >
                <Text style={[styles.text, styles.textContinueBtn]}>
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
            <View style={[styles.centeredView]}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.modalView,
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
            <View style={[styles.centeredView]}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.modalView,
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
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.modalView,
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
        <Text style={[styles.text, styles.textInputLabel]}>
          {'Rules / Regulations'}
          <Text style={{ fontWeight: '400' }}>
            {' (max. 2,000 characters)'}
          </Text>
        </Text>
        <TextInput
          testID="rulesRegulationInputText"
          placeholder="Enter rules / regulations"
          style={styles.textInput}
          multiline
          placeholderTextColor="#CBD5E1"
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
            <View style={styles.showFeatureItem}>
              {true ? (
                <TouchableOpacity
                  testID="unselectedShowFeature"
                  style={styles.checkbox}
                  onPress={() => {}}
                />
              ) : (
                <TouchableOpacity
                  testID="selectedShowFeature"
                  onPress={() => {}}
                >
                  <Image
                    source={require('../../../mobile/assets/images/checkbox.png')}
                    style={[styles.backBtn, { marginRight: 10 }]}
                  />
                </TouchableOpacity>
              )}
              <Text
                style={[
                  styles.label,
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
        <Text style={[styles.text, styles.textInputLabel, { marginTop: -20 }]}>
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
              <View style={styles.rulesItem}>
                <TouchableOpacity
                  style={styles.checkboxTouchable}
                  testID={`ruleCheckbox_${ruleId}`}
                  onPress={() => this.handleToggleRuleSelection(ruleId)}
                >
                  {isSelected ? (
                    <Feather name="check" size={14} color="#3333CC" />
                  ) : null}
                </TouchableOpacity>
                <Text style={styles.rulesItemText}>
                  {ruleTitle || 'No Title'}
                </Text>
              </View>
            );
          }}
          keyExtractor={(item: any) =>
            (item.id || item.attributes?.id || Math.random()).toString()
          }
          contentContainerStyle={styles.rulesListContainer}
        />

        {/* Custom Rules Input - at the end of list */}
        <View style={styles.rosterInputContainer}>
          <TextInput
            testID="customRuleTextInput"
            placeholder="Enter custom rule or regulation"
            placeholderTextColor="#CBD5E1"
            style={styles.rosterInput}
            value={this.state.customRuleTxt}
            onChangeText={text =>
              this.setState({ customRuleTxt: text.replace('  ', ' ') })
            }
            onSubmitEditing={this.handleAddCustomRule}
          />
          {this.state.customRuleTxt.trim() !== '' && (
            <TouchableOpacity
              testID="saveCustomRuleBtn"
              style={styles.rosterSaveButton}
              onPress={this.handleAddCustomRule}
            >
              <Text style={styles.rosterSaveButtonText}>Save</Text>
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
        <Text style={[styles.text, styles.textInputLabel, { marginTop: -20 }]}>
          Roster
        </Text>
        <View style={styles.rosterInputContainer}>
          <TextInput
            testID="rosterTextInput"
            placeholder="E.g. Aerosmith"
            placeholderTextColor="#CBD5E1"
            style={styles.rosterInput}
            value={this.state.rosterTxt}
            onChangeText={text =>
              this.setState({ rosterTxt: text.replace('  ', ' ') })
            }
            onSubmitEditing={this.handleAddRosterItem}
          />
          {this.state.rosterTxt.trim() !== '' && (
            <TouchableOpacity
              testID="saveRosterBtn"
              style={styles.rosterSaveButton}
              onPress={this.handleAddRosterItem}
            >
              <Text style={styles.rosterSaveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
        {this.state.roster && this.state.roster.length > 0 && (
          <View style={styles.selectionsContainer}>
            <FlatList
              data={this.state.roster}
              renderItem={({ item }: { item: string }) => (
                <View style={styles.selectedAffiliate}>
                  <Text style={styles.selectedAffiliateText}>{item}</Text>
                  <Feather
                    name="x"
                    size={17}
                    color="#4949EE"
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
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.contentContainer}>
            <View style={styles.contentContainer}>
              <StatusBar
                backgroundColor={colors(false).background}
                barStyle="dark-content"
              />
              {this.renderBackBtnAndHeader()}
              {this.renderImageSection()}
              <View style={styles.bottomContainer}>
                <View style={{ marginHorizontal: 30 }}>
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
                    <View style={styles.countryCodeAndroidModal}>
                      <View style={styles.countryCodeAndroidModalView}>
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
                    style={styles.saveButton}
                    onPress={() => {
                      // this.props.navigation.goBack()
                      this.createBandProfile();
                    }}
                  >
                    <Text style={styles.textStyle}>Save</Text>
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
                <View style={[styles.centeredView]}>
                  <TouchableWithoutFeedback>
                    <View
                      style={[
                        styles.modalView,
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
                <View style={[styles.centeredView]}>
                  <TouchableWithoutFeedback>
                    <View
                      style={[
                        styles.modalView,
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
                <View style={[styles.centeredView]}>
                  <TouchableWithoutFeedback>
                    <View
                      style={[
                        styles.modalView,
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
                <View style={[styles.centeredView]}>
                  <TouchableWithoutFeedback>
                    <View
                      style={[
                        styles.modalView,
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
                <View style={[styles.centeredView]}>
                  <TouchableWithoutFeedback>
                    <View
                      style={[
                        styles.modalView,
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
            animationType="slide"
            transparent={true}
            visible={this.state.showCameraGalleryPopup}
          >
            <View style={[styles.centerView, { padding: 10 }]}>
              <View style={styles.galleryOptions}>
                <Text
                  testID="cameraOption"
                  style={styles.takeChoosePhoto}
                  onPress={this.handleCamera}
                >
                  Take photo
                </Text>
                <View style={styles.separator} />
                <Text
                  testID="galleryOption"
                  style={styles.takeChoosePhoto}
                  onPress={this.handleGallery}
                >
                  Choose photo
                </Text>
              </View>
              <TouchableOpacity
                testID="cancelOption"
                style={styles.cancelPhotoOption}
                onPress={this.handleCameraGalleryCancelPopup}
              >
                <Text style={styles.cancelPhotoText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          {this.renderCountryPopup()}
          {this.renderCountryModal()}
          {this.renderStateModal()}
          {this.renderCityModal()}
          {this.state.isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size={'large'} color="black" />
            </View>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
    // Customizable Area End
  }
  // Customizable Area Start
  // Customizable Area End
}
// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerIcon: {
    width: 12,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 24,
    color: colors(false).text,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginHorizontal: 50,
    alignSelf: 'center',
    marginTop: 15,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  topBackdrop: {
    backgroundColor: '#131388',
    height: 350,
    width: '100%',
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: '#FCFCFF',
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 20,
  },
  profileImageContainer: {
    backgroundColor: '#FCFCFF',
    width: 130,
    height: 130,
    borderRadius: 80,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    borderRadius: 75,
  },
  coverImageButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  bandNameText: {
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 28,
    marginTop: 20,
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
    color: colors(false).text,
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
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#C5C5FF',
    color: colors(false).text,
    height: 50,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: '#F1F5F9',
    opacity: 0.8,
  },
  emailSecurityText: {
    fontSize: 12,
    color: '#64748B',
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
    backgroundColor: 'white',
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
    backgroundColor: 'white',
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
    backgroundColor: 'white',
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
    backgroundColor: '#3333CC',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    marginTop: 25,
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
    borderColor: '#C5C5FF',
    backgroundColor: '#FFFFFF',
    height: 50,
    fontSize: 16,
    marginRight: 10,
  },
  rosterSaveButton: {
    backgroundColor: '#3333CC',
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
    backgroundColor: '#EDEDFF',
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
    color: '#4949EE',
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
    backgroundColor: '#EDEDFF',
    paddingVertical: 5,
    marginRight: 10,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  crossBtn: {
    marginLeft: 10,
    tintColor: '#3333CC',
    width: 10,
    height: 10,
    resizeMode: 'contain',
    marginTop: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginTop: 20,
  },
  textOutsideCountry: {
    fontWeight: '700',
    fontSize: 26,
    lineHeight: 28,
    marginVertical: 10,
    color: '#0F172A',
  },
  textOnlySupportCountry: {
    fontSize: 18,
  },
  continueBtn: {
    backgroundColor: '#3333CC',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  textContinueBtn: {
    color: colors(false).white,
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
    height: 350,
    width: '100%',
  },
  coverPicBtn: {
    width: 45,
    height: 45,
    position: 'absolute',
    right: 10,
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    width: 20,
    height: 20,
  },
  profilePicBtn: {
    borderRadius: 25,
    backgroundColor: '#4949EE',
    width: 45,
    height: 45,
    position: 'absolute',
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelTxt: {
    color: '#3333CC',
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: '4%',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  galleryOptions: {
    borderRadius: 10,
    backgroundColor: '#EDEDFF',
    alignItems: 'center',
  },
  takeChoosePhoto: {
    fontSize: 14,
    fontWeight: '400',
    color: '#4949EE',
    marginVertical: 15,
  },
  cancelPhotoOption: {
    borderRadius: 10,
    backgroundColor: '#EDEDFF',
    marginTop: 15,
    alignItems: 'center',
  },
  cancelPhotoText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4949EE',
    marginVertical: 20,
  },
  daysItem: {
    flexDirection: 'row',
    width: '20%',
    marginTop: 10,
  },
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors(false).text,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: colors(false).text,
    fontFamily: 'OpenSans',
    flex: 1,
    marginLeft: 10,
  },
  checkboxTouchable: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors(false).text,
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
// Customizable Area End.                                                                                                              
                                     