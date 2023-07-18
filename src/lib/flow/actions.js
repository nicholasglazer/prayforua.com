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
// set balance on login/logout
fcl.currentUser.subscribe((user) => {
  if (user) {
    auth.assignFlowAccount(user);
    getAccountBalance(user.addr, get(auth).user.id);
  }
}, []);

// Lifecycle FCL Auth functions
export const flowUnauth = () => fcl.unauthenticate();
export const flowLogIn = () => fcl.authenticate();

// TRANSACTIONS
// init account
export const initFlowProfile = async () => {
  let transactionId = false;
  initTransactionState();

  try {
    transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile
        import FlowToken from 0x7e60df042a9c0868
        import FungibleToken from 0x9a0766d93b6608b7

        transaction {
          prepare(account: AuthAccount) {
            // Only initialize the account if it hasn't already been initialized
            if (!Profile.check(account.address)) {
              // This creates and stores the profile in the user's account
              account.save(<- Profile.new(), to: Profile.privatePath)

              // This creates the public capability that lets applications read the profile's info
              account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
            }
          if account.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault) == nil {
            // Create a new flowToken Vault and put it in storage
            account.save(<-FlowToken.createEmptyVault(), to: /storage/flowTokenVault)

            // Create a public capability to the Vault that only exposes
            // the deposit function through the Receiver interface
            account.link<&FlowToken.Vault{FungibleToken.Receiver}>(
                /public/flowTokenReceiver,
                target: /storage/flowTokenVault
            )

            // Create a public capability to the Vault that only exposes
            // the balance field through the Balance interface
            account.link<&FlowToken.Vault{FungibleToken.Balance}>(
                /public/flowTokenBalance,
                target: /storage/flowTokenVault
            )
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
      if (res.status) {
        auth.isFlowProfileCreated(res.status);
        if (res.status === 4) {
          auth.addFlowTransaction({
            txId: transactionId,
            event: 'Flow profile created',
            status: res.status,
            timestamp: new Date().getTime()
          });
          setTimeout(() => transactionInProgress.set(false), 1000);
        }
      }
    });
  } catch (e) {
    transactionStatus.set(99);
    console.log(e);
  }
};

export const mutateFlowProfile = async () => {
  let transactionId = false;
  initTransactionState();
  try {
    transactionId = await fcl.mutate({
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
      if (res.status) {
        if (res.status === 4) {
          auth.addFlowTransaction({
            txId: transactionId,
            event: 'Flow profile updated',
            status: res.status,
            timestamp: new Date().getTime()
          });
          setTimeout(() => transactionInProgress.set(false), 2000);
        }
      }
    });
  } catch (e) {
    console.log(e);
    transactionStatus.set(99);
  }
};

export const transferFlow = async (amount, addr, cid) => {
  let transactionId = false;
  initTransactionState();

  try {
    transactionId = await fcl.mutate({
      cadence: `
        import FungibleToken from 0x9a0766d93b6608b7
        import FlowToken from 0x7e60df042a9c0868

        transaction(amount: UFix64, to: Address) {

           // The Vault resource that holds the tokens that are being transferred
           let sentVault: @FungibleToken.Vault

           prepare(signer: AuthAccount) {

               // Get a reference to the signer's stored vault
               let vaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow reference to the owner's Vault!")

               // Withdraw tokens from the signer's stored vault
               self.sentVault <- vaultRef.withdraw(amount: amount)
           }

           execute {

               // Get a reference to the recipient's Receiver
               let receiverRef =  getAccount(to)
                   .getCapability(/public/flowTokenReceiver)
                   .borrow<&{FungibleToken.Receiver}>()
                    ?? panic("Could not borrow receiver reference to the recipient's Vault")

               // Deposit the withdrawn tokens in the recipient's receiver
               receiverRef.deposit(from: <-self.sentVault)
           }
        }
      `,
      args: (arg, t) => [arg(amount, t.UFix64), arg(addr, t.Address)],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50
    });

    txId.set(transactionId);

    fcl.tx(transactionId).subscribe((res) => {
      transactionStatus.set(res.status);
      if (res.status) {
        if (res.status === 4) {
          getAccountBalance(addr, cid);
          auth.addFlowTransaction({
            txId: transactionId,
            event: `${amount} Flow transferred to ${addr} at`,
            status: res.status,
            timestamp: new Date().getTime()
          });
          setTimeout(() => transactionInProgress.set(false), 2000);
        }
      }
    });
    // console.log('totalSup', transactionId);
    // auth.assignFlowProfile(storefrontQueryResult ?? null);
  } catch (e) {
    transactionStatus.set(99);
    console.warn(e);
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

      if (res.status) {
        if (res.status === 4) {
          auth.addFlowTransaction({
            txId: transactionId,
            event: 'Storefront initialized',
            status: res.status,
            timestamp: new Date().getTime()
          });
          setTimeout(() => transactionInProgress.set(false), 1000);
        }
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
    auth.assignFlowProfile(profileQueryResult ?? null);
  } catch (e) {
    console.warn(e);
  }
};

export const getAccountBalance = async (addr, id, bool) => {
  let accountBalance = null;

  try {
    accountBalance = await fcl.query({
      cadence: `
        import FungibleToken from 0x9a0766d93b6608b7
        import FlowToken from 0x7e60df042a9c0868

        pub fun main(account: Address): UFix64 {

          let vaultRef = getAccount(account)
            .getCapability(/public/flowTokenBalance)
            .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
            ?? panic("Could not borrow Balance reference to the Vault")

          return vaultRef.balance
        }
      `,
      args: (arg, t) => [arg(addr, t.Address)]
    });
    if (accountBalance && id) {
      auth.assignFlowBalance(accountBalance, id, bool);
    }
  } catch (e) {
    console.warn(e);
  }
};

export const getTotalSupply = async () => {
  let totalSup = null;

  try {
    totalSup = await fcl.query({
      cadence: `
        import FlowToken from 0x7e60df042a9c0868

        pub fun main(): UFix64 {

          let supply = FlowToken.totalSupply

          return supply
        }
      `
    });
    return totalSup;
  } catch (e) {
    console.warn(e);
  }
};

// test

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
    // console.log('storefrontQueryResult', storefrontQueryResult);
    // auth.assignFlowProfile(storefrontQueryResult ?? null);
  } catch (e) {
    console.warn(e);
  }
};

export const mintCharityTokens = async (addr, amount) => {
  let charityTokensMinted = null;

  try {
    charityTokensMinted = await fcl.query({
      cadence: `
        import FungibleToken from 0x9a0766d93b6608b7
        import ExampleToken from 0xAdmin

        /// This transaction is what the minter Account uses to mint new tokens
        /// They provide the recipient address and amount to mint, and the tokens
        /// are transferred to the address after minting

        transaction(recipient: Address, amount: UFix64) {

        /// Reference to the Example Token Admin Resource object
        let tokenAdmin: &ExampleToken.Administrator

        /// Reference to the Fungible Token Receiver of the recipient
        let tokenReceiver: &{FungibleToken.Receiver}

        /// The total supply of tokens before the burn
        let supplyBefore: UFix64

        prepare(signer: AuthAccount) {
            self.supplyBefore = ExampleToken.totalSupply

            // Borrow a reference to the admin object
            self.tokenAdmin = signer.borrow<&ExampleToken.Administrator>(from: ExampleToken.AdminStoragePath)
                ?? panic("Signer is not the token admin")

            // Get the account of the recipient and borrow a reference to their receiver
            self.tokenReceiver = getAccount(recipient)
                .getCapability(ExampleToken.ReceiverPublicPath)
                .borrow<&{FungibleToken.Receiver}>()
                ?? panic("Unable to borrow receiver reference")
        }

        execute {

            // Create a minter and mint tokens
            let minter <- self.tokenAdmin.createNewMinter(allowedAmount: amount)
            let mintedVault <- minter.mintTokens(amount: amount)

            // Deposit them to the receiever
            self.tokenReceiver.deposit(from: <-mintedVault)

            destroy minter
        }

        post {
            ExampleToken.totalSupply == self.supplyBefore + amount: "The total supply must be increased by the amount"
        }
      }
      `,
      args: (arg, t) => [arg(addr, t.Address), arg(amount, t.String)]
    });

    // console.log('totalSup', charityTokensMinted);
    // auth.assignFlowProfile(storefrontQueryResult ?? null);
  } catch (e) {
    console.warn(e);
  }
};
