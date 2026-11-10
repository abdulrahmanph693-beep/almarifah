import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertNotLastAdmin, assertNotSelf } from "./account-management.policy";

describe("account-management safeguards", () => {
  it("blocks an administrator from changing their own account", () => {
    assert.throws(
      () => assertNotSelf("admin-1", "admin-1", "sign-in status"),
      /You cannot change your own sign-in status\./,
    );
  });

  it("allows changes to another account", () => {
    assert.doesNotThrow(() => assertNotSelf("admin-1", "author-1", "administrator access"));
  });

  it("protects the last administrator from removal", () => {
    assert.throws(
      () => assertNotLastAdmin(true, 1, "removed"),
      /The last administrator cannot be removed\./,
    );
  });

  it("allows removal when another administrator remains", () => {
    assert.doesNotThrow(() => assertNotLastAdmin(true, 2, "removed"));
  });

  it("does not apply the last-administrator rule to authors", () => {
    assert.doesNotThrow(() => assertNotLastAdmin(false, 0, "removed"));
  });
});