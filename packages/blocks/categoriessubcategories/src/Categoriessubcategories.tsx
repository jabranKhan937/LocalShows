import React from 'react';
// Customizable Area Start
import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  FlatList,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
  Modal,
  Platform,
  RefreshControl,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import CategoriessubcategoriesController, {
  Props,
} from './CategoriessubcategoriesController';
import { redesignTheme } from '../../utilities/src/Colors';
import { leftArrow } from '../../events/src/assets';
import Icon from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
// Customizable Area End

type CategoriesTheme = typeof redesignTheme;

export default class Categoriessubcategories extends CategoriessubcategoriesController {
  // Customizable Area Start
  constructor(props: Props) {
    super(props);
  }

  get styles() {
    return createCategoriesStyles(this.getCategoriesTheme());
  }

  renderSelectorItem = ({ item }: { item: string }) => {
    const styles = this.styles;
    const theme = this.getCategoriesTheme();
    return (
      <View style={styles.selectorSection}>
        <Text style={styles.categoryText}>{item}</Text>
        {Platform.OS === 'ios' ? (
          <TouchableOpacity
            testID="btnToggleIosModal"
            style={styles.iOSPicker}
            onPress={() => {
              this.modalCallback = subCat => {
                this.handleSubCatSelection(item, subCat);
                this.setState({ showModal: false });
              };
              this.setState({
                showModal: true,
                modalValues: this.state.categoriesArray[item].map(
                  item => item.attributes.name,
                ),
              });
            }}>
            <Text style={[styles.text, styles.iOSPickerText]}>
              {`Select ${item}`}
            </Text>
            <Image source={leftArrow} style={[styles.iOSPickerArrow, { tintColor: theme.muted }]} />
          </TouchableOpacity>
        ) : (
          <View
            style={[
              styles.selectorPicker,
              {
                paddingHorizontal: 0,
              },
            ]}>
            <Picker
              testID="subcategoryPicker"
              style={[styles.selectorPicker, { color: theme.foreground }]}
              itemStyle={[styles.text, styles.selectorPickerText]}
              dropdownIconColor={theme.muted}
              onValueChange={(subCat: string) =>
                this.handleSubCatSelection(item, subCat)
              }>
              <Picker.Item label={`Select ${item}`} value={''} />
              {this.state.categoriesArray[item].map((elem: any) => (
                <Picker.Item
                  key={elem.id}
                  label={elem.attributes.name}
                  value={elem.attributes.name}
                />
              ))}
            </Picker>
          </View>
        )}
        <View style={styles.selectionsContainer}>
          <FlatList
            data={this.state.subcategories[item] || []}
            renderItem={(subCat: { item: string }) => (
              <View style={styles.selectedItem}>
                <Text style={styles.selectedItemText}>{subCat.item}</Text>
                <Icon
                  name="x"
                  size={17}
                  color={theme.primary}
                  onPress={() => this.handleRemoveSubcat(item, subCat.item)}
                />
              </View>
            )}
            scrollEnabled={false}
            numColumns={20}
            columnWrapperStyle={{ flexWrap: 'wrap' }}
          />
        </View>
      </View>
    );
  };

  conditionalRenderngBasedOnActiveTab = () => {
    const styles = this.styles;
    const theme = this.getCategoriesTheme();
    if (this.state.activeTab === 0) {
      return (
        <View style={{ alignSelf: 'flex-start', width: '100%' }}>
          <View style={{ alignSelf: 'flex-start', width: '100%' }}>
            <FlatList
              data={Object.keys(this.state.categoriesArray)}
              renderItem={this.renderSelectorItem}
              keyExtractor={item => item}
              scrollEnabled={false}
            />
          </View>
          <View style={styles.newCategoryContainer}>
            <Text style={styles.newCategoryHeading}>
              Didn't find a category?
            </Text>
            <TouchableOpacity
              style={styles.newCategoryLinkContainer}
              onPress={this.handleAddNewCategory}>
              <Icon name="plus-circle" color={theme.primary} size={18} />
              <Text style={styles.newCategoryLink}>Add a new category</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            testID="btnNext1"
            style={styles.nextButton}
            onPress={() => this.handleSaveCategories()}>
            <Text style={[styles.text, styles.textNextButton]}>Next</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (this.state.activeTab === 1) {
      // Check if this tab should show roster content (for venue users)
      const isRosterTab = this.state.secondTabLabel === "Roster";
      
      return (
        <View style={{ alignSelf: 'flex-start', width: '100%' }}>
          <View style={{ alignSelf: 'flex-start', width: '100%' }}>
            <View style={[styles.selectorSection]}>
              <Text style={styles.categoryText}>
                {this.state.secondTabLabel}
              </Text>
              <View style={styles.rosterInputContainer}>
                {isRosterTab ? (
                  <>
                    <TextInput
                      testID="rosterTextInput"
                      placeholder="E.g. Aerosmith"
                      placeholderTextColor={theme.muted}
                      style={styles.rosterInput}
                      value={this.state.rosterTxt}
                      onChangeText={(text) =>
                        this.setState({ rosterTxt: text.replace('  ', ' ') })
                      }
                      onSubmitEditing={this.handleAddRosterItem}
                    />
                    {this.state.rosterTxt.trim() !== "" && (
                      <TouchableOpacity
                        testID="saveRosterBtn"
                        style={styles.rosterSaveButton}
                        onPress={this.handleAddRosterItem}>
                        <Text style={styles.rosterSaveButtonText}>Save</Text>
                      </TouchableOpacity>
                    )}
                  </>
                ) : (
                  <>
                    <TextInput
                      testID="influencesTextInput"
                      placeholder="Enter your influences"
                      placeholderTextColor={theme.muted}
                      style={styles.rosterInput}
                      value={this.state.influenceTxt}
                      onChangeText={text =>
                        this.setState({ influenceTxt: text.replace('  ', ' ') })
                      }
                      onSubmitEditing={this.handleArtistSelection}
                    />
                    {this.state.influenceTxt.trim() !== "" && (
                      <TouchableOpacity
                        testID="saveInfluenceBtn"
                        style={styles.rosterSaveButton}
                        onPress={this.handleArtistSelection}>
                        <Text style={styles.rosterSaveButtonText}>Save</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
              <View style={styles.selectionsContainer}>
                <FlatList
                  data={
                    isRosterTab
                      ? this.state.roster
                      : this.state.userRole === 'fan'
                      ? this.state.selectedArtists
                      : this.state.influences
                  }
                  renderItem={({ item }: { item: string }) => (
                    <View style={styles.selectedItem}>
                      <Text style={styles.selectedItemText}>{item}</Text>
                      <Icon
                        name="x"
                        size={17}
                        color={theme.primary}
                        onPress={() => 
                          isRosterTab 
                            ? this.handleRemoveRosterItem(item)
                            : this.handleRemoveArtist(item)
                        }
                      />
                    </View>
                  )}
                  scrollEnabled={false}
                  numColumns={20}
                  columnWrapperStyle={{ flexWrap: 'wrap' }}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity
            testID="btnNext2"
            style={styles.nextButton}
            onPress={() => {
              this.handleNext();
            }}>
            <Text style={[styles.text, styles.textNextButton]}>
              {this.state.userRole === 'band' ||
                this.state.userRole === 'Artist'
                ? 'Save'
                : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (this.state.activeTab === 2) {
      // Show Affiliates tab for band and venue users
      if (this.state.userRole === 'band' || this.state.userRole === 'venue') {
        return (
          <>
            <View style={{ alignSelf: 'flex-start', width: '100%' }}>
              <View style={{ alignSelf: 'flex-start', width: '100%' }}>
                <Text style={styles.alertText}>
                  Affiliates (Record Label, Agent/Manager, Tattoo Shop you are
                  working, Band Members etc..)
                </Text>
                <View style={styles.selectorSection}>
                  <View style={styles.rosterInputContainer}>
                    <TextInput
                      testID="txtInputAffiliates"
                      placeholder="E.g. Record Label / Epitaph records"
                      placeholderTextColor={theme.muted}
                      style={styles.rosterInput}
                      value={this.state.affiliateTxt}
                      onChangeText={affiliateTxt => this.setState({ affiliateTxt })}
                      onSubmitEditing={() => this.handleAddAffiliate()}
                    />
                    {this.state.affiliateTxt.trim() !== "" && (
                      <TouchableOpacity
                        testID="saveAffiliateBtn"
                        style={styles.rosterSaveButton}
                        onPress={this.handleAddAffiliate}>
                        <Text style={styles.rosterSaveButtonText}>Save</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <View style={styles.selectionsContainer}>
                  <FlatList
                    data={this.state.affiliates}
                    renderItem={({ item }: { item: string }) => (
                      <View
                        style={[
                          styles.selectedItem,
                          styles.affiliatesSelectedItem,
                        ]}>
                        <Text style={styles.selectedItemText}>{item}</Text>
                        <Icon
                          name="x"
                          size={17}
                          color={theme.primary}
                          onPress={() => this.handleRemoveAffiliate(item)}
                        />
                      </View>
                    )}
                    scrollEnabled={false}
                    numColumns={20}
                    columnWrapperStyle={{ flexWrap: 'wrap' }}
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity
              testID="saveBtn"
              style={styles.nextButton}
              onPress={this.handleNext}>
              <Text style={[styles.text, styles.textNextButton]}>Save</Text>
            </TouchableOpacity>
          </>
        );
      }
      // Fallback for non-band/venue users on tab 2
    }

    if (this.state.activeTab === 3) {
      // Show Roster tab content for specific account types
      if (this.shouldHideRulesAndRegulationsTab()) {
        return (
          <>
            <View style={{ alignSelf: 'flex-start', width: '100%' }}>
              <View style={{ alignSelf: 'flex-start', width: '100%' }}>
                <Text style={styles.categoryText}>Roster</Text>
                <View style={styles.rosterInputContainer}>
                  <TextInput
                    testID="rosterTextInput"
                    placeholder="E.g. Aerosmith"
                    placeholderTextColor={theme.muted}
                    style={styles.rosterInput}
                    value={this.state.rosterTxt}
                    onChangeText={(text) =>
                      this.setState({ rosterTxt: text.replace('  ', ' ') })
                    }
                    onSubmitEditing={this.handleAddRosterItem}
                  />
                  {this.state.rosterTxt.trim() !== "" && (
                    <TouchableOpacity
                      testID="saveRosterBtn"
                      style={styles.rosterSaveButton}
                      onPress={this.handleAddRosterItem}>
                      <Text style={styles.rosterSaveButtonText}>Save</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.selectionsContainer}>
                  <FlatList
                    data={this.state.roster}
                    renderItem={({ item }: { item: string }) => (
                      <View style={styles.selectedItem}>
                        <Text style={styles.selectedItemText}>{item}</Text>
                        <Icon
                          name="x"
                          size={17}
                          color={theme.primary}
                          onPress={() => this.handleRemoveRosterItem(item)}
                        />
                      </View>
                    )}
                    scrollEnabled={false}
                    numColumns={20}
                    columnWrapperStyle={{ flexWrap: 'wrap' }}
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity
              testID="saveBtnRoster"
              style={styles.nextButton}
              onPress={this.handleNext}>
              <Text style={[styles.text, styles.textNextButton]}>Save</Text>
            </TouchableOpacity>
          </>
        );
      }
      // Show Rules and Regulations tab content for other account types
      return (
        <>
          <View style={{ alignSelf: 'flex-start', width: '100%' }}>
            <View style={{ alignSelf: 'flex-start', width: '100%' }}>
              <Text style={styles.categoryText}>Rules and Regulations</Text>
              
              {/* Combined Rules List (API + Custom) */}
              {(() => {
                // Use customRules state to show all added custom rules (regardless of selection)
                const customRules = this.state.customRules || [];
                const apiRules = this.state.rulesAndRegulations || [];
                const apiRuleTitles = apiRules.map(
                  (rule: any) => rule.title || rule.attributes?.title
                );

                // Exclude custom rules that duplicate an API rule (e.g. when loading from profile
                // user-selected rules can be merged into customRules before rulesAndRegulations is loaded)
                const customRulesDeduped = customRules.filter(
                  (text: string) => apiRuleTitles.indexOf(text) === -1
                );

                // Combine API rules and custom rules into a single array (no duplicates)
                const allRules = [
                  ...apiRules.map((rule: any) => ({
                    id: rule.id,
                    title: rule.title || rule.attributes?.title,
                    isCustom: false
                  })),
                  ...customRulesDeduped.map((text: string, index: number) => ({
                    id: `custom-${index}-${text}`,
                    title: text,
                    isCustom: true
                  }))
                ];

                return allRules.length > 0 ? (
                  <FlatList
                    data={allRules}
                    renderItem={({ item }: { item: any }) => {
                      const isSelected = item.isCustom
                        ? this.state.selectedRulesAndRegulationsTexts.indexOf(item.title) !== -1
                        : this.state.selectedRulesAndRegulationsIds.indexOf(item.id) !== -1 ||
                          this.state.selectedRulesAndRegulationsTexts.indexOf(item.title) !== -1;
                      
                      return (
                        <View style={styles.rulesItem}>
                          <TouchableOpacity
                            style={styles.checkboxTouchable}
                            testID={item.isCustom ? `customRuleCheckbox_${item.id}` : `ruleCheckbox_${item.id}`}
                            onPress={() => {
                              if (item.isCustom) {
                                this.handleToggleCustomRuleSelection(item.title);
                              } else {
                                this.handleToggleRuleSelection(item.id);
                              }
                            }}>
                            {isSelected ? (
                              <Icon name="check" size={14} color={theme.primary} />
                            ) : null}
                          </TouchableOpacity>
                          <Text style={styles.rulesItemText}>{item.title}</Text>
                        </View>
                      );
                    }}
                    keyExtractor={(item: any) => item.id.toString()}
                    contentContainerStyle={styles.rulesListContainer}
                  />
                ) : null;
              })()}
              
              {/* Custom Rules Input - at the end of list */}
              <View style={styles.rosterInputContainer}>
                <TextInput
                  testID="customRuleTextInput"
                  placeholder="Enter custom rule or regulation"
                  placeholderTextColor={theme.muted}
                  style={styles.rosterInput}
                  value={this.state.customRuleTxt}
                  onChangeText={(text) =>
                    this.setState({ customRuleTxt: text.replace('  ', ' ') })
                  }
                  onSubmitEditing={this.handleAddCustomRule}
                />
                {this.state.customRuleTxt.trim() !== "" && (
                  <TouchableOpacity
                    testID="saveCustomRuleBtn"
                    style={styles.rosterSaveButton}
                    onPress={this.handleAddCustomRule}>
                    <Text style={styles.rosterSaveButtonText}>Save</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <TouchableOpacity
            testID="saveBtnRules"
            style={styles.nextButton}
            onPress={this.handleNext}>
            <Text style={[styles.text, styles.textNextButton]}>Save</Text>
          </TouchableOpacity>
        </>
      );
    }

    if (this.state.activeTab === 4) {
      // Only show States tab content for fan users
      if (this.state.userRole !== 'fan') {
        return null;
      }
      // Show States tab content
      return (
        <View style={{ alignSelf: 'flex-start', width: '100%' }}>
          <View style={{ alignSelf: 'flex-start', width: '100%' }}>
            <Text style={styles.alertText}>
              Be aware that the shows available on our platform are currently
              limited to those produced within the United States not other
              countries.
            </Text>
            <View style={styles.selectorSection}>
              <Text style={styles.categoryText}>Shows in (Default)</Text>
              {Platform.OS === 'ios' ? (
                <TouchableOpacity
                  testID="btnToggleIosStateModal"
                  style={styles.iOSPicker}
                  onPress={() => {
                    this.modalCallback = defaultState => {
                      this.setState({ defaultState, showStatePickerModal: false });
                    };
                    this.setState({ showStatePickerModal: true });
                  }}>
                  <Text style={[styles.text, styles.iOSPickerText]}>
                    {this.getStateNameForPicker(this.state.defaultState)}
                  </Text>
                  <Image source={leftArrow} style={[styles.iOSPickerArrow, { tintColor: theme.muted }]} />
                </TouchableOpacity>
              ) : (
                <View
                  style={[
                    styles.selectorPicker,
                    {
                      paddingHorizontal: 0,
                    },
                  ]}>
                  <Picker
                    testID="statePicker"
                    style={[styles.selectorPicker, { color: theme.foreground }]}
                    itemStyle={[styles.text, styles.selectorPickerText]}
                    dropdownIconColor={theme.muted}
                    selectedValue={this.state.defaultState}
                    onValueChange={defaultState => this.setState({ defaultState })}>
                    <Picker.Item label={'Select a state'} value={''} />
                    {this.state.states.map((elem: any) => (
                      <Picker.Item
                        key={elem.key}
                        label={elem.name}
                        value={elem.key}
                      />
                    ))}
                  </Picker>
                  <Image source={leftArrow} style={[styles.pickerArrow, { tintColor: theme.muted }]} />
                </View>
              )}
            </View>
            <View style={styles.checkboxView}>
              <TouchableOpacity
                style={styles.checkboxTouchable}
                testID="btnShowAltState"
                onPress={() =>
                  this.setState({ showAltState: !this.state.showAltState })
                }>
                {this.state.showAltState && (
                  <View style={styles.checkboxChecked} />
                )}
              </TouchableOpacity>
              <View>
                <Text style={styles.text}>Other states</Text>
              </View>
            </View>
            {this.state.showAltState && (
              <View style={styles.selectorSection}>
                <Text style={styles.categoryText}>Shows in</Text>
                {Platform.OS === 'ios' ? (
                  <TouchableOpacity
                    testID="btnToggleIosStateAltModal"
                    style={styles.iOSPicker}
                    onPress={() => {
                      this.modalCallback = altState => {
                        this.setState({ altState, showStatePickerModal: false });
                      };
                      this.setState({ showStatePickerModal: true });
                    }}>
                    <Text style={[styles.text, styles.iOSPickerText]}>
                      {this.getStateNameForPicker(this.state.altState)}
                    </Text>
                    <Image source={leftArrow} style={[styles.iOSPickerArrow, { tintColor: theme.muted }]} />
                  </TouchableOpacity>
                ) : (
                  <View
                    style={[
                      styles.selectorPicker,
                      {
                        paddingHorizontal: 0,
                      },
                    ]}>
                    <Picker
                      testID="stateAltPicker"
                      style={[styles.selectorPicker, { color: theme.foreground }]}
                      itemStyle={[styles.text, styles.selectorPickerText]}
                      dropdownIconColor={theme.muted}
                      selectedValue={this.state.altState}
                      onValueChange={altState => this.setState({ altState })}>
                      <Picker.Item label={'Select a state'} value={''} />
                      {this.state.states.map((elem: any) => (
                        <Picker.Item
                          key={elem.key}
                          label={elem.name}
                          value={elem.key}
                        />
                      ))}
                    </Picker>
                    <Image source={leftArrow} style={[styles.pickerArrow, { tintColor: theme.muted }]} />
                  </View>
                )}
              </View>
            )}
            <View style={styles.infoContainer}>
              <Icon name="info" size={25} color={theme.primary} />
              <Text style={[styles.text, styles.infoText]}>
                Local Shows only supports up to two states. If you want to
                checkout any more please visit the Travel feature.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            testID="saveBtn"
            style={styles.nextButton}
            onPress={this.handleSaveData}>
            <Text style={[styles.text, styles.textNextButton]}>Save</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  getTabCount = () => {
    const { userRole } = this.state;
    let count = 1; // Tab 1 (Categories) is always visible
    
    if (userRole === 'fan') {
      return 3; // Categories, Influences, States
    }
    
    // Tab 2 (Influences/Roster) - visible for band, artist (NOT venue)
    if (userRole !== 'venue') {
      count++; // Tab 2
    }
    
    // Tab 3 (Affiliates) - visible for band, artist (NOT fan, NOT venue)
    if (userRole !== 'fan' && userRole !== 'venue') {
      count++; // Tab 3
    }
    
    // Tab 4 (Roster/Rules and Regulations) - visible for venue, artist (NOT fan, NOT band)
    // Check renderTabFour: userRole !== 'fan' && userRole !== 'band'
    if (userRole !== 'fan' && userRole !== 'band') {
      count++; // Tab 4
    }
    
    return count;
  };

  getTabWidth = () => {
    const screenWidth = Dimensions.get('window').width;
    const containerPadding = 32; // 16 padding on each side
    const tabBarPadding = 8; // 4 padding on each side of tabBar
    const tabCount = this.getTabCount();
    const separatorsWidth = (tabCount - 1) * 1; // 1px separator between each tab
    const availableWidth = screenWidth - containerPadding - tabBarPadding;
    const calculatedTabWidth = (availableWidth - separatorsWidth) / tabCount;
    const minTabWidth = 120; // Minimum width for tabs to be readable
    
    // If calculated width is less than minimum, use minimum (will cause scrolling)
    // Otherwise, use calculated width to fill the screen
    return Math.max(calculatedTabWidth, minTabWidth);
  };

  renderTabOne = () => {
    const styles = this.styles;
    const theme = this.getCategoriesTheme();
    const isActiveTab = this.state.activeTab === 0;
    const baseStyle = isActiveTab ? styles.tabButtonActive : styles.tabButton;
    const tabWidth = this.getTabWidth();
    const tabButtonStyle = [baseStyle, { width: tabWidth }];

    return (
      <TouchableOpacity
        testID="firstTabButton"
        style={tabButtonStyle}
        onPress={() => this.handleTabSwitch(0)}>
        <Text
          style={
            isActiveTab ? styles.tabButtonActiveText : styles.tabButtonText
          }>
          Categories
        </Text>
      </TouchableOpacity>
    );
  };

  renderTabTwo = () => {
    const styles = this.styles;
    const theme = this.getCategoriesTheme();
    // Hide Influences tab for venue users only
    if (this.state.userRole === 'venue') {
      return null;
    }

    // Disable for Influences (band/artist) or Bands/Artists (fan) until categories saved
    const isDisabled = !this.state.categoriesSaved;
    const isActiveTab = this.state.activeTab === 1;
    const baseStyle = isActiveTab ? styles.tabButtonActive : styles.tabButton;
    const tabWidth = this.getTabWidth();
    const tabButtonStyle = [baseStyle, isDisabled && styles.tabButtonDisabled, { width: tabWidth }];

    return (
      <TouchableOpacity
        testID="secondTabButton"
        style={tabButtonStyle}
        onPress={() => !isDisabled && this.handleTabSwitch(1)}
        activeOpacity={isDisabled ? 1 : 0.7}
        disabled={isDisabled}>
        <Text
          style={[
            isActiveTab ? styles.tabButtonActiveText : styles.tabButtonText,
            isDisabled && styles.tabButtonDisabledText
          ]}>
          {this.state.secondTabLabel}
        </Text>
      </TouchableOpacity>
    );
  };

  renderTabThree = () => {
    const styles = this.styles;
    const theme = this.getCategoriesTheme();
    // Hide Affiliates tab for venue users only
    if (this.state.userRole === 'venue') {
      return null;
    }

    const isAffiliatesTab = this.state.thirdTabLabel === 'Affiliates';
    const isDisabled = isAffiliatesTab && (!this.state.categoriesSaved || !this.state.influencesSaved);

    return (
      <>
        {this.state.userRole !== 'fan' && (
          <>
            <View style={styles.tabSeparator} />
            <TouchableOpacity
              testID="thirdTabButton"
              style={[
                this.state.activeTab === 2
                  ? styles.tabButtonActive
                  : styles.tabButton,
                isDisabled && styles.tabButtonDisabled,
                { width: this.getTabWidth() }
              ]}
              onPress={() => !isDisabled && this.handleTabSwitch(2)}
              activeOpacity={isDisabled ? 1 : 0.7}
              disabled={isDisabled}>
              <Text
                style={[
                  this.state.activeTab === 2
                    ? styles.tabButtonActiveText
                    : styles.tabButtonText,
                  isDisabled && styles.tabButtonDisabledText
                ]}>
                {this.state.thirdTabLabel}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </>
    );
  };

  renderTabFour = () => {
    const styles = this.styles;
    const theme = this.getCategoriesTheme();
    if (this.state.userRole === 'fan' || this.state.userRole === 'band') {
      return null;
    }
    const isRosterTab = this.shouldHideRulesAndRegulationsTab();
    const tabLabel = isRosterTab ? "Roster" : "Rules and Regulations";
    // Disable Roster (and Rules and Regulations) tab until categories are saved
    const isDisabled = !this.state.categoriesSaved;

    return (
      <>
        <View style={styles.tabSeparator} />
        <TouchableOpacity
          testID="fourthTabButton"
          style={[
            this.state.activeTab === 3
              ? styles.tabButtonActive
              : styles.tabButton,
            isDisabled && styles.tabButtonDisabled,
            { width: this.getTabWidth() }
          ]}
          onPress={() => !isDisabled && this.handleTabSwitch(3)}
          activeOpacity={isDisabled ? 1 : 0.7}
          disabled={isDisabled}>
          <Text
            style={[
              this.state.activeTab === 3
                ? styles.tabButtonActiveText
                : styles.tabButtonText,
              isDisabled && styles.tabButtonDisabledText
            ]}
            numberOfLines={1}>
            {tabLabel}
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  renderTabFive = () => {
    const styles = this.styles;
    const theme = this.getCategoriesTheme();
    // Only show States tab for fan users
    if (this.state.userRole !== 'fan') {
      return null;
    }
    const isDisabled = !this.state.categoriesSaved || !this.state.bandsArtistsSaved;
    const isActiveTab = this.state.activeTab === 4;
    const baseStyle = isActiveTab ? styles.tabButtonActive : styles.tabButton;
    const tabWidth = this.getTabWidth();
    const tabButtonStyle = [baseStyle, isDisabled && styles.tabButtonDisabled, { width: tabWidth }];

    return (
      <>
        <View style={styles.tabSeparator} />
        <TouchableOpacity
          testID="fifthTabButton"
          style={tabButtonStyle}
          onPress={() => !isDisabled && this.handleTabSwitch(4)}
          activeOpacity={isDisabled ? 1 : 0.7}
          disabled={isDisabled}>
          <Text
            style={[
              isActiveTab ? styles.tabButtonActiveText : styles.tabButtonText,
              isDisabled && styles.tabButtonDisabledText
            ]}>
            States
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  // Customizable Area End
  render() {
    const styles = this.styles;
    const theme = this.getCategoriesTheme();
    // Customizable Area Start
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.background }}>
        <StatusBar
          barStyle={this.state.isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <View pointerEvents="none" style={styles.decorTop} />
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ alignItems: 'flex-start' }}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={this.handleRefresh}
              tintColor={theme.primary}
            />
          }>
          <View style={styles.headerView}>
            <TouchableOpacity
              testID="backButton"
              style={styles.backButtonContainer}
              onPress={this.goBack}>
              <Image source={leftArrow} style={[styles.backButton, { tintColor: theme.foreground }]} />
            </TouchableOpacity>
            <Text
              testID="pageTitle"
              style={[
                styles.text,
                styles.pageTitle,
                { fontSize: this.state.fontSize || 18 },
              ]}
              numberOfLines={1}>
              {this.state.title}
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            style={styles.tabBarScrollView}
            contentContainerStyle={styles.tabBar}>
            {this.renderTabOne()}
            <View style={styles.tabSeparator} />
            {this.renderTabTwo()}
            {this.renderTabThree()}
            {this.renderTabFour()}
            {this.renderTabFive()}
          </ScrollView>
          <this.conditionalRenderngBasedOnActiveTab />
        </ScrollView>
        {this.state.fetching && (
          <View style={styles.fetchingContainer}>
            <ActivityIndicator size={'large'} color={theme.primary} />
          </View>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showModal}>
          <TouchableWithoutFeedback testID="hideModal" onPress={this.hideModal}>
            <View style={styles.centeredModalView}>
              <TouchableWithoutFeedback>
                <View style={styles.sheetContainer}>
                  <View style={styles.sheetHandle} />
                  <Text style={styles.sheetTitle}>Select</Text>
                  <ScrollView
                    style={styles.sheetList}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always">
                    {this.state.modalValues.map((item: string, index: number) => {
                      const selected = item === this.state.modalSelectedValue;
                      return (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.sheetOption,
                            selected && styles.sheetOptionSelected,
                          ]}
                          onPress={() => this.modalCallback(item)}>
                          <Text
                            style={[
                              styles.sheetOptionText,
                              selected && styles.sheetOptionTextSelected,
                            ]}>
                            {item}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                  <Picker
                    testID="pickerModal"
                    selectedValue={this.state.modalSelectedValue}
                    onValueChange={value => this.modalCallback(value)}
                    style={styles.hiddenPicker}>
                    {this.state.modalValues.map(
                      (item: string, index: number) => (
                        <Picker.Item key={index} label={item} value={item} />
                      ),
                    )}
                  </Picker>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showStatePickerModal}>
          <TouchableWithoutFeedback
            testID="hideStatePickerModal"
            onPress={this.hideStatePickerModal}>
            <View style={styles.centeredModalView}>
              <TouchableWithoutFeedback>
                <View style={styles.sheetContainer}>
                  <View style={styles.sheetHandle} />
                  <Text style={styles.sheetTitle}>Select a state</Text>
                  <ScrollView
                    style={styles.sheetList}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always">
                    {this.state.states.map((elem: any) => {
                      const selected = elem.key === this.state.modalSelectedValue;
                      return (
                        <TouchableOpacity
                          key={elem.key}
                          style={[
                            styles.sheetOption,
                            selected && styles.sheetOptionSelected,
                          ]}
                          onPress={() => this.modalCallback(elem.key)}>
                          <Text
                            style={[
                              styles.sheetOptionText,
                              selected && styles.sheetOptionTextSelected,
                            ]}>
                            {elem.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                  <Picker
                    testID="statePickerModal"
                    selectedValue={this.state.modalSelectedValue}
                    onValueChange={value => this.modalCallback(value)}
                    style={styles.hiddenPicker}>
                    {this.state.states.map((elem: any) => (
                      <Picker.Item
                        key={elem.key}
                        label={elem.name}
                        value={elem.key}
                      />
                    ))}
                  </Picker>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    );
    // Customizable Area End
  }
}

const createCategoriesStyles = (theme: CategoriesTheme) => StyleSheet.create({
  // Customizable Area Start
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.background,
  },
  decorTop: {
    position: 'absolute',
    top: -90,
    right: -70,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.primarySoft,
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  backButtonContainer: {
    padding: 10,
    marginRight: 10,
    zIndex: 1,
  },
  backButton: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  pageTitle: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: theme.primary,
  },
  text: {
    fontFamily: 'OpenSans',
    alignSelf: 'flex-start',
    color: theme.foreground,
  },
  tabBarScrollView: {
    marginVertical: 20,
    height: 44,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 4,
    height: 44,
    minWidth: '100%',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexShrink: 0,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonActive: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexShrink: 0,
    backgroundColor: theme.primary,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonText: {
    textAlign: 'center',
    color: theme.muted,
    fontWeight: '600',
  },
  tabButtonActiveText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tabButtonDisabled: {
    opacity: 0.5,
  },
  tabButtonDisabledText: {
    color: theme.muted,
  },
  tabSeparator: {
    height: 24,
    width: 1,
    backgroundColor: theme.border,
  },
  selectorSection: {
    marginVertical: 15,
    alignSelf: 'flex-start',
    width: '100%',
  },
  categoryText: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
    color: theme.foreground,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  selectorPicker: {
    width: '100%',
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    color: theme.foreground,
    height: 50,
    textAlign: 'left',
  },
  rosterInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  rosterInput: {
    flex: 1,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    color: theme.foreground,
    height: 50,
    textAlign: 'left',
    fontSize: 16,
    marginRight: 10,
  },
  rosterSaveButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  rosterSaveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pickerArrow: {
    position: 'absolute',
    right: 15,
    marginRight: 5,
    width: 8,
    backgroundColor: 'transparent',
    transform: [{ rotate: '-90deg' }],
    resizeMode: 'contain',
  },
  selectorPickerText: {
    color: theme.foreground,
  },
  infoContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  infoText: {
    width: '90%',
    paddingLeft: 15,
    color: theme.muted,
  },
  alertText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 15,
    color: theme.foreground,
  },
  checkboxView: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
  },
  checkboxTouchable: {
    height: 22,
    width: 22,
    borderWidth: 1.5,
    borderRadius: 6,
    borderColor: theme.muted,
    backgroundColor: theme.input,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    height: 12,
    width: 12,
    backgroundColor: theme.primary,
    borderRadius: 3,
  },
  nextButton: {
    backgroundColor: theme.primary,
    width: '100%',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 25,
  },
  textNextButton: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    alignSelf: 'center',
  },
  skipButton: {
    width: '100%',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  textSkipButton: {
    color: theme.primary,
    fontWeight: '700',
    fontSize: 18,
    alignSelf: 'center',
  },
  selectionsContainer: {
    alignSelf: 'flex-start',
    width: '100%',
  },
  selectedItem: {
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
    borderWidth: 1,
    borderColor: theme.primary,
  },
  selectedItemText: {
    color: theme.primary,
    paddingRight: 5,
    fontWeight: '600',
  },
  fetchingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 8, 15, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputField: {
    width: '100%',
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    color: theme.foreground,
    height: 50,
  },
  affiliatesSelectedItem: {
    alignSelf: 'flex-start',
  },
  centeredModalView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(8, 8, 15, 0.72)',
  },
  modalContainerView: {
    height: '30%',
    justifyContent: 'space-between',
    backgroundColor: theme.card,
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
  sheetContainer: {
    backgroundColor: theme.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 28,
    maxHeight: '62%',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.muted,
    opacity: 0.5,
    marginBottom: 14,
  },
  sheetTitle: {
    fontFamily: 'OpenSans',
    fontWeight: '700',
    fontSize: 18,
    color: theme.primary,
    marginBottom: 12,
    textAlign: 'center',
    alignSelf: 'center',
  },
  sheetList: {
    maxHeight: 340,
  },
  sheetOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: theme.input,
    borderWidth: 1,
    borderColor: theme.border,
  },
  sheetOptionSelected: {
    backgroundColor: theme.primarySoft,
    borderColor: theme.primary,
  },
  sheetOptionText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: '600',
    color: theme.foreground,
    textAlign: 'center',
  },
  sheetOptionTextSelected: {
    color: theme.primary,
  },
  hiddenPicker: {
    height: 0,
    width: 0,
    opacity: 0,
    position: 'absolute',
  },
  iOSPicker: {
    width: '100%',
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.input,
    color: theme.foreground,
    height: 50,
    justifyContent: 'center',
  },
  iOSPickerText: {
    color: theme.muted,
  },
  iOSPickerArrow: {
    position: 'absolute',
    right: 15,
    marginRight: 5,
    width: 8,
    backgroundColor: 'transparent',
    transform: [{ rotate: '-90deg' }],
    resizeMode: 'contain',
  },
  newCategoryContainer: {
    marginVertical: 15,
  },
  newCategoryHeading: {
    fontWeight: 'bold',
    fontSize: 16,
    color: theme.foreground,
  },
  newCategoryLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  newCategoryLink: {
    color: theme.primary,
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 5,
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
    borderBottomColor: theme.border,
  },
  rulesItemText: {
    fontSize: 16,
    color: theme.foreground,
    fontFamily: 'OpenSans',
    flex: 1,
    marginLeft: 10,
  },
  // Customizable Area End
});
