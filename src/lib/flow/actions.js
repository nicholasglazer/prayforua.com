import * as fcl from '@onflow/fcl';
import '$lib/flow/config';
import {get} from 'svelte/store';
import {auth} from '$stores/authStore';
import {
  transactionStatus,
  txId,
  transactionInProgress
} from '$stores/flowStore';

function initTransactionState() {
  txId.set(null);
  transactionInProgress.set(true);
  transactionStatus.set(-1);
}

// set Svelte $user store to currentUser,
// so other components can access it
fcl.currentUser.subscribe(auth.assignFlowAccount, []);
async function test() {
  const account = await fcl.account('0x4c9f41eb4765c946');
  const admacc = await fcl.account('0xe1ce55a0609b04a6');

  console.log('acc 8****', account);
  console.log('admacc 8****', admacc);
}

test();

fcl.currentUser.subscribe(console.log);

// Lifecycle FCL Auth functions
export const flowUnauth = () => fcl.unauthenticate();
export const flowLogIn = () => fcl.logIn();

// TRANSACTIONS
// init account
export const initFlowProfile = async () => {
  let transactionId = false;
  initTransactionState();

  try {
    transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile
        import NFTStorefrontV2 from 0xAdmin

        transaction {
          prepare(account: AuthAccount) {
            // Only initialize the account if it hasn't already been initialized
            if (!Profile.check(account.address)) {
              // This creates and stores the profile in the user's account
              account.save(<- Profile.new(), to: Profile.privatePath)

              // This creates the public capability that lets applications read the profile's info
              account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
            }
            // If the account doesn't already have a Storefront
            if account.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath) == nil {

              // Create a new empty Storefront
              let storefront <- NFTStorefrontV2.createStorefront() as! @NFTStorefrontV2.Storefront

              // save it to the account
              account.save(<-storefront, to: NFTStorefrontV2.StorefrontStoragePath)

              // create a public capability for the Storefront
              account.link<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(NFTStorefrontV2.StorefrontPublicPath, target: NFTStorefrontV2.StorefrontStoragePath)
            }
          }
        }
      `,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50
    });

    txId.set(transactionId);

    fcl.tx(transactionId).subscribe((res) => {
      transactionStatus.set(res.status);
      if (res.status === 4) {
        setTimeout(() => transactionInProgress.set(false), 1000);
      }
    });
  } catch (e) {
    transactionStatus.set(99);
    console.log(e);
  }
};

export const mutateFlowProfile = async () => {
  initTransactionState();
  try {
    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile

        transaction(name: String, color: String, info: String) {
          prepare(account: AuthAccount) {
            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setName(name)

            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setInfo(info)

            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setColor(color)
          }
        }
      `,
      args: (arg, t) => [
        arg(get(auth).flow.profile.name, t.String),
        arg(get(auth).flow.profile.color, t.String),
        arg(get(auth).flow.profile.info, t.String)
      ],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50
    });

    txId.set(transactionId);

    fcl.tx(transactionId).subscribe((res) => {
      transactionStatus.set(res.status);
      if (res.status === 4) {
        setTimeout(() => transactionInProgress.set(false), 2000);
      }
    });
  } catch (e) {
    console.log(e);
    transactionStatus.set(99);
  }
};

export const initFlowStorefront = async () => {
  let transactionId = false;
  initTransactionState();

  try {
    transactionId = await fcl.mutate({
      cadence: `
        import NFTStorefrontV2 from 0xAdmin

        transaction {
          prepare(account: AuthAccount) {
            // If the account doesn't already have a Storefront
            if account.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath) == nil {

              // Create a new empty Storefront
              let storefront <- NFTStorefrontV2.createStorefront() as! @NFTStorefrontV2.Storefront

              // save it to the account
              account.save(<-storefront, to: NFTStorefrontV2.StorefrontStoragePath)

              // create a public capability for the Storefront
              account.link<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(NFTStorefrontV2.StorefrontPublicPath, target: NFTStorefrontV2.StorefrontStoragePath)
            }
          }
        }
      `,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50
    });

    txId.set(transactionId);

    fcl.tx(transactionId).subscribe((res) => {
      transactionStatus.set(res.status);
      if (res.status === 4) {
        setTimeout(() => transactionInProgress.set(false), 1000);
      }
    });
  } catch (e) {
    transactionStatus.set(99);
    console.log(e);
  }
};

// SCRIPTS
// send a script to get a user's profile
export const sendProfileQuery = async (addr) => {
  let profileQueryResult = null;

  try {
    profileQueryResult = await fcl.query({
      cadence: `
        import Profile from 0xProfile

        pub fun main(address: Address): Profile.ReadOnly? {
          return Profile.read(address)
        }
      `,
      args: (arg, t) => [arg(addr, t.Address)]
    });
    console.log('projefi!!!!!!!!!!!!!!!!! ', profileQueryResult);
    auth.assignFlowProfile(profileQueryResult ?? null);
  } catch (e) {
    console.warn(e);
  }
};

export const sendStorefrontQuery = async (addr) => {
  let storefrontQueryResult = null;

  try {
    storefrontQueryResult = await fcl.query({
      cadence: `
        import NFTStorefrontV2 from 0xAdmin

        pub fun main(address: Address): NFTStorefrontV2.ReadOnly? {
          return NFTStorefrontV2.read(address)
        }
      `,
      args: (arg, t) => [arg(addr, t.Address)]
    });
    console.log('projefi!!!!!!!!!!!!!!!!! ', storefrontQueryResult);
    // auth.assignFlowProfile(storefrontQueryResult ?? null);
  } catch (e) {
    console.warn(e);
  }
};
