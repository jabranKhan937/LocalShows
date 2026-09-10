import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar} from 'react-native';

import HomeScreen from '../components/src/HomeScreen';
import Customisableuserprofiles2 from '../blocks/customisableuserprofiles2/src/Customisableuserprofiles2';
import Hamburgermenu from '../blocks/hamburgermenu/src/Hamburgermenu';
import Likeapost2 from '../blocks/likeapost2/src/Likeapost2';
import Splashscreen from '../blocks/splashscreen/src/Splashscreen';
import Notificationsettings from '../blocks/notificationsettings/src/Notificationsettings';
import NavigationMenu from '../blocks/navigationmenu/src/NavigationMenu';
import EducationalUserProfile from '../blocks/educational-user-profile/src/EducationalUserProfile';
import OTPInputAuth from '../blocks/otp-input-confirmation/src/OTPInputAuth';
import Recommendationengine from '../blocks/recommendationengine/src/Recommendationengine';
import Adminconsole2 from '../blocks/adminconsole2/src/Adminconsole2';
import Notifications from '../blocks/notifications/src/Notifications';
import Location from '../blocks/location/src/Location';
import Locationbasedalerts2 from '../blocks/locationbasedalerts2/src/Locationbasedalerts2';
import AddEventDetailScreen from '../blocks/events/src/AddEventDetailScreen';
import AddEventLocation from '../blocks/events/src/AddEventLocation';
import AllEventDetailScreen from '../blocks/events/src/AllEventDetailScreen';
import AllEventScreen from '../blocks/events/src/AllEventScreen';
import ArtistsToWatchAllScreen from '../blocks/events/src/ArtistsToWatchAllScreen';
import Events from '../blocks/events/src/Events';
import Customisableusersubscriptions from '../blocks/customisableusersubscriptions/src/Customisableusersubscriptions';
import SubscriptionDetails from '../blocks/customisableusersubscriptions/src/SubscriptionDetails';
import ApiIntegration from '../blocks/apiintegration/src/ApiIntegration';
import CountryCodeSelector from '../blocks/country-code-selector/src/CountryCodeSelector';
import CountryCodeSelectorTable from '../blocks/country-code-selector/src/CountryCodeSelectorTable';
import UserProfileBasicBlock from '../blocks/user-profile-basic/src/UserProfileBasicBlock';
import Eventregistration from '../blocks/eventregistration/src/Eventregistration';
import Pushnotifications from '../blocks/pushnotifications/src/Pushnotifications';
import Scheduling from '../blocks/scheduling/src/Scheduling';
import Contactus from '../blocks/contactus/src/Contactus';
import AddContactus from '../blocks/contactus/src/AddContactus';
import Settings2 from '../blocks/settings2/src/Settings2';
import Share from '../blocks/share/src/Share';
import Rolesandpermissions from '../blocks/rolesandpermissions/src/Rolesandpermissions';
import Favourites from '../blocks/favourites/src/Favourites';
import AddFavourites from '../blocks/favourites/src/AddFavourites';
import Comments from '../blocks/comments/src/Comments';
import CreateComment from '../blocks/comments/src/CreateComment';
import PostCreation from '../blocks/postcreation/src/PostCreation';
import Posts from '../blocks/postcreation/src/Posts';
import PostDetails from '../blocks/postcreation/src/PostDetails';
import SocialMediaAccountLoginScreen from '../blocks/social-media-account-login/src/SocialMediaAccountLoginScreen';
import RequestManagement from '../blocks/requestmanagement/src/RequestManagement';
import Search from '../blocks/search/src/Search';
import SocialMediaAccountRegistrationScreen from '../blocks/social-media-account-registration/src/SocialMediaAccountRegistrationScreen';
import EmailAccountLoginBlock from '../blocks/email-account-login/src/EmailAccountLoginBlock';
import ForgotPassword from '../blocks/forgot-password/src/ForgotPassword';
import ForgotPasswordOTP from '../blocks/forgot-password/src/ForgotPasswordOTP';
import NewPassword from '../blocks/forgot-password/src/NewPassword';
import TermsConditions from '../blocks/termsconditions/src/TermsConditions';
import PrivacyPolicy from '../blocks/termsconditions/src/PrivacyPolicy';
import TermsConditionsDetail from '../blocks/termsconditions/src/TermsConditionsDetail';
import TermsConditionsUsers from '../blocks/termsconditions/src/TermsConditionsUsers';
import BulkUploading from '../blocks/bulkuploading/src/BulkUploading';
import EmailAccountRegistration from '../blocks/email-account-registration/src/EmailAccountRegistration';
import PhotoLibrary from '../blocks/photolibrary/src/PhotoLibrary';
import Categoriessubcategories from '../blocks/categoriessubcategories/src/Categoriessubcategories';
import EditProfile from '../blocks/user-profile-basic/src/EditProfile';
import CreateYourProfile from '../blocks/user-profile-basic/src/CreateYourProfile';
import HelpCentre from '../blocks/helpcentre/src/HelpCentre';
import AboutUs from '../blocks/helpcentre/src/AboutUs';
import ChangePassword from '../blocks/settings2/src/ChangePassword';
import SearchResult from '../blocks/search/src/SearchResult';
import Followers from '../blocks/followers/src/Followers';
import PostSelection from '../blocks/postcreation/src/PostSelection';
import PostPostpone from '../blocks/postcreation/src/PostPostpone';
import ImageSelection from '../blocks/postcreation/src/ImageSelection';
import RepresentativeCertification from '../blocks/email-account-registration/src/RepresentativeCertification';
import ClaimPage from '../blocks/email-account-registration/src/ClaimPage';
import CreatePage from '../blocks/email-account-registration/src/CreatePage';
import DisputeForm from '../blocks/email-account-registration/src/DisputeForm';
import Chat from '../blocks/chat/src/Chat';
import PhotoLibraryDetail from '../blocks/photolibrary/src/PhotoLibraryDetail';
import HomeEmptyScreen from '../blocks/events/src/HomeEmptyScreen';
import {SafeAreaView} from 'react-native-safe-area-context';

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Splashscreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Splashscreen"
        component={Splashscreen}
        options={{title: 'Splashscreen'}}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'mainEvents'}}
      />
      <Stack.Screen
        name="Customisableuserprofiles2"
        component={Customisableuserprofiles2}
        options={{title: 'Customisableuserprofiles2'}}
      />
      <Stack.Screen
        name="Hamburgermenu"
        component={Hamburgermenu}
        options={{title: 'Hamburgermenu'}}
      />
      <Stack.Screen
        name="Likeapost2"
        component={Likeapost2}
        options={{title: 'Likeapost2'}}
      />
      <Stack.Screen
        name="Notificationsettings"
        component={Notificationsettings}
        options={{title: 'Notificationsettings'}}
      />
      <Stack.Screen
        name="NavigationMenu"
        component={NavigationMenu}
        options={{title: 'NavigationMenu'}}
      />
      <Stack.Screen
        name="EducationalUserProfile"
        component={EducationalUserProfile}
        options={{title: 'EducationalUserProfile'}}
      />
      <Stack.Screen
        name="OTPInputAuth"
        component={OTPInputAuth}
        options={{title: 'OTPInputAuth'}}
      />
      <Stack.Screen
        name="Recommendationengine"
        component={Recommendationengine}
        options={{title: 'Recommendationengine'}}
      />
      <Stack.Screen
        name="Adminconsole2"
        component={Adminconsole2}
        options={{title: 'Adminconsole2'}}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{title: 'Notifications'}}
      />
      <Stack.Screen
        name="Location"
        component={Location}
        options={{title: 'Location'}}
      />
      <Stack.Screen
        name="Locationbasedalerts2"
        component={Locationbasedalerts2}
        options={{title: 'Locationbasedalerts2'}}
      />
      <Stack.Screen
        name="AddEventDetailScreen"
        component={AddEventDetailScreen}
        options={{title: 'AddEventDetailScreen'}}
      />
      <Stack.Screen
        name="AddEventLocation"
        component={AddEventLocation}
        options={{title: 'AddEventLocation'}}
      />
      <Stack.Screen
        name="AllEventDetailScreen"
        component={AllEventDetailScreen}
        options={{title: 'AllEventDetailScreen'}}
      />
      <Stack.Screen
        name="AllEventScreen"
        component={AllEventScreen}
        options={{title: 'AllEventScreen'}}
      />
      <Stack.Screen
        name="ArtistsToWatchAllScreen"
        component={ArtistsToWatchAllScreen}
        options={{title: 'ArtistsToWatchAllScreen'}}
      />
      <Stack.Screen
        name="Events"
        component={Events}
        options={{title: 'Events'}}
      />
      <Stack.Screen
        name="Customisableusersubscriptions"
        component={Customisableusersubscriptions}
        options={{title: 'Customisableusersubscriptions'}}
      />
      <Stack.Screen
        name="SubscriptionDetails"
        component={SubscriptionDetails}
        options={{title: 'SubscriptionDetails'}}
      />
      <Stack.Screen
        name="ApiIntegration"
        component={ApiIntegration}
        options={{title: 'ApiIntegration'}}
      />
      <Stack.Screen
        name="CountryCodeSelector"
        component={CountryCodeSelector}
        options={{title: 'CountryCodeSelector'}}
      />
      <Stack.Screen
        name="CountryCodeSelectorTable"
        component={CountryCodeSelectorTable}
        options={{title: 'CountryCodeSelectorTable'}}
      />
      <Stack.Screen
        name="UserProfileBasicBlock"
        component={UserProfileBasicBlock}
        options={{headerShown: false, title: 'UserProfileBasicBlock'}}
      />
      <Stack.Screen
        name="Eventregistration"
        component={Eventregistration}
        options={{title: 'Eventregistration'}}
      />
      <Stack.Screen
        name="Pushnotifications"
        component={Pushnotifications}
        options={{title: 'Pushnotifications'}}
      />
      <Stack.Screen
        name="Scheduling"
        component={Scheduling}
        options={{title: 'Scheduling'}}
      />
      <Stack.Screen
        name="Contactus"
        component={Contactus}
        options={{headerShown: false, title: 'Contactus'}}
      />
      <Stack.Screen
        name="AddContactus"
        component={AddContactus}
        options={{title: 'AddContactus'}}
      />
      <Stack.Screen
        name="Settings2"
        component={Settings2}
        options={{headerShown: false, title: 'Settings2'}}
      />
      <Stack.Screen name="Share" component={Share} options={{title: 'Share'}} />
      <Stack.Screen
        name="Rolesandpermissions"
        component={Rolesandpermissions}
        options={{title: 'Rolesandpermissions'}}
      />
      <Stack.Screen
        name="Favourites"
        component={Favourites}
        options={{title: 'Favourites'}}
      />
      <Stack.Screen
        name="AddFavourites"
        component={AddFavourites}
        options={{title: 'AddFavourites'}}
      />
      <Stack.Screen
        name="Comments"
        component={Comments}
        options={{title: 'Comments'}}
      />
      <Stack.Screen
        name="CreateComment"
        component={CreateComment}
        options={{title: 'CreateComment'}}
      />
      <Stack.Screen
        name="PostCreation"
        component={PostCreation}
        options={{title: 'PostCreation'}}
      />
      <Stack.Screen name="Posts" component={Posts} options={{title: 'Posts'}} />
      <Stack.Screen
        name="PostDetails"
        component={PostDetails}
        options={{title: 'PostDetails'}}
      />
      <Stack.Screen
        name="SocialMediaAccountLoginScreen"
        component={SocialMediaAccountLoginScreen}
        options={{title: 'SocialMediaAccountLoginScreen'}}
      />
      <Stack.Screen
        name="RequestManagement"
        component={RequestManagement}
        options={{headerShown: false, title: 'RequestManagement'}}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{title: 'Search'}}
      />
      <Stack.Screen
        name="SocialMediaAccountRegistrationScreen"
        component={SocialMediaAccountRegistrationScreen}
        options={{title: 'SocialMediaAccountRegistrationScreen'}}
      />
      <Stack.Screen
        name="EmailAccountLoginBlock"
        component={EmailAccountLoginBlock}
        options={{headerShown: false, title: 'EmailAccountLoginBlock'}}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{headerShown: false, title: 'ForgotPassword'}}
      />
      <Stack.Screen
        name="ForgotPasswordOTP"
        component={ForgotPasswordOTP}
        options={{headerShown: false, title: 'ForgotPasswordOTP'}}
      />
      <Stack.Screen
        name="NewPassword"
        component={NewPassword}
        options={{headerShown: false, title: 'NewPassword'}}
      />
      <Stack.Screen
        name="TermsConditions"
        component={TermsConditions}
        options={{headerShown: false, title: 'TermsConditions'}}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{headerShown: false, title: 'PrivacyPolicy'}}
      />
      <Stack.Screen
        name="TermsConditionsDetail"
        component={TermsConditionsDetail}
        options={{title: 'TermsConditionsDetail'}}
      />
      <Stack.Screen
        name="TermsConditionsUsers"
        component={TermsConditionsUsers}
        options={{title: 'TermsConditionsUsers'}}
      />
      <Stack.Screen
        name="BulkUploading"
        component={BulkUploading}
        options={{title: 'BulkUploading'}}
      />
      <Stack.Screen
        name="EmailAccountRegistration"
        component={EmailAccountRegistration}
        options={{headerShown: false, title: 'EmailAccountRegistration'}}
      />
      <Stack.Screen
        name="PhotoLibrary"
        component={PhotoLibrary}
        options={{title: 'PhotoLibrary'}}
      />
      <Stack.Screen
        name="Categoriessubcategories"
        component={Categoriessubcategories}
        options={{title: 'Categoriessubcategories'}}
      />
      <Stack.Screen
        name="CategoriesSubCategories"
        component={Categoriessubcategories}
        options={{headerShown: false, title: 'CategoriesSubCategories'}}
      />
      <Stack.Screen
        name="InfoPage"
        component={HomeScreen}
        options={{headerShown: false, title: 'Info'}}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{headerShown: false, title: 'EditProfile'}}
      />
      <Stack.Screen
        name="CreateYourProfile"
        component={CreateYourProfile}
        options={{headerShown: false, title: 'CreateYourProfile'}}
      />
      <Stack.Screen
        name="HelpCentre"
        component={HelpCentre}
        options={{headerShown: false, title: 'HelpCentre'}}
      />
      <Stack.Screen
        name="AboutUs"
        component={AboutUs}
        options={{headerShown: false, title: 'AboutUs'}}
      />
      <Stack.Screen
        name="SearchResult"
        component={SearchResult}
        options={{headerShown: false, title: 'SearchResult'}}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{headerShown: false, title: 'ChangePassword'}}
      />
      <Stack.Screen
        name="Followers"
        component={Followers}
        options={{headerShown: false, title: 'Followers'}}
      />
      <Stack.Screen
        name="PostSelection"
        component={PostSelection}
        options={{headerShown: false, title: 'PostSelection'}}
      />
      <Stack.Screen
        name="PostPostpone"
        component={PostPostpone}
        options={{headerShown: false, title: 'PostPostpone'}}
      />
      <Stack.Screen
        name="ImageSelection"
        component={ImageSelection}
        options={{headerShown: false, title: 'ImageSelection'}}
      />
      <Stack.Screen
        name="RepresentativeCertification"
        component={RepresentativeCertification}
        options={{headerShown: false, title: 'RepresentativeCertification'}}
      />
      <Stack.Screen
        name="ClaimPage"
        component={ClaimPage}
        options={{headerShown: false, title: 'ClaimPage'}}
      />
      <Stack.Screen
        name="CreatePage"
        component={CreatePage}
        options={{headerShown: false, title: 'CreatePage'}}
      />
      <Stack.Screen
        name="DisputeForm"
        component={DisputeForm}
        options={{headerShown: false, title: 'DisputeForm'}}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{headerShown: false, title: 'Chat'}}
      />
      <Stack.Screen
        name="PhotoLibraryDetail"
        component={PhotoLibraryDetail}
        options={{headerShown: false, title: 'PhotoLibraryDetail'}}
      />
      <Stack.Screen
        name="HomeEmptyScreen"
        component={HomeEmptyScreen}
        options={{headerShown: false, title: 'HomeEmptyScreen'}}
      />
    </Stack.Navigator>
  );
}

export function App() {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#08080f"
        translucent={false}
      />
      <NavigationContainer>
        <SafeAreaView style={{flex: 1, backgroundColor: '#08080f'}}>
          <HomeStack />
        </SafeAreaView>
      </NavigationContainer>
    </>
  );
}
