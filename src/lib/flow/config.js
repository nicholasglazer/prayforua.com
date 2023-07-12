import {config} from '@onflow/fcl';
import flowJSON from '../../../flow.json';

import {
  PUBLIC_ADMIN_ADDRESS,
  PUBLIC_PROFILE_ADDRESS,
  PUBLIC_ACCESS_NODE_API,
  PUBLIC_DISCOVERY_WALLET,
  PUBLIC_FLOW_NETWORK
} from '$env/static/public';

config({
  'app.detail.title': 'Blockchain charity platform - prayforua.com',
  'app.detail.icon': 'https://unavatar.io/twitter/mykolaiivanov',
  'flow.network': PUBLIC_FLOW_NETWORK,
  'accessNode.api': PUBLIC_ACCESS_NODE_API,
  'discovery.wallet': PUBLIC_DISCOVERY_WALLET,
  '0xProfile': PUBLIC_PROFILE_ADDRESS,
  '0xAdmin': PUBLIC_ADMIN_ADDRESS
}).load({flowJSON});
