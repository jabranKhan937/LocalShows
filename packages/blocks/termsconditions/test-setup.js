// test-setup.js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'macos',
  select: () => null
}));

const customFormData = () => {};
customFormData.prototype.constructor = jest.fn();
customFormData.prototype.append = jest.fn();

global.FormData = customFormData;
