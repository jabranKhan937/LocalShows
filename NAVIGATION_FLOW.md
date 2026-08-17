# Navigation Flow in OTP Verification

## Current Navigation Mechanism

### 1. **NavigationMessage System** (Primary Method)

**Location:** `packages/framework/src/Blocks/NavigationBlock.tsx`

```typescript
// NavigationBlock receives NavigationMessage and executes navigation
async receive(from: string, message: Message) {
  if (message.id === getName(MessageEnum.NavigationMessage)) {
    const props = message.getData(getName(MessageEnum.NavigationPropsMessage));
    if (props && props.navigation) {
      props.navigation.navigate(
        message.getData(getName(MessageEnum.NavigationTargetMessage)),
        { navigationBarTitleText: screenTitle }
      );
    }
  }
}
```

**How it works:**
- A `NavigationMessage` is created
- `NavigationTargetMessage` is added with the target screen name
- `NavigationPropsMessage` contains the navigation props
- `NavigationBlock` receives the message and calls `props.navigation.navigate()`

### 2. **Storage-Based Navigation** (Secondary Method)

**Location:** `packages/components/src/HomeScreen.tsx` (line 1432-1439)

```typescript
getToken = async () => {
  const token = await getStorageData('authToken');
  const redirectionNav = await getStorageData('redirectionNav');
  this.setState({ token });
  if (redirectionNav !== null) {
    this.setState({ initialRoute: redirectionNav });
  }
};
```

**How it works:**
- `redirectionNav` is stored in AsyncStorage
- `HomeScreen.getToken()` reads it and sets `initialRoute` state
- `HomeStack` uses `initialRoute` as its `initialRouteName` (line 2072)

### 3. **Current OTP Navigation Code**

**Location:** `packages/blocks/otp-input-confirmation/src/OTPInputAuthController.tsx`

#### For Account Block (Signup) - Lines 252-310:

```typescript
handleAccountBlockResponse = async (responseJson: any, message: Message) => {
  // ... determines redirectionNav based on userRole and accountType
  
  if (dispute_form || claim_page) {
    // Method 1: Direct navigation via NavigationMessage
    message.addData(
      getName(MessageEnum.NavigationTargetMessage),
      redirectionNav,  // 'DisputeForm' or 'ClaimPage'
    );
  } else {
    // Method 2: Storage-based navigation
    setStorageData('redirectionNav', redirectionNav);  // 'CreateYourProfile' or 'CategoriesSubCategories'
    // Sends AuthTokenEmailMessage which triggers HomeScreen.getToken()
  }
  
  this.send(message);  // Sends NavigationMessage
}
```

#### For Non-Account Block (Login) - Lines 312-328:

```typescript
handleNonAccountBlockResponse = (responseJson: any, message: Message) => {
  // ...
  message.addData(getName(MessageEnum.NavigationTargetMessage), 'HomeTab');
  // Sends AuthTokenEmailMessage
}
```

## Navigation Targets

### Available Navigation Targets:

1. **'HomeTab'** - Navigates to the Home tab (TabNavigator)
   - Used in: `handleNonAccountBlockResponse` (line 324)
   - Contains: HomeStack, SearchStack, ProfileStack, etc.

2. **'Home'** - Navigates to Home screen within HomeStack
   - Used in: Various places for direct Home navigation

3. **'CreateYourProfile'** - Screen within HomeStack
   - Currently set in storage but NOT navigated to directly
   - HomeScreen reads from storage and sets as initialRoute

4. **'DisputeForm'** / **'ClaimPage'** - Direct navigation via NavigationMessage

## The Problem

**Current behavior for signup flows:**
- `redirectionNav = 'CreateYourProfile'` is stored in storage
- `NavigationMessage` is sent WITHOUT `NavigationTargetMessage`
- User ends up at Profile tab (default) instead of Home tab

**Expected behavior:**
- Navigate to **HomeTab** (not Profile tab)
- Show **CreateYourProfile** screen within HomeStack

## Solution

To fix the navigation, you need to:

1. **Add NavigationTargetMessage for signup flows:**
```typescript
if (isSignupFlow && redirectionNav === 'CreateYourProfile') {
  message.addData(
    getName(MessageEnum.NavigationTargetMessage),
    'HomeTab',  // Navigate to HomeTab
  );
}
```

2. **Keep redirectionNav in storage:**
```typescript
setStorageData('redirectionNav', 'CreateYourProfile');
```

3. **HomeScreen will then:**
   - Navigate to HomeTab (via NavigationMessage)
   - Read `redirectionNav` from storage
   - Set `initialRoute = 'CreateYourProfile'`
   - HomeStack renders with CreateYourProfile as initial screen

## Key Files

1. **OTPInputAuthController.tsx** - Sets navigation target and storage
2. **NavigationBlock.tsx** - Executes navigation via React Navigation
3. **HomeScreen.tsx** - Reads storage and sets initialRoute
4. **HomeStack** (in HomeScreen.tsx) - Uses initialRoute to show correct screen









