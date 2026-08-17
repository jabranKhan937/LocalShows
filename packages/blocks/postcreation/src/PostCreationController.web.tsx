import PostCreationCommonController from './PostCreationCommonController';

// Customizable Area Start
// Customizable Area End

export const configJSON = require('./config');

export default class PostCreationController extends PostCreationCommonController {
  // Customizable Area Start
  // Customizable Area End

  async componentDidMount() {
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

    this.showAlert('Error', 'WEB::chooseImage::WIP');
  };
  // Customizable Area End
}
