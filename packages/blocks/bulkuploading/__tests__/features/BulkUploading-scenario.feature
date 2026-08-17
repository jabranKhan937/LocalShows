Feature: BulkUploading

    Scenario: User navigates to BulkUploading
        Given I am a User loading BulkUploading
        When I navigate to the BulkUploading
        Then BulkUploading will load with out errors
        And Set token from session response
        When User choose file from file input
        Then User remove one file from selected files
        And Only one file should be present in selected file
        When User press on submit button to upload files
        Then Network response for create bulk uploading files
        And File uploaded status should be success
        When User click on get uploaded button
        And Set network response for get upload files
        Then User press on download button to download file
        Then downloadFile function should be call
        When User press on delete button to delete all files
        Then Network should be call to delete all file
        And I can leave the screen with out errors