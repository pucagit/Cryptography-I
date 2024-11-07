"use strict";

const { getRandomValues } = require("crypto");
const crypto = require("crypto").webcrypto;

/**
 * Converts a crypto key into a buffer for use in SubtleCrypto functions.
 * @param {CryptoKey} key - A crypto key
 */
async function keyToBuffer(key) {
  const rawKey = await crypto.subtle.exportKey("raw", key);
  return Buffer.from(rawKey);
}

/**
 * Converts a plaintext string into a buffer for use in SubtleCrypto functions.
 * @param {string} str - A plaintext string
 * @returns {Buffer} A buffer representation for use in SubtleCrypto functions
 */
function stringToBuffer(str) {
  return Buffer.from(str);
}

/**
 * Converts a buffer object representing string data back into a string
 * @param {BufferSource} buf - A buffer containing string data
 * @returns {string} The original string
 */
function bufferToString(buf) {
  return Buffer.from(buf).toString();
}

/**
 * Converts a buffer to a Base64 string which can be used as a key in a map and
 * can be easily serialized.
 * @param {BufferSource} buf - A buffer-like object
 * @returns {string} A Base64 string representing the bytes in the buffer
 */
function encodeBuffer(buf) {
  return Buffer.from(buf).toString("base64");
}

/**
 * Converts a Base64 string back into a buffer
 * @param {string} base64 - A Base64 string representing a buffer
 * @returns {Buffer} A Buffer object
 */
function decodeBuffer(base64) {
  return Buffer.from(base64, "base64");
}

/**
 * Generates a buffer of random bytes
 * @param {number} len - The number of random bytes
 * @returns {Uint8Array} A buffer of `len` random bytes
 */
function getRandomBytes(len) {
  return getRandomValues(new Uint8Array(len)).buffer;
}

/**
 * Compare 2 array buffers
 * @param {ArrayBuffer} buffer1
 * @param {ArrayBuffer} buffer2
 * @returns {Boolean} True if the buffers are equal, false
 */
function arrayBuffersEqual(buffer1, buffer2) {
  // Check if the buffers are the same length
  if (buffer1.byteLength !== buffer2.byteLength) {
    return false;
  }

  // Create typed arrays for both buffers
  const view1 = new Uint8Array(buffer1);
  const view2 = new Uint8Array(buffer2);

  // Compare each byte
  for (let i = 0; i < view1.length; i++) {
    if (view1[i] !== view2[i]) {
      return false; // Return false if any byte is different
    }
  }

  return true; // If no differences, return true
}

module.exports = {
  keyToBuffer,
  stringToBuffer,
  bufferToString,
  encodeBuffer,
  decodeBuffer,
  getRandomBytes,
  arrayBuffersEqual,
};
