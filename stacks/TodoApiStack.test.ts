import { it } from "vitest";
import { Template } from "aws-cdk-lib/assertions";
import { initProject } from "sst/project";
import { App, getStack } from "sst/constructs";
import { API } from "./TodoApiStack";

it("test stack output", async () => {
    await initProject({ stage: "test" });
    const app = new App({ stage: "test", mode: "deploy" });
    app.stack(API);

    //@ts-ignore
    const template = Template.fromStack(getStack(API));

    template.hasResourceProperties("AWS::Lambda::Function", {
        Timeout: 20,
    });
});
