"use strict";

let expect = require("expect.js");
// let expect = require("expect");
const { Keychain } = require("../src/password-manager");

function expectReject(promise) {
  return promise.then(
    (result) =>
      expect().fail(`Expected failure, but function returned ${result}`),
    (error) => {}
  );
}

describe("Password manager", async function () {
  this.timeout(5000);
  let password = "password123!";

  let kvs = {
    service1: "value1",
    service2: "value2",
    service3: "value3",
  };

  describe("functionality", async function () {
    it("inits without an error", async function () {
      await Keychain.init(password);
    });

    it("can set and retrieve a password", async function () {
      let keychain = await Keychain.init(password);
      let url = "www.stanford.edu";
      let pw = "sunetpassword";
      await keychain.set(url, pw);
      expect(await keychain.get(url)).to.equal(pw);
    });

    it("can set and retrieve multiple passwords", async function () {
      let keychain = await Keychain.init(password);
      for (let k in kvs) {
        await keychain.set(k, kvs[k]);
      }
      for (let k in kvs) {
        expect(await keychain.get(k)).to.equal(kvs[k]);
      }
    });

    it("returns null for non-existent passwords", async function () {
      let keychain = await Keychain.init(password);
      for (let k in kvs) {
        await keychain.set(k, kvs[k]);
      }
      expect(await keychain.get("www.stanford.edu")).to.be(null);
    });

    it("can remove a password", async function () {
      let keychain = await Keychain.init(password);
      for (let k in kvs) {
        await keychain.set(k, kvs[k]);
      }
      expect(await keychain.remove("service1")).to.be(true);
      expect(await keychain.get("service1")).to.be(null);
    });

    it("returns false if there is no password for the domain being removed", async function () {
      let keychain = await Keychain.init(password);
      for (let k in kvs) {
        await keychain.set(k, kvs[k]);
      }
      expect(await keychain.remove("www.stanford.edu")).to.be(false);
    });

    it("can dump and restore the database", async function () {
      let keychain = await Keychain.init(password);
      for (let k in kvs) {
        await keychain.set(k, kvs[k]);
      }
      let data = await keychain.dump();
      let contents = data[0];
      let checksum = data[1];
      let newKeychain = await Keychain.load(password, contents, checksum);
      // console.log("newKeychain", newKeychain);

      // Make sure it's valid JSON
      expect(async function () {
        JSON.parse(contents);
      }).not.to.throwException();
      for (let k in kvs) {
        expect(await newKeychain.get(k)).to.equal(kvs[k]);
      }
    });

    it("fails to restore the database if checksum is wrong", async function () {
      let keychain = await Keychain.init(password);
      for (let k in kvs) {
        await keychain.set(k, kvs[k]);
      }
      let data = await keychain.dump();
      let contents = data[0];
      let fakeChecksum = "3GB6WSm+j+jl8pm4Vo9b9CkO2tZJzChu34VeitrwxXM=";
      await expectReject(Keychain.load(password, contents, fakeChecksum));
    });

    it("returns false if trying to load with an incorrect password", async function () {
      let keychain = await Keychain.init(password);
      for (let k in kvs) {
        await keychain.set(k, kvs[k]);
      }
      let data = await keychain.dump();
      let contents = data[0];
      let checksum = data[1];
      await expectReject(Keychain.load("fakepassword", contents, checksum));
    });
  });

  describe("security", async function () {
    // Very basic test to make sure you're not doing the most naive thing
    it("doesn't store domain names and passwords in the clear", async function () {
      let keychain = await Keychain.init(password);
      let url = "www.stanford.edu";
      let pw = "sunetpassword";
      await keychain.set(url, pw);
      let data = await keychain.dump();
      let contents = data[0];
      expect(contents).not.to.contain(password);
      expect(contents).not.to.contain(url);
      expect(contents).not.to.contain(pw);
    });

    // This test won't be graded directly -- it just exists to make sure your
    // dump include a kvs object with all your urls and passwords, because
    // we will be using that in other tests.
    it("includes a kvs object in the serialized dump", async function () {
      let keychain = await Keychain.init(password);
      for (let i = 0; i < 10; i++) {
        await keychain.set(String(i), String(i));
      }
      let data = await keychain.dump();
      let contents = data[0];
      let contentsObj = JSON.parse(contents);
      expect(contentsObj).to.have.key("kvs");
      expect(contentsObj.kvs).to.be.an("object");
      expect(Object.getOwnPropertyNames(contentsObj.kvs)).to.have.length(10);
    });
  });
});
