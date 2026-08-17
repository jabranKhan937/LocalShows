Feature: UserProfileBasicBlock

    Scenario: User navigates to CreateProfile
        Given I am a User loading CreateProfile
        When I navigate to the CreateProfile
        Then CreateProfile is rendered properly
        When I click the navigationBackButton
        Then goBack method is called
        When I click the saveBtn
        Then isLoading is true
        When I click the cancelButton
        Then isLoading is true
        When I click the profilePicButton
        Then isLoading is true
        When I click the coverPicButton
        Then isLoading is true
        When I change text in the adminNameTextInput
        Then name is updated
        When I change text in the websiteTextInput
        Then website is updated
        When I change text in the instagramTextInput
        Then instagram link is updated
        When I change text in the facebookTextInput
        Then facebook link is updated
        When I change text in the linkedinTextInput
        Then linkedin link is updated
        When I change text in the aboutUsTxtInput
        Then aboutUs is updated
        When I submit text in the affiliateTextInput without change
        Then affiliateTxt is reset
        When I change text in the affiliateTextInput
        Then affiliateTxt is updated
        When I change and submit text in the affiliateTextInput
        Then affiliateTxt is reset
        When I click btnRemoveAffiliate
        Then affiliatesList is cleared
        When I change value in the categoryPicker
        Then bandType is updated
        When I click btnRemoveInfluence
        Then influencesList is cleared
        When I click the saveBtn
        Then isLoading is true
        When I call API to create band profile
        Then isLoading is false
    
    Scenario: Rendering in iOS
        Given I am a User loading CreateProfile
        When I navigate to the CreateProfile
        Then CreateProfile is rendered properly
        When I change value in the pickerModal
        Then showPickerModal is false
        When I change value in the categoryPickerModal
        Then showPickerModal is false
        When I change value in the subCategoryPickerModal
        Then showPickerModal is false
        When I click the btnCategoryPicker
        Then showPickerModal is true
        When I change value in the pickerModal
        Then showPickerModal is false
        When I change value in the pickerModal
        Then showPickerModal is false
        When I click the influencesTextInput
        Then showPickerModal is true
        When I change value in the pickerModal
        Then showPickerModal is false
    
    Scenario: User navigates to CreateProfile in Edit mode
        Given I am a User loading CreateProfile
        When I navigate to the CreateProfile
        Then CreateProfile is rendered properly
        When I change text in the adminNameTextInput
        Then name is updated
        When I change text in the aboutUsTxtInput
        Then aboutUs is updated
        When I click the saveBtn
        Then isLoading is true
        When I call API to edit band profile
        Then goBack is called
    Scenario: User Edit Email And Phone
        Given User Try to Type in Input
        When User Add Text In Input
