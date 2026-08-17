// You can only update code inside the customizable area. Other changes will be detected during commit and your commit will be rejected.

import { BlockComponent } from '../../../framework/src/BlockComponent';
import { IBlock } from "../../../framework/src/IBlock";
import { runEngine } from "../../../framework/src/RunEngine";
import { Message } from "../../../framework/src/Message";
import MessageEnum, { getName } from '../Messages/MessageEnum';
import { navigateToNotificationsScreen } from '../navigateToNotifications';
import { navigateToFollowersScreen } from '../../../components/src/NavigationCompat';
import { getStorageData } from '../Utilities';

/** Stack routes for opening a profile by `profileIdToLoad` in storage; `isOtherUser` is set from whether that id differs from the logged-in user. */
const OTHER_USER_PROFILE_ROUTE_NAMES = [
  'UserProfileBasicBlock2',
  'UserProfileBasicBlockArtist2',
  'UserProfileBasicBlock3',
  'UserProfileBasicBlockArtist3',
] as const;

/** Merge NavigationRaiseMessage payload into React Navigation route params (v6). */
function buildRouteParamsFromRaiseMessage(
  raiseMessage: Message | undefined,
  screenTitle: string | undefined,
): Record<string, unknown> {
  const navParams: Record<string, unknown> = {
    navigationBarTitleText: screenTitle,
  };
  if (!raiseMessage) {
    return navParams;
  }
  const helpData = raiseMessage.getData(
    getName(MessageEnum.HelpCentreMessageData),
  );
  const postData = raiseMessage.getData(
    getName(MessageEnum.PostDetailDataMessage),
  );
  const merged = helpData || postData;
  if (merged && typeof merged === 'object') {
    Object.assign(navParams, merged as Record<string, unknown>);
  }
  return navParams;
}

interface Props {}
interface S {}
interface SS {}

class NavigationBlock extends BlockComponent<Props, S, SS> {
  constructor(props: Props = { navigation: null }) {
    super(props);
    this.receive = this.receive.bind(this);
    runEngine.attachBuildingBlock(this as IBlock, [
      getName(MessageEnum.NavigationMessage),
      getName(MessageEnum.NavigationPropsMessage)
    ]);
  }

  async receive(from: string, message: Message) {

    if (message.id === getName(MessageEnum.NavigationMessage)) {
      // debugger;
      const raiseMessage: Message = message.getData(
        getName(MessageEnum.NavigationRaiseMessage)
      );
      if (raiseMessage !== undefined) {
        const self = this;
        setTimeout(function() {
          self.send(raiseMessage);
        }, 0);
      }
      const screenTitle = message.getData(
        getName(MessageEnum.NavigationScreenNameMessage)
      );
      const props = message.getData(
        getName(MessageEnum.NavigationPropsMessage)
      );
      const target = message.getData(
        getName(MessageEnum.NavigationTargetMessage)
      );
      if (props && props.navigation) {
        if (target === 'Notifications') {
          navigateToNotificationsScreen(props.navigation);
        } else if (target === 'Followers') {
          const navParams = buildRouteParamsFromRaiseMessage(
            raiseMessage,
            screenTitle,
          );
          if (!navigateToFollowersScreen(props.navigation, navParams)) {
            if (typeof props.navigation.push === 'function') {
              props.navigation.push(target, navParams);
            } else {
              props.navigation.navigate(target, navParams);
            }
          }
        } else if (target === 'HomeTab') {
          // Drawer route is HomeTab; feed stack lives on tab HomeFeed → screen Home.
          props.navigation.navigate('HomeTab', {
            screen: 'HomeFeed',
            params: {
              screen: 'Home',
              params: { navigationBarTitleText: screenTitle },
            },
          });
        } else if (
          OTHER_USER_PROFILE_ROUTE_NAMES.includes(
            target as (typeof OTHER_USER_PROFILE_ROUTE_NAMES)[number],
          )
        ) {
          const profileIdToLoad = await getStorageData('profileIdToLoad');
          const userId = await getStorageData('user_id');
          const isViewingSomeoneElse =
            Boolean(profileIdToLoad) &&
            String(profileIdToLoad) !== String(userId ?? '');
          const navParams = {
            isOtherUser: isViewingSomeoneElse,
            navigationBarTitleText: screenTitle,
          };
          if (typeof props.navigation.push === 'function') {
            props.navigation.push(target, navParams);
          } else {
            props.navigation.navigate(target, navParams);
          }
        } else {
          const navParams = buildRouteParamsFromRaiseMessage(
            raiseMessage,
            screenTitle,
          );
          if (typeof props.navigation.push === 'function') {
            props.navigation.push(target, navParams);
          } else {
            props.navigation.navigate(target, navParams);
          }
        }
      }
    }
  }
}

export default NavigationBlock;
