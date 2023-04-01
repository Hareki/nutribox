import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
const Mock = new MockAdapter(axios, { onNoMatch: 'passthrough' });
export default Mock;
