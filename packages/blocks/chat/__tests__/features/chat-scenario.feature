Feature: Chat

  Scenario: Rendering of the Chat Screen
    Given The initial setup
    When I navigate to Chat
    Then Chat will load

  Scenario: Testing archival of chats
    Given The initial setup
    When archiveList is empty and archiveSelected is false
    Then Render UI when archiveList is empty and archiveSelected is false
    When User archives a chat
    Then Chat will load with archived list
  
  Scenario: Testing APIs
    Given The initial setup
    When I send the API requests through runengine
    Then the data is saved properly
    
  Scenario: UI rendering
    Given The initial setup
    When I am loading renderConversationItem with correct parameter
    Then renderConversationItem loads up
  
  Scenario: User interactions
    Given The initial setup
    When I change text in txtMsgInput
    Then the value gets updated
    When I click btnSend
    And the api is called
    When I click the back button
    And it navigates back

  Scenario: Cleaning up
    Given The initial setup
    When I exit the screen
    Then socket is closed

  Scenario: API Calls
    Given The initial setup
    When I call the send event API
    Then getMessages is called
  
  Scenario: Web socket
    Given The initial setup
    When websocket is created
    Then it can connect to it
  
  Scenario: Render event
    Given The initial setup
    When renderEvent is invoked
    Then it renders properly
    When user click on hamburger icon
    When renderMessage invoked
    When i want to send image from gallary
    When i want to send image from Camera
    When i cancel to pick image

  Scenario: Profile Nav From Chat
    Given Render Profile Nav Buttons
    When User Try To Navigate To Other User Profile
  
  Scenario: The APIs should not be called if token is empty
        Given user enters chat page
        When token is empty or invalid
        Then the api would not be called

  Scenario: The APIs should be called if token is valid
    Given user enters chat page
    When token is valid
    Then the api would be called
 