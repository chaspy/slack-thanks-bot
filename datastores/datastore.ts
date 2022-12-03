import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

/**
 * Datastores are a Slack-hosted location to store
 * and retrieve data for your app.
 * https://api.slack.com/future/datastores
 */
const ThanksDatastore = DefineDatastore({
  name: "Thanks",
  primary_key: "thanks_id",
  attributes: {
    thanks_id: {
      type: Schema.types.string,
    },
    user_id: {
      type: Schema.types.string,
    },
    message: {
      type: Schema.types.string,
    },
  },
});

export default ThanksDatastore;
