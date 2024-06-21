import {
  reactExtension,
  useApi,
  Text,
  AdminAction,
  Button,
} from "@shopify/ui-extensions-react/admin";

// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)

export default reactExtension<any>(
  "admin.product-index.selection-action.render",
  () => <App />
);

function App() {
  const {
    extension: { target },
    i18n,
  } = useApi<"admin.product-index.selection-action.render">();

  return (
    <AdminAction>
      <Text>"welcome degen mint your nft"</Text>
      <Button>Post on Warpcast</Button>
    </AdminAction>
  );
}
