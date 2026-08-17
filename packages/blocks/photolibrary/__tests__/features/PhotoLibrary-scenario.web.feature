Feature: PhotoLibrary

    Scenario: User navigates to PhotoLibrary
        Given I am a User loading PhotoLibrary
        When User navigate to the PhotoLibrary
        Then PhotoLibrary will load without errors
        Then User can click the view Image without errors
        Then Image view modal opens without errors
        When User can press share modal button without errors
        Then User try to share with an empty account id
        Then User share the PhotoLibrary without errors
        Then User can click add image modal btn without errors
        When User try to save an empty image
        Then Add new image modal opens and user can save the new image data without errors
        Then User can select delete image and gallery buttons without errors
        Then User can leave the screen without errors