Feature: Geofence

    Scenario: User navigates to Geofence
        Given I am a User loading Geofence
        When I navigate to the Geofence
        Then Geofence will display my location on the screen
        