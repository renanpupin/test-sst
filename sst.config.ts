import { SSTConfig } from "sst";
import { API } from "./stacks/TodoApiStack";

export default {
  config(_input) {
    return {
      name: "test-sst",
      region: "sa-east-1",
    };
  },
  stacks(app) {
    app.stack(API);
  }
} satisfies SSTConfig;
