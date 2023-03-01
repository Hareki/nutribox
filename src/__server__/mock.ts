import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
const Mock = new MockAdapter(axios);
// Mock.restore();
export default Mock;
