Feature: AllEventScreen

    Scenario: User navigates to AllEventScreen
        Given I am a User loading AllEventScreen
        When I navigate to the AllEventScreen
        Then User clicks on modal buttons
        When expandedItems has data
        Then User clicks on header buttons
        Then Render flatlist for guest user
        When Shows are more
        Then Render shows flatlist for guest user
        Then User clicks on event to navigate
        When User clicks on All tab
        Then All tab activates
        When User is a logged in user
        Then User clicks on notification bell
        Then Render event list
        When Event has some likes & comments
        Then Show likes & comments count
        When User likes an event
        Then Update likes count
        Then Platform is iOS
        Then Platform is Android
        When selectedState is empty
        Then Render UI with empty selectedState
        When selectedState is California
        Then Render UI with California as selectedState
        When selectedState is California and expandedItems is empty
        Then Render UI with California as selectedState and expandedItems is empty
        When selectedState is California and expandedItems has state
        Then Render UI with California as selectedState and expandedItems has MP as state
        When I call the events by location API successfully
        Then I get the expected response
        When I call the events by location API with no data
        Then I get blank events list
        When I call the events by location API with failure
        Then I get no data
        When I call the events list API but with location permissions
        Then I get blank events list
        When I call the create comment API
        Then I get the expected response
        When I call the get comments API
        Then the comments are fetched
        When I click the closeCommentsPopupButton
        Then the comment popup disappears
        When I enter text into the commentTextInput
        Then the comment text is updated

    Scenario: Comments
        Given I am a User loading AllEventScreen
        When I navigate to the AllEventScreen
        Then I can toggle the comments popup
    
    Scenario: Comments popup
        Given I am a User opening the comments popup
        When I open the comments popup
        Then I can reply
        Then I can like
        When isEditing and showReplies are true
        Then Trigger api with isEditing and showReplies true
        When isEditing is true and showReplies is false
        Then Trigger api with isEditing true and showReplies false
        When I click profile picture
        Then it goes to profile

    Scenario: Pickers in iOS
        Given User attempting to AllEventScreen
        When User click the state picker
        Then User can select the state

    Scenario: Web socket
        Given The initial setup
        When websocket is created
        Then it can connect to it
        When component is unmounted
        Then close is called
    
    Scenario: Posts data should not be shown on screen for guest users
        Given User attempting to AllEventScreen
        When The screen is loaded for a guest user with only posts
        Then Nothing should be showed to the guest user

    Scenario: Logged out user sees signup banner below filters
        Given I am a User loading AllEventScreen
        When I navigate to the AllEventScreen
        Then Guest signup banner is shown below filters

    Scenario: User taps Show more on the home feed
        Given I am a User loading AllEventScreen
        When I navigate to the AllEventScreen
        When the home feed has twenty five swimming shows
        Then the home feed shows ten events
        When I tap Show more
        Then the home feed shows twenty events
        When I tap Show more again
        Then the home feed shows all twenty five events

    Scenario: Home feed shows artists to watch and hot venues
        Given I am a User loading AllEventScreen
        When I navigate to the AllEventScreen
        When the home feed has swimming shows from the API
        Then Artists to Watch and Hot Venues are shown from those shows

    Scenario: See all artists opens the all artists screen
        Given I am a User loading AllEventScreen
        When I navigate to the AllEventScreen
        When the home feed has swimming shows from the API
        Then See all opens the all artists list

    Scenario: User navigate to all AllEventScreen with params on the route
        Given User attempting to AllEventScreen
        When I load the AllEventScreen screen
        Then I expect to show a created post success message