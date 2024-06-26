import { Button, Frog, parseEther } from "frog";
import { devtools } from "frog/dev";
import { pinata } from "frog/hubs";
import { serveStatic } from "frog/serve-static";
import { handle } from "frog/vercel";
import { baseSepolia } from "viem/chains";

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  basePath: "/api",
  // Supply a Hub API URL to enable frame verification.
  hub: pinata(),
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' }),
  imageAspectRatio: "1:1",
  imageOptions: { width: 1000, height: 1000 },
});

app.frame("/", (c) => {
  return c.res({
    action: "/size",
    image: (
      <img src="https://chocolate-liquid-ferret-925.mypinata.cloud/ipfs/QmVum5SSRcaHYu3AYttVLYx6Jiky3oE3cffLwaarVAS4zN" />
    ),
    intents: [<Button>Buy</Button>],
  });
});

app.frame("/size", (c) => {
  return c.res({
    // action: "/shipping-1",
    action: "/checkout",
    image: (
      <img src="https://chocolate-liquid-ferret-925.mypinata.cloud/ipfs/QmVum5SSRcaHYu3AYttVLYx6Jiky3oE3cffLwaarVAS4zN" />
    ),
    intents: [
      <Button value="xs">XS</Button>,
      <Button value="s">S</Button>,
      <Button value="m">M</Button>,
      <Button action="/size2">More</Button>,
    ],
  });
});

app.frame("/size2", (c) => {
  return c.res({
    // action: "/shipping-1",
    action: "/checkout",
    image: (
      <img src="https://chocolate-liquid-ferret-925.mypinata.cloud/ipfs/QmVum5SSRcaHYu3AYttVLYx6Jiky3oE3cffLwaarVAS4zN" />
    ),
    intents: [
      <Button value="l">L</Button>,
      <Button value="xl">XL</Button>,
      <Button value="xl">XXL</Button>,
      <Button action="/size">Go back</Button>,
    ],
  });
});

// app.frame("/shipping-1", (c) => {
//   return c.res({
//     action: "/shipping-2",
//     image: (
//       <img src="https://chocolate-liquid-ferret-925.mypinata.cloud/ipfs/QmVum5SSRcaHYu3AYttVLYx6Jiky3oE3cffLwaarVAS4zN" />
//     ),
//     intents: [
//       <TextInput placeholder="Email"></TextInput>,
//       <Button>Next</Button>,
//     ],
//   });
// });
// app.frame("/shipping-2", (c) => {
//   return c.res({
//     action: "/shipping-3",
//     image: (
//       <img src="https://chocolate-liquid-ferret-925.mypinata.cloud/ipfs/QmVum5SSRcaHYu3AYttVLYx6Jiky3oE3cffLwaarVAS4zN" />
//     ),
//     intents: [
//       <TextInput placeholder="Phone"></TextInput>,
//       <Button>Next</Button>,
//     ],
//   });
// });
// app.frame("/shipping-3", (c) => {
//   return c.res({
//     action: "/shipping-4",
//     image: (
//       <img src="https://chocolate-liquid-ferret-925.mypinata.cloud/ipfs/QmVum5SSRcaHYu3AYttVLYx6Jiky3oE3cffLwaarVAS4zN" />
//     ),
//     intents: [
//       <TextInput placeholder="Address"></TextInput>,
//       <Button>Next</Button>,
//     ],
//   });
// });
// app.frame("/shipping-4", (c) => {
//   return c.res({
//     action: "/shipping-5",
//     image: (
//       <img src="https://chocolate-liquid-ferret-925.mypinata.cloud/ipfs/QmVum5SSRcaHYu3AYttVLYx6Jiky3oE3cffLwaarVAS4zN" />
//     ),
//     intents: [
//       <TextInput placeholder="Country / Region"></TextInput>,
//       <Button>Next</Button>,
//     ],
//   });
// });

// app.frame("/shipping-5", (c) => {
//   return c.res({
//     action: "/shipping-6",
//     image: (
//       <img src="https://chocolate-liquid-ferret-925.mypinata.cloud/ipfs/QmVum5SSRcaHYu3AYttVLYx6Jiky3oE3cffLwaarVAS4zN" />
//     ),
//     intents: [
//       <TextInput placeholder="City"></TextInput>,
//       <Button>Next</Button>,
//     ],
//   });
// });
// app.frame("/shipping-6", (c) => {
//   return c.res({
//     action: "/checkout",
//     image: (
//       <img src="https://chocolate-liquid-ferret-925.mypinata.cloud/ipfs/QmVum5SSRcaHYu3AYttVLYx6Jiky3oE3cffLwaarVAS4zN" />
//     ),
//     intents: [
//       <TextInput placeholder="Postal Code"></TextInput>,
//       <Button>Go to checkout</Button>,
//     ],
//   });
// });

app.frame("/checkout", (c) => {
  return c.res({
    action: "/finish",
    image: (
      <img src="https://chocolate-liquid-ferret-925.mypinata.cloud/ipfs/QmVum5SSRcaHYu3AYttVLYx6Jiky3oE3cffLwaarVAS4zN" />
    ),
    intents: [<Button.Transaction target="/pay">Pay</Button.Transaction>],
  });
});

app.transaction("/pay", (c) => {
  return c.send({
    chainId: `eip155:${baseSepolia.id}`,
    to: "0x92F5635eB37303A0dB480b3a385E578B875E428B",
    value: parseEther("0.003"),
  });
});

app.frame("/finish", (c) => {
  const { transactionId } = c;
  return c.res({
    image: (
      <div style={{ color: "white", display: "flex", fontSize: 50 }}>
        Thank you for your purchase - Transaction ID: {transactionId}
      </div>
    ),
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
