Feature: BulkUploading

    Scenario: User navigates to BulkUploading
        Given I am a User loading BulkUploading
        When I navigate to the BulkUploading
        Then BulkUploading will load with out errors
        And Set token from session response
        When I can choose file from file input
        Then User remove one file from selected files
        And Only one file should be present in selected file
        When User click on submit button to upload files
        Then Network response for create bulk uploading files
        When User click on get button to get all bulk uploaded
        Then Network call should be call to get upload files
        And Set network response for get upload files
        Then User click on download button to download file
        When User click on delete button to delete all files
        Then Network should be call to delete all file
        And Set network response for delete all file
        And User can leave the screen with out errors