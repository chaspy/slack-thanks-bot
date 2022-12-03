import { Manifest } from "deno-slack-sdk/mod.ts";
import Workflow from "./workflows/workflow.ts";
import ThanksDatastore from "./datastores/datastore.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "thanks",
  description: "Remember and reply a count of thanks",
  icon: "assets/thanks.png",
  workflows: [Workflow],
  outgoingDomains: [],
  datastores: [ThanksDatastore],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "app_mentions:read",
    "datastore:read",
    "datastore:write",
  ],
});
