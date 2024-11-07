// const Keychain = require("./password-manager");
const { Keychain } = require("./password-manager");

(async () => {
  // Step 1: Initialize the Keychain
  const passwordManager = await Keychain.init("myMasterPassword");
  // const passwordManager = await Keychain.

  // Step 2: Set some entries
  await passwordManager.set("www.example1.com", "mySecretPassword1");
  await passwordManager.set("www.example2.com", "mySecretPassword2");

  // Step 3: Dump the Keychain
  const [serialization, checksum] = await passwordManager.dump();
  // console.log("Serialized Keychain:", serialization);
  // console.log("Checksum:", checksum);

  // Step 4: Load the Keychain
  const loadedKeychain = await Keychain.load(
    "myMasterPassword123",
    serialization,
    checksum
  );

  /*
  // Step 5: Verify entries
  const password1 = await loadedKeychain.get("www.example1.com");
  const password2 = await loadedKeychain.get("www.example2.com");

  console.log("Loaded Password 1:", password1); // Should output: mySecretPassword1
  console.log("Loaded Password 2:", password2); // Should output: mySecretPassword2

  // Step 6: Remove an entry
  await loadedKeychain.remove("www.example1.com");
  const removedPassword = await loadedKeychain.get("www.example1.com");
  console.log("Removed Password:", removedPassword); // Should output: null

  // Check for a non-existent entry
  const nonExistentPassword = await loadedKeychain.get("www.nonexistent.com");
  console.log("Non-existent Password:", nonExistentPassword); // Should output: null
  */
})();
