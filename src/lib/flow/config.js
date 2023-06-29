import {config} from '@onflow/fcl';
import {
  PUBLIC_PROFILE_ADDRESS,
  PUBLIC_ACCESS_NODE_API,
  PUBLIC_DISCOVERY_WALLET
} from '$env/static/public';

config({
  'app.detail.title': 'prayforua.com',
  'app.detail.icon': 'https://unavatar.io/twitter/mykolaiivanov',
  'accessNode.api': PUBLIC_ACCESS_NODE_API,
  'discovery.wallet': PUBLIC_DISCOVERY_WALLET,
  '0xProfile': PUBLIC_PROFILE_ADDRESS
});
