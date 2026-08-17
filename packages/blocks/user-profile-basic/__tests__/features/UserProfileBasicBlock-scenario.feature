Feature: UserProfileBasicBlock

    Scenario: User navigates to UserProfileBasicBlock
        Given I am a User loading UserProfileBasicBlock
        When I navigate to the UserProfileBasicBlock
        Then User clicks the back button
        When attributes is empty
        Then render UI when attributes is empty
        When id is not empty
        Then render UI when id is not empty
        When catgories has value
        Then render UI when catgories has value
        When band_artists has value
        Then render UI when band_artists has value
        When calendar_event has value
        Then render UI when calendar_event has value
        Then render user details
        When I send a successful follow API response
        Then alert is shown
        When showCommentsBtn is pressed
        Then comments modal is open
        When closeCommentsModalButton is pressed
        Then comments modal is closed
        When comment is submitted
        Then comment is posted
        When comment is edited
        Then comment is posted
        When private account is used
        Then it checks for followers

    Scenario: Test render events
        Given I am a User loading UserProfileBasicBlock
        When I call like event API
        Then getUserDetailsAPI is invoked
        When I try to render event
        Then I can render event
        When I click likeEventBtn
        Then I can like event
        When I click shareEventBtn
        Then navigate() is invoked
    
    Scenario: Comments
        Given I am a User loading UserProfileBasicBlock
        When I navigate to the UserProfileBasicBlock
        Then I can toggle the comments popup

    Scenario: Render and interact with the comment component
        Given the component is rendered
        When I try to render the component
        Then the component should render correctly
        When I click the profile image button
        Then the profile is shown
        When the reply button is pressed
        Then input.focus() is invoked
        When the show reply button is pressed
        Then reply modal is open
        When the like button is pressed
        Then you can like comments
    
    Scenario: Render comments
        Given the component is rendered
        When I try to render the component
        Then the component should render correctly

    Scenario: Render hidden comments
        Given the component is rendered
        When I try to render the component
        Then the component should render correctly
        When the edit button is pressed
        Then input.focus() is invoked
        When delete button is pressed
        Then comments can be deleted
    
    Scenario: Render replies modal
        Given the component is rendered
        When I try to render the component
        Then the component should render correctly
        When emojiReply button is pressed
        Then emojis are inserted
        When onChange is triggered on reply text input
        Then reply is updated
        When close modal button is pressed
        Then modal is closed

    Scenario: Render replies
        Given the component is rendered
        When I try to render the component
        Then the component should render correctly
        When userProfileImage is pressed
        Then profile is shown
    
    Scenario: Render reply item
        Given the component is rendered
        When I try to render the component
        Then the component should render correctly
        When showProfileBtn is pressed
        Then profile is shown

    Scenario: Render reply hidden item
        Given the component is rendered
        When I try to render the component
        Then the component should render correctly
        When edit is pressed
        Then reply can be edited
        When deleteReply is pressed
        Then reply can be deleted
    
    Scenario: Create and delete comments
        Given the component is rendered
        When I try to render the component
        Then the component should render correctly
        When delete comment API is called
        Then API call goes through
        When post comment API is called
        Then API call goes through

    Scenario: Calendar and liked events
        Given the component is rendered
        When the calendar and liked events are set
        Then the component should render correctly
    
    Scenario: Render preferences
        Given the component is rendered
        When the calendar and liked events are set
        Then the component should render correctly
