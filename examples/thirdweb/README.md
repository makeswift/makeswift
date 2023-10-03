## Demo

[https://makeswift-examples-thirdweb.vercel.app/](https://makeswift-examples-thirdweb.vercel.app/)

# Visually build with Thirdweb components

In this example, you'll learn how to integrate thirdweb components from your Next.js app into [Makeswift](https://www.makeswift.com) to make it visually editable.

## Tools

- [**React SDK**](https://docs.thirdweb.com/react): to enable users to connect their wallets with the [useMetamask](https://portal.thirdweb.com/react/react.usemetamask) hook, and access hooks such as [useNFTDrop](https://portal.thirdweb.com/react/react.usenftdrop) to interact with the NFT drop contract.
- [**TypeScript SDK**](https://docs.thirdweb.com/typescript): to view the claimed supply, total supply, and mint NFTs from the drop.
- [**Makeswift SDK**](https://www.makeswift.com/docs): to register components into Makeswift's visual builder.

---

## Using this example

To quickly try this example either [deploy to Vercel](#deploy-your-own-to-vercel) or [use our CLI](#use-this-example-locally-with-the-makeswift-cli).

### Deploy your own to Vercel

Deploy your own with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmakeswift%2Fmakeswift%2Ftree%2Fmain%2Fexamples%2Fthirdweb&project-name=makeswift-thirdweb-example&repository-name=makeswift-thirdweb-example&redirect-url=https%3A%2F%2Fapp.makeswift.com&integration-ids=oac_51ryd7Pob5ZsyTFzNzVvpsGq&external-id=ecommerce-thirdweb)

With your deployment completed, [take a tour of the newly created store](#take-a-tour-of-your-web3-website)

### Use this example locally with the Makeswift CLI

1. Run the Makeswift CLI command

   ```bash
   npx makeswift@latest init --template=ecommerce-thirdweb
   ```

   Note: the `--template=ecommerce-thirdweb` above will auto-select the "Ecommerce - Thirdweb" template in Makeswift and download this example Next.js app to your local machine

2. Log in or sign up for Makeswift

Once completed, the CLI runs `yarn dev` and redirects you to app.makeswift.com.

### Take a tour of your web3 website

After integration, you will be redirected to app.makeswift.com. You can see the "NFT Drop" component on the right-hand side of the screen.

With the NFT drop component selected, paste your NFT drop contract address from Thirdweb into the "Contract address" panel and select the correct chain.

> If you don't have an NFT drop contract, [read this guide](https://portal.thirdweb.com/guides/release-an-nft-drop-with-no-code#create-a-drop-contract) to learn how to create one using Thirdweb without any code.

If you are struggling with this example reach out in our [Discord](https://discord.com/invite/7dDpz6y) and we will be happy to help!

---

## Next steps

With Makeswift, you can give your marketing team hand-crafted Thirdweb building blocks to create custom Web3 websites.

To learn more about Makeswift, take a look at the following resources:

- [Makeswift Website](https://www.makeswift.com/)
- [Makeswift Documentation](https://www.makeswift.com/docs/)
- [Makeswift Discord Community](https://discord.gg/dGNdF3Uzfz)

You can check out [the Makeswift GitHub repository](https://github.com/makeswift/makeswift) - your feedback and contributions are welcome!
