import PostCreationCommonController from './PostCreationCommonController';
import { getStorageData } from '../../../framework/src/Utilities';

// Customizable Area Start
// Customizable Area End

export const configJSON = require('./config');

const RULES_AND_REGULATIONS_ICONS_API =
  'https://api.localshows.com/bx_block_roles_permissions/rules_and_regulations_icons';

export default class PostCreationController extends PostCreationCommonController {
  // Customizable Area Start
  // Customizable Area End

  fetchOfficialRulesAndRegulationsIcons = async () => {
    try {
      const authToken = await getStorageData('authToken');
      const response = await fetch(RULES_AND_REGULATIONS_ICONS_API, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: authToken || '',
        },
      });
      const json = await response.json();
      if (json && Array.isArray(json.data)) {
        this.setState({
          officialRulesAndRegulationsIconsList: json.data.map((item: any) => ({
            id: item.id,
            title: item.title || '',
          })),
        });
      }
    } catch (error) {
      console.log(
        'PostCreationController - fetchOfficialRulesAndRegulationsIcons error:',
        error,
      );
    }
  };

  async componentDidMount() {
    // Check if we have an eventId in params (indicates we're viewing PostDetails)
    const eventId =
      this.props.route?.params?.eventId ||
      this.props.navigation.state?.params?.eventId;

    if (eventId) {
      console.log(
        'PostCreationController - Navigated to PostDetails with eventId:',
        eventId,
      );
      console.log(
        'PostCreationController - Ensuring isLoading is true while fetching details',
      );
      // Ensure loader is visible while we fetch post/show details
      this.setState({ isLoading: true });

      // Reset flags for new eventId
      this.postDetailResponseReceived = false;
      this.postDetailShowErrorReceived = false;
      this.postDetailPostErrorReceived = false;

      // Fetch official rules and regulations icons list for PostDetails comparison
      this.fetchOfficialRulesAndRegulationsIcons();

      // Set the eventId in state so the API can use it
      console.log(
        'PostCreationController - Setting eventId in state:',
        eventId,
      );
      this.setState({ eventId: eventId }, () => {
        // Make sure the API call happens even if session response doesn't work
        console.log(
          'PostCreationController - Calling handlePostDetailAPI directly',
        );
        this.handlePostDetailAPI();
      });
    }

    super.componentDidMount();
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  chooseImage = () => {
    /* eslint-disable */
    const options = {
      title: 'You can choose one image',
      maxWidth: 256,
      maxHeight: 256,
      storageOptions: {
        skipBackup: true,
      },
    };
  };
  // Customizable Area End
}
