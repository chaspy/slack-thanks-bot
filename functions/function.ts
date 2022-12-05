import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import SchemaTypes from "https://deno.land/x/deno_slack_sdk@1.4.2/schema/schema_types.ts";
import ThanksDatastore from "../datastores/datastore.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in Workflows.
 * https://api.slack.com/future/functions/custom
 */
export const FunctionDefinition = DefineFunction({
  callback_id: "response_function",
  title: "Send a message",
  description: "Generate a message",
  source_file: "functions/function.ts",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "Message to the bot",
      },
      user_id: {
        type: Schema.slack.types.user_id,
        description: "user id of the person who made the mentions",
      },
    },
    required: ["message"],
  },
  output_parameters: {
    properties: {
      response: {
        type: Schema.types.string,
        description: "Response from the bot",
      },
    },
    required: ["response"],
  },
});

export default SlackFunction(
  FunctionDefinition,
  async ({ inputs, client, env }) => {
    let response;

    console.log(inputs);
    const { message } = inputs;
    console.log(`inputs: ${message}`);
    const parsedMsg = parseInputs(message).filter((x: string) => x.length > 0);

    console.log(`parsedarray: ${parsedMsg}`);

    if (parsedMsg.length == 0) {
      // early return
      response = `usage: <@${
        env["BOT_ID"]
      }> @people-youd-like-to-thank message`;
      return { outputs: { response } };
    }

    const uuid = crypto.randomUUID();
    const bot_id = parsedMsg[0];
    const user_id = parsedMsg[1];
    const msg = parsedMsg[2];

    console.log(env);
    console.log(env["BOT_ID"]);
    console.log(bot_id);
    // early return
    if (bot_id != env["BOT_ID"]) {
      const response = "ERROR: The mentioned app is not thanks bot.";
      console.log(response);
      return { outputs: { response } };
    }

    const thanksObject = {
      user_id: user_id,
      message: msg,
      thanks_id: uuid,
    };

    console.log(thanksObject);

    // get count of thanks for the user
    let result = await client.apps.datastore.query({
      datastore: "thanks",
      expression: "#user_id = :user_id",
      expression_attributes: { "#user_id": "user_id" },
      expression_values: { ":user_id": user_id },
    });

    console.log(result);
    console.log(result.items.length);
    const count = result.items.length;

    // Save the sample object to the datastore
    // https://api.slack.com/future/datastores
    const putResponse = await client.apps.datastore.put<
      typeof ThanksDatastore.definition
    >(
      {
        datastore: "Thanks",
        item: thanksObject,
      },
    );

    let res = "";
    if (!putResponse.ok) {
      res = "Error calling apps.datastore.put:";
      console.log(res);
    } else {
      res = "Datastore put successful!";
      console.log(res);
    }

    response = `<@${user_id}> was thanked ${count} times :tada:`;
    return { outputs: { response } };
  },
);

/**
 * @param {string}  input - input text from users
 * @returns {string[]} return array of splited input text. the array length is 2.
 */
function parseInputs(input: string): string[] {
  const regex = /^<@(.*)> <@(.*)> (.*)$/;
  const found = input.match(regex);
  console.log(`found: ${found}`);
  const bot_id = found ? found[1] : "";
  const user_id = found ? found[2] : "";
  const message = found ? found[3] : "";

  return [bot_id, user_id, message];
}
