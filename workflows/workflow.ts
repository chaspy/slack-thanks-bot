import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { FunctionDefinition } from "../functions/function.ts";

/**
 * A Workflow is a set of steps that are executed in order.
 * Each step in a Workflow is a function.
 * https://api.slack.com/future/workflows
 */
const Workflow = DefineWorkflow({
  callback_id: "workflow",
  title: "Send a message",
  description: "Send a message to channel",
  input_parameters: {
    properties: {
      text: {
        type: Schema.types.string,
      },
      channelId: {
        type: Schema.slack.types.channel_id,
      },
      userId: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["channelId"],
  },
});

const FunctionStep = Workflow.addStep(FunctionDefinition, {
  message: Workflow.inputs.text,
  user_id: Workflow.inputs.userId,
});

Workflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: Workflow.inputs.channelId,
  message: FunctionStep.outputs.response,
});

export default Workflow;
