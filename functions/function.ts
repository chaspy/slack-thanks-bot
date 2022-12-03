import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
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

export default SlackFunction(FunctionDefinition, async ({ inputs, client }) => {
  const { message } = inputs;
  console.log(`inputs: ${message}`);
  const parsedMsg = parseInputs(message);
  console.log(`parsedarray: ${parsedMsg}`);

  const uuid = crypto.randomUUID();

  const thanksObject = {
    message: parsedMsg[1],
    user_id: parsedMsg[0],
    thanks_id: uuid,
  };

  console.log(thanksObject);

  /*
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
  */

  const response = "hello!!!!";
  return { outputs: { response } };
});

/**
 * @param {string}  input - input text from users
 * @returns {string[]} return array of splited input text. the array length is 2.
 */
function parseInputs(input: string): string[] {
  const regex = /^<@(.*)> <@(.*)> (.*)$/;
  const found = input.match(regex);
  console.log(`found: ${found}`);
  //  const bot_id = found ? found[1] : "";
  const user_id = found ? found[2] : "";
  const message = found ? found[3] : "";

  return [user_id, message];
}
