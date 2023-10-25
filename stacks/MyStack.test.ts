import { it } from "vitest";
import { Template } from "aws-cdk-lib/assertions";
import { initProject } from "sst/project";
import { App, getStack } from "sst/constructs";
import { API } from "./MyStack";

it("test stack output", async () => {
    await initProject({ stage: "test" });
    const app = new App({ stage: "test", mode: "deploy" });
    app.stack(API);
    const template = Template.fromStack(getStack(API));
    console.log('template', template)
    template.hasResourceProperties("AWS::Lambda::Function", {
        Timeout: 20,
    });
    // // Create the API stack
    // app.stack(API);
    //
    // // Wait for resources to finalize
    // await app.finish();
    //
    // // Get the CloudFormation template of the stack
    // const stack = getStack(API);
    // const template = Template.fromStack(stack);
    // console.log('template', template)
    //
    // // Check point-in-time recovery is enabled
    // template.hasResourceProperties("AWS::DynamoDB::Table", {
    //     PointInTimeRecoverySpecification: {
    //         PointInTimeRecoveryEnabled: true,
    //     },
    // });
});
