#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import "RNGoogleSignin.h"

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, GIDSignInDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
