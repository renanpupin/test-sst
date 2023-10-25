import { expect, it } from "vitest";
import { list } from "@test-sst/core/src/todo"

it("list", async () => {
    // Check the newly created article exists
    expect(list()).not.toBeNull();
});
