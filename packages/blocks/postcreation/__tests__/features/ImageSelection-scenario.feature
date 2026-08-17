Feature: ImageSelection

    Scenario: User navigates to ImageSelection for Post a Show
        Given I am a User loading ImageSelection
        When I navigate to the ImageSelection
        Then User interacts with UI
        When User clicks from camera
        Then Render the camera image on UI
        When User gets gallery images
        Then Render gallery images

    Scenario: User navigates to ImageSelection for Post a Picture
        Given I am a User loading ImageSelection
        When I navigate to the ImageSelection
        Then User interacts with UI
        When User clicks from camera
        Then Render the camera image on UI
        When User gets gallery images
        Then Render gallery images

    Scenario: Camera Access
        Given I am a User loading ImageSelection
        When I press select photo button
        Then User interacts with the camera modal
        When I press cancel button
        Then The camera modal is closed

        When I open the modal and select take a photo
        Then I expect the camera should be opened
        When I open the modal and select choose a photo
        Then I expect the photos library should be opened

    Scenario: Camera access declined by the user
        Given I am a User loading ImageSelection
        When A user declines camera permission
        Then I expect to show an error message

    Scenario: Camera Access on IOS device
        Given I am a User loading ImageSelection on IOS device
        When I press select photo button and select take a photo button
        Then User interacts with the camera screen
        When I press select photo button and press choose photos button
        Then User interacts with the library

    Scenario: Camera Access with errors
        Given I am a User loading ImageSelection
        When I open the modal and select take a photo
        Then I expect the camera should not be opened
        When I open the modal and select choose a photo
        Then I expect the library should not be opened
        



