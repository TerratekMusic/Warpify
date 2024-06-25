import {
  reactExtension,
  useApi,
  Text,
  AdminAction,
  Button,
} from "@shopify/ui-extensions-react/admin";

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

  const postData = async () => {
    const apiURL = "https://reqres.in/api/users";
    const data = {
      name: "morpheus",
      job: "leader",
    };

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      <Text>"welcome degen mint your nft"</Text>
      <Button onClick={postData}>Post on Warpcast</Button>
    </AdminAction>
  );
}
