Feature: Geofence

    Scenario: User navigates to Geofence
        Given I am a User loading Geofence
        When I navigate to the Geofence
        Then Geofence will display my location on the screen
        
    Scenario: User navigates to Geofence with api errors
        Given I am a User loading Geofence
        When I navigate to the Geofence
        Then Geofence will display error instead of my location
   