#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    // Configure the primary Firebase app
    [FIRApp configure];

    // Load the secondary GoogleService-Info.plist file
    NSString *secondaryPath = [[NSBundle mainBundle] pathForResource:@"GoogleService-Info-secondary" ofType:@"plist"];
    FIROptions *secondaryOptions = [[FIROptions alloc] initWithContentsOfFile:secondaryPath];

    if (secondaryOptions) {
        // Initialize the secondary Firebase app with the given options
        [FIRApp configureWithName:@"secondary" options:secondaryOptions];
    } else {
        NSLog(@"Error: Could not load secondary Firebase config file.");
    }

    self.moduleName = @"aichat";
    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = @{};

    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
    return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
