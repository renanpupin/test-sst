import { SSTConfig } from "sst";
import { API } from "./stacks/TodoApiStack";
import { GraphqlAPI } from "./stacks/GraphqlStack";

export default {
  config(_input) {
    return {
      name: "test-sst",
      region: "sa-east-1",
    };
  },
  stacks(app) {
    app.stack(API).stack(GraphqlAPI);
  }
} satisfies SSTConfig;
