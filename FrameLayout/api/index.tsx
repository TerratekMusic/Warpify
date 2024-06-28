import { Button, Frog, TextInput, parseEther } from "frog";
import { devtools } from "frog/dev";
import { createNeynar } from "frog/middlewares";
import { serveStatic } from "frog/serve-static";
import { handle } from "frog/vercel";
import { baseSepolia } from "viem/chains";
import fetch from "node-fetch";

const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

const neynar = createNeynar({ apiKey: NEYNAR_API_KEY || "NEYNAR_FROG_FM" });

export const app = new Frog({
  title: "Warpify Store",
  basePath: "/api",
  hub: neynar.hub(),
  imageAspectRatio: "1:1",
  imageOptions: { width: 1000, height: 1000 },
}).use(neynar.middleware({ features: ["interactor", "cast"] }));

app.frame("/", (c) => {
  return c.res({
    action: "/size",
    image: (
      <img src="https://chocolate-liquid-ferret-925.mypinata.cloud/ipfs/Qma2GcaKsmxxEKuKsiQGGY6dmM1FnK2RSpUzUcmzNMtYKu" />
    ),
    intents: [<Button>Buy</Button>],
  });
});

app.frame("/size", (c) => {
  return c.res({
    action: "/shipping-1",
    image: (
      <img src="https://chocolate-liquid-ferret-925.mypinata.cloud/ipfs/QmcRyb29kksdpWmnqCS2ELXJB4VsjfERyUeS98nW38kXLq" />
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
    action: "/shipping-1",
    image: (
      <img src="https://chocolate-liquid-ferret-925.mypinata.cloud/ipfs/QmcRyb29kksdpWmnqCS2ELXJB4VsjfERyUeS98nW38kXLq" />
    ),
    intents: [
      <Button value="l">L</Button>,
      <Button value="xl">XL</Button>,
      <Button value="xl">XXL</Button>,
      <Button action="/size">Go back</Button>,
    ],
  });
});

app.frame("/shipping-1", (c) => {
  return c.res({
    action: "/shipping-2",
    image: (
      <img src="https://chocolate-liquid-ferret-925.mypinata.cloud/ipfs/QmV3pPWaW3KjacYfR1JkF8dKozo2CChF2btJvQRiFiBi7p" />
    ),
    intents: [
      <TextInput placeholder="Email"></TextInput>,
      <Button>Next</Button>,
    ],
  });
});
app.frame("/shipping-2", (c) => {
  return c.res({
    action: "/shipping-3",
    image: (
      <img src="https://chocolate-liquid-ferret-925.mypinata.cloud/ipfs/QmV3pPWaW3KjacYfR1JkF8dKozo2CChF2btJvQRiFiBi7p" />
    ),
    intents: [
      <TextInput placeholder="Phone"></TextInput>,
      <Button>Next</Button>,
    ],
  });
});
app.frame("/shipping-3", (c) => {
  return c.res({
    action: "/shipping-4",
    image: (
      <img src="https://chocolate-liquid-ferret-925.mypinata.cloud/ipfs/QmV3pPWaW3KjacYfR1JkF8dKozo2CChF2btJvQRiFiBi7p" />
    ),
    intents: [
      <TextInput placeholder="Address"></TextInput>,
      <Button>Next</Button>,
    ],
  });
});
app.frame("/shipping-4", (c) => {
  return c.res({
    action: "/shipping-5",
    image: (
      <img src="https://chocolate-liquid-ferret-925.mypinata.cloud/ipfs/QmV3pPWaW3KjacYfR1JkF8dKozo2CChF2btJvQRiFiBi7p" />
    ),
    intents: [
      <TextInput placeholder="Country / Region"></TextInput>,
      <Button>Next</Button>,
    ],
  });
});

app.frame("/shipping-5", (c) => {
  return c.res({
    action: "/shipping-6",
    image: (
      <img src="https://chocolate-liquid-ferret-925.mypinata.cloud/ipfs/QmV3pPWaW3KjacYfR1JkF8dKozo2CChF2btJvQRiFiBi7p" />
    ),
    intents: [
      <TextInput placeholder="City"></TextInput>,
      <Button>Next</Button>,
    ],
  });
});
app.frame("/shipping-6", (c) => {
  return c.res({
    action: "/checkout",
    image: (
      <img src="https://chocolate-liquid-ferret-925.mypinata.cloud/ipfs/QmV3pPWaW3KjacYfR1JkF8dKozo2CChF2btJvQRiFiBi7p" />
    ),
    intents: [
      <TextInput placeholder="Postal Code"></TextInput>,
      <Button>Go to checkout</Button>,
    ],
  });
});

app.frame("/checkout", (c) => {
  const isFollower = c.var.interactor?.viewerContext?.following;
  const fid = c.var.interactor?.fid;
  const isRecastedCastByUser = c.var.cast?.reactions.recasts?.some(
    (recast) => recast.fid === fid
  );

  if (isFollower && isRecastedCastByUser) {
    return c.res({
      action: "/finish",
      image: (
        <div
          style={{
            color: "white",
            display: "flex",
            justifyContent: "center",
            fontSize: 50,
            backgroundColor: "#283890",
          }}
        >
          Gracias por seguirnos, tienes un 5% de descuento en la compra
        </div>
      ),
      intents: [<Button.Transaction target="/pay">Pay</Button.Transaction>],
    });
  }
  return c.res({
    action: "/finish",
    image: (
      <img src="https://chocolate-liquid-ferret-925.mypinata.cloud/ipfs/Qma2GcaKsmxxEKuKsiQGGY6dmM1FnK2RSpUzUcmzNMtYKu" />
    ),
    intents: [<Button.Transaction target="/pay">Pay</Button.Transaction>],
  });
});

app.transaction("/pay", (c) => {
  const isFollower = c.var.interactor?.viewerContext?.following;
  const basePrice = parseEther("0.003");
  const discountFactor = BigInt(95);
  const price = isFollower
    ? (basePrice * discountFactor) / BigInt(100)
    : basePrice;
  return c.send({
    chainId: `eip155:${baseSepolia.id}`,
    to: "0x92F5635eB37303A0dB480b3a385E578B875E428B",
    value: price,
  });
});

app.frame("/finish", async (c) => {
  const isFollower = c.var.interactor?.viewerContext?.following;
  const price = isFollower ? 9.5 : 10.0;
  try {
    const order = {
      order: {
        line_items: [
          {
            title: "Base T-Shirt Black",
            price: price,
            grams: "1300",
            quantity: 1,
          },
        ],
        transactions: [
          {
            kind: "sale",
            status: "paid",
            amount: price,
          },
        ],
        total_tax: 0,
        currency: "USD",
      },
    };
    await fetch(
      `https://${SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/orders.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN || "",
        },
        body: JSON.stringify(order),
      }
    );
    return c.res({
      image: (
        <img src="https://chocolate-liquid-ferret-925.mypinata.cloud/ipfs/QmZzL24Hg3VUo7uEKekxFDrrCEynqXbtivkwMKiPWZ5S5c" />
      ),
      intents: [
        <Button.Redirect location="">
          Support Warpify Team in the Onchain summer buildathon
        </Button.Redirect>,
      ],
    });
  } catch (error) {
    console.log(error);
    return c.res({
      image: (
        <div
          style={{
            color: "white",
            display: "flex",
            justifyContent: "center",
            fontSize: 50,
            backgroundColor: "#283890",
          }}
        >
          Sorry, we have a problem with your purchase
        </div>
      ),
    });
  }
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
