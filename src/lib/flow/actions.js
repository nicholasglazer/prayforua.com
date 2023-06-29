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

// Lifecycle FCL Auth functions
export const flowUnauth = () => fcl.unauthenticate();
export const flowLogIn = () => fcl.logIn();

// init account
export const initFlowProfile = async () => {
  let transactionId = false;
  initTransactionState();

  try {
    transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile

        transaction {
          prepare(account: AuthAccount) {
            // Only initialize the account if it hasn't already been initialized
            if (!Profile.check(account.address)) {
              // This creates and stores the profile in the user's account
              account.save(<- Profile.new(), to: Profile.privatePath)

              // This creates the public capability that lets applications read the profile's info
              account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
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
// send a transaction to get a user's profile
export const sendProfileQuery = async (addr) => {
  let profileQueryResult = false;
  initTransactionState();

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
    transactionStatus.set(4);
    auth.assignFlowProfile(profileQueryResult ?? null);
  } catch (e) {
    transactionStatus.set(99);
    console.warn(e);
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
