import { Page, Layout } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

import { CollectionCard } from "../components/CollectionCard";

export default function HomePage() {
  return (
    <Page narrowWidth>
      <TitleBar title="App name" primaryAction={undefined} />
      <Layout>
        <Layout.Section>
          <CollectionCard />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
