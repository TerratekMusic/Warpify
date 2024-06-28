import {
  reactExtension,
  useApi,
  Text,
  AdminAction,
  Button,
  BlockStack,
} from "@shopify/ui-extensions-react/admin";
import { useState } from "react";

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
        <Text>"welcome degen mint your nft"</Text>
        <Button onClick={postData}>Post on Warpcast</Button>
      </BlockStack>
    </AdminAction>
  );
}
