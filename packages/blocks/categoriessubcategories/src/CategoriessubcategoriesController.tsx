import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { getStorageData, removeStorageData, setStorageData } from "../../../framework/src/Utilities";
import { DeviceEventEmitter, Dimensions, Alert } from "react-native";
import {
  lightTheme,
  PROFILE_THEME_CHANGED_EVENT,
  PROFILE_THEME_STORAGE_KEY,
  redesignTheme,
} from "../../utilities/src/Colors";
export const configJSON = require("./config");

interface ISubcategory {
  id: number;
  name: string;
};

interface ICategory {
  id: number;
  name: string;
  subcategories: ISubcategory[];
};
// Customizable Area End
export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  token: string;
  categoriesArray: Record<string, any[]>;
  category: string;
  subCategory: string;
  isVisible: boolean;
  dropdownCategoryStatus: boolean;
  activeModalType: string;
  selectedCategoryID: any;
  activeTab: 0 | 1 | 2 | 3 | 4;
  artists: any[];
  states: Record<string, any>;
  showAltState: boolean;
  subcategories: any;
  selectedArtists: string[];
  influences: string[];
  affiliates: string[];
  defaultState: string;
  altState: string;
  fetching: boolean;
  userRole: string;
  firstTabTitle: string;
  secondTabTitle: string;
  thirdTabTitle: string;
  secondTabLabel: string;
  thirdTabLabel: string;
  title: string;
  affiliateTxt: string;
  showModal: boolean;
  modalSelectedValue: string;
  modalValues: any[];
  showStatePickerModal: boolean;
  isEditMode: boolean;
  fontSize: number;
  influenceTxt: string;
  rulesAndRegulations: any[];
  selectedRulesAndRegulationsIds: number[];
  selectedRulesAndRegulationsTexts: string[];
  customRules: string[]; // Track custom rules that have been added (regardless of selection)
  customRuleTxt: string;
  accountType: string;
  roster: string[];
  rosterTxt: string;
  userProfileData: any;
  pendingUpdateInfluencesAffiliates: boolean;
  categoriesSaved: boolean;
  influencesSaved: boolean;
  bandsArtistsSaved: boolean;
  isDarkMode: boolean;
  // Customizable Area End
}

interface SS {
  id: any;
}

export default class CategoriessubcategoriesController extends BlockComponent<
  Props,
  S,
  SS
> {
  getCategoriesApiCallId: any;
  deleteCategoriesApiCallId: any;
  deleteSubCategoriesApiCallId: any;
  addCategoryApiCallId: any;
  addSubCategoryApiCallId: any;
  getRulesAndRegulationsApiCallId: any;
  getUserSelectedRulesAndRegulationsApiCallId: any;
  updateRulesAndRegulationsApiCallId: any;
  updateRostersApiCallId: any;
  updateInfluencesAndAffiliatesApiCallId: any;
  getUserProfileApiCallId: any;
  willFocusUnsubscribe?: () => void;
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
    ];

    this.state = {
      token: "",
      categoriesArray: {},
      category: "",
      subCategory: "",
      isVisible: false,
      dropdownCategoryStatus: false,
      activeModalType: "",
      selectedCategoryID: [],
      activeTab: 0,
      artists: [],
      states: [],
      showAltState: false,
      subcategories: {},
      selectedArtists: [],
      influences: [],
      affiliates: [],
      defaultState: "",
      altState: "",
      fetching: false,
      userRole: "fan",
      firstTabTitle: "",
      secondTabTitle: "",
      thirdTabTitle: "",
      secondTabLabel: "",
      thirdTabLabel: "",
      title: "",
      affiliateTxt: "",
      showModal: false,
      modalSelectedValue: "",
      modalValues: [],
      showStatePickerModal: false,
      fontSize: 0,
      isEditMode: false,
      influenceTxt: "",
      rulesAndRegulations: [],
      selectedRulesAndRegulationsIds: [],
      selectedRulesAndRegulationsTexts: [],
      customRules: [],
      customRuleTxt: "",
      accountType: "",
      roster: [],
      rosterTxt: "",
      userProfileData: null,
      pendingUpdateInfluencesAffiliates: false,
      categoriesSaved: false,
      influencesSaved: false,
      bandsArtistsSaved: false,
      isDarkMode: true,
    };
    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  // Customizable Area Start
  getArtistsApiCallId: any;
  getStatesApiCallId: any;
  saveDataAPICallId: any;
  saveCategoriesApiCallId: any;

  modalCallback = (_: string) => { }

  isProfileNotFoundError = (responseJson: any): boolean => {
    if (!responseJson?.errors) {
      return false;
    }
    const errorText =
      typeof responseJson.errors === "string"
        ? responseJson.errors
        : JSON.stringify(responseJson.errors);
    return errorText.toLowerCase().includes("profile does not exist");
  };

  shouldSuppressSignupProfileError = (responseJson: any): boolean => {
    if (!responseJson?.errors) {
      return false;
    }
    if (!this.state.isEditMode) {
      return true;
    }
    return this.isProfileNotFoundError(responseJson);
  };

  resolveFromProfile = async (): Promise<boolean> => {
    const navigationParams =
      this.props.navigation?.state?.params ||
      (this.props as any).route?.params ||
      {};
    if (navigationParams?.fromProfile === true) {
      return true;
    }
    if (!this.state.isEditMode) {
      return false;
    }
    const fromProfileStorage = await getStorageData("categoriesFromProfile");
    return fromProfileStorage === "true";
  };

  shouldHideRulesAndRegulationsTab = (): boolean => {
    // Account types that should show Rules and Regulations tab
    const rulesAccountTypes = [
      'Venue',
      'Club',
      'Bar',
      'Gallery',
      'Casino',
      'Cabaret',
      'Record_Store',
      'Theater',
      'Museum',
    ];
    
    // Account types that should show Roster tab (hidden from Rules tab)
    const hiddenAccountTypes = [
      'Record Label',
      'Record_Label',
      'Promoter',
      'Booking_Agent',
      'Agency',
    ];
    
    // If account type is in the rules list, show Rules tab (return false)
    if (rulesAccountTypes.includes(this.state.accountType)) {
      return false;
    }
    
    // If account type is in the hidden list, show Roster tab (return true)
    if (hiddenAccountTypes.includes(this.state.accountType)) {
      return true;
    }
    
    // If userRole is venue but accountType is not in rules list, show Roster tab
    if (this.state.userRole === 'venue') {
      console.log("🔍 Venue user with account type not in rules list - showing Roster tab");
      return true;
    }
    
    return false;
  }

  goBack = async () => {
    // Store influences and affiliates before going back
    await setStorageData("updated_influences", JSON.stringify(this.state.influences));
    await setStorageData("updated_affiliates", JSON.stringify(this.state.affiliates));
    console.log('🔙 Going back - stored updated influences and affiliates');

    if (this.props.navigation?.goBack) {
      this.props.navigation.goBack();
    }
  };

  async componentDidMount() {
    super.componentDidMount();
    // Check edit mode first and clear influences/affiliates if in create mode
    await this.handleEditMode();
    this.updateBottomTabVisibility();
    this.getToken();
    // Load user role and set tab labels on initial mount
    this.getUserRole();

    this.loadCategoriesTheme();

    this.willFocusUnsubscribe = this.props.navigation.addListener("willFocus", () => {
      this.handleEditMode();
      this.updateBottomTabVisibility();
      this.getToken();
      this.getUserRole();
    });
  }

  componentDidUpdate(_prevProps: Readonly<Props>, prevState: Readonly<S>) {
    if (prevState.isEditMode !== this.state.isEditMode) {
      this.updateBottomTabVisibility();
    }
  }

  async componentWillUnmount() {
    if (this.willFocusUnsubscribe) {
      this.willFocusUnsubscribe();
      this.willFocusUnsubscribe = undefined;
    }
    if (this.profileThemeListener) {
      this.profileThemeListener.remove();
      this.profileThemeListener = null;
    }
    this.showBottomTabBar();
  }

  profileThemeListener: any = null;

  loadCategoriesTheme = async () => {
    const savedTheme = await getStorageData(PROFILE_THEME_STORAGE_KEY);
    this.setState({ isDarkMode: savedTheme !== "false" });
    if (!this.profileThemeListener) {
      this.profileThemeListener = DeviceEventEmitter.addListener(
        PROFILE_THEME_CHANGED_EVENT,
        (isDarkMode: boolean) => {
          this.setState({ isDarkMode });
        },
      );
    }
  };

  getCategoriesTheme = () => {
    return this.state.isDarkMode ? redesignTheme : lightTheme;
  };

  updateFontSize = () => {
    const { title } = this.state;
    const deviceWidth = Dimensions.get('window').width;
    const maxWidth = deviceWidth - 40;
    let fontSize = 28;

    const measureTextWidth = (text: string, fontSize: number) => {
      const textWidth = text.length * (fontSize * 0.6);
      return textWidth;
    };
    let textWidth = measureTextWidth(title, fontSize);
    while (textWidth > maxWidth && fontSize > 10) {
      fontSize -= 1;
      textWidth = measureTextWidth(title, fontSize);
    }

    this.setState({ fontSize });
  };

  getToken = async () => {
    const token = await getStorageData("authToken");
    const accountType = await getStorageData("account_type") || "";

    await this.handleEditMode();

    this.setState({ token: token, accountType: accountType }, () => {
      this.getCategories();
      this.getArtists();
      this.getStates();
      this.getRulesAndRegulations();

      // Only load profile data in edit mode — new signups have no profile yet
      if (token && this.state.isEditMode) {
        this.getUserProfile();
        const navigationParams = this.props.navigation?.state?.params ||
          (this.props as any).route?.params || {};
        if (navigationParams?.fromProfile === true) {
          this.getUserSelectedRulesAndRegulations();
        }
      }
    });
  };

  handleEditMode = async () => {
    const isEditMode = await getStorageData("categoriesEditMode");
    // Check if navigating from profile screen (params or storage flag)
    const navigationParams = this.props.navigation?.state?.params ||
                             (this.props as any).route?.params || {};
    const fromProfileParam = navigationParams?.fromProfile === true;
    const fromProfileStorage = await getStorageData("categoriesFromProfile");
    const fromProfile =
      fromProfileParam || (isEditMode === "true" && fromProfileStorage === "true");

    if (isEditMode === "true") {
      this.setState({ isEditMode: true }, this.updateBottomTabVisibility);
      if (!fromProfile) {
        this.loadCategoriesData();
      } else {
        // From profile (incl. fan): load categories/artists from storage so they auto-select; API response won't overwrite with empty
        this.loadInitialCategoriesFromProfileStorage();
      }
    } else {
      // In create mode, clear influences and affiliates to prevent old values from showing
      this.setState(
        { isEditMode: false, influences: [], affiliates: [] },
        this.updateBottomTabVisibility
      );
    }
  }

  updateBottomTabVisibility = () => {
    const parentNavigator = (this.props as any).navigation?.getParent?.();
    if (!parentNavigator?.setOptions) return;

    parentNavigator.setOptions({
      tabBarStyle: this.state.isEditMode ? undefined : { display: 'none' },
    });
  };

  showBottomTabBar = () => {
    const parentNavigator = (this.props as any).navigation?.getParent?.();
    if (!parentNavigator?.setOptions) return;

    parentNavigator.setOptions({
      tabBarStyle: undefined,
    });
  };

  loadCategoriesData = async () => {
    this.setState({ isEditMode: true });
    let categoriesData: any[] = [];
    let artistsList: string[] = [];

    try {
      const categoriesRaw = await getStorageData("categoriesData");
      const parsedCategories = categoriesRaw ? JSON.parse(categoriesRaw) : [];
      categoriesData = Array.isArray(parsedCategories) ? parsedCategories : [];
    } catch {
      categoriesData = [];
    }

    try {
      const artistsRaw = await getStorageData("artistsList");
      const parsedArtists = artistsRaw ? JSON.parse(artistsRaw) : [];
      artistsList = Array.isArray(parsedArtists) ? parsedArtists : [];
    } catch {
      artistsList = [];
    }

    await removeStorageData("categoriesEditMode");
    await removeStorageData("categoriesData");
    await removeStorageData("artistsList");

    let tmpObject = {};

    categoriesData.forEach((category: any) => {
      tmpObject = {
        ...tmpObject,
        [category.name]: category.user_sub_categories.map((item: any) => item.name),
      }
    })
    this.setState({ subcategories: tmpObject, selectedArtists: artistsList, categoriesSaved: true });
  }

  /** When from profile (incl. fan): load categories and band artists from storage so they auto-select; preserved when API returns empty. */
  loadInitialCategoriesFromProfileStorage = async () => {
    try {
      const categoriesDataStr = await getStorageData("categoriesData");
      const artistsListStr = await getStorageData("artistsList");
      const subcategoriesMap: any = {};

      if (categoriesDataStr) {
        const categoriesData = JSON.parse(categoriesDataStr);
        if (Array.isArray(categoriesData) && categoriesData.length > 0) {
          categoriesData.forEach((userCategory: any) => {
            const category = userCategory?.category ?? userCategory;
            const categoryName = category?.name;
            const subCategories = category?.user_sub_categories || [];
            if (categoryName && subCategories.length > 0) {
              const subCategoryNames = subCategories.map((subCat: any) => {
                const sc = subCat?.sub_category ?? subCat;
                return sc?.name ?? subCat;
              }).filter((name: any) => name);
              if (subCategoryNames.length > 0) {
                subcategoriesMap[categoryName] = subCategoryNames;
              }
            }
          });
        }
      }

      let artistsList: string[] = [];
      if (artistsListStr) {
        try {
          const parsed = JSON.parse(artistsListStr);
          artistsList = Array.isArray(parsed)
            ? parsed.map((a: any) => (typeof a === "string" ? a : a?.name ?? a)).filter((n: any) => n)
            : [];
        } catch (_) {
          artistsList = [];
        }
      }

      if (Object.keys(subcategoriesMap).length > 0 || artistsList.length > 0) {
        console.log("Auto-selecting categories from profile storage (incl. fan):", subcategoriesMap, "artists:", artistsList);
        this.setState({
          subcategories: subcategoriesMap,
          selectedArtists: artistsList,
          categoriesSaved: true,
          ...(artistsList.length > 0 ? { bandsArtistsSaved: true } : {}),
        });
      }
    } catch (e) {
      console.log("Could not load initial categories from profile storage:", e);
    }
  }

  getUserRole = async () => {
    const userRole = await getStorageData("userRole");
    if (userRole === "band") {
      this.setState({
        firstTabTitle: "Describe what you do",
        secondTabTitle: "Choose your influences",
        thirdTabTitle: "Choose your Professional Links",
        secondTabLabel: "Influences",
        thirdTabLabel: "Affiliates",
        title: "Describe what you do",
      })
    } else if (userRole === "venue") {
      this.setState({
        firstTabTitle: "Describe your business",
        secondTabTitle: "Choose your influences",
        secondTabLabel: "Influences",
        thirdTabLabel: "Affiliates",
        title: "Describe your business",
      })
    } else {
      this.setState({
        firstTabTitle: "Tell us what you like",
        secondTabTitle: "Tell us what you like",
        thirdTabTitle: "Tell us what you like",
        secondTabLabel: "Bands/Artists",
        thirdTabLabel: "States",
        title: "Tell us what you like",
      })
    }
    this.setState({ userRole }, () => {
      this.updateFontSize();

    });
  }
  // Customizable Area End

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) {
      this.handleNavigationPayload(message)
    } else if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      this.handleRestAPIResponse(message)
    }
    // Customizable Area End
  }

  // Customizable Area Start
  handleNavigationPayload = (message: Message) => {
    const payloadData = message.getData(getName(MessageEnum.HelpCentreMessageData));
    console.log('📥 CategoriesSubCategories received navigation payload:', payloadData);

    // Only set influences and affiliates in edit mode, clear them in create mode
    if (this.state.isEditMode) {
      if (payloadData?.affiliates) {
        console.log('✅ Setting affiliates (edit mode):', payloadData.affiliates);
        this.setState({ affiliates: payloadData.affiliates })
      }
      if (payloadData?.influences) {
        console.log('✅ Setting influences (edit mode):', payloadData.influences);
        this.setState({ influences: payloadData.influences, influencesSaved: true });
      }
    } else {
      // In create mode, ensure influences and affiliates are empty
      console.log('🧹 Create mode: Clearing influences and affiliates');
      this.setState({ influences: [], affiliates: [] })
    }
  }

  handleRestAPIResponse = async (message: Message) => {
    const apiRequestCallId = message.getData(
      getName(MessageEnum.RestAPIResponceDataMessage)
    );

    const responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );

    if (apiRequestCallId === this.getStatesApiCallId) {
      this.handleGetStatesResponse(responseJson);
      return;
    }

    if (apiRequestCallId === this.getRulesAndRegulationsApiCallId) {
      this.handleGetRulesAndRegulationsResponse(responseJson);
      return;
    }

    if (apiRequestCallId === this.getUserSelectedRulesAndRegulationsApiCallId) {
      this.handleGetUserSelectedRulesAndRegulationsResponse(responseJson);
      return;
    }

    if (apiRequestCallId === this.updateRulesAndRegulationsApiCallId) {
      this.handleUpdateRulesAndRegulationsResponse(responseJson);
      return;
    }

    if (apiRequestCallId === this.updateRostersApiCallId) {
      this.handleUpdateRostersResponse(responseJson);
      return;
    }

    if (apiRequestCallId === this.updateInfluencesAndAffiliatesApiCallId) {
      this.handleUpdateInfluencesAndAffiliatesResponse(responseJson);
      return;
    }

    if (apiRequestCallId === this.getUserProfileApiCallId) {
      this.handleGetUserProfileResponse(responseJson);
      return;
    }

    if (apiRequestCallId === this.saveCategoriesApiCallId) {
      this.handleSaveCategoriesResponse(responseJson);
      return;
    }

    // Save data (tab 4 - States): always stop loading; on success navigate to profile or home
    if (apiRequestCallId === this.saveDataAPICallId) {
      const fallbackId = (this as any)._saveStatesFallbackNavId;
      if (fallbackId) {
        clearTimeout(fallbackId);
        (this as any)._saveStatesFallbackNavId = null;
      }
      this.setState({ fetching: false });
      // Only treat as error when we have a definite non-empty errors array (fan sign-up must still navigate to home on success)
      const hasErrors = responseJson != null &&
        Array.isArray(responseJson.errors) &&
        responseJson.errors.length > 0;
      if (hasErrors) {
        console.log("error", responseJson.errors);
        return;
      }
      // Persist selected states for events screen before navigating
      this.persistUserStatesForEventsScreen().catch(() => {});
      this.navigateAfterSaveStates();
      return;
    }

    if (responseJson.data) {
      if (apiRequestCallId === this.getCategoriesApiCallId) {
        this.setState({ categoriesArray: responseJson.data, fetching: false });
      } else if (apiRequestCallId === this.getArtistsApiCallId) {
        this.setState({ artists: responseJson.data, fetching: false });
      }
    } else if (responseJson.errors) {
      console.log("error", responseJson.errors);
    }
  }

  persistUserStatesForEventsScreen = async () => {
    const defaultStateObject = this.state.states.find((item: any) => item.key === this.state.defaultState);
    const defaultStateName = defaultStateObject ? defaultStateObject.name : "";
    const otherStateObject = this.state.states.find((item: any) => item.key === this.state.altState);
    const otherStateName = otherStateObject ? otherStateObject.name : "";
    const altName = this.state.showAltState ? otherStateName : "";
    const stateNames = [defaultStateName, altName].filter(Boolean);
    if (stateNames.length > 0) {
      await setStorageData("user_selected_states_events", JSON.stringify(stateNames));
    }
  };

  navigateAfterSaveStates = async () => {
    const navigationParams = this.props.navigation?.state?.params ||
      (this.props as any).route?.params || {};
    const fromProfile = await this.resolveFromProfile();
    if (fromProfile) {
      await removeStorageData('categoriesFromProfile');
      if (this.props.navigation?.goBack) {
        this.props.navigation.goBack();
      } else {
        this.backToHomeScreen();
      }
    } else {
      this.backToHomeScreen();
    }
  }

  getStateNameForPicker = (value: string) => {
    if (value) {
      return (this.state.states.filter((item: any) => item.key === value)[0]?.name);
    } else {
      return "Select a state";
    }
  }

  backToHomeScreen = async () => {
    await removeStorageData('popupShown');
    setStorageData('redirectionNav', 'Home');
    const tokenMsg = new Message(
      getName(MessageEnum.AuthTokenEmailMessage)
    );
    tokenMsg.addData("token", this.state.token);
    runEngine.sendMessage(tokenMsg.id, tokenMsg);
    // Use Message-based navigation so NavigationBlock performs navigate (works from any stack)
    const homeScreenNavMsg = new Message(getName(MessageEnum.NavigationMessage));
    homeScreenNavMsg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    homeScreenNavMsg.addData(getName(MessageEnum.NavigationTargetMessage), "HomeTab");
    this.send(homeScreenNavMsg);
    // Direct navigation: from root stack (e.g. sign-up flow) go to "Home" screen; otherwise use HomeTab
    if (this.props.navigation && typeof this.props.navigation.navigate === 'function') {
      try {
        this.props.navigation.navigate("Home");
      } catch (_) {
        try {
          this.props.navigation.navigate("HomeTab", {
            screen: "HomeFeed",
            params: { screen: "Home" },
          });
        } catch (__) {
          this.props.navigation.navigate("HomeTab");
        }
      }
    }
  }

  handleTabSwitch = (tab: number) => {
    if (tab === 0) {
      this.setState({ activeTab: 0, title: this.state.firstTabTitle }, () => {
        this.updateFontSize()
      });
    } else if (tab === 1) {
      // Influences (band/artist) or Bands/Artists (fan): only allow switch if categories have been saved
      if (!this.state.categoriesSaved) {
        return;
      }
      this.setState({ activeTab: 1, title: this.state.secondTabTitle }, () => {
        this.updateFontSize()
      });
    } else if (tab === 2) {
      // Affiliates tab: only allow switch if categories saved and user has clicked Save on Influences tab
      if (this.state.thirdTabLabel === 'Affiliates') {
        if (!this.state.categoriesSaved) return;
        if (!this.state.influencesSaved) return;
      }
      this.setState({ activeTab: 2, title: this.state.thirdTabTitle }, () => {
        this.updateFontSize()
      });
    } else if (tab === 3) {
      // Rules and Regulations tab: only allow switch if categories have been saved
      if (!this.shouldHideRulesAndRegulationsTab() && !this.state.categoriesSaved) {
        return;
      }
      const tabTitle = this.shouldHideRulesAndRegulationsTab() ? "Roster" : "Rules and Regulations";
      this.setState({ activeTab: 3, title: tabTitle }, () => {
        this.updateFontSize()
      });
      // Call user profile API when Rules and Regulations tab is selected
      if (!this.shouldHideRulesAndRegulationsTab()) {
        this.getUserProfile();
        // Also call API to get user's selected rules and regulations
        this.getUserSelectedRulesAndRegulations();
      }
    } else if (tab === 4) {
      // States tab (fan only): only allow switch if categories saved and Bands/Artists saved (Next clicked)
      if (!this.state.categoriesSaved) {
        return;
      }
      if (!this.state.bandsArtistsSaved) {
        return;
      }
      this.setState({ activeTab: 4, title: "States" }, () => {
        this.updateFontSize()
      });
    }
  }

  handleGetStatesResponse = async (responseJson: any) => {
    if (!responseJson.errors && responseJson.state) {
      const { state } = responseJson;
      const statesList = Object.keys(state).map(key => {
        return {
          key,
          name: state[key]
        }
      })
      const alternateState = await getStorageData("alternate_state");
      const userState = await getStorageData("user_state");
      removeStorageData("user_state");
      removeStorageData("alternate_state");
      const selectedStateObject = statesList.find(
        (item) => item.key === userState || item.name === userState
      );
      const selectedStateKey = selectedStateObject
        ? selectedStateObject.key
        : "";

      const selectedAltStateObject = statesList.find(
        (item) => item.key === alternateState || item.name === alternateState
      );
      const selectedAltStateKey = selectedAltStateObject
        ? selectedAltStateObject.key
        : "";
      this.setState({
        states: statesList,
        fetching: false,
        defaultState: selectedStateKey,
        altState: selectedAltStateKey,
        showAltState: selectedAltStateKey !== ""
      });
    } else {
      console.log("States data missing or error:", responseJson);
      this.setState({ fetching: false });
      if (responseJson.errors) {
        this.parseApiErrorResponse(responseJson);
      }
    }
  }

  handleAddAffiliate = () => {
    if (!this.state.affiliateTxt) {
      return;
    }

    if (!this.state.affiliates.includes(this.state.affiliateTxt)) {
      this.setState({
        affiliates: [...this.state.affiliates, this.state.affiliateTxt],
        affiliateTxt: "",
      });
    }
  }

  handleRemoveAffiliate = async (itemToRemove: string) => {
    let items = [...this.state.affiliates];
    let affiliates = items.filter((item: string) => item !== itemToRemove);
    this.setState({ affiliates });
  }

  handleArtistSelection = () => {
    const trimmedText = this.state.influenceTxt.trim();
    if (trimmedText !== "") {
      if (this.state.userRole === "fan") {
        if (!this.state.selectedArtists.includes(trimmedText)) {
          this.setState({ influenceTxt: "", selectedArtists: [...this.state.selectedArtists, trimmedText] });
        }
      } else if (this.state.userRole === "band" || this.state.userRole === "venue") {
        if (!this.state.influences.includes(trimmedText)) {
          this.setState({ influenceTxt: "", influences: [...this.state.influences, trimmedText] });
        }
      }
    } else {
      this.setState({ influenceTxt: "" })
    }
  }

  handleRemoveArtist = async (itemToRemove: string) => {
    if (this.state.userRole === "fan") {
      let items = [...this.state.selectedArtists];
      let selectedArtists = items.filter((item: string) => item !== itemToRemove);
      this.setState({ selectedArtists });
    } else if (this.state.userRole === "band" || this.state.userRole === "venue") {
      let items = [...this.state.influences];
      let influences = items.filter((item: string) => item !== itemToRemove);
      this.setState({ influences });
    }
  }

  handleAddCustomRule = () => {
    const customRuleText = this.state.customRuleTxt.trim();
    if (customRuleText !== "") {
      // Check if this custom rule has already been added
      const currentCustomRules = this.state.customRules;
      if (!currentCustomRules.includes(customRuleText)) {
        // Add to custom rules list and automatically select it
        const updatedCustomRules = [...currentCustomRules, customRuleText];
        const currentSelectedTexts = this.state.selectedRulesAndRegulationsTexts;
        const updatedSelectedTexts = currentSelectedTexts.includes(customRuleText) 
          ? currentSelectedTexts 
          : [...currentSelectedTexts, customRuleText];
        
        this.setState({
          customRules: updatedCustomRules,
          selectedRulesAndRegulationsTexts: updatedSelectedTexts,
          customRuleTxt: ""
        }, () => {
          console.log("✅ Custom rule added:", customRuleText);
          console.log("✅ All custom rules:", this.state.customRules);
          console.log("✅ All selected rules texts:", this.state.selectedRulesAndRegulationsTexts);
        });
      } else {
        // Rule already exists, just clear the input
        this.setState({ customRuleTxt: "" });
        console.log("⚠️ Custom rule already exists:", customRuleText);
      }
    }
  }

  handleToggleCustomRuleSelection = (ruleText: string) => {
    const currentSelectedTexts = this.state.selectedRulesAndRegulationsTexts;
    const index = currentSelectedTexts.indexOf(ruleText);
    
    if (index !== -1) {
      // Remove if already selected
      this.setState({
        selectedRulesAndRegulationsTexts: currentSelectedTexts.filter(text => text !== ruleText)
      });
    } else {
      // Add if not selected
      this.setState({
        selectedRulesAndRegulationsTexts: [...currentSelectedTexts, ruleText]
      });
    }
  }

  handleRemoveCustomRule = (ruleTextToRemove: string) => {
    // Remove from custom rules list and selected texts
    const updatedCustomRules = this.state.customRules.filter(
      (text: string) => text !== ruleTextToRemove
    );
    const updatedTexts = this.state.selectedRulesAndRegulationsTexts.filter(
      (text: string) => text !== ruleTextToRemove
    );
    this.setState({
      customRules: updatedCustomRules,
      selectedRulesAndRegulationsTexts: updatedTexts
    });
    console.log("✅ Custom rule removed:", ruleTextToRemove);
  }

  handleAddRosterItem = () => {
    if (this.state.rosterTxt.trim() !== "") {
      if (!this.state.roster.includes(this.state.rosterTxt.trim())) {
        this.setState({
          roster: [...this.state.roster, this.state.rosterTxt.trim()],
          rosterTxt: ""
        });
      }
    }
  }

  handleRemoveRosterItem = (itemToRemove: string) => {
    const updatedRoster = this.state.roster.filter((item: string) => item !== itemToRemove);
    this.setState({ roster: updatedRoster });
  }

  handleSubCatSelection = (cat: string, subCat: string) => {
    if (!this.state.subcategories[cat]) {
      this.setState({
        subcategories: {
          ...this.state.subcategories,
          [cat]: [subCat]
        }
      })
    } else if (!this.state.subcategories[cat].includes(subCat)) {
      this.setState({
        subcategories: {
          ...this.state.subcategories,
          [cat]: [...this.state.subcategories[cat], subCat]
        }
      })
    }
  }

  handleRemoveSubcat = async (category: string, itemToRemove: string) => {
    let items = { ...this.state.subcategories };
    let filteredItems = items[category].filter((item: string) => item !== itemToRemove);
    this.setState({
      subcategories: {
        ...items,
        [category]: filteredItems,
      }
    })
  }

  getCategories = () => {

    if (!this.state.token) {
      return;
    }

    this.setState({ fetching: true });

    const header = {
      "Content-Type": configJSON.categoryApiContentType,
      token: this.state.token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getCategoriesApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.categoryAPIEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetType
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  getArtists = () => {

    if (!this.state.token) {
      return;
    }

    this.setState({ fetching: true });

    const headerParams = {
      "Content-Type": configJSON.categoryApiContentType,
      token: this.state.token
    };
    const msg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getArtistsApiCallId = msg.messageId;

    msg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.artistsAPIEndpoint
    );
    msg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headerParams)
    );

    msg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetType
    );

    runEngine.sendMessage(msg.id, msg);
  };

  getStates(): boolean {
    this.setState({ fetching: true });
    const header = {
      "Content-Type": configJSON.categoryApiContentType,
    };
    const getStatesRequestMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getStatesApiCallId = getStatesRequestMsg.messageId;

    getStatesRequestMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getStatesApiEndpoint + "US"
    );

    getStatesRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    getStatesRequestMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetType
    );

    runEngine.sendMessage(getStatesRequestMsg.id, getStatesRequestMsg);

    return true;
  }

  getUserCategories = (data: any, selectedSubCategories: any) => {
    const userCategories: any = [];

    Object.keys(data).forEach((category) => {
      const subCategories = data[category].filter((subCategory: any) =>
        selectedSubCategories.includes(subCategory.attributes.name)
      );

      if (subCategories.length > 0) {
        userCategories.push({
          category_id: subCategories[0].attributes.parent_id,
          sub_categories: subCategories.map((subCategory: any) => ({
            sub_category_id: subCategory.attributes.id
          }))
        });
      }
    });

    return userCategories;
  };

  handleSaveCategories = async () => {
    if (!this.state.token) {
      return;
    }

    // Check if user came from profile (params or storage)
    const navigationParams = this.props.navigation?.state?.params ||
                             (this.props as any).route?.params || {};
    const fromProfile = await this.resolveFromProfile();

    // If coming from profile screen, always save to profile API
    // Otherwise, if not in edit mode (i.e., Signup), save categories to AsyncStorage and navigate
    if (!fromProfile && !this.state.isEditMode) {
      console.log("💾 Creation mode: Saving categories to AsyncStorage");
      
      // Save the subcategories object which contains all selected categories and their subcategories
      // Format: { "Art": ["Ceramic", "Architecture"], "Music": ["Country Music"], ... }
      await setStorageData("savedCategoriesAndSubcategories", JSON.stringify(this.state.subcategories));
      
      console.log("✅ Saved categories to AsyncStorage:");
      console.log("  - Categories and Subcategories:", this.state.subcategories);
      
      // Next tab: venue → Rules/Roster (tab 3); fan/band/artist → Bands/Artists or Influences (tab 1)
      if (this.state.userRole === 'venue') {
        const tabTitle = this.shouldHideRulesAndRegulationsTab() ? "Roster" : "Rules and Regulations";
        this.setState({ categoriesSaved: true, activeTab: 3, title: tabTitle }, () => {
          this.updateFontSize();
          if (!this.shouldHideRulesAndRegulationsTab()) {
            this.getUserProfile();
            this.getUserSelectedRulesAndRegulations();
          }
        });
      } else {
        this.setState(
          { categoriesSaved: true, activeTab: 1, title: this.state.secondTabTitle },
          () => this.updateFontSize()
        );
      }
      return;
    }

    // Save to profile API (for both edit mode and when coming from profile screen)
    this.setState({ fetching: true });

    // Extract category names and subcategory names from subcategories state
    // subcategories format: { "Art": ["Ceramic", "Architecture"], "Music": ["Country Music"] }
    const categoryNames: string[] = [];
    const subcategoryNames: string[] = [];
    
    Object.keys(this.state.subcategories).forEach((categoryName) => {
      const subcats = this.state.subcategories[categoryName];
      if (subcats && Array.isArray(subcats) && subcats.length > 0) {
        categoryNames.push(categoryName);
        subcats.forEach((subcat: string) => {
          subcategoryNames.push(subcat);
        });
      }
    });

    console.log("💾 Saving categories to profile:");
    console.log("  - Category names:", categoryNames);
    console.log("  - Subcategory names:", subcategoryNames);
    console.log("  - From profile:", fromProfile);
    console.log("  - Edit mode:", this.state.isEditMode);
    // return
    // Use update_profile endpoint with PATCH method, using same format as CreateYourProfile
    // Format: { "profile": { "categories": [...], "subcategories": [...] } }
    const data: any = {
      "profile": {}
    };

    // Add categories array (array of category names)
    if (categoryNames.length > 0) {
      data.profile.categories = categoryNames;
    } else {
      data.profile.categories = [];
    }

    // Add subcategories array (array of subcategory names)
    if (subcategoryNames.length > 0) {
      data.profile.subcategories = subcategoryNames;
    } else {
      data.profile.subcategories = [];
    }

    const header = {
      "Content-Type": configJSON.categoryApiContentType,
      token: this.state.token,
    };

    const saveCategoriesReqMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.saveCategoriesApiCallId = saveCategoriesReqMsg.messageId;

    saveCategoriesReqMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.updateProfileEndpoint
    );

    saveCategoriesReqMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    saveCategoriesReqMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPatchType
    );

    saveCategoriesReqMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(data)
    );

    runEngine.sendMessage(saveCategoriesReqMsg.id, saveCategoriesReqMsg);

    // Switch to next tab immediately (Bands/Artists or Influences) so user is not stuck on categories
    if (this.state.userRole === 'venue') {
      const tabTitle = this.shouldHideRulesAndRegulationsTab() ? "Roster" : "Rules and Regulations";
      this.setState({ activeTab: 3, title: tabTitle }, () => {
        this.updateFontSize();
        if (!this.shouldHideRulesAndRegulationsTab()) {
          this.getUserProfile();
          this.getUserSelectedRulesAndRegulations();
        }
      });
    } else {
      this.setState(
        { activeTab: 1, title: this.state.secondTabTitle },
        () => this.updateFontSize()
      );
    }

    return true;
  };

  handleSaveCategoriesResponse = (responseJson: any) => {
    this.setState({ fetching: false });

    console.log("📥 Categories save response:", responseJson);

    // Check if user came from Customisableuserprofiles2 (profile screen)
    const navigationParams = this.props.navigation?.state?.params || 
                             (this.props as any).route?.params || {};
    const fromProfile = navigationParams?.fromProfile === true;

    if (responseJson.errors) {
      console.log("Error saving categories:", responseJson.errors);
      const normalizedErrorText =
        typeof responseJson.errors === "string"
          ? responseJson.errors.toLowerCase()
          : JSON.stringify(responseJson.errors).toLowerCase();
      const isProfileUpdateNotAllowedError =
        normalizedErrorText.indexOf("account is not allowed to update a profile") !== -1;

      if (isProfileUpdateNotAllowedError || this.shouldSuppressSignupProfileError(responseJson)) {
        console.log("ℹ️ Suppressing categories profile API alert during signup.");
        return;
      }

      this.parseApiErrorResponse(responseJson);
    } else {
      console.log("✅ Categories saved successfully");

      // Navigate to next tab after successful save
      if (this.state.userRole === 'venue') {
        // Venue: skip to Rules and Regulations / Roster (tab 3)
        const tabTitle = this.shouldHideRulesAndRegulationsTab() ? "Roster" : "Rules and Regulations";
        this.setState({ categoriesSaved: true, activeTab: 3, title: tabTitle }, () => {
          this.updateFontSize();
          if (!this.shouldHideRulesAndRegulationsTab()) {
            this.getUserProfile();
            this.getUserSelectedRulesAndRegulations();
          }
        });
      } else {
        // Fan: Bands/Artists tab (tab 1). Band/artist: Influences tab (tab 1).
        this.setState(
          { categoriesSaved: true, activeTab: 1, title: this.state.secondTabTitle },
          () => this.updateFontSize()
        );
      }
    }
  };

  handleSaveData = async () => {
    if (!this.state.token) {
      return;
    }
    this.setState({ fetching: true });

    const defaultStateObject = this.state.states.find((item: any) => item.key === this.state.defaultState);
    const defaultStateName = defaultStateObject ? defaultStateObject.name : "";

    const otherStateObject = this.state.states.find((item: any) => item.key === this.state.altState);
    const otherStateName = otherStateObject ? otherStateObject.name : "";
    const altName = this.state.showAltState ? otherStateName : ""

    // Store influences and affiliates for bi-directional sync with CreateYourProfile
    await setStorageData("updated_influences", JSON.stringify(this.state.influences));
    await setStorageData("updated_affiliates", JSON.stringify(this.state.affiliates));
    console.log('💾 Stored updated influences and affiliates for CreateYourProfile sync');
    console.log('  - Influences:', this.state.influences);
    console.log('  - Affiliates:', this.state.affiliates);

    const selectedSubCategories = Object.values(this.state.subcategories).reduce((acc: any[], val: any) => acc.concat(val), []);
    const userCategories = this.getUserCategories(this.state.categoriesArray, selectedSubCategories)
    const data = {
      "user_categories": userCategories,
      "band_artists": this.state.selectedArtists,
      "states": [defaultStateName, altName],
      "influences": this.state.influences,
      "affiliates": this.state.affiliates,
      "rules_and_regulations_icon_ids": this.state.selectedRulesAndRegulationsIds,
    }

    const endpoint = this.state.isEditMode ? configJSON.updateCategoriesSubcategories : configJSON.saveDataAPIEndpoint
    const methodType = this.state.isEditMode ? configJSON.httpPutType : configJSON.httpPostType

    const header = {
      "Content-Type": configJSON.categoryApiContentType,
      token: this.state.token,
    };


console.log("here is data", data,endpoint);



// return
    const saveDataReqMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.saveDataAPICallId = saveDataReqMsg.messageId;

    saveDataReqMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint
    );

    saveDataReqMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    saveDataReqMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      methodType
    );

    saveDataReqMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(data)
    );

    runEngine.sendMessage(saveDataReqMsg.id, saveDataReqMsg);

    // Fan create-account: fallback navigation if response is delayed/lost so user isn't stuck on States tab
    if (this.state.userRole === 'fan' && !this.state.isEditMode && this.state.activeTab === 4) {
      const fallbackNavId = setTimeout(() => {
        if (this.isLoaded && this.state.fetching) {
          this.setState({ fetching: false }, () => {
            this.persistUserStatesForEventsScreen().catch(() => {});
            this.navigateAfterSaveStates().catch(() => this.backToHomeScreen());
          });
        }
      }, 5000);
      (this as any)._saveStatesFallbackNavId = fallbackNavId;
    }

    return true;

  }

  handleAddNewCategory = () => {
    const msg: Message = new Message(getName(MessageEnum.NavigationMessage));
    msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    msg.addData(getName(MessageEnum.NavigationTargetMessage), "RequestManagement");
    this.send(msg);
  }

  handleRefresh = () => {
    this.getCategories()
  }

  hideModal = () => {
    this.setState({ showModal: false })
  }

  hideStatePickerModal = () => {
    this.setState({ showStatePickerModal: false })
  }

  handleNext = () => {
    // Check if we're on a roster tab and validate roster is not empty
    const isRosterTabOnTab1 = this.state.activeTab === 1 && this.state.secondTabLabel === "Roster";
    const isRosterTabOnTab3 = this.state.activeTab === 3 && this.shouldHideRulesAndRegulationsTab();
    
    if (isRosterTabOnTab1 || isRosterTabOnTab3) {
      // Validate that roster is not empty
      if (!this.state.roster || this.state.roster.length === 0) {
        Alert.alert(
          "Roster Required",
          "Please enter at least one roster item before proceeding to the next screen.",
          [{ text: "OK" }]
        );
        return;
      }
    }

    // If on tab 2 (Affiliates) and user role is band/Artist/venue, save influences and affiliates
    // For band and venue users: tab 1 = Influences, tab 2 = Affiliates
    // When clicking Save on Affiliates tab, save both influences and affiliates
    if (this.state.activeTab === 2 && (this.state.userRole === 'band' || this.state.userRole === 'Artist' || this.state.userRole === 'venue')) {
      this.handleSaveInfluencesAndAffiliates();
      return;
    }

    // If on tab 1 (Influences) and user role is band/Artist, save influences and affiliates
    // (Button shows "Save" for band/Artist users on Influences tab)
    if (this.state.activeTab === 1 && (this.state.userRole === 'band' || this.state.userRole === 'Artist')) {
      this.handleSaveInfluencesAndAffiliates();
      return;
    }

    // If on tab 1 (Bands/Artists) for fan users, navigate to States tab (tab 4)
    // For venue users on tab 1 (Influences), go to next tab (Affiliates) - button shows "Next"
    if (this.state.activeTab === 1) {
      if (this.state.userRole === 'fan') {
        this.setState({ bandsArtistsSaved: true, activeTab: 4, title: "States" }, () => {
          this.updateFontSize()
        });
        return;
      }
      // For venue users, continue to next tab (will be handled by the general navigation logic below)
    }

    // Determine the last tab index based on account type
    const isLastTab = this.shouldHideRulesAndRegulationsTab()
      ? this.state.activeTab === 3  // Last tab is Roster (tab 3)
      : this.state.activeTab === 3; // Last tab is Rules and Regulations (tab 3)

    // If on the last tab (Rules and Regulations), call the specific API
    if (isLastTab && !this.shouldHideRulesAndRegulationsTab()) {
      // This is the Rules and Regulations tab, call the update profile API
      this.handleSaveRulesAndRegulations();
    } else if (isLastTab && this.shouldHideRulesAndRegulationsTab()) {
      // This is the Roster tab, call the save rosters API
      this.handleSaveRosters();
    } else {
      // Otherwise, navigate to the next tab
      const nextTab = this.state.activeTab + 1;
      this.setState({ activeTab: nextTab as 0 | 1 | 2 | 3 | 4 }, () => {
        if (nextTab === 0) {
          this.setState({ title: this.state.firstTabTitle }, () => {
            this.updateFontSize()
          });
        } else if (nextTab === 1) {
          this.setState({ title: this.state.secondTabTitle }, () => {
            this.updateFontSize()
          });
        } else if (nextTab === 2) {
          this.setState({ title: this.state.thirdTabTitle }, () => {
            this.updateFontSize()
          });
        } else if (nextTab === 3) {
          const tabTitle = this.shouldHideRulesAndRegulationsTab() ? "Roster" : "Rules and Regulations";
          this.setState({ title: tabTitle }, () => {
            this.updateFontSize()
          });
        } else if (nextTab === 4) {
          this.setState({ title: "States" }, () => {
            this.updateFontSize()
          });
        }
      });
    }
  }

  getRulesAndRegulations = () => {
    if (!this.state.token) {
      return;
    }

    this.setState({ fetching: true });

    const header = {
      "Content-Type": configJSON.categoryApiContentType,
      token: this.state.token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getRulesAndRegulationsApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.rulesAndRegulationsEndpoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetType
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  handleGetRulesAndRegulationsResponse = (responseJson: any) => {
    if (responseJson.data && !responseJson.errors) {
      this.setState((prevState) => {
        const newRules = responseJson.data;
        
        // If we have selected texts but not all IDs matched, try to match them now
        const selectedTexts = prevState.selectedRulesAndRegulationsTexts || [];
        const existingSelectedIds = prevState.selectedRulesAndRegulationsIds || [];
        const matchedIds: number[] = [...existingSelectedIds];
        
        selectedTexts.forEach((title: string) => {
          // Find matching rule in the newly loaded rules
          const matchingRule = newRules.find((rule: any) => {
            const ruleTitle = rule.title || rule.attributes?.title;
            return ruleTitle === title;
          });
          
          if (matchingRule && !matchedIds.includes(matchingRule.id)) {
            matchedIds.push(matchingRule.id);
          }
        });
        
        return {
          rulesAndRegulations: newRules,
          selectedRulesAndRegulationsIds: matchedIds,
          fetching: false
        };
      });
    } else {
      console.log("error fetching rules and regulations", responseJson.errors);
      this.setState({ fetching: false });
    }
  }

  getUserSelectedRulesAndRegulations = () => {
    if (!this.state.token) {
      return;
    }

    this.setState({ fetching: true });

    const header = {
      "Content-Type": configJSON.categoryApiContentType,
      token: this.state.token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getUserSelectedRulesAndRegulationsApiCallId = requestMessage.messageId;

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.userSelectedRulesAndRegulationsEndpoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetType
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  handleGetUserSelectedRulesAndRegulationsResponse = async (responseJson: any) => {
    this.setState({ fetching: false });

    if (responseJson.data && !responseJson.errors && Array.isArray(responseJson.data)) {
      const selectedRuleTitles = responseJson.data;
      console.log("User selected rules and regulations:", selectedRuleTitles);

      // Match the selected rule titles with the rules in state and pre-select them
      const selectedIds: number[] = [];
      const selectedTexts: string[] = [];
      const customRulesFromApi: string[] = [];

      selectedRuleTitles.forEach((title: string) => {
        // Find matching rule in rulesAndRegulations array
        const matchingRule = this.state.rulesAndRegulations.find((rule: any) => {
          const ruleTitle = rule.title || rule.attributes?.title;
          return ruleTitle === title;
        });

        if (matchingRule) {
          const ruleId = matchingRule.id;
          if (!selectedIds.includes(ruleId)) {
            selectedIds.push(ruleId);
            selectedTexts.push(title);
          }
        } else {
          // If rule not found in API rules, it's a custom rule
          // Add it to selected texts and custom rules
          if (!selectedTexts.includes(title)) {
            selectedTexts.push(title);
          }
          if (!customRulesFromApi.includes(title)) {
            customRulesFromApi.push(title);
          }
        }
      });

      console.log("Pre-selecting rules with IDs:", selectedIds);
      console.log("Pre-selecting rules with texts:", selectedTexts);
      console.log("Custom rules from API:", customRulesFromApi);

      // Merge custom rules from API with existing custom rules.
      // Exclude any title that already exists in rulesAndRegulations to avoid duplicates
      // (e.g. when both APIs have returned and a rule is in the master list).
      const apiRuleTitles = (this.state.rulesAndRegulations || []).map(
        (rule: any) => rule.title || rule.attributes?.title
      );
      const existingCustomRules = this.state.customRules || [];
      const mergedCustomRules = [...existingCustomRules];
      customRulesFromApi.forEach((customRule: string) => {
        if (
          !mergedCustomRules.includes(customRule) &&
          !apiRuleTitles.includes(customRule)
        ) {
          mergedCustomRules.push(customRule);
        }
      });

      // Save custom rules to AsyncStorage for persistence
      await setStorageData("customRules", JSON.stringify(mergedCustomRules));
      console.log("✅ Saved custom rules to AsyncStorage:", mergedCustomRules);

      // Update state - merge with existing selections to avoid overwriting
      this.setState((prevState) => ({
        selectedRulesAndRegulationsIds: [
          ...prevState.selectedRulesAndRegulationsIds.filter(id => !selectedIds.includes(id)),
          ...selectedIds
        ],
        selectedRulesAndRegulationsTexts: [
          ...prevState.selectedRulesAndRegulationsTexts.filter(text => !selectedTexts.includes(text)),
          ...selectedTexts
        ],
        customRules: mergedCustomRules
      }));
    } else {
      console.log("Error fetching user selected rules and regulations:", responseJson.errors);
      if (responseJson.errors) {
        const rawErrors = responseJson.errors;
        const normalizedErrorText =
          typeof rawErrors === "string"
            ? rawErrors.toLowerCase()
            : JSON.stringify(rawErrors).toLowerCase();
        const isMissingProfileError =
          normalizedErrorText.indexOf("profile for this user not present") !== -1;

        if (isMissingProfileError) {
          console.log(
            "ℹ️ Suppressing alert for missing profile while fetching selected rules in create flow."
          );
          return;
        }

        this.parseApiErrorResponse(responseJson);
      }
    }
  }

  handleToggleRuleSelection = (ruleId: number) => {
    const currentSelected = this.state.selectedRulesAndRegulationsIds;
    const currentSelectedTexts = this.state.selectedRulesAndRegulationsTexts;
    const index = currentSelected.indexOf(ruleId);
    
    // Find the rule object to get its title
    const rule = this.state.rulesAndRegulations.find(r => r.id === ruleId);
    const ruleTitle = rule ? rule.title : '';
    
    if (index !== -1) {
      // Remove if already selected
      this.setState({
        selectedRulesAndRegulationsIds: currentSelected.filter(id => id !== ruleId),
        selectedRulesAndRegulationsTexts: currentSelectedTexts.filter(text => text !== ruleTitle)
      });
    } else {
      // Add if not selected
      this.setState({
        selectedRulesAndRegulationsIds: [...currentSelected, ruleId],
        selectedRulesAndRegulationsTexts: [...currentSelectedTexts, ruleTitle]
      });
    }
  }

  handleSaveRulesAndRegulations = async () => {
    // Check if user came from Customisableuserprofiles2 (profile screen)
    const navigationParams = this.props.navigation?.state?.params || 
                             (this.props as any).route?.params || {};
    const fromProfile = navigationParams?.fromProfile === true;
    
    // Save selected rules text to AsyncStorage
    console.log("💾 Saving rules and regulations texts to AsyncStorage:", this.state.selectedRulesAndRegulationsTexts);
    console.log("💾 Saving custom rules to AsyncStorage:", this.state.customRules);
    
    await setStorageData(
      "selectedRulesAndRegulationsTexts",
      JSON.stringify(this.state.selectedRulesAndRegulationsTexts)
    );
    
    // Also save custom rules array so they persist even if unchecked
    await setStorageData(
      "customRules",
      JSON.stringify(this.state.customRules)
    );
    
    // If user came from profile screen, call API to update profile
    if (fromProfile) {
      console.log("📤 User came from profile - calling update_profile API");
      this.updateRulesAndRegulationsInProfile();
      return true;
    }
    
    // If not from profile, navigate immediately without waiting for API
    this.proceedAfterRulesAndRegulations();
    
    return true;
  }

  updateRulesAndRegulationsInProfile = async () => {
    if (!this.state.token) {
      console.log("⚠️ No token available for API call");
      this.proceedAfterRulesAndRegulations();
      return;
    }

    this.setState({ fetching: true });

    // Prepare data with selected rules as texts (strings) - API expects all rules as strings
    // Use selectedRulesAndRegulationsTexts which contains both API rules and custom rules
    let rulesArray: string[] = [];
    
    // First, get texts from selectedRulesAndRegulationsTexts (contains all selected rules)
    if (this.state.selectedRulesAndRegulationsTexts && this.state.selectedRulesAndRegulationsTexts.length > 0) {
      rulesArray = [...this.state.selectedRulesAndRegulationsTexts];
    }
    
    // Also ensure API rules from selected IDs are included (in case texts are missing)
    if (
      this.state.selectedRulesAndRegulationsIds &&
      this.state.selectedRulesAndRegulationsIds.length > 0 &&
      this.state.rulesAndRegulations &&
      this.state.rulesAndRegulations.length > 0
    ) {
      this.state.rulesAndRegulations.forEach((rule: any) => {
        const ruleId = rule.id || rule.attributes?.id;
        if (this.state.selectedRulesAndRegulationsIds.indexOf(ruleId) !== -1) {
          const ruleTitle = rule.title || rule.attributes?.title || '';
          if (ruleTitle && !rulesArray.includes(ruleTitle)) {
            rulesArray.push(ruleTitle);
          }
        }
      });
    }

    const data = {
      "profile": {
        "rules_and_regulations_icon_ids": rulesArray
      }
    };

    console.log("📤 Updating profile with rules and regulations:", data);
    console.log("📤 Total rules:", rulesArray.length);
    console.log("📤 Includes custom rules:", rulesArray.filter(text => {
      const isApiRule = this.state.rulesAndRegulations?.some((rule: any) => {
        const ruleTitle = (rule.title || rule.attributes?.title || '').trim();
        return ruleTitle === text.trim() || ruleTitle.toLowerCase() === text.trim().toLowerCase();
      });
      return !isApiRule;
    }));

    const header = {
      "Content-Type": configJSON.categoryApiContentType,
      token: this.state.token,
    };

    const updateProfileReqMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.updateRulesAndRegulationsApiCallId = updateProfileReqMsg.messageId;

    updateProfileReqMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.updateProfileEndpoint
    );

    updateProfileReqMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    updateProfileReqMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPatchType
    );

    updateProfileReqMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(data)
    );

    runEngine.sendMessage(updateProfileReqMsg.id, updateProfileReqMsg);
  }

  handleUpdateRulesAndRegulationsResponse = (responseJson: any) => {
    this.setState({ fetching: false });

    console.log("📥 Rules and Regulations API Response:", JSON.stringify(responseJson, null, 2));

    if (!responseJson) {
      console.log("⚠️ Response is undefined - proceeding to next step anyway");
      this.proceedAfterRulesAndRegulations();
      return;
    }

    if (responseJson.errors) {
      console.log("Error updating rules and regulations:", responseJson.errors);
      if (this.shouldSuppressSignupProfileError(responseJson)) {
        console.log("ℹ️ Suppressing rules profile API alert during signup.");
        this.proceedAfterRulesAndRegulations();
        return;
      }
      this.parseApiErrorResponse(responseJson);
    } else {
      console.log("✅ Rules and regulations updated successfully");
      this.proceedAfterRulesAndRegulations();
    }
  }

  updateRostersInProfile = async () => {
    if (!this.state.token) {
      console.log("⚠️ No token available for API call");
      this.proceedAfterRosters();
      return;
    }

    this.setState({ fetching: true });

    // Prepare data with rosters array
    const data = {
      "profile": {
        "rosters": this.state.roster || []
      }
    };

    console.log("📤 Updating profile with rosters:", data);
    console.log("📤 Total rosters:", this.state.roster?.length || 0);

    const header = {
      "Content-Type": configJSON.categoryApiContentType,
      token: this.state.token,
    };

    const updateProfileReqMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.updateRostersApiCallId = updateProfileReqMsg.messageId;

    updateProfileReqMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.updateProfileEndpoint
    );

    updateProfileReqMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    updateProfileReqMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPatchType
    );

    updateProfileReqMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(data)
    );

    runEngine.sendMessage(updateProfileReqMsg.id, updateProfileReqMsg);
  }

  proceedAfterRulesAndRegulations = () => {
    // Check if user came from Customisableuserprofiles2 (profile screen)
    const navigationParams = this.props.navigation?.state?.params || 
                             (this.props as any).route?.params || {};
    const fromProfile = navigationParams?.fromProfile === true;
    
    if (fromProfile) {
      console.log("🔄 Navigating back to profile screen");
      // Navigate back to the previous screen (profile)
      if (this.props.navigation?.goBack) {
        this.props.navigation.goBack();
      } else {
        this.backToHomeScreen();
      }
    } else if (this.state.userRole === 'venue' && !this.state.isEditMode) {
      console.log("🔄 Venue signup: Navigating to CreateYourProfile");
      this.navigateToCreateProfile();
    } else {
      this.backToHomeScreen();
    }
  }

  handleSaveRosters = async () => {
    // Validate that roster is not empty before saving
    if (!this.state.roster || this.state.roster.length === 0) {
      Alert.alert(
        "Roster Required",
        "Please enter at least one roster item before proceeding to the next screen.",
        [{ text: "OK" }]
      );
      return false;
    }

    // Check if user came from Customisableuserprofiles2 (profile screen)
    const navigationParams = this.props.navigation?.state?.params || 
                             (this.props as any).route?.params || {};
    const fromProfile = navigationParams?.fromProfile === true;
    
    // Save rosters to AsyncStorage
    console.log("💾 Saving rosters to AsyncStorage:", this.state.roster);
    
    await setStorageData(
      "savedRosters",
      JSON.stringify(this.state.roster)
    );
    
    // If user came from profile screen, call API to update profile
    if (fromProfile) {
      console.log("📤 User came from profile - calling update_profile API for rosters");
      this.updateRostersInProfile();
      return true;
    }
    
    // If not from profile, navigate immediately without waiting for API
    this.proceedAfterRosters();
    
    return true;
  }

  handleUpdateRostersResponse = (responseJson: any) => {
    this.setState({ fetching: false });

    console.log("📥 Rosters API Response:", JSON.stringify(responseJson, null, 2));

    if (!responseJson) {
      console.log("⚠️ Response is undefined - proceeding to next step anyway");
      this.proceedAfterRosters();
      return;
    }

    if (responseJson.errors) {
      console.log("Error updating rosters:", responseJson.errors);
      if (this.shouldSuppressSignupProfileError(responseJson)) {
        console.log("ℹ️ Suppressing rosters profile API alert during signup.");
        this.proceedAfterRosters();
        return;
      }
      this.parseApiErrorResponse(responseJson);
    } else {
      console.log("✅ Rosters updated successfully");
      this.proceedAfterRosters();
    }
  }

  proceedAfterRosters = () => {
    // Check if user came from Customisableuserprofiles2 (profile screen)
    const navigationParams = this.props.navigation?.state?.params || 
                             (this.props as any).route?.params || {};
    const fromProfile = navigationParams?.fromProfile === true;
    
    if (fromProfile) {
      console.log("🔄 Navigating back to profile screen");
      // Navigate back to the previous screen (profile)
      if (this.props.navigation?.goBack) {
        this.props.navigation.goBack();
      } else {
        this.backToHomeScreen();
      }
    } else if (!this.state.isEditMode) {
      console.log("🔄 Signup: Navigating to CreateYourProfile");
      this.navigateToCreateProfile();
    } else {
      this.backToHomeScreen();
    }
  }

  handleSaveInfluencesAndAffiliates = async () => {
    // User clicked Save on Influences tab (tab 1) or Affiliates tab (tab 2) - enable Affiliates tab when saving from Influences
    if (this.state.activeTab === 1) {
      this.setState({ influencesSaved: true });
    }
    // Check if user came from Customisableuserprofiles2 (profile screen)
    const navigationParams = this.props.navigation?.state?.params || 
                             (this.props as any).route?.params || {};
    const fromProfile = await this.resolveFromProfile();
    
    // Save influences and affiliates to AsyncStorage
    console.log("💾 Saving influences and affiliates to AsyncStorage:");
    console.log("  - Influences:", this.state.influences);
    console.log("  - Affiliates:", this.state.affiliates);
    
    // Save to AsyncStorage
    await setStorageData("updated_influences", JSON.stringify(this.state.influences || []));
    await setStorageData("updated_affiliates", JSON.stringify(this.state.affiliates || []));
    
    console.log("✅ Saved influences and affiliates to AsyncStorage");
    
    // If user came from profile screen, GET current profile first then PATCH with merged data
    // so we only update influences/affiliates and do not overwrite categories etc.
    if (fromProfile) {
      console.log("📤 User came from profile - fetching profile then updating only influences and affiliates");
      this.setState({ pendingUpdateInfluencesAffiliates: true }, () => {
        this.getUserProfile();
      });
      return true;
    }
    
    // If not from profile, navigate to next step (Rules and Regulations or CreateYourProfile)
    this.proceedAfterInfluencesAndAffiliates();
    
    return true;
  }
  
  updateInfluencesAndAffiliatesInProfile = async () => {
    if (!this.state.token) {
      console.log("⚠️ No token available for API call");
      this.proceedAfterInfluencesAndAffiliates();
      return;
    }

    this.setState({ fetching: true });

    // Prepare data with influences and affiliates arrays
    const data = {
      "profile": {
        "influences": this.state.influences || [],
        "affiliates": this.state.affiliates || []
      }
    };

    console.log("📤 Updating profile with influences and affiliates:", data);
    console.log("📤 Total influences:", this.state.influences?.length || 0);
    console.log("📤 Total affiliates:", this.state.affiliates?.length || 0);

    const header = {
      "Content-Type": configJSON.categoryApiContentType,
      token: this.state.token,
    };

    const updateProfileReqMsg = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.updateInfluencesAndAffiliatesApiCallId = updateProfileReqMsg.messageId;

    updateProfileReqMsg.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.updateProfileEndpoint
    );

    updateProfileReqMsg.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    updateProfileReqMsg.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpPatchType
    );

    updateProfileReqMsg.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(data)
    );

    runEngine.sendMessage(updateProfileReqMsg.id, updateProfileReqMsg);
  }

  isBandOrArtistSignup = () => {
    return (
      !this.state.isEditMode &&
      (this.state.userRole === 'band' || this.state.userRole === 'Artist')
    );
  };

  proceedAfterInfluencesAndAffiliates = () => {
    // Check if user came from Customisableuserprofiles2 (profile screen)
    const navigationParams = this.props.navigation?.state?.params || 
                             (this.props as any).route?.params || {};
    const fromProfile = navigationParams?.fromProfile === true;
    
    if (fromProfile) {
      // When coming from profile screen
      if (this.state.activeTab === 1) {
        // If on Influences tab (tab 1), navigate to Affiliates tab (tab 2)
        console.log("🔄 Navigating from Influences to Affiliates tab (from profile)");
        this.setState({ activeTab: 2, title: this.state.thirdTabTitle }, () => {
          this.updateFontSize();
        });
      } else if (this.state.activeTab === 2) {
        // If on Affiliates tab (tab 2), navigate back to profile screen
        console.log("🔄 Navigating back to profile screen after saving Affiliates");
        if (this.props.navigation?.goBack) {
          this.props.navigation.goBack();
        } else {
          this.backToHomeScreen();
        }
      } else {
        // For other tabs, navigate back to profile
        console.log("🔄 Navigating back to profile screen");
        if (this.props.navigation?.goBack) {
          this.props.navigation.goBack();
        } else {
          this.backToHomeScreen();
        }
      }
      return;
    }
    
    // Navigate based on current tab and user role (for signup flow)
    if (this.isBandOrArtistSignup()) {
      // For band/artist users in create mode
      if (this.state.activeTab === 1) {
        // If on Influences tab (tab 1), navigate to Affiliates tab (tab 2)
        console.log("🔄 Navigating from Influences to Affiliates tab");
        this.setState({ activeTab: 2, title: this.state.thirdTabTitle }, () => {
          this.updateFontSize();
        });
      } else if (this.state.activeTab === 2) {
        // If on Affiliates tab (tab 2), navigate to CreateYourProfile screen
        console.log("🔄 Band/artist signup: Navigating to CreateYourProfile after saving Affiliates");
        this.navigateToCreateProfile();
      }
    } else if (this.state.userRole === 'venue' && !this.state.isEditMode) {
      // For venue users in create mode, navigate to CreateYourProfile
      console.log("🔄 Venue signup: Navigating to CreateYourProfile");
      this.navigateToCreateProfile();
    } else {
      // For edit mode or other cases, go back to home
      this.backToHomeScreen();
    }
  }

  handleUpdateInfluencesAndAffiliatesResponse = (responseJson: any) => {
    this.setState({ fetching: false });

    console.log("📥 Influences and Affiliates API Response:", JSON.stringify(responseJson, null, 2));

    if (!responseJson) {
      console.log("⚠️ Response is undefined - proceeding to next step anyway");
      this.proceedAfterInfluencesAndAffiliates();
      return;
    }

    if (responseJson.errors) {
      console.log("Error updating influences and affiliates:", responseJson.errors);
      if (this.shouldSuppressSignupProfileError(responseJson)) {
        console.log("ℹ️ Suppressing influences profile API alert during signup.");
        this.proceedAfterInfluencesAndAffiliates();
        return;
      }
      this.parseApiErrorResponse(responseJson);
    } else {
      console.log("✅ Influences and affiliates updated successfully");
      this.proceedAfterInfluencesAndAffiliates();
    }
  }

  navigateToCreateProfile = async () => {
    await setStorageData("updated_influences", JSON.stringify(this.state.influences));
    await setStorageData("updated_affiliates", JSON.stringify(this.state.affiliates));

    const message: Message = new Message(getName(MessageEnum.NavigationMessage));
    message.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    message.addData(getName(MessageEnum.NavigationTargetMessage), "CreateYourProfile");
    this.send(message);
  }

  getUserProfile = async () => {
    if (!this.state.token) {
      console.log("⚠️ getUserProfile skipped: token missing");
      return;
    }

    // Get account ID from props or storage
    let accountId = this.props.id;
    if (!accountId) {
      accountId = await getStorageData("user_id");
    }

    if (!accountId) {
      console.log("No account ID available for user profile API");
      return;
    }

    this.setState({ fetching: true });

    const header = {
      "Content-Type": configJSON.categoryApiContentType,
      token: this.state.token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getUserProfileApiCallId = requestMessage.messageId;
    const userProfileEndpoint = `${configJSON.showUserProfileEndpoint}?id=${accountId}`;
    console.log("📡 getUserProfile API call details:");
    console.log("  - endpoint:", userProfileEndpoint);
    console.log("  - method:", configJSON.httpGetType);
    console.log("  - accountId:", accountId);
    console.log("  - hasToken:", !!this.state.token);
    console.log("  - isEditMode:", this.state.isEditMode);
    console.log("  - activeTab:", this.state.activeTab);
    console.log("  - requestMessageId:", this.getUserProfileApiCallId);

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      userProfileEndpoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.httpGetType
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  /**
   * Build merged profile payload from GET attributes + influences/affiliates to send in PATCH.
   * Only updates influences and affiliates while preserving categories, subcategories, rosters, rules.
   */
  buildProfilePayloadFromAttributes = (
    attributes: any,
    influencesToSave: string[],
    affiliatesToSave: string[]
  ): { profile: any } => {
    const profile: any = {
      influences: influencesToSave || [],
      affiliates: affiliatesToSave || [],
    };
    const userCategories = attributes?.user_categories ||
      attributes?.user_selection?.data?.attributes?.user_categories || [];
    const categorySubcat = attributes?.category_subcat || [];
    const categoryNames: string[] = [];
    const subcategoryNames: string[] = [];
    if (userCategories && Array.isArray(userCategories) && userCategories.length > 0) {
      userCategories.forEach((userCategory: any) => {
        const categoryName = userCategory?.category?.name;
        const subCategories = userCategory?.category?.user_sub_categories || [];
        if (categoryName) {
          categoryNames.push(categoryName);
          subCategories.forEach((subCat: any) => {
            const name = subCat?.sub_category?.name || subCat?.name || subCat;
            if (name) subcategoryNames.push(name);
          });
        }
      });
    }
    if (categorySubcat && Array.isArray(categorySubcat) && categorySubcat.length > 0) {
      categorySubcat.forEach((categoryItem: any) => {
        const categoryName = categoryItem?.name;
        const subCategories = categoryItem?.subcategories || [];
        if (categoryName) {
          categoryNames.push(categoryName);
          subCategories.forEach((subCat: any) => {
            const name = typeof subCat === "string" ? subCat : subCat?.name || subCat;
            if (name) subcategoryNames.push(name);
          });
        }
      });
    }
    if (categoryNames.length > 0) profile.categories = categoryNames;
    if (subcategoryNames.length > 0) profile.subcategories = subcategoryNames;
    const rosters = attributes?.rosters || [];
    if (rosters && Array.isArray(rosters) && rosters.length > 0) {
      profile.rosters = rosters.map((r: any) => (typeof r === "string" ? r : r?.name || r)).filter((n: any) => n);
    }
    const rulesIcons = attributes?.rules_and_regulations_icons || [];
    if (rulesIcons && Array.isArray(rulesIcons) && rulesIcons.length > 0) {
      profile.rules_and_regulations_icon_ids = rulesIcons.map((r: any) => r?.id ?? r).filter((id: any) => id != null);
    }
    return { profile };
  };

  handleGetUserProfileResponse = async (responseJson: any) => {
    this.setState({ fetching: false });
    console.log("📥 getUserProfile raw response:", JSON.stringify(responseJson, null, 2));

    if (responseJson.data && !responseJson.errors) {
      console.log("User profile data received:", responseJson.data);
      const wasPendingInfluencesAffiliates = this.state.pendingUpdateInfluencesAffiliates;
      this.setState({ userProfileData: responseJson.data });

      const attributes = responseJson.data.attributes;

      // When fromProfile (incl. fan), preserve categories/artists loaded from storage if API returns empty
      const navigationParams = this.props.navigation?.state?.params ||
        (this.props as any).route?.params || {};
      const fromProfile = await this.resolveFromProfile();

      // When saving only influences/affiliates from profile: merge with current profile and PATCH so we don't overwrite categories
      if (wasPendingInfluencesAffiliates) {
        this.setState({ pendingUpdateInfluencesAffiliates: false });
        const influencesToSave = this.state.influences || [];
        const affiliatesToSave = this.state.affiliates || [];
        const data = this.buildProfilePayloadFromAttributes(attributes, influencesToSave, affiliatesToSave);
        console.log("📤 PATCHing profile with merged data (only influences/affiliates changed):", data);
        const header = {
          "Content-Type": configJSON.categoryApiContentType,
          token: this.state.token,
        };
        const updateProfileReqMsg = new Message(getName(MessageEnum.RestAPIRequestMessage));
        this.updateInfluencesAndAffiliatesApiCallId = updateProfileReqMsg.messageId;
        updateProfileReqMsg.addData(getName(MessageEnum.RestAPIResponceEndPointMessage), configJSON.updateProfileEndpoint);
        updateProfileReqMsg.addData(getName(MessageEnum.RestAPIRequestHeaderMessage), JSON.stringify(header));
        updateProfileReqMsg.addData(getName(MessageEnum.RestAPIRequestMethodMessage), configJSON.httpPatchType);
        updateProfileReqMsg.addData(getName(MessageEnum.RestAPIRequestBodyMessage), JSON.stringify(data));
        runEngine.sendMessage(updateProfileReqMsg.id, updateProfileReqMsg);
        // Skip overwriting influences/affiliates from API below; keep user's just-saved values
      }

      // Update accountType from API response if available
      if (attributes?.account_type) {
        this.setState({ accountType: attributes.account_type });
        console.log("🔍 Updated accountType from API:", attributes.account_type);
      }
      
      // Ensure we're in edit mode if categoriesEditMode is set
      const isEditMode = await getStorageData("categoriesEditMode");
      if (isEditMode === "true" && !this.state.isEditMode) {
        this.setState({ isEditMode: true });
      }

      // Extract rules_and_regulations_icons from the API response and pre-select them
      const rulesAndRegulationsIcons = attributes?.rules_and_regulations_icons;
      if (rulesAndRegulationsIcons && Array.isArray(rulesAndRegulationsIcons)) {
        // Extract the IDs from the rules_and_regulations_icons array
        const selectedIds = rulesAndRegulationsIcons.map((rule: any) => rule.id);
        console.log("Pre-selecting rules with IDs:", selectedIds);
        this.setState({ selectedRulesAndRegulationsIds: selectedIds });
      }

      // Always load influences, affiliates, and rosters from API response if they exist
      // Skip when we just saved influences/affiliates so we don't overwrite user's values
      if (!wasPendingInfluencesAffiliates) {
        // Extract influences from API response
        const influences = attributes?.influences ||
          attributes?.user_selection?.data?.attributes?.influences ||
          [];
        if (influences && Array.isArray(influences) && influences.length > 0) {
          console.log("Loading influences from API:", influences);
          this.setState({ influences: influences, influencesSaved: true });
        } else if (influences && Array.isArray(influences)) {
          console.log("Setting empty influences array from API");
          this.setState({ influences: [] });
        }

        // Extract affiliates from API response
        const affiliates = attributes?.affiliates ||
          attributes?.user_selection?.data?.attributes?.affiliates ||
          [];
        if (affiliates && Array.isArray(affiliates) && affiliates.length > 0) {
          console.log("Loading affiliates from API:", affiliates);
          this.setState({ affiliates: affiliates });
        } else if (affiliates && Array.isArray(affiliates)) {
          console.log("Setting empty affiliates array from API");
          this.setState({ affiliates: [] });
        }
      }

      // Extract rosters from API response
      const rosters = attributes?.rosters || [];
      if (rosters && Array.isArray(rosters) && rosters.length > 0) {
        // Extract just the names from the rosters array (rosters is array of {id, name})
        const rosterNames = rosters.map((roster: any) => roster.name || roster).filter((name: any) => name);
        console.log("Loading rosters from API:", rosterNames);
        this.setState({ roster: rosterNames });
      } else if (rosters && Array.isArray(rosters)) {
        // Even if empty array, set it to ensure we clear any old values
        console.log("Setting empty rosters array from API");
        this.setState({ roster: [] });
      }

      // Extract band_artists (Bands/Artists for fan, Influences for band/artist) from API response
      const bandArtists = attributes?.band_artists ||
        attributes?.user_selection?.data?.attributes?.band_artists ||
        [];
      if (bandArtists && Array.isArray(bandArtists) && bandArtists.length > 0) {
        const artistNames = bandArtists.map((a: any) => (typeof a === 'string' ? a : a?.name || a)).filter((name: any) => name);
        console.log("Loading band_artists from API (auto-select):", artistNames);
        this.setState({
          selectedArtists: artistNames,
          ...(this.state.userRole === 'fan' ? { bandsArtistsSaved: true } : {}),
        });
      } else if (bandArtists && Array.isArray(bandArtists) && !fromProfile) {
        console.log("Setting empty selectedArtists from API");
        this.setState({ selectedArtists: [] });
      }
      // When fromProfile (e.g. fan): keep existing selectedArtists from storage if API returned empty

      // Extract categories and subcategories from API response
      // Check both direct attributes and user_selection
      const userCategories = attributes?.user_categories ||
        attributes?.user_selection?.data?.attributes?.user_categories ||
        [];

      // Also check for category_subcat structure (used in Customisableuserprofiles2)
      const categorySubcat = attributes?.category_subcat || [];

      // Transform categories into subcategories state format
      // Format: { "Art": ["Architecture", "Ceramic"], "Enjoyment": ["Comedy"] }
      const subcategoriesMap: any = {};

      // Handle user_categories structure
      if (userCategories && Array.isArray(userCategories) && userCategories.length > 0) {
        console.log("Loading categories from API (user_categories):", userCategories);

        userCategories.forEach((userCategory: any) => {
          const categoryName = userCategory?.category?.name;
          const subCategories = userCategory?.category?.user_sub_categories || [];

          if (categoryName && subCategories.length > 0) {
            const subCategoryNames = subCategories.map((subCat: any) => {
              // Handle both nested structure and direct name
              return subCat?.sub_category?.name || subCat?.name || subCat;
            }).filter((name: any) => name);

            if (subCategoryNames.length > 0) {
              // If category already exists, merge subcategories (avoid duplicates)
              if (subcategoriesMap[categoryName]) {
                const existing = subcategoriesMap[categoryName];
                // Merge arrays and remove duplicates without using Set
                const merged = [...existing];
                subCategoryNames.forEach((name: string) => {
                  if (merged.indexOf(name) === -1) {
                    merged.push(name);
                  }
                });
                subcategoriesMap[categoryName] = merged;
              } else {
                subcategoriesMap[categoryName] = subCategoryNames;
              }
            }
          }
        });
      }

      // Handle category_subcat structure (from Customisableuserprofiles2)
      if (categorySubcat && Array.isArray(categorySubcat) && categorySubcat.length > 0) {
        console.log("Loading categories from API (category_subcat):", categorySubcat);

        categorySubcat.forEach((categoryItem: any) => {
          const categoryName = categoryItem?.name;
          const subCategories = categoryItem?.subcategories || [];

          if (categoryName && subCategories.length > 0) {
            const subCategoryNames = subCategories.map((subCat: any) => {
              // Handle both nested structure and direct name
              return subCat?.name || subCat;
            }).filter((name: any) => name);

            if (subCategoryNames.length > 0) {
              // If category already exists, merge subcategories (avoid duplicates)
              if (subcategoriesMap[categoryName]) {
                const existing = subcategoriesMap[categoryName];
                // Merge arrays and remove duplicates without using Set
                const merged = [...existing];
                subCategoryNames.forEach((name: string) => {
                  if (merged.indexOf(name) === -1) {
                    merged.push(name);
                  }
                });
                subcategoriesMap[categoryName] = merged;
              } else {
                subcategoriesMap[categoryName] = subCategoryNames;
              }
            }
          }
        });
      }

      // Update state if we have categories from API; when fromProfile (e.g. fan) don't clear if API returned empty
      if (Object.keys(subcategoriesMap).length > 0) {
        console.log("Transformed subcategories:", subcategoriesMap);
        this.setState({ subcategories: subcategoriesMap, categoriesSaved: true });
      } else if (
        ((userCategories && Array.isArray(userCategories)) || (categorySubcat && Array.isArray(categorySubcat))) &&
        !fromProfile
      ) {
        // Only clear subcategories when current state is empty - never overwrite user's in-memory
        // selections (e.g. just saved on Categories tab) when API returns stale/empty data
        const hasExistingSubcategories = this.state.subcategories && Object.keys(this.state.subcategories).length > 0;
        if (!hasExistingSubcategories) {
          console.log("Setting empty categories from API");
          this.setState({ subcategories: {} });
        }
      }
      // When fromProfile (e.g. fan): keep existing subcategories from storage if API returned empty

      // Categories tab (tab 0) is always selected by default when screen loads,
      // whether coming from profile or not. Tab only changes when user taps a tab or clicks Next.
    } else {
      console.log("Error fetching user profile:", responseJson.errors);
      console.log("❌ getUserProfile API failed payload:", JSON.stringify(responseJson, null, 2));
      if (this.state.pendingUpdateInfluencesAffiliates) {
        this.setState({ pendingUpdateInfluencesAffiliates: false });
        this.proceedAfterInfluencesAndAffiliates();
        return;
      }
      if (this.shouldSuppressSignupProfileError(responseJson)) {
        console.log("ℹ️ Suppressing getUserProfile alert during signup.");
        return;
      }
      this.parseApiErrorResponse(responseJson);
    }
  }

  // Customizable Area End
}

