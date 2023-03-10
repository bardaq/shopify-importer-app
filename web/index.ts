import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";

const PORT = parseInt(
  (process.env.BACKEND_PORT as string) || (process.env.PORT as string),
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers as any })
);

// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json({ type: "*/*" }));

app.get("/api/products/count", async (_req: any, res: any) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req: any, res: any) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e: any) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.post("/api/graphql", async (req: any, res: any) => {
  try {
    const session = res.locals.shopify.session;
    const response = await shopify.api.clients.graphqlProxy({
      session,
      rawBody: req.body,
    });

    res.status(200).send(response.body);
  } catch (error: any) {
    console.log(JSON.stringify({ MESS: error }, null, 2));
    res.status(500).send(error);
  }
});

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use(
  "/*",
  shopify.ensureInstalledOnShop(),
  async (_req: any, res: any, _next: any) => {
    return res
      .status(200)
      .set("Content-Type", "text/html")
      .send(readFileSync(join(STATIC_PATH, "index.html")));
  }
);

app.listen(PORT);
