Feature: eventregistration

    Scenario: User navigates to eventregistration
        Given I am a User loading eventregistration
        When I navigate to the eventregistration
        Then eventregistration will load with out errors
        When I navigate to the Eventregistration
        When I navigate to the hamburgerBtn
        When I navigate to the navigationBackButton
        When I toggle to the privateAccount
        When I navigate to the notificationScreen
        When I press this btn modal close

Scenario: Test generic functions
        Given I am a User loading eventregistration
        When I navigate to the eventregistration
        And I call txtInputWebProps onChangeText function
        Then I expect txtInputValue to have some value
        When I call btnShowHideProps onPress function
        Then I expect enabledField to be true
        When I call btnExampleProps onPress function
        Then I expect doButtonPressed to be called
        When I call setEnableField
        Then I expect enableField to be false

Scenario: User navigates to ItineraryDetails with pending accepted itinerary
        Given I am a User loading eventregistration for ios
        When I press addItineraryBtn with card pending accept
        Then I expect the handleFieldsBlank to be called
        When I try to delete itineraryCard with accept pending
        Then I can see the card beeing deleted from the list
        When I press cancel on delete itinerary modal
        Then I should get back to the current page
        When I press upArrow button Icon
        Then I should hide all the cards
        When I select the itinerary card
        Then I should go to the itinerary Card screen with the itinerary card information
        When I am in the itineraryDetails screen with the params sended
        Then I can see the cards with the params selected

Scenario: User navigates to eventregistration for ios
        Given I am a User loading eventregistration for ios
        When I navigate to the eventregistration for ios
        Then eventregistration will load with out errors for ios
        When I press to the DateRangePicker
        Then I expect to show the start date and end date on the datefield
        When I press to the btnCountrySelect
        Then I expect the country to be selected
        When I press to the StateDropdown
        Then I expect the state modal to be opened
        When I try to select the state with no countries selected
        Then I expect state button to be disabled
        When I press to the btnCitySelect
        Then I expect a cityPickerModal modal to be opened
        When I choose the city
        Then I expect the city to be on the field
        When I press to the btnTypeSelect
        Then I expect a typePickerModal modal to be opened
        When I choose the type
        Then I expect the type to be on the field
        When I press addItineraryBtn with countries blank fields
        Then I expect the handleFieldsBlank to be called
        When I press addItineraryBtn with states blank fields
        Then I expect the handleFieldsBlank to be called
        When I press addItineraryBtn with cities blank fields
        Then I expect the handleFieldsBlank to be called
        When I press addItineraryBtn
        Then scrols to the new tile
        Then I can see a card on the bottom
        When I press acceptBtn
        Then The api should be called to create a itinerary

Scenario: User navigates to eventregistration for android
        Given I am a User loading eventregistration for android
        When I navigate to the eventregistration for android
        Then eventregistration will load with out errors for android
        When I press to the countryPicker and change the value to outside country
        Then I expect the modal with warning to be showed on screen
        When I press to the countryPicker and change the value
        Then I expect the countryPicker to be United States as value
        When I press to the statePicker and change the value
        Then I expect the statePicker to be United States as value
        When I choose the city
        Then I expect the city to be on the field
        When I choose the type
        Then I expect the type to be on the field

Scenario: API calls with success to eventregistration
        Given I am a User loading eventregistration
        When I navigate to the eventregistration
        Then I expect the apis to be called
        When I fill the fields
        And I press the addItineraryBtn
        Then I expect a post API to be called
        Then I expect a post API to be called with error
        When I have an itinerary item and I press delete icon
        Then I expect an delete API to be called with success
        Then I expect an delete API to be called with error

Scenario: API calls with errors to eventregistration
        Given I am a User loading eventregistration
        When I navigate to the eventregistration
        Then I expect the apis to be called with errors

Scenario: User navigates to ItineraryDetails
        Given I am a User loading eventregistration
        When I press search button with no date selected
        Then eventregistration will show an alert error
        When I press search button with date selected
        Then eventregistration will show ItineraryDetails screen with the params


Scenario: User navigates to ItineraryDetails with country and date params only
        Given I am a User loading eventregistration
        When I select the date of the show and I select the country
        And I press search button
        Then eventregistration will show ItineraryDetails screen with the params selected


Scenario: User loads ItineraryDetails screen
        Given I am a User loading ItineraryDetails
        When I navigate to the ItineraryDetails
        Then ItineraryDetails will load with out errors
        When I press like button
        Then I expect to show the like button filled
        And I expect to show the like button outfilled
        When I call handleNotificationNavigationPressed function
        Then I expect the function to be called

Scenario: User press edit search button
        Given I am a User loading ItineraryDetails screen
        When I navigate to the ItineraryDetails screen
        And I press edit search button
        Then I expect to be redirected to travels screen

Scenario: API calls with success to ItineraryDetails screen
        Given I am a User loading ItineraryDetails screen
        When I navigate to the ItineraryDetails screen
        Then I expect to get the params from the other screen
        Then I expect to get the params from the itinerary Card selected
        Then I expect the categories api to be called
        Then I expect the apis to be called
        Then I expect the apis to be called with errors
        When I press back arrow button
        Then I expect to get back to travels screen

Scenario: Comments section
        Given I am a User loading ItineraryDetails screen
        When I press comments icon button
        Then I can see the modal to be showed
        And The api be called with the comments
        When I press close modal button
        Then I expect the show comments modal to be closed
        When I select an emoticon
        And I type an comment and press submit button
        And I type an comment and press submit button with isEdditing true
        Then I expect the api to be called
        When I press reply button
        Then I can see the replies and call the reply submit function
        And I can call reply submit function with isEditing as true
        And I expect to call modal close functions
    
Scenario: Test generic functions in ItineraryDetails
        Given I am a User loading ItineraryDetails screen
        When I navigate to the ItineraryDetails and call generics functions
        Then I expect the function to be called

Scenario: User selects a date range using the calendar
    Given the calendar is initially hidden
    When the user opens the calendar
    Then the calendar should be visible
    When the user selects a start date and an end date
    Then the start and end dates should be updated and calendar hidden
        