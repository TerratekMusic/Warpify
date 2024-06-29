import {
  reactExtension,
  useApi,
  Text,
  AdminAction,
  Button,
  BlockStack,
  Image,
} from "@shopify/ui-extensions-react/admin";
import { useEffect, useState } from "react";
import { getIssues } from "./utils";

import { BlockLayout } from "@shopify/ui-extensions-react/checkout";
// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)

export default reactExtension<any>(
  "admin.product-details.action.render",
  () => <App />
);

function App() {
  const {
    extension: { target },
    i18n,
  } = useApi<"admin.product-variant-details.configuration.render">();

  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState("");

  //connect with the extension's APIs
  const { data } = useApi(target);
  const [issue, setIssues] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [formErrors, setFormErrors] = useState(null);
  const [initialValues, setInitialValues] = useState([]);
  const productId = data.selected[0].id;

  // const productData = JSON.stringify(data.selected[0]);

  console.log(productId);
  // useEffect(() => {
  //   (async function getProductInfo() {
  //     // Load the product's metafield of type issues
  //     const productData = await getIssues(productId);

  //     setLoading(false);
  //     if (productData?.data?.product?.metafield?.value) {
  //       const parsedIssues = JSON.parse(
  //         productData.data.product.metafield.value
  //       );
  //       setInitialValues(
  //         parsedIssues.map(({ completed }) => Boolean(completed))
  //       );
  //       setIssues(parsedIssues);
  //       console.log(productData);
  //     }
  //   })();
  // }, [productId]);

  // useEffect(() => {
  //   (async function getProductInfo() {
  //     const getProductQuery = {
  //       query: `query Product($id: ID!) {
  //         product(id: $id) {
  //           title
  //         }
  //       }`,
  //       variables: { id: data.selected[0].id },
  //     };
  //     const res = await fetch("shopify:admin/api/graphql.json", {
  //       method: "POST",
  //       body: JSON.stringify(getProductQuery),
  //     });
  //     if (!res.ok) {
  //       console.log("Error fetching product data");
  //     }
  //     const productData = await res.json();
  //     console.log(productData);
  //     setProductName(productData.data.product.title);
  //     console.log(productName);
  //   });
  // }, []);

  const postData = async () => {
    const apiURL = "https://api.neynar.com/v2/farcaster/cast";
    const data = {
      parent_author_fid: 3,
      signer_uuid: "c1fac964-4986-4a18-bccb-28cef06805a7",
      text: "Buy this BASE T-SHIRT",
      embeds: [{ url: "https://warpify.vercel.app/api" }],
    };

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          accept: "application/json",
          api_key: "CAFFCD1C-D08E-4E65-BD86-B6376F3C2CC6",
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const responseData = await response.json();
      console.log(responseData); // Do something with the response data
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
  };

  return (
    <AdminAction>
      <BlockStack inlineAlignment="center">
        <Text>You are about to post this item for sell in Warpcast</Text>
        <Text>{productName}</Text>
        <Image
          alt="Pickaxe"
          source="https://m.media-amazon.com/images/I/A13usaonutL._CLa%7C2140%2C2000%7C71gTgdiSrwL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_SX385_.png"
        />
        <Button onClick={postData}>Post on Warpcast</Button>
      </BlockStack>
    </AdminAction>
  );
}
