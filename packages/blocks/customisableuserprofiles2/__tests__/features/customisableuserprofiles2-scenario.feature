Feature: customisableuserprofiles2

    Scenario: User navigates to customisableuserprofiles2
        Given I am a User loading customisableuserprofiles2
        When I navigate to the customisableuserprofiles2
        Then User opens drawer menu
        When User opens other band's profile
        Then API is called
        When test
        Then API is called

    Scenario: Comments
        Given I am a User loading customisableuserprofiles2
        When I navigate to the customisableuserprofiles2
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
