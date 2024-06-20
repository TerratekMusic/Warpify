import {
  reactExtension,
  useApi,
  Text,
} from "@shopify/ui-extensions-react/admin";

// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)

export default reactExtension<any>(
  "admin.product-variant-details.configuration.render",
  () => <App />
);

function App() {
  const {
    extension: { target },
    i18n,
  } = useApi<"admin.product-variant-details.configuration.render">();

  return <Text>"welcome degen mint your nft"</Text>;
}
