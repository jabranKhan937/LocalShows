Feature: rolesandpermissions

    Scenario: User navigates to rolesandpermissions
        Given I am a User loading rolesandpermissions
        When I navigate to the rolesandpermissions
        Then rolesandpermissions will load with out errors
        And controller functions work properly
        And Icons work properly
        And I can select the buttons with with out errors
        And I can navigate to login
        And I can leave the screen with out errors