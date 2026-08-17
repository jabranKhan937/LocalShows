## Building Blocks React Native Mobile - Social Media Account

Building Blocks - React Native Master App - Social Media Account

## Getting Started

React Native Social Authentication: https://rnfirebase.io/auth/social-auth

### Prerequisites

src/package.json includes

"@react-oauth/google": "0.8.0"

### Setting up environment to google login for web

### STEP-1: Create Google Cloud Project

Create a project in google cloud platform with this url: https://console.cloud.google.com/projectcreate.
If you have existing project skip step-1.

<br/>

### STEP-2: Create OAuth Client ID
Create OAuth webclient id from google cloud project dashboard with following steps. \
a. You can find APIs & Services > Credentials tab from sidebar of the dashboard. Or you can go directly with this url: https://console.cloud.google.com/apis/credentials \
b. Go to CREATE CREDENTIALS > OAuth client ID \
c. Select Web Application from application type \
d. Enter your app name \
e. You must have to add Authorized JavaScript origins (Your domain name). If you are working in localhost then you have to add https://localhost:3000. \
f. Click on Create button \
g. You can find your Client ID from modal when your app is successfully created.

<br/>

### STEP-3: Add Client ID in config file
Replace your client id with the value of exports.clientID from config.js file. e.g.
``exports.clientID = "<<your-client-id>>"``

<br/>

### Git Structure

N/A

### Installing

N/A

## Running the tests

yarn && yarn test

## CI/CD Details

N/A

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).



