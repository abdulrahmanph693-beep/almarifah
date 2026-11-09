import { describe, expect, it } from "bun:test";
import { assertNotLastAdmin, assertNotSelf } from "./account-management.policy";

describe("account-management safeguards", () => {
  it("blocks an administrator from changing their own account", () => {
    expect(() => assertNotSelf("admin-1", "admin-1", "sign-in status")).toThrow(
      "You cannot change your own sign-in status.",
    );
  });

  it("allows changes to another account", () => {
    expect(() => assertNotSelf("admin-1", "author-1", "administrator access")).not.toThrow();
  });

  it("protects the last administrator from removal", () => {
    expect(() => assertNotLastAdmin(true, 1, "removed")).toThrow(
      "The last administrator cannot be removed.",
    );
  });

  it("allows removal when another administrator remains", () => {
    expect(() => assertNotLastAdmin(true, 2, "removed")).not.toThrow();
  });

  it("does not apply the last-administrator rule to authors", () => {
    expect(() => assertNotLastAdmin(false, 0, "removed")).not.toThrow();
  });
});