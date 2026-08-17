Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.ACCOUNT_TYPE_EMAIL = "EmailAccount";
exports.ACCOUNT_TYPE_SOCIAL = "SocialAccount";
exports.ACCOUNT_TYPE_PHONE = "SmsAccount";

exports.contentTypeApiUpdateUser = "application/json";
exports.apiEndPointUpdateUser = "profile/profile";
exports.apiUpdateUserType = "PUT";

exports.urlGetValidations = "profile/validations";
exports.validationApiContentType = "application/json";
exports.validationApiMethodType = "GET";

exports.contenttypeApiValidateMobileNo = "application/json";
exports.endPointApiValidateMobileNo = "profile/change_phone_validation";
exports.callTypeApiValidateMobileNo = "POST";

exports.endPointApiGetUserProfile = "profile/profile";
exports.contentTypeApiGetUserProfile = "application/json";
exports.methodTypeApiGetUserProfile = "GET";

// Customizable Area Start
exports.placeHolderEmail = "Email";
exports.labelHeader =
  "This is your profile, Here you can see and update your personal information.";
exports.labelFirstName = "First name";
exports.lastName = "Last name";
exports.labelArea = "Area";
exports.labelMobile = "Mobile";
exports.labelEmail = "Email";
exports.labelCurrentPassword = "Current password";
exports.labelNewPassword = "New Password";
exports.labelRePassword = "Re-Type Password";
exports.btnTextCancelPasswordChange = "Cancel";
exports.btnTextSaveChanges = "Save Changes";
exports.btnTextChangePassword = "Change Password";
exports.errorCountryCodeNotSelected = "Please select country code";
exports.errorMobileNoNotValid = "Phone number is not valid.";
exports.errorTitle = "Error";
exports.errorBothPasswordsNotSame = "Passwords must match.";
exports.errorCurrentNewPasswordMatch = "New password cannot match current password.";
exports.errorCurrentPasswordNotValid = "Current password not valid.";
exports.errorNewPasswordNotValid = "New password not valid.";
exports.errorReTypePasswordNotValid = "Re-type password not valid.";
exports.hintCountryCode = "Select Country";
exports.errorBlankField = "can't be blank";
exports.errorEmailNotValid = "Email not valid.";
exports.userDetailEndPoint = "account_block/show_user_profile";
exports.getCitiesEndpoint = "/account_block/show_cities?country_name=US&state="
exports.getStatesEndpoint = "/account_block/show_states?country_name=";
exports.bandArtistsAPIEndpoint = "/bx_block_categories/band_artists/all_band_artists";

exports.adminNameUnavilableError = "Admin name required";
exports.bioUnavilableError = "Bio is required";

exports.errorNameCannotBeBlank = "Name cannot be blank";
exports.errorNameCanOnlyContainAlphabets = "Name can only contain alphabets";
exports.errorEmailCannotBeBlank = "Email cannot be blank";
exports.errorCountryCannotBeBlank = "Country cannot be blank";
exports.errorStateCannotBeBlank = "State cannot be blank";
exports.errorCityCannotBeBlank = "City cannot be blank";
exports.errorPhoneCannotBeBlank = "Cell Phone cannot be blank";
exports.errorPhoneNumberLength = "Cell Phone number invalid";
exports.errorAddressCannotBeBlank = "Address cannot be blank";
exports.errorZipCodeCannotBeBlank = "Zip code cannot be blank";
exports.errorZipCodeLength = "Zip code must be at least 5 digits";
exports.methodTypeApiPatchUserProfile = "PATCH";
exports.editProfileEndPoint = "account_block/update_user_profile"
exports.contentTypeFormData="multipart/form-data"
exports.createBandProfileEndpoint = "/bx_block_profile/profiles";
exports.createBandProfileApiMethod = "POST";
exports.editBandProfileEndpoint = "/bx_block_profile/update_profile";
exports.editBandProfileApiMethod = "PATCH";
exports.createFollowApiEndpoint = "/bx_block_favourites/follows";
exports.createFollowApiMethod = "POST";
exports.createFollowContentType = "application/json";
exports.toggleLikeApiEndPoint = "/bx_block_like/likes";
exports.toggleLikeApiMethod = "POST";
exports.toggleLikeContentType = "application/json";
exports.categoriesEndPoint = "/bx_block_categories/categories/all_categories";
exports.subCategoriesEndPoint = "/bx_block_categories/categories/all_subcategories?category_id=";
exports.fetchCommentsEndpoint = "/bx_block_comments/comments";
exports.likeCommentEndpoint = "/bx_block_like/likes/create_comment_like";
exports.createCommentApiEndpoint = "/bx_block_comments/comments";
exports.postCommentMethodType = "POST";
exports.editCommentMethodType = "PUT";
exports.deleteMethodType = "DELETE";
exports.countriesList = "/account_block/get_all_countries";
exports.countryCodeList = "/account_block/accounts/country_code_and_flags/1";
exports.websiteLinkError = "Website invalid";
exports.instagramLinkError = "Instagram link invalid";
exports.facebookLinkError = "Facebook link invalid";
exports.linkedInLinkError = "LinkedIn link invalid";
exports.privateAccount = "This account is private. Ask to follow\nto learn about this account."
exports.followersListEndPoint = "/bx_block_favourites/follows"
exports.followersListAPIContentType = "application/json";
exports.followersListAPIMethod = "GET";
exports.deleteApiMethodType = "DELETE";
exports.rulesAndRegulationsEndpoint = "/bx_block_roles_permissions/rules_and_regulations_icons";
exports.checkUnreadNotificationsEndpoint = "/account_block/check_unread_notifications";
exports.categoryApiContentType = "application/json";
exports.httpPatchType = "PATCH";
// Customizable Area End

