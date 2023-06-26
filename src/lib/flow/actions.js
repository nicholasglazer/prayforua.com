import * as fcl from '@onflow/fcl';
import '$lib/flow/config';
import {auth} from '$stores/authStore';
import {transactionStatus} from '$stores/flowStore';

// set Svelte $user store to currentUser,
// so other components can access it
fcl.currentUser.subscribe(auth.assignFlowAccount, []);

// Lifecycle FCL Auth functions
export const flowUnauth = () => fcl.unauthenticate();
export const flowLogIn = () => fcl.logIn();

// init account
export const initAccount = async () => {
  let transactionId = false;
  let transaction = false;
  transactionStatus.set('Executing Transaction...');

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
    transaction = await fcl.tx(transactionId).onceSealed();
    transactionStatus.set(transaction.status);
  } catch (e) {
    transactionStatus.set(e);
    console.log(e);
  }

  console.log(transaction);
};

// send a transaction to get a user's profile
export const sendQuery = async (addr) => {
  transactionStatus.set('Retrieving Profile...');

  let profileQueryResult = false;

  try {
    console.log(await fcl.config().all(), addr);
    profileQueryResult = await fcl.query({
      cadence: `
        import Profile from 0xProfile

        pub fun main(address: Address): Profile.ReadOnly? {
          return Profile.read(address)
        }
      `,
      args: (arg, t) => [arg(addr, t.Address)]
    });
    auth.assignFlowProfile(profileQueryResult?.name ?? 'No Profile');
    transactionStatus.set('Profile queried successfully!');
  } catch (e) {
    transactionStatus.set(e);
    console.log(e);
  }
};

export const executeTransaction = async () => {
  transactionStatus.set('Executing Transaction...');
  try {
    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile

        transaction(name: String) {
          prepare(account: AuthAccount) {
            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setName(name)
          }
        }
      `,
      args: (arg, t) => [arg('Flow Developer', t.String)],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50
    });

    fcl.tx(transactionId).subscribe((res) => transactionStatus.set(res.status));
  } catch (e) {
    console.log(e);
    transactionStatus.set(e);
  }
};
