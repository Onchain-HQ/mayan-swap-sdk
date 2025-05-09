// src/addresses.ts
var addresses_default = {
  "MAYAN_FORWARDER_CONTRACT": "0x337685fdaB40D39bd02028545a4FfA7D287cC3E2",
  "MAYAN_PROGRAM_ID": "FC4eXxkyrMPTjiYUpp4EAnkmwMbQyZ6NDCh1kfLn6vsf",
  "AUCTION_PROGRAM_ID": "8QJmxZcEzwuYmCPy6XqgN2sHcYCcFq6AEfBMJZZuLo5a",
  "MCTP_PROGRAM_ID": "dkpZqrxHFrhziEMQ931GLtfy11nFkCsfMftH9u6QwBU",
  "SWIFT_PROGRAM_ID": "BLZRi6frs4X4DNLw56V4EXai1b6QVESN1BhHBTYM9VcY",
  "FEE_MANAGER_PROGRAM_ID": "5VtQHnhs2pfVEr68qQsbTRwKh4JV5GTu9mBHgHFxpHeQ",
  "WORMHOLE_PROGRAM_ID": "worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth",
  "CCTP_CORE_PROGRAM_ID": "CCTPmbSD7gX1bxKPAmg77w8oFzNFpaQiQUWD43TKaecd",
  "CCTP_TOKEN_PROGRAM_ID": "CCTPiPYPc6AsJuwueEnWgSgucamXDZwBd53dQ11YiKX3",
  "TOKEN_PROGRAM_ID": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  "TOKEN_2022_PROGRAM_ID": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
  "ASSOCIATED_TOKEN_PROGRAM_ID": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
  "SPL_UTILS_PROGRAM_ID": "B96dV3Luxzo6SokJx3xt8i5y8Mb7HRR6Eec8hCjJDT69",
  "LOOKUP_TABLE": "75X8YgJPcadksw6Ag3qsYUfi1bsFwDoCKYtqPPqdydAG",
  "SUI_MCTP_STATE": "0xb787fe0f7530b4fd2162fa0cc92f4f6c5a97c54b4c5c55eb04ab29f4b803ac9c",
  "SUI_MCTP_FEE_MANAGER_STATE": "0xa1b4a96ce93d36dd0bbce0adc39533a07d2f32928918c80cd6fe7868320978f2",
  "SUI_CCTP_CORE_PACKAGE_ID": "0x08d87d37ba49e785dde270a83f8e979605b03dc552b5548f26fdf2f49bf7ed1b",
  "SUI_CCTP_CORE_STATE": "0xf68268c3d9b1df3215f2439400c1c4ea08ac4ef4bb7d6f3ca6a2a239e17510af",
  "SUI_CCTP_TOKEN_PACKAGE_ID": "0x2aa6c5d56376c371f88a6cc42e852824994993cb9bab8d3e6450cbe3cb32b94e",
  "SUI_CCTP_TOKEN_STATE": "0x45993eecc0382f37419864992c12faee2238f5cfe22b98ad3bf455baf65c8a2f",
  "SUI_WORMHOLE_PACKAGE_ID": "0x5306f64e312b581766351c07af79c72fcb1cd25147157fdc2f8ad76de9a3fb6a",
  "SUI_WORMHOLE_STATE": "0xaeab97f96cf9877fee2883315d459552b2b921edc16d7ceac6eab944dd88919c",
  "SUI_LOGGER_PACKAGE_ID": "0x05680e9030c147b413a489f7891273acc221d49bd061c433e5771bc170fc37ac",
  "EXPLORER_URL": "https://explorer-api.mayan.finance/v3",
  "PRICE_URL": "https://price-api.mayan.finance/v3",
  "RELAYER_URL": "https://relayer-api.mayan.finance/v3"
};

// src/utils.ts
import {
  zeroPadValue,
  parseUnits,
  formatUnits,
  keccak256
} from "ethers";
import { PublicKey, SystemProgram } from "@solana/web3.js";
var isValidAptosType = (str) => /^(0x)?[0-9a-fA-F]+::\w+::\w+$/.test(str);
function nativeAddressToHexString(address, wChainId) {
  if (wChainId === 1) {
    return zeroPadValue(new PublicKey(address).toBytes(), 32);
  } else if (wChainId === chains.ethereum || wChainId === chains.bsc || wChainId === chains.polygon || wChainId === chains.avalanche || wChainId === chains.arbitrum || wChainId === chains.optimism || wChainId === chains.base || wChainId === chains.unichain || wChainId === chains.linea) {
    return zeroPadValue(address, 32);
  } else if (wChainId === chains.aptos && isValidAptosType(address)) {
    return keccak256(address);
  } else if (wChainId === chains.sui) {
    let addressStr = address.startsWith("0x") ? address.substring(2) : address;
    if (Buffer.from(addressStr, "hex").length !== 32) {
      throw new Error("Invalid sui address: " + address);
    }
    return zeroPadValue(address, 32);
  } else {
    console.log(`Unsupported chain id: ${wChainId}`, address);
    throw new Error("Unsupported token chain");
  }
}
function hexToUint8Array(input) {
  return new Uint8Array(
    Buffer.from(input.startsWith("0x") ? input.substring(2) : input, "hex")
  );
}
function getAssociatedTokenAddress(mint, owner, allowOwnerOffCurve = false, programId = new PublicKey(addresses_default.TOKEN_PROGRAM_ID), associatedTokenProgramId = new PublicKey(
  addresses_default.ASSOCIATED_TOKEN_PROGRAM_ID
)) {
  if (!allowOwnerOffCurve && !PublicKey.isOnCurve(owner.toBuffer())) {
    throw new Error("TokenOwnerOffCurveError");
  }
  const [address] = PublicKey.findProgramAddressSync(
    [owner.toBuffer(), programId.toBuffer(), mint.toBuffer()],
    associatedTokenProgramId
  );
  return address;
}
function getAmountOfFractionalAmount(amount, decimals) {
  if (amount === null || amount === void 0) {
    throw new Error("getAmountOfFractionalAmount: Amount is null or undefined");
  }
  if (typeof amount !== "string" && typeof amount !== "number") {
    throw new Error(
      "getAmountOfFractionalAmount: Amount is not a string or number"
    );
  }
  if (typeof amount === "string" && amount.length === 0) {
    throw new Error("getAmountOfFractionalAmount: Amount is empty");
  }
  if (!Number.isFinite(Number(amount))) {
    throw new Error("getAmountOfFractionalAmount: Amount is not a number");
  }
  const cutFactor = Math.min(8, Number(decimals));
  const numStr = Number(amount).toFixed(cutFactor + 1);
  const reg = new RegExp(`^-?\\d+(?:\\.\\d{0,${cutFactor}})?`);
  const matchResult = numStr.match(reg);
  if (!matchResult) {
    throw new Error("getAmountOfFractionalAmount: fixedAmount is null");
  }
  const fixedAmount = matchResult[0];
  return parseUnits(fixedAmount, Number(decimals));
}
function getDisplayAmount(inputAmount, decimals) {
  return Number(formatUnits(inputAmount, decimals));
}
var chains = {
  solana: 1,
  ethereum: 2,
  bsc: 4,
  polygon: 5,
  avalanche: 6,
  arbitrum: 23,
  optimism: 24,
  base: 30,
  aptos: 22,
  sui: 21,
  unichain: 44,
  linea: 38
};
function getWormholeChainIdByName(chain) {
  return chains[chain];
}
var evmChainIdMap = {
  [1]: 2,
  [56]: 4,
  [137]: 5,
  [43114]: 6,
  [42161]: 23,
  [10]: 24,
  [8453]: 30,
  [130]: 44,
  [59144]: 38
};
function getEvmChainIdByName(chain) {
  const wormholeChainId = chains[chain];
  const evmIds = Object.keys(evmChainIdMap);
  for (const evmId of evmIds) {
    if (evmChainIdMap[evmId] === wormholeChainId) {
      return Number(evmId);
    }
  }
  throw new Error(`Unsupported chain: ${chain}`);
}
function getWormholeChainIdById(chainId) {
  return evmChainIdMap[chainId];
}
var sdkVersion = [10, 5, 0];
function getSdkVersion() {
  return sdkVersion.join("_");
}
function checkSdkVersionSupport(minimumVersion) {
  if (sdkVersion[0] < minimumVersion[0]) {
    return false;
  }
  if (sdkVersion[0] > minimumVersion[0]) {
    return true;
  }
  if (sdkVersion[1] < minimumVersion[1]) {
    return false;
  }
  if (sdkVersion[1] > minimumVersion[1]) {
    return true;
  }
  if (sdkVersion[2] >= minimumVersion[2]) {
    return true;
  }
  return false;
}
function getGasDecimal(chain) {
  if (chain === "solana") {
    return 9;
  }
  return 18;
}
function getGasDecimalsInSolana(chain) {
  if (chain === "solana") {
    return 9;
  }
  return 8;
}
var MAX_U64 = BigInt(2) ** BigInt(64) - BigInt(1);
function getSafeU64Blob(value) {
  if (value < BigInt(0) || value > MAX_U64) {
    throw new Error(`Invalid u64: ${value}`);
  }
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(value);
  return buf;
}
var ZeroPermit = {
  value: BigInt(0),
  deadline: 0,
  v: 0,
  r: `0x${SystemProgram.programId.toBuffer().toString("hex")}`,
  s: `0x${SystemProgram.programId.toBuffer().toString("hex")}`
};
function wait(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
function getQuoteSuitableReferrerAddress(quote, referrerAddresses) {
  if (!quote || !referrerAddresses) {
    return null;
  }
  if (quote.type === "WH") {
    return referrerAddresses?.solana || null;
  }
  if (quote.type === "MCTP" || quote.type === "SWIFT") {
    if (quote.toChain === "solana") {
      return referrerAddresses?.solana || null;
    }
    if (quote.toChain === "sui") {
      return referrerAddresses?.sui || null;
    }
    return referrerAddresses?.evm || null;
  }
  return null;
}
var MCTP_PAYLOAD_TYPE_DEFAULT = 1;
var MCTP_PAYLOAD_TYPE_CUSTOM_PAYLOAD = 2;
var MCTP_INIT_ORDER_PAYLOAD_ID = 1;
var FAST_MCTP_PAYLOAD_TYPE_DEFAULT = 1;
var FAST_MCTP_PAYLOAD_TYPE_CUSTOM_PAYLOAD = 2;
var FAST_MCTP_PAYLOAD_TYPE_ORDER = 3;

// src/api.ts
function toQueryString(params) {
  return Object.entries(params).filter(
    ([_, value]) => value !== void 0 && value !== null && !Array.isArray(value)
  ).map(
    ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  ).join("&");
}
async function check5xxError(res) {
  if (res.status.toString().startsWith("5")) {
    let error;
    try {
      const err = await res.json();
      if ((err?.code || err?.statusCode) && (err?.message || err?.msg)) {
        error = {
          code: err?.code || err?.statusCode,
          message: err?.message || err?.msg
        };
      }
    } catch (err) {
      error = new Error("Internal server error");
    }
    throw error;
  }
}
async function fetchAllTokenList(tokenStandards) {
  const query = tokenStandards ? `?standard=${tokenStandards.join(",")}` : "";
  const res = await fetch(`${addresses_default.PRICE_URL}/tokens${query}`, {
    method: "GET",
    redirect: "follow"
  });
  await check5xxError(res);
  if (res.status === 200) {
    const result = await res.json();
    return result;
  }
  throw new Error("Cannot fetch Mayan tokens!");
}
async function fetchTokenList(chain, nonPortal = false, tokenStandards) {
  const queryParams = {
    chain,
    nonPortal,
    standard: tokenStandards ? tokenStandards?.join(",") : void 0
  };
  const res = await fetch(
    `${addresses_default.PRICE_URL}/tokens?${toQueryString(queryParams)}`
  );
  await check5xxError(res);
  if (res.status === 200) {
    const result = await res.json();
    return result[chain];
  }
  throw new Error("Cannot fetch Mayan tokens!");
}
function generateFetchQuoteUrl(params, quoteOptions = {
  wormhole: true,
  swift: true,
  mctp: true,
  shuttle: true,
  gasless: false,
  onlyDirect: false,
  fastMctp: true
}) {
  const { gasDrop, referrerBps } = params;
  let slippageBps = params.slippageBps;
  if (slippageBps !== "auto" && !Number.isFinite(slippageBps)) {
    slippageBps = params.slippage * 100;
  }
  const _quoteOptions = {
    wormhole: quoteOptions.wormhole !== false,
    // default to true
    swift: quoteOptions.swift !== false,
    // default to true
    mctp: quoteOptions.mctp !== false,
    // default to true
    shuttle: quoteOptions.shuttle === true,
    // default to false
    fastMctp: quoteOptions.fastMctp !== false,
    // default to true
    gasless: quoteOptions.gasless === true,
    // default to false
    onlyDirect: quoteOptions.onlyDirect === true
    // default to false
  };
  const queryParams = {
    ..._quoteOptions,
    solanaProgram: addresses_default.MAYAN_PROGRAM_ID,
    forwarderAddress: addresses_default.MAYAN_FORWARDER_CONTRACT,
    amountIn: !params.amountIn64 && Number.isFinite(params.amount) ? params.amount : void 0,
    amountIn64: params.amountIn64,
    fromToken: params.fromToken,
    fromChain: params.fromChain,
    toToken: params.toToken,
    toChain: params.toChain,
    slippageBps,
    referrer: params.referrer,
    referrerBps: Number.isFinite(referrerBps) ? referrerBps : void 0,
    gasDrop: Number.isFinite(gasDrop) ? gasDrop : void 0,
    sdkVersion: getSdkVersion()
  };
  const baseUrl = `${addresses_default.PRICE_URL}/quote?`;
  const queryString = toQueryString(queryParams);
  return baseUrl + queryString;
}
async function fetchQuote(params, quoteOptions = {
  swift: true,
  mctp: true,
  gasless: false,
  onlyDirect: false
}) {
  const url = generateFetchQuoteUrl(params, quoteOptions);
  const res = await fetch(url, {
    method: "GET",
    redirect: "follow"
  });
  await check5xxError(res);
  const result = await res.json();
  if (res.status !== 200 && res.status !== 201) {
    throw {
      code: result?.code || 0,
      message: result?.msg || result?.message || "Route not found",
      data: result?.data
    };
  }
  if (!checkSdkVersionSupport(result.minimumSdkVersion)) {
    throw {
      code: 9999,
      message: "Swap SDK is outdated!"
    };
  }
  return result.quotes;
}
async function getCurrentChainTime(chain) {
  const res = await fetch(`${addresses_default.PRICE_URL}/clock/${chain}`, {
    method: "GET",
    redirect: "follow"
  });
  await check5xxError(res);
  const result = await res.json();
  if (res.status !== 200 && res.status !== 201) {
    throw result;
  }
  return result.clock;
}
async function getSuggestedRelayer() {
  const res = await fetch(
    `${addresses_default.RELAYER_URL}/active-relayers?solanaProgram=${addresses_default.MAYAN_PROGRAM_ID}`,
    {
      method: "GET",
      redirect: "follow"
    }
  );
  await check5xxError(res);
  const result = await res.json();
  if (res.status !== 200 && res.status !== 201) {
    throw result;
  }
  return result.suggested;
}
async function getSwapSolana(params) {
  const query = toQueryString({
    ...params,
    sdkVersion: getSdkVersion()
  });
  const res = await fetch(`${addresses_default.PRICE_URL}/get-swap/solana?${query}`, {
    method: "GET",
    redirect: "follow"
  });
  await check5xxError(res);
  const result = await res.json();
  if (res.status !== 200 && res.status !== 201) {
    throw result;
  }
  return result;
}
async function submitSwiftEvmSwap(params, signature) {
  const res = await fetch(`${addresses_default.EXPLORER_URL}/submit/evm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(
      {
        ...params,
        signature
      },
      (_key, value) => {
        if (typeof value === "bigint") {
          return value.toString();
        }
        return value;
      }
    )
  });
  await check5xxError(res);
}
async function submitSwiftSolanaSwap(signedTx) {
  const res = await fetch(`${addresses_default.EXPLORER_URL}/submit/solana`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      signedTx
    })
  });
  await check5xxError(res);
  const result = await res.json();
  if (res.status !== 200 && res.status !== 201) {
    throw result;
  }
  return result;
}

// src/evm/evmSwap.ts
import {
  Contract as Contract5,
  toBeHex as toBeHex5,
  ZeroAddress as ZeroAddress7
} from "ethers";
import { PublicKey as PublicKey8, SystemProgram as SystemProgram9 } from "@solana/web3.js";

// src/evm/MayanSwapArtifact.ts
var MayanSwapArtifact_default = {
  "_format": "hh-sol-artifact-1",
  "contractName": "MayanSwap",
  "sourceName": "src/MayanSwap.sol",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_tokenBridge",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_weth",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "emitterChainId",
          "type": "uint16"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "emitterAddress",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "sequence",
          "type": "uint64"
        }
      ],
      "name": "Redeemed",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newGuardian",
          "type": "address"
        }
      ],
      "name": "changeGuardian",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "claimGuardian",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint8",
              "name": "payloadId",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "tokenAddr",
              "type": "bytes32"
            },
            {
              "internalType": "uint16",
              "name": "tokenChainId",
              "type": "uint16"
            },
            {
              "internalType": "bytes32",
              "name": "destAddr",
              "type": "bytes32"
            },
            {
              "internalType": "uint16",
              "name": "destChainId",
              "type": "uint16"
            },
            {
              "internalType": "bytes32",
              "name": "sourceAddr",
              "type": "bytes32"
            },
            {
              "internalType": "uint16",
              "name": "sourceChainId",
              "type": "uint16"
            },
            {
              "internalType": "uint64",
              "name": "sequence",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "amountOutMin",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "deadline",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "swapFee",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "redeemFee",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "refundFee",
              "type": "uint64"
            },
            {
              "internalType": "bytes32",
              "name": "auctionAddr",
              "type": "bytes32"
            },
            {
              "internalType": "bool",
              "name": "unwrapRedeem",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "unwrapRefund",
              "type": "bool"
            }
          ],
          "internalType": "struct MayanStructs.Swap",
          "name": "s",
          "type": "tuple"
        }
      ],
      "name": "encodeSwap",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "encoded",
          "type": "bytes"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getWeth",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isPaused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "encoded",
          "type": "bytes"
        }
      ],
      "name": "parseRedeemPayload",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint8",
              "name": "payloadId",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "recipient",
              "type": "bytes32"
            },
            {
              "internalType": "uint64",
              "name": "relayerFee",
              "type": "uint64"
            },
            {
              "internalType": "bool",
              "name": "unwrap",
              "type": "bool"
            },
            {
              "internalType": "uint64",
              "name": "gasDrop",
              "type": "uint64"
            },
            {
              "internalType": "bytes",
              "name": "customPayload",
              "type": "bytes"
            }
          ],
          "internalType": "struct MayanStructs.Redeem",
          "name": "r",
          "type": "tuple"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "encodedVm",
          "type": "bytes"
        }
      ],
      "name": "redeem",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "encodedVm",
          "type": "bytes"
        }
      ],
      "name": "redeemAndUnwrap",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "_pause",
          "type": "bool"
        }
      ],
      "name": "setPause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint64",
              "name": "swapFee",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "redeemFee",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "refundFee",
              "type": "uint64"
            }
          ],
          "internalType": "struct MayanSwap.RelayerFees",
          "name": "relayerFees",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "mayanAddr",
              "type": "bytes32"
            },
            {
              "internalType": "uint16",
              "name": "mayanChainId",
              "type": "uint16"
            },
            {
              "internalType": "bytes32",
              "name": "auctionAddr",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "destAddr",
              "type": "bytes32"
            },
            {
              "internalType": "uint16",
              "name": "destChainId",
              "type": "uint16"
            },
            {
              "internalType": "bytes32",
              "name": "referrer",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "refundAddr",
              "type": "bytes32"
            }
          ],
          "internalType": "struct MayanSwap.Recepient",
          "name": "recipient",
          "type": "tuple"
        },
        {
          "internalType": "bytes32",
          "name": "tokenOutAddr",
          "type": "bytes32"
        },
        {
          "internalType": "uint16",
          "name": "tokenOutChainId",
          "type": "uint16"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "transferDeadline",
              "type": "uint256"
            },
            {
              "internalType": "uint64",
              "name": "swapDeadline",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "amountOutMin",
              "type": "uint64"
            },
            {
              "internalType": "bool",
              "name": "unwrap",
              "type": "bool"
            },
            {
              "internalType": "uint64",
              "name": "gasDrop",
              "type": "uint64"
            },
            {
              "internalType": "bytes",
              "name": "customPayload",
              "type": "bytes"
            }
          ],
          "internalType": "struct MayanSwap.Criteria",
          "name": "criteria",
          "type": "tuple"
        },
        {
          "internalType": "address",
          "name": "tokenIn",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        }
      ],
      "name": "swap",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "sequence",
          "type": "uint64"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "address payable",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "sweepEth",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "sweepToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint64",
              "name": "swapFee",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "redeemFee",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "refundFee",
              "type": "uint64"
            }
          ],
          "internalType": "struct MayanSwap.RelayerFees",
          "name": "relayerFees",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "mayanAddr",
              "type": "bytes32"
            },
            {
              "internalType": "uint16",
              "name": "mayanChainId",
              "type": "uint16"
            },
            {
              "internalType": "bytes32",
              "name": "auctionAddr",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "destAddr",
              "type": "bytes32"
            },
            {
              "internalType": "uint16",
              "name": "destChainId",
              "type": "uint16"
            },
            {
              "internalType": "bytes32",
              "name": "referrer",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "refundAddr",
              "type": "bytes32"
            }
          ],
          "internalType": "struct MayanSwap.Recepient",
          "name": "recipient",
          "type": "tuple"
        },
        {
          "internalType": "bytes32",
          "name": "tokenOutAddr",
          "type": "bytes32"
        },
        {
          "internalType": "uint16",
          "name": "tokenOutChainId",
          "type": "uint16"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "transferDeadline",
              "type": "uint256"
            },
            {
              "internalType": "uint64",
              "name": "swapDeadline",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "amountOutMin",
              "type": "uint64"
            },
            {
              "internalType": "bool",
              "name": "unwrap",
              "type": "bool"
            },
            {
              "internalType": "uint64",
              "name": "gasDrop",
              "type": "uint64"
            },
            {
              "internalType": "bytes",
              "name": "customPayload",
              "type": "bytes"
            }
          ],
          "internalType": "struct MayanSwap.Criteria",
          "name": "criteria",
          "type": "tuple"
        }
      ],
      "name": "wrapAndSwapETH",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "sequence",
          "type": "uint64"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]
};

// src/evm/MayanForwarderArtifact.ts
var MayanForwarderArtifact_default = {
  "_format": "hh-sol-artifact-1",
  "contractName": "MayanForwarder",
  "sourceName": "src/MayanForwarder.sol",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_guardian",
          "type": "address"
        },
        {
          "internalType": "address[]",
          "name": "_swapProtocols",
          "type": "address[]"
        },
        {
          "internalType": "address[]",
          "name": "_mayanProtocols",
          "type": "address[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "UnsupportedProtocol",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "mayanProtocol",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "protocolData",
          "type": "bytes"
        }
      ],
      "name": "ForwardedERC20",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "mayanProtocol",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "protocolData",
          "type": "bytes"
        }
      ],
      "name": "ForwardedEth",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "SwapAndForwarded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "tokenIn",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "swapProtocol",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "middleToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "middleAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "mayanProtocol",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "mayanData",
          "type": "bytes"
        }
      ],
      "name": "SwapAndForwardedERC20",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "swapProtocol",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "middleToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "middleAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "mayanProtocol",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "mayanData",
          "type": "bytes"
        }
      ],
      "name": "SwapAndForwardedEth",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newGuardian",
          "type": "address"
        }
      ],
      "name": "changeGuardian",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "claimGuardian",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenIn",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "v",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "r",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "s",
              "type": "bytes32"
            }
          ],
          "internalType": "struct MayanForwarder.PermitParams",
          "name": "permitParams",
          "type": "tuple"
        },
        {
          "internalType": "address",
          "name": "mayanProtocol",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "protocolData",
          "type": "bytes"
        }
      ],
      "name": "forwardERC20",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "mayanProtocol",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "protocolData",
          "type": "bytes"
        }
      ],
      "name": "forwardEth",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "guardian",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "mayanProtocols",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextGuardian",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "address payable",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "rescueEth",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "rescueToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "mayanProtocol",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "enabled",
          "type": "bool"
        }
      ],
      "name": "setMayanProtocol",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "swapProtocol",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "enabled",
          "type": "bool"
        }
      ],
      "name": "setSwapProtocol",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenIn",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "v",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "r",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "s",
              "type": "bytes32"
            }
          ],
          "internalType": "struct MayanForwarder.PermitParams",
          "name": "permitParams",
          "type": "tuple"
        },
        {
          "internalType": "address",
          "name": "swapProtocol",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "swapData",
          "type": "bytes"
        },
        {
          "internalType": "address",
          "name": "middleToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "minMiddleAmount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "mayanProtocol",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "mayanData",
          "type": "bytes"
        }
      ],
      "name": "swapAndForwardERC20",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "swapProtocol",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "swapData",
          "type": "bytes"
        },
        {
          "internalType": "address",
          "name": "middleToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "minMiddleAmount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "mayanProtocol",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "mayanData",
          "type": "bytes"
        }
      ],
      "name": "swapAndForwardEth",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "swapProtocols",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "linkReferences": {},
  "deployedLinkReferences": {}
};

// src/evm/evmMctp.ts
import { Contract, toBeHex, ZeroAddress } from "ethers";
import { SystemProgram as SystemProgram2 } from "@solana/web3.js";

// src/evm/MayanCircleArtifact.ts
var MayanCircleArtifact_default = {
  _format: "hh-sol-artifact-1",
  contractName: "MayanCircle",
  sourceName: "src/MayanCircle.sol",
  abi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "_cctpTokenMessenger",
          type: "address"
        },
        {
          internalType: "address",
          name: "_wormhole",
          type: "address"
        },
        {
          internalType: "address",
          name: "_feeManager",
          type: "address"
        },
        {
          internalType: "uint16",
          name: "_auctionChainId",
          type: "uint16"
        },
        {
          internalType: "bytes32",
          name: "_auctionAddr",
          type: "bytes32"
        },
        {
          internalType: "uint8",
          name: "_consistencyLevel",
          type: "uint8"
        }
      ],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      inputs: [],
      name: "CallerAlreadySet",
      type: "error"
    },
    {
      inputs: [],
      name: "CallerNotSet",
      type: "error"
    },
    {
      inputs: [],
      name: "CctpReceiveFailed",
      type: "error"
    },
    {
      inputs: [],
      name: "DeadlineViolation",
      type: "error"
    },
    {
      inputs: [],
      name: "DomainAlreadySet",
      type: "error"
    },
    {
      inputs: [],
      name: "DomainNotSet",
      type: "error"
    },
    {
      inputs: [],
      name: "EmitterAlreadySet",
      type: "error"
    },
    {
      inputs: [],
      name: "EthTransferFailed",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidAction",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidAddress",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidAmountOut",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidCaller",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidDestAddr",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidDomain",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidEmitter",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidGasDrop",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidMintRecipient",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidNonce",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidOrder",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidPayload",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidProtocolFee",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidRedeemFee",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidReferrerFee",
      type: "error"
    },
    {
      inputs: [],
      name: "MintRecipientAlreadySet",
      type: "error"
    },
    {
      inputs: [],
      name: "MintRecipientNotSet",
      type: "error"
    },
    {
      inputs: [],
      name: "Paused",
      type: "error"
    },
    {
      inputs: [],
      name: "Unauthorized",
      type: "error"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint32",
          name: "sourceDomain",
          type: "uint32"
        },
        {
          indexed: false,
          internalType: "uint64",
          name: "sourceNonce",
          type: "uint64"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      name: "OrderFulfilled",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint32",
          name: "sourceDomain",
          type: "uint32"
        },
        {
          indexed: false,
          internalType: "uint64",
          name: "sourceNonce",
          type: "uint64"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      name: "OrderRefunded",
      type: "event"
    },
    {
      inputs: [],
      name: "auctionAddr",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "auctionChainId",
      outputs: [
        {
          internalType: "uint16",
          name: "",
          type: "uint16"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "tokenIn",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amountIn",
          type: "uint256"
        },
        {
          internalType: "uint64",
          name: "redeemFee",
          type: "uint64"
        },
        {
          internalType: "uint64",
          name: "gasDrop",
          type: "uint64"
        },
        {
          internalType: "bytes32",
          name: "destAddr",
          type: "bytes32"
        },
        {
          internalType: "uint32",
          name: "destDomain",
          type: "uint32"
        },
        {
          internalType: "uint8",
          name: "payloadType",
          type: "uint8"
        },
        {
          internalType: "bytes",
          name: "customPayload",
          type: "bytes"
        }
      ],
      name: "bridgeWithFee",
      outputs: [
        {
          internalType: "uint64",
          name: "sequence",
          type: "uint64"
        }
      ],
      stateMutability: "payable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "tokenIn",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amountIn",
          type: "uint256"
        },
        {
          internalType: "uint64",
          name: "gasDrop",
          type: "uint64"
        },
        {
          internalType: "uint256",
          name: "redeemFee",
          type: "uint256"
        },
        {
          internalType: "uint32",
          name: "destDomain",
          type: "uint32"
        },
        {
          internalType: "bytes32",
          name: "destAddr",
          type: "bytes32"
        }
      ],
      name: "bridgeWithLockedFee",
      outputs: [
        {
          internalType: "uint64",
          name: "cctpNonce",
          type: "uint64"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "cctpTokenMessenger",
      outputs: [
        {
          internalType: "contract ITokenMessenger",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "",
          type: "uint16"
        }
      ],
      name: "chainIdToEmitter",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newGuardian",
          type: "address"
        }
      ],
      name: "changeGuardian",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "claimGuardian",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "consistencyLevel",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "address",
              name: "tokenIn",
              type: "address"
            },
            {
              internalType: "uint256",
              name: "amountIn",
              type: "uint256"
            },
            {
              internalType: "uint64",
              name: "gasDrop",
              type: "uint64"
            },
            {
              internalType: "bytes32",
              name: "destAddr",
              type: "bytes32"
            },
            {
              internalType: "uint16",
              name: "destChain",
              type: "uint16"
            },
            {
              internalType: "bytes32",
              name: "tokenOut",
              type: "bytes32"
            },
            {
              internalType: "uint64",
              name: "minAmountOut",
              type: "uint64"
            },
            {
              internalType: "uint64",
              name: "deadline",
              type: "uint64"
            },
            {
              internalType: "uint64",
              name: "redeemFee",
              type: "uint64"
            },
            {
              internalType: "bytes32",
              name: "referrerAddr",
              type: "bytes32"
            },
            {
              internalType: "uint8",
              name: "referrerBps",
              type: "uint8"
            }
          ],
          internalType: "struct MayanCircle.OrderParams",
          name: "params",
          type: "tuple"
        }
      ],
      name: "createOrder",
      outputs: [
        {
          internalType: "uint64",
          name: "sequence",
          type: "uint64"
        }
      ],
      stateMutability: "payable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "",
          type: "uint32"
        }
      ],
      name: "domainToCaller",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "feeManager",
      outputs: [
        {
          internalType: "contract IFeeManager",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint64",
          name: "",
          type: "uint64"
        }
      ],
      name: "feeStorage",
      outputs: [
        {
          internalType: "bytes32",
          name: "destAddr",
          type: "bytes32"
        },
        {
          internalType: "uint64",
          name: "gasDrop",
          type: "uint64"
        },
        {
          internalType: "address",
          name: "token",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "redeemFee",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "cctpMsg",
          type: "bytes"
        },
        {
          internalType: "bytes",
          name: "cctpSigs",
          type: "bytes"
        },
        {
          internalType: "bytes",
          name: "encodedVm",
          type: "bytes"
        },
        {
          components: [
            {
              internalType: "bytes32",
              name: "destAddr",
              type: "bytes32"
            },
            {
              internalType: "uint16",
              name: "destChainId",
              type: "uint16"
            },
            {
              internalType: "bytes32",
              name: "tokenOut",
              type: "bytes32"
            },
            {
              internalType: "uint64",
              name: "promisedAmount",
              type: "uint64"
            },
            {
              internalType: "uint64",
              name: "gasDrop",
              type: "uint64"
            },
            {
              internalType: "uint64",
              name: "redeemFee",
              type: "uint64"
            },
            {
              internalType: "uint64",
              name: "deadline",
              type: "uint64"
            },
            {
              internalType: "bytes32",
              name: "referrerAddr",
              type: "bytes32"
            },
            {
              internalType: "uint8",
              name: "referrerBps",
              type: "uint8"
            },
            {
              internalType: "uint8",
              name: "protocolBps",
              type: "uint8"
            },
            {
              internalType: "bytes32",
              name: "driver",
              type: "bytes32"
            }
          ],
          internalType: "struct MayanCircle.FulfillParams",
          name: "params",
          type: "tuple"
        },
        {
          internalType: "address",
          name: "swapProtocol",
          type: "address"
        },
        {
          internalType: "bytes",
          name: "swapData",
          type: "bytes"
        }
      ],
      name: "fulfillOrder",
      outputs: [],
      stateMutability: "payable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "chainId",
          type: "uint16"
        }
      ],
      name: "getDomain",
      outputs: [
        {
          internalType: "uint32",
          name: "domain",
          type: "uint32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "guardian",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "isPaused",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      name: "keyToMintRecipient",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "localDomain",
      outputs: [
        {
          internalType: "uint32",
          name: "",
          type: "uint32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "paused",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "cctpMsg",
          type: "bytes"
        },
        {
          internalType: "bytes",
          name: "cctpSigs",
          type: "bytes"
        },
        {
          internalType: "bytes",
          name: "encodedVm",
          type: "bytes"
        },
        {
          components: [
            {
              internalType: "uint8",
              name: "payloadType",
              type: "uint8"
            },
            {
              internalType: "bytes32",
              name: "destAddr",
              type: "bytes32"
            },
            {
              internalType: "uint64",
              name: "gasDrop",
              type: "uint64"
            },
            {
              internalType: "uint64",
              name: "redeemFee",
              type: "uint64"
            },
            {
              internalType: "uint64",
              name: "burnAmount",
              type: "uint64"
            },
            {
              internalType: "bytes32",
              name: "burnToken",
              type: "bytes32"
            },
            {
              internalType: "bytes32",
              name: "customPayload",
              type: "bytes32"
            }
          ],
          internalType: "struct MayanCircle.BridgeWithFeeParams",
          name: "bridgeParams",
          type: "tuple"
        }
      ],
      name: "redeemWithFee",
      outputs: [],
      stateMutability: "payable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "cctpMsg",
          type: "bytes"
        },
        {
          internalType: "bytes",
          name: "cctpSigs",
          type: "bytes"
        },
        {
          internalType: "bytes32",
          name: "unlockerAddr",
          type: "bytes32"
        }
      ],
      name: "redeemWithLockedFee",
      outputs: [
        {
          internalType: "uint64",
          name: "sequence",
          type: "uint64"
        }
      ],
      stateMutability: "payable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "cctpNonce",
          type: "uint32"
        },
        {
          internalType: "uint32",
          name: "cctpDomain",
          type: "uint32"
        },
        {
          internalType: "bytes32",
          name: "destAddr",
          type: "bytes32"
        },
        {
          internalType: "bytes32",
          name: "unlockerAddr",
          type: "bytes32"
        }
      ],
      name: "refineFee",
      outputs: [
        {
          internalType: "uint64",
          name: "sequence",
          type: "uint64"
        }
      ],
      stateMutability: "payable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "encodedVm",
          type: "bytes"
        },
        {
          internalType: "bytes",
          name: "cctpMsg",
          type: "bytes"
        },
        {
          internalType: "bytes",
          name: "cctpSigs",
          type: "bytes"
        },
        {
          components: [
            {
              internalType: "address",
              name: "tokenIn",
              type: "address"
            },
            {
              internalType: "uint256",
              name: "amountIn",
              type: "uint256"
            },
            {
              internalType: "uint64",
              name: "gasDrop",
              type: "uint64"
            },
            {
              internalType: "bytes32",
              name: "destAddr",
              type: "bytes32"
            },
            {
              internalType: "uint16",
              name: "destChain",
              type: "uint16"
            },
            {
              internalType: "bytes32",
              name: "tokenOut",
              type: "bytes32"
            },
            {
              internalType: "uint64",
              name: "minAmountOut",
              type: "uint64"
            },
            {
              internalType: "uint64",
              name: "deadline",
              type: "uint64"
            },
            {
              internalType: "uint64",
              name: "redeemFee",
              type: "uint64"
            },
            {
              internalType: "bytes32",
              name: "referrerAddr",
              type: "bytes32"
            },
            {
              internalType: "uint8",
              name: "referrerBps",
              type: "uint8"
            }
          ],
          internalType: "struct MayanCircle.OrderParams",
          name: "orderParams",
          type: "tuple"
        },
        {
          components: [
            {
              internalType: "bytes32",
              name: "trader",
              type: "bytes32"
            },
            {
              internalType: "uint16",
              name: "sourceChainId",
              type: "uint16"
            },
            {
              internalType: "uint8",
              name: "protocolBps",
              type: "uint8"
            }
          ],
          internalType: "struct MayanCircle.ExtraParams",
          name: "extraParams",
          type: "tuple"
        }
      ],
      name: "refund",
      outputs: [],
      stateMutability: "payable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          internalType: "address payable",
          name: "to",
          type: "address"
        }
      ],
      name: "rescueEth",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "token",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          internalType: "address",
          name: "to",
          type: "address"
        }
      ],
      name: "rescueToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint8",
          name: "_consistencyLevel",
          type: "uint8"
        }
      ],
      name: "setConsistencyLevel",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "chainId",
          type: "uint16"
        },
        {
          internalType: "uint32",
          name: "domain",
          type: "uint32"
        }
      ],
      name: "setDomain",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "domain",
          type: "uint32"
        },
        {
          internalType: "bytes32",
          name: "caller",
          type: "bytes32"
        }
      ],
      name: "setDomainCaller",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "chainId",
          type: "uint16"
        },
        {
          internalType: "bytes32",
          name: "emitter",
          type: "bytes32"
        }
      ],
      name: "setEmitter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_feeManager",
          type: "address"
        }
      ],
      name: "setFeeManager",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "destDomain",
          type: "uint32"
        },
        {
          internalType: "address",
          name: "tokenIn",
          type: "address"
        },
        {
          internalType: "bytes32",
          name: "mintRecipient",
          type: "bytes32"
        }
      ],
      name: "setMintRecipient",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bool",
          name: "_pause",
          type: "bool"
        }
      ],
      name: "setPause",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "encodedVm",
          type: "bytes"
        },
        {
          components: [
            {
              internalType: "uint8",
              name: "action",
              type: "uint8"
            },
            {
              internalType: "uint8",
              name: "payloadType",
              type: "uint8"
            },
            {
              internalType: "uint64",
              name: "cctpNonce",
              type: "uint64"
            },
            {
              internalType: "uint32",
              name: "cctpDomain",
              type: "uint32"
            },
            {
              internalType: "bytes32",
              name: "unlockerAddr",
              type: "bytes32"
            },
            {
              internalType: "uint64",
              name: "gasDrop",
              type: "uint64"
            }
          ],
          internalType: "struct MayanCircle.UnlockFeeMsg",
          name: "unlockMsg",
          type: "tuple"
        }
      ],
      name: "unlockFee",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "encodedVm1",
          type: "bytes"
        },
        {
          internalType: "bytes",
          name: "encodedVm2",
          type: "bytes"
        },
        {
          components: [
            {
              internalType: "uint8",
              name: "action",
              type: "uint8"
            },
            {
              internalType: "uint8",
              name: "payloadType",
              type: "uint8"
            },
            {
              internalType: "uint64",
              name: "cctpNonce",
              type: "uint64"
            },
            {
              internalType: "uint32",
              name: "cctpDomain",
              type: "uint32"
            },
            {
              internalType: "bytes32",
              name: "unlockerAddr",
              type: "bytes32"
            },
            {
              internalType: "uint64",
              name: "gasDrop",
              type: "uint64"
            }
          ],
          internalType: "struct MayanCircle.UnlockFeeMsg",
          name: "unlockMsg",
          type: "tuple"
        },
        {
          components: [
            {
              internalType: "uint8",
              name: "action",
              type: "uint8"
            },
            {
              internalType: "uint8",
              name: "payloadType",
              type: "uint8"
            },
            {
              internalType: "uint64",
              name: "cctpNonce",
              type: "uint64"
            },
            {
              internalType: "uint32",
              name: "cctpDomain",
              type: "uint32"
            },
            {
              internalType: "bytes32",
              name: "unlockerAddr",
              type: "bytes32"
            },
            {
              internalType: "uint64",
              name: "gasDrop",
              type: "uint64"
            },
            {
              internalType: "bytes32",
              name: "destAddr",
              type: "bytes32"
            }
          ],
          internalType: "struct MayanCircle.UnlockRefinedFeeMsg",
          name: "refinedMsg",
          type: "tuple"
        }
      ],
      name: "unlockFeeRefined",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "wormhole",
      outputs: [
        {
          internalType: "contract IWormhole",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      stateMutability: "payable",
      type: "receive"
    }
  ],
  linkReferences: {},
  deployedLinkReferences: {}
};

// src/cctp.ts
import { PublicKey as PublicKey2 } from "@solana/web3.js";
var CCTP_TOKEN_DECIMALS = 6;
function getCCTPDomain(chain) {
  switch (chain) {
    case "ethereum":
      return 0;
    case "avalanche":
      return 1;
    case "optimism":
      return 2;
    case "arbitrum":
      return 3;
    case "solana":
      return 5;
    case "base":
      return 6;
    case "polygon":
      return 7;
    case "sui":
      return 8;
    case "unichain":
      return 10;
    case "linea":
      return 11;
    default:
      throw new Error("unsupported chain for cctp");
  }
}
function getCCTPBridgePDAs(mint, destinationChain) {
  const cctpCoreProgramId = new PublicKey2(addresses_default.CCTP_CORE_PROGRAM_ID);
  const cctpTokenProgramId = new PublicKey2(addresses_default.CCTP_TOKEN_PROGRAM_ID);
  const [messageTransmitter] = PublicKey2.findProgramAddressSync(
    [Buffer.from("message_transmitter")],
    cctpCoreProgramId
  );
  const [senderAuthority] = PublicKey2.findProgramAddressSync(
    [Buffer.from("sender_authority")],
    cctpTokenProgramId
  );
  const [localToken] = PublicKey2.findProgramAddressSync(
    [Buffer.from("local_token"), mint.toBytes()],
    cctpTokenProgramId
  );
  const [tokenMessenger] = PublicKey2.findProgramAddressSync(
    [Buffer.from("token_messenger")],
    cctpTokenProgramId
  );
  const [tokenMinter] = PublicKey2.findProgramAddressSync(
    [Buffer.from("token_minter")],
    cctpTokenProgramId
  );
  const destinationDomain = getCCTPDomain(destinationChain);
  const [remoteTokenMessengerKey] = PublicKey2.findProgramAddressSync(
    [
      Buffer.from("remote_token_messenger"),
      Buffer.from(destinationDomain.toString())
    ],
    cctpTokenProgramId
  );
  const [eventAuthCore] = PublicKey2.findProgramAddressSync(
    [Buffer.from("__event_authority")],
    cctpCoreProgramId
  );
  const [eventAuthToken] = PublicKey2.findProgramAddressSync(
    [Buffer.from("__event_authority")],
    cctpTokenProgramId
  );
  return {
    messageTransmitter,
    senderAuthority,
    remoteTokenMessengerKey,
    tokenMessenger,
    tokenMinter,
    eventAuthToken,
    eventAuthCore,
    localToken
  };
}

// src/evm/evmMctp.ts
function getEvmMctpBridgeParams(quote, destinationAddress, signerChainId, customPayload) {
  const signerWormholeChainId = getWormholeChainIdById(Number(signerChainId));
  const sourceChainId = getWormholeChainIdByName(quote.fromChain);
  const destChainId = getWormholeChainIdByName(quote.toChain);
  if (sourceChainId !== signerWormholeChainId) {
    throw new Error(
      `Signer chain id(${Number(
        signerChainId
      )}) and quote from chain are not same! ${sourceChainId} !== ${signerWormholeChainId}`
    );
  }
  const lockFee = quote.cheaperChain === quote.fromChain;
  if (lockFee && !!customPayload) {
    throw new Error("Bridge lock fee cannot have custom payload");
  }
  const destinationAddressHex = nativeAddressToHexString(
    destinationAddress,
    destChainId
  );
  const redeemFee = getAmountOfFractionalAmount(
    quote.redeemRelayerFee,
    CCTP_TOKEN_DECIMALS
  );
  const gasDrop = getAmountOfFractionalAmount(
    quote.gasDrop,
    Math.min(getGasDecimal(quote.toChain), 8)
  );
  const amountIn = BigInt(quote.effectiveAmountIn64);
  const destDomain = getCCTPDomain(quote.toChain);
  if (!quote.mctpMayanContract) {
    throw new Error("MCTP contract address is missing");
  }
  const contractAddress = quote.mctpMayanContract;
  if (quote.toChain === "solana" && lockFee) {
    throw new Error("Cannot lock fee for transfer to solana");
  }
  let bridgeFee = getAmountOfFractionalAmount(
    quote.bridgeFee,
    getGasDecimal(quote.fromChain)
  );
  if (lockFee) {
    bridgeFee = BigInt(0);
  }
  return {
    lockFee,
    tokenIn: quote.mctpInputContract,
    amountIn,
    redeemFee,
    gasDrop,
    destAddr: destinationAddressHex,
    destDomain,
    payloadType: customPayload ? MCTP_PAYLOAD_TYPE_CUSTOM_PAYLOAD : MCTP_PAYLOAD_TYPE_DEFAULT,
    customPayload: customPayload ? `0x${Buffer.from(customPayload).toString("hex")}` : "0x",
    bridgeFee,
    contractAddress
  };
}
function getEvmMctpBridgeTxPayload(quote, destinationAddress, signerChainId, payload) {
  const params = getEvmMctpBridgeParams(
    quote,
    destinationAddress,
    signerChainId,
    payload
  );
  const {
    contractAddress,
    tokenIn,
    amountIn,
    destAddr,
    lockFee,
    redeemFee,
    gasDrop,
    destDomain,
    customPayload,
    payloadType,
    bridgeFee
  } = params;
  const mctpContract = new Contract(contractAddress, MayanCircleArtifact_default.abi);
  let data;
  let value;
  if (lockFee) {
    data = mctpContract.interface.encodeFunctionData("bridgeWithLockedFee", [
      tokenIn,
      amountIn,
      gasDrop,
      redeemFee,
      destDomain,
      destAddr
    ]);
  } else {
    data = mctpContract.interface.encodeFunctionData("bridgeWithFee", [
      tokenIn,
      amountIn,
      redeemFee,
      gasDrop,
      destAddr,
      destDomain,
      payloadType,
      customPayload
    ]);
  }
  value = toBeHex(bridgeFee);
  return {
    to: contractAddress,
    data,
    value,
    _params: params
  };
}
function getEvmMctpCreateOrderParams(quote, destinationAddress, referrerAddress, signerChainId) {
  const signerWormholeChainId = getWormholeChainIdById(Number(signerChainId));
  const sourceChainId = getWormholeChainIdByName(quote.fromChain);
  const destChainId = getWormholeChainIdByName(quote.toChain);
  if (sourceChainId !== signerWormholeChainId) {
    throw new Error(
      `Signer chain id(${Number(
        signerChainId
      )}) and quote from chain are not same! ${sourceChainId} !== ${signerWormholeChainId}`
    );
  }
  if (!quote.mctpMayanContract) {
    throw new Error("MCTP contract address is missing");
  }
  const contractAddress = quote.mctpMayanContract;
  const destinationAddressHex = nativeAddressToHexString(
    destinationAddress,
    destChainId
  );
  let referrerHex;
  if (referrerAddress) {
    referrerHex = nativeAddressToHexString(referrerAddress, destChainId);
  } else {
    referrerHex = nativeAddressToHexString(
      SystemProgram2.programId.toString(),
      getWormholeChainIdByName("solana")
    );
  }
  const redeemFee = getAmountOfFractionalAmount(
    quote.redeemRelayerFee,
    CCTP_TOKEN_DECIMALS
  );
  const gasDrop = getAmountOfFractionalAmount(
    quote.gasDrop,
    Math.min(getGasDecimal(quote.toChain), 8)
  );
  let amountIn = BigInt(quote.effectiveAmountIn64);
  const minAmountOut = getAmountOfFractionalAmount(
    quote.minAmountOut,
    Math.min(8, quote.toToken.decimals)
  );
  const deadline = BigInt(quote.deadline64);
  const tokenOut = quote.toToken.contract === ZeroAddress ? nativeAddressToHexString(
    SystemProgram2.programId.toString(),
    getWormholeChainIdByName("solana")
  ) : nativeAddressToHexString(
    quote.toChain === "sui" ? quote.toToken.verifiedAddress : quote.toToken.contract,
    quote.toToken.wChainId
  );
  return {
    params: {
      tokenIn: quote.mctpInputContract,
      amountIn,
      gasDrop,
      destAddr: destinationAddressHex,
      destChain: destChainId,
      tokenOut,
      minAmountOut,
      deadline,
      redeemFee,
      referrerAddr: referrerHex,
      referrerBps: quote.referrerBps || 0
    },
    bridgeFee: getAmountOfFractionalAmount(
      quote.bridgeFee,
      getGasDecimal(quote.fromChain)
    ),
    contractAddress
  };
}
function getEvmMctpCreateOrderTxPayload(quote, destinationAddress, referrerAddress, signerChainId) {
  const orderParams = getEvmMctpCreateOrderParams(
    quote,
    destinationAddress,
    referrerAddress,
    signerChainId
  );
  const { contractAddress, params, bridgeFee } = orderParams;
  const mctpContract = new Contract(contractAddress, MayanCircleArtifact_default.abi);
  const data = mctpContract.interface.encodeFunctionData("createOrder", [
    params
  ]);
  const value = toBeHex(bridgeFee);
  return {
    to: contractAddress,
    data,
    value,
    _params: orderParams
  };
}
function getMctpFromEvmTxPayload(quote, destinationAddress, referrerAddress, signerChainId, permit, payload) {
  if (quote.type !== "MCTP") {
    throw new Error("Quote type is not MCTP");
  }
  if (!Number.isFinite(Number(signerChainId))) {
    throw new Error("Invalid signer chain id");
  }
  signerChainId = Number(signerChainId);
  const _permit = permit || ZeroPermit;
  const forwarder = new Contract(
    addresses_default.MAYAN_FORWARDER_CONTRACT,
    MayanForwarderArtifact_default.abi
  );
  const bridgeFee = getAmountOfFractionalAmount(
    quote.bridgeFee,
    getGasDecimal(quote.fromChain)
  );
  let value = toBeHex(bridgeFee);
  if (quote.fromToken.contract === quote.mctpInputContract) {
    if (quote.hasAuction) {
      if (!Number(quote.deadline64)) {
        throw new Error("MCTP order requires timeout");
      }
      const mctpPayloadIx = getEvmMctpCreateOrderTxPayload(
        quote,
        destinationAddress,
        referrerAddress,
        signerChainId
      );
      const forwarderMethod = "forwardERC20";
      const forwarderParams = [
        quote.fromToken.contract,
        mctpPayloadIx._params.params.amountIn,
        _permit,
        mctpPayloadIx._params.contractAddress,
        mctpPayloadIx.data
      ];
      const data = forwarder.interface.encodeFunctionData(
        forwarderMethod,
        forwarderParams
      );
      return {
        data,
        to: addresses_default.MAYAN_FORWARDER_CONTRACT,
        value: toBeHex(value),
        chainId: signerChainId,
        _forwarder: {
          method: forwarderMethod,
          params: forwarderParams
        }
      };
    } else {
      const mctpPayloadIx = getEvmMctpBridgeTxPayload(
        quote,
        destinationAddress,
        signerChainId,
        payload
      );
      const forwarderMethod = "forwardERC20";
      const forwarderParams = [
        quote.fromToken.contract,
        mctpPayloadIx._params.amountIn,
        _permit,
        mctpPayloadIx._params.contractAddress,
        mctpPayloadIx.data
      ];
      const data = forwarder.interface.encodeFunctionData(
        forwarderMethod,
        forwarderParams
      );
      return {
        data,
        to: addresses_default.MAYAN_FORWARDER_CONTRACT,
        value: toBeHex(value),
        chainId: signerChainId,
        _forwarder: {
          method: forwarderMethod,
          params: forwarderParams
        }
      };
    }
  } else {
    const { minMiddleAmount, evmSwapRouterAddress, evmSwapRouterCalldata } = quote;
    if (!minMiddleAmount || !evmSwapRouterAddress || !evmSwapRouterCalldata) {
      throw new Error(
        "MCTP swap requires middle amount, router address and calldata"
      );
    }
    if (quote.hasAuction) {
      if (!Number(quote.deadline64)) {
        throw new Error("MCTP order requires timeout");
      }
      const mctpPayloadIx = getEvmMctpCreateOrderTxPayload(
        quote,
        destinationAddress,
        referrerAddress,
        signerChainId
      );
      const minMiddleAmount2 = getAmountOfFractionalAmount(
        quote.minMiddleAmount,
        CCTP_TOKEN_DECIMALS
      );
      if (quote.fromToken.contract === ZeroAddress) {
        let amountIn = mctpPayloadIx._params.params.amountIn;
        if (amountIn <= bridgeFee) {
          throw new Error("Amount in is less than bridge fee");
        }
        if (bridgeFee !== BigInt(0)) {
          amountIn -= bridgeFee;
        }
        value = toBeHex(mctpPayloadIx._params.params.amountIn);
        const forwarderMethod = "swapAndForwardEth";
        const forwarderParams = [
          amountIn,
          evmSwapRouterAddress,
          evmSwapRouterCalldata,
          quote.mctpInputContract,
          minMiddleAmount2,
          mctpPayloadIx._params.contractAddress,
          mctpPayloadIx.data
        ];
        const data = forwarder.interface.encodeFunctionData(
          forwarderMethod,
          forwarderParams
        );
        return {
          data,
          to: addresses_default.MAYAN_FORWARDER_CONTRACT,
          value: toBeHex(value),
          chainId: signerChainId,
          _forwarder: {
            method: forwarderMethod,
            params: forwarderParams
          }
        };
      } else {
        const forwarderMethod = "swapAndForwardERC20";
        const forwarderParams = [
          quote.fromToken.contract,
          mctpPayloadIx._params.params.amountIn,
          _permit,
          evmSwapRouterAddress,
          evmSwapRouterCalldata,
          quote.mctpInputContract,
          minMiddleAmount2,
          mctpPayloadIx._params.contractAddress,
          mctpPayloadIx.data
        ];
        const data = forwarder.interface.encodeFunctionData(
          forwarderMethod,
          forwarderParams
        );
        return {
          data,
          to: addresses_default.MAYAN_FORWARDER_CONTRACT,
          value: toBeHex(value),
          chainId: signerChainId,
          _forwarder: {
            method: forwarderMethod,
            params: forwarderParams
          }
        };
      }
    } else {
      const mctpPayloadIx = getEvmMctpBridgeTxPayload(
        quote,
        destinationAddress,
        signerChainId,
        payload
      );
      const minMiddleAmount2 = getAmountOfFractionalAmount(
        quote.minMiddleAmount,
        CCTP_TOKEN_DECIMALS
      );
      if (quote.fromToken.contract === ZeroAddress) {
        let amountIn = mctpPayloadIx._params.amountIn;
        if (amountIn <= bridgeFee) {
          throw new Error("Amount in is less than bridge fee");
        }
        if (bridgeFee !== BigInt(0)) {
          amountIn -= bridgeFee;
        }
        value = toBeHex(mctpPayloadIx._params.amountIn);
        const forwarderMethod = "swapAndForwardEth";
        const forwarderParams = [
          amountIn,
          evmSwapRouterAddress,
          evmSwapRouterCalldata,
          quote.mctpInputContract,
          minMiddleAmount2,
          mctpPayloadIx._params.contractAddress,
          mctpPayloadIx.data
        ];
        const data = forwarder.interface.encodeFunctionData(
          forwarderMethod,
          forwarderParams
        );
        return {
          data,
          to: addresses_default.MAYAN_FORWARDER_CONTRACT,
          value: toBeHex(value),
          chainId: signerChainId,
          _forwarder: {
            method: forwarderMethod,
            params: forwarderParams
          }
        };
      } else {
        const forwarderMethod = "swapAndForwardERC20";
        const forwarderParams = [
          quote.fromToken.contract,
          mctpPayloadIx._params.amountIn,
          _permit,
          evmSwapRouterAddress,
          evmSwapRouterCalldata,
          quote.mctpInputContract,
          minMiddleAmount2,
          mctpPayloadIx._params.contractAddress,
          mctpPayloadIx.data
        ];
        const data = forwarder.interface.encodeFunctionData(
          forwarderMethod,
          forwarderParams
        );
        return {
          data,
          to: addresses_default.MAYAN_FORWARDER_CONTRACT,
          value: toBeHex(value),
          chainId: signerChainId,
          _forwarder: {
            method: forwarderMethod,
            params: forwarderParams
          }
        };
      }
    }
  }
}

// src/evm/evmSwift.ts
import {
  Contract as Contract2,
  toBeHex as toBeHex2,
  ZeroAddress as ZeroAddress4
} from "ethers";
import { Keypair as Keypair5, SystemProgram as SystemProgram7 } from "@solana/web3.js";

// src/evm/MayanSwiftArtifact.ts
var MayanSwiftArtifact_default = {
  "_format": "hh-sol-artifact-1",
  "contractName": "MayanSwift",
  "sourceName": "src/MayanSwift.sol",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_wormhole",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_feeManager",
          "type": "address"
        },
        {
          "internalType": "uint16",
          "name": "_auctionChainId",
          "type": "uint16"
        },
        {
          "internalType": "bytes32",
          "name": "_auctionAddr",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "_solanaEmitter",
          "type": "bytes32"
        },
        {
          "internalType": "uint8",
          "name": "_consistencyLevel",
          "type": "uint8"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "DeadlineViolation",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "DuplicateOrder",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "FeesTooHigh",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidAction",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidAmount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidAuctionMode",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidBpsFee",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidContractSignature",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidDestChain",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidEmitterAddress",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidEmitterChain",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidEvmAddr",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidGasDrop",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidOrderHash",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidOrderStatus",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidSignature",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidSignatureLength",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidSigner",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidSrcChain",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidWormholeFee",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "OrderNotExists",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "Paused",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "SmallAmountIn",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "Unauthorized",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "key",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "sequence",
          "type": "uint64"
        }
      ],
      "name": "OrderCanceled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "key",
          "type": "bytes32"
        }
      ],
      "name": "OrderCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "key",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "sequence",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "netAmount",
          "type": "uint256"
        }
      ],
      "name": "OrderFulfilled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "key",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "netAmount",
          "type": "uint256"
        }
      ],
      "name": "OrderRefunded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "key",
          "type": "bytes32"
        }
      ],
      "name": "OrderUnlocked",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "auctionAddr",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "auctionChainId",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "tokenIn",
          "type": "bytes32"
        },
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "trader",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "tokenOut",
              "type": "bytes32"
            },
            {
              "internalType": "uint64",
              "name": "minAmountOut",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "gasDrop",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "cancelFee",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "refundFee",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "deadline",
              "type": "uint64"
            },
            {
              "internalType": "bytes32",
              "name": "destAddr",
              "type": "bytes32"
            },
            {
              "internalType": "uint16",
              "name": "destChainId",
              "type": "uint16"
            },
            {
              "internalType": "bytes32",
              "name": "referrerAddr",
              "type": "bytes32"
            },
            {
              "internalType": "uint8",
              "name": "referrerBps",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "auctionMode",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "random",
              "type": "bytes32"
            }
          ],
          "internalType": "struct MayanSwift.OrderParams",
          "name": "params",
          "type": "tuple"
        },
        {
          "internalType": "uint16",
          "name": "srcChainId",
          "type": "uint16"
        },
        {
          "internalType": "uint8",
          "name": "protocolBps",
          "type": "uint8"
        },
        {
          "internalType": "bytes32",
          "name": "canceler",
          "type": "bytes32"
        }
      ],
      "name": "cancelOrder",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "sequence",
          "type": "uint64"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newGuardian",
          "type": "address"
        }
      ],
      "name": "changeGuardian",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "claimGuardian",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "consistencyLevel",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "trader",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "tokenOut",
              "type": "bytes32"
            },
            {
              "internalType": "uint64",
              "name": "minAmountOut",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "gasDrop",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "cancelFee",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "refundFee",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "deadline",
              "type": "uint64"
            },
            {
              "internalType": "bytes32",
              "name": "destAddr",
              "type": "bytes32"
            },
            {
              "internalType": "uint16",
              "name": "destChainId",
              "type": "uint16"
            },
            {
              "internalType": "bytes32",
              "name": "referrerAddr",
              "type": "bytes32"
            },
            {
              "internalType": "uint8",
              "name": "referrerBps",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "auctionMode",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "random",
              "type": "bytes32"
            }
          ],
          "internalType": "struct MayanSwift.OrderParams",
          "name": "params",
          "type": "tuple"
        }
      ],
      "name": "createOrderWithEth",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "orderHash",
          "type": "bytes32"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenIn",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "trader",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "tokenOut",
              "type": "bytes32"
            },
            {
              "internalType": "uint64",
              "name": "minAmountOut",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "gasDrop",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "cancelFee",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "refundFee",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "deadline",
              "type": "uint64"
            },
            {
              "internalType": "bytes32",
              "name": "destAddr",
              "type": "bytes32"
            },
            {
              "internalType": "uint16",
              "name": "destChainId",
              "type": "uint16"
            },
            {
              "internalType": "bytes32",
              "name": "referrerAddr",
              "type": "bytes32"
            },
            {
              "internalType": "uint8",
              "name": "referrerBps",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "auctionMode",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "random",
              "type": "bytes32"
            }
          ],
          "internalType": "struct MayanSwift.OrderParams",
          "name": "params",
          "type": "tuple"
        },
        {
          "internalType": "bytes",
          "name": "signedOrderHash",
          "type": "bytes"
        }
      ],
      "name": "createOrderWithSig",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "orderHash",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenIn",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "trader",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "tokenOut",
              "type": "bytes32"
            },
            {
              "internalType": "uint64",
              "name": "minAmountOut",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "gasDrop",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "cancelFee",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "refundFee",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "deadline",
              "type": "uint64"
            },
            {
              "internalType": "bytes32",
              "name": "destAddr",
              "type": "bytes32"
            },
            {
              "internalType": "uint16",
              "name": "destChainId",
              "type": "uint16"
            },
            {
              "internalType": "bytes32",
              "name": "referrerAddr",
              "type": "bytes32"
            },
            {
              "internalType": "uint8",
              "name": "referrerBps",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "auctionMode",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "random",
              "type": "bytes32"
            }
          ],
          "internalType": "struct MayanSwift.OrderParams",
          "name": "params",
          "type": "tuple"
        }
      ],
      "name": "createOrderWithToken",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "orderHash",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "feeManager",
      "outputs": [
        {
          "internalType": "contract IFeeManager",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "fulfillAmount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "encodedVm",
          "type": "bytes"
        },
        {
          "internalType": "bytes32",
          "name": "recepient",
          "type": "bytes32"
        },
        {
          "internalType": "bool",
          "name": "batch",
          "type": "bool"
        }
      ],
      "name": "fulfillOrder",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "sequence",
          "type": "uint64"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "fulfillAmount",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "orderHash",
          "type": "bytes32"
        },
        {
          "internalType": "uint16",
          "name": "srcChainId",
          "type": "uint16"
        },
        {
          "internalType": "bytes32",
          "name": "tokenIn",
          "type": "bytes32"
        },
        {
          "internalType": "uint8",
          "name": "protocolBps",
          "type": "uint8"
        },
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "trader",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "tokenOut",
              "type": "bytes32"
            },
            {
              "internalType": "uint64",
              "name": "minAmountOut",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "gasDrop",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "cancelFee",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "refundFee",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "deadline",
              "type": "uint64"
            },
            {
              "internalType": "bytes32",
              "name": "destAddr",
              "type": "bytes32"
            },
            {
              "internalType": "uint16",
              "name": "destChainId",
              "type": "uint16"
            },
            {
              "internalType": "bytes32",
              "name": "referrerAddr",
              "type": "bytes32"
            },
            {
              "internalType": "uint8",
              "name": "referrerBps",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "auctionMode",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "random",
              "type": "bytes32"
            }
          ],
          "internalType": "struct MayanSwift.OrderParams",
          "name": "params",
          "type": "tuple"
        },
        {
          "internalType": "bytes32",
          "name": "recepient",
          "type": "bytes32"
        },
        {
          "internalType": "bool",
          "name": "batch",
          "type": "bool"
        }
      ],
      "name": "fulfillSimple",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "sequence",
          "type": "uint64"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "guardian",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextGuardian",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "orders",
      "outputs": [
        {
          "internalType": "enum MayanSwift.Status",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "uint64",
          "name": "amountIn",
          "type": "uint64"
        },
        {
          "internalType": "uint16",
          "name": "destChainId",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "encoded",
          "type": "bytes"
        }
      ],
      "name": "parseFulfillPayload",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint8",
              "name": "action",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "orderHash",
              "type": "bytes32"
            },
            {
              "internalType": "uint16",
              "name": "destChainId",
              "type": "uint16"
            },
            {
              "internalType": "bytes32",
              "name": "destAddr",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "driver",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "tokenOut",
              "type": "bytes32"
            },
            {
              "internalType": "uint64",
              "name": "promisedAmount",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "gasDrop",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "deadline",
              "type": "uint64"
            },
            {
              "internalType": "bytes32",
              "name": "referrerAddr",
              "type": "bytes32"
            },
            {
              "internalType": "uint8",
              "name": "referrerBps",
              "type": "uint8"
            },
            {
              "internalType": "uint8",
              "name": "protocolBps",
              "type": "uint8"
            },
            {
              "internalType": "uint16",
              "name": "srcChainId",
              "type": "uint16"
            },
            {
              "internalType": "bytes32",
              "name": "tokenIn",
              "type": "bytes32"
            }
          ],
          "internalType": "struct MayanSwift.FulfillMsg",
          "name": "fulfillMsg",
          "type": "tuple"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "encoded",
          "type": "bytes"
        }
      ],
      "name": "parseRefundPayload",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint8",
              "name": "action",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "orderHash",
              "type": "bytes32"
            },
            {
              "internalType": "uint16",
              "name": "srcChainId",
              "type": "uint16"
            },
            {
              "internalType": "bytes32",
              "name": "tokenIn",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "recipient",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "canceler",
              "type": "bytes32"
            },
            {
              "internalType": "uint64",
              "name": "cancelFee",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "refundFee",
              "type": "uint64"
            }
          ],
          "internalType": "struct MayanSwift.RefundMsg",
          "name": "refundMsg",
          "type": "tuple"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "encoded",
          "type": "bytes"
        }
      ],
      "name": "parseUnlockPayload",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint8",
              "name": "action",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "orderHash",
              "type": "bytes32"
            },
            {
              "internalType": "uint16",
              "name": "srcChainId",
              "type": "uint16"
            },
            {
              "internalType": "bytes32",
              "name": "tokenIn",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "recipient",
              "type": "bytes32"
            }
          ],
          "internalType": "struct MayanSwift.UnlockMsg",
          "name": "unlockMsg",
          "type": "tuple"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32[]",
          "name": "orderHashes",
          "type": "bytes32[]"
        }
      ],
      "name": "postBatch",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "sequence",
          "type": "uint64"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "encodedVm",
          "type": "bytes"
        }
      ],
      "name": "refundOrder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_consistencyLevel",
          "type": "uint8"
        }
      ],
      "name": "setConsistencyLevel",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_feeManager",
          "type": "address"
        }
      ],
      "name": "setFeeManager",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "_pause",
          "type": "bool"
        }
      ],
      "name": "setPause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "solanaEmitter",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "encodedVm",
          "type": "bytes"
        }
      ],
      "name": "unlockBatch",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "unlockMsgs",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "action",
          "type": "uint8"
        },
        {
          "internalType": "bytes32",
          "name": "orderHash",
          "type": "bytes32"
        },
        {
          "internalType": "uint16",
          "name": "srcChainId",
          "type": "uint16"
        },
        {
          "internalType": "bytes32",
          "name": "tokenIn",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "recipient",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "encodedVm",
          "type": "bytes"
        }
      ],
      "name": "unlockSingle",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "wormhole",
      "outputs": [
        {
          "internalType": "contract IWormhole",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ],
  "linkReferences": {},
  "deployedLinkReferences": {}
};

// src/solana/utils.ts
import {
  Connection,
  Keypair,
  PublicKey as PublicKey3,
  SystemProgram as SystemProgram3,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
  AddressLookupTableAccount,
  ComputeBudgetProgram
} from "@solana/web3.js";
import { blob, struct, u8 } from "@solana/buffer-layout";
import { encodeBase58, sha256, toUtf8Bytes } from "ethers";
var cachedConnections = {};
function getConnection(rpcUrl) {
  cachedConnections[rpcUrl] ??= new Connection(rpcUrl);
  return new Connection(rpcUrl);
}
async function submitTransactionWithRetry({
  trx,
  connection,
  errorChance,
  extraRpcs,
  options,
  rate = 8
}) {
  let signature = null;
  let errorNumber = 0;
  const connections = [connection].concat(extraRpcs.map(getConnection));
  for (let i = 0; i < rate; i++) {
    if (signature) {
      try {
        const status = await Promise.any(
          connections.map((c) => c.getSignatureStatus(signature))
        );
        if (status && status.value) {
          if (status.value.err) {
            if (errorNumber >= errorChance) {
              return {
                signature,
                serializedTrx: trx
              };
            }
            errorNumber++;
          } else if (status.value.confirmationStatus === "confirmed") {
            return {
              signature,
              serializedTrx: trx
            };
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    const sendRequests = connections.map(
      (c) => c.sendRawTransaction(trx, options)
    );
    if (!signature) {
      try {
        signature = await Promise.any(sendRequests);
      } catch (err) {
        console.error(
          "Transaction not submitted, remaining attempts:",
          rate - i - 1,
          err
        );
      }
    }
    await wait(1e3);
  }
  if (!signature) {
    throw new Error("Failed to send transaction");
  }
  return {
    signature,
    serializedTrx: trx
  };
}
function createAssociatedTokenAccountInstruction(payer, associatedToken, owner, mint, programId = new PublicKey3(addresses_default.TOKEN_PROGRAM_ID), associatedTokenProgramId = new PublicKey3(
  addresses_default.ASSOCIATED_TOKEN_PROGRAM_ID
)) {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedToken, isSigner: false, isWritable: true },
    { pubkey: owner, isSigner: false, isWritable: false },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: SystemProgram3.programId, isSigner: false, isWritable: false },
    { pubkey: programId, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }
  ];
  return new TransactionInstruction({
    keys,
    programId: associatedTokenProgramId,
    data: Buffer.alloc(0)
  });
}
var TOKEN_ACCOUNT_LEN = 165;
async function createInitializeRandomTokenAccountInstructions(connection, payer, mint, owner, keyPair, programId = new PublicKey3(addresses_default.TOKEN_PROGRAM_ID)) {
  const instructions = [];
  const rentLamports = await connection.getMinimumBalanceForRentExemption(
    TOKEN_ACCOUNT_LEN
  );
  instructions.push(
    SystemProgram3.createAccount({
      fromPubkey: payer,
      newAccountPubkey: keyPair.publicKey,
      lamports: rentLamports,
      space: TOKEN_ACCOUNT_LEN,
      programId
    })
  );
  instructions.push(
    new TransactionInstruction({
      keys: [
        { pubkey: keyPair.publicKey, isWritable: true, isSigner: false },
        { pubkey: mint, isWritable: false, isSigner: false },
        { pubkey: owner, isWritable: false, isSigner: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isWritable: false, isSigner: false }
      ],
      programId,
      data: Buffer.from([1])
    })
  );
  return instructions;
}
var ApproveInstructionData = struct([
  u8("instruction"),
  blob(8, "amount")
]);
function createApproveInstruction(account, delegate, owner, amount, programId = new PublicKey3(addresses_default.TOKEN_PROGRAM_ID)) {
  const keys = [
    { pubkey: account, isSigner: false, isWritable: true },
    { pubkey: delegate, isSigner: false, isWritable: false },
    { pubkey: owner, isSigner: true, isWritable: false }
  ];
  const data = Buffer.alloc(ApproveInstructionData.span);
  ApproveInstructionData.encode(
    {
      instruction: 4,
      amount: getSafeU64Blob(amount)
    },
    data
  );
  return new TransactionInstruction({ keys, programId, data });
}
var SyncNativeInstructionData = struct([u8("instruction")]);
function createSyncNativeInstruction(account) {
  const keys = [{ pubkey: account, isSigner: false, isWritable: true }];
  const data = Buffer.alloc(SyncNativeInstructionData.span);
  SyncNativeInstructionData.encode({ instruction: 17 }, data);
  return new TransactionInstruction({
    keys,
    programId: new PublicKey3(addresses_default.TOKEN_PROGRAM_ID),
    data
  });
}
var CloseAccountInstructionData = struct([u8("instruction")]);
function createCloseAccountInstruction(account, destination, owner, programId = new PublicKey3(addresses_default.TOKEN_PROGRAM_ID)) {
  const keys = [
    { pubkey: account, isSigner: false, isWritable: true },
    { pubkey: destination, isSigner: false, isWritable: true },
    { pubkey: owner, isSigner: true, isWritable: false }
  ];
  const data = Buffer.alloc(CloseAccountInstructionData.span);
  CloseAccountInstructionData.encode(
    {
      instruction: 9
    },
    data
  );
  return new TransactionInstruction({ keys, programId, data });
}
var SplTransferInstructionData = struct([
  u8("instruction"),
  blob(8, "amount")
]);
function createSplTransferInstruction(source, destination, owner, amount, programId = new PublicKey3(addresses_default.TOKEN_PROGRAM_ID)) {
  const keys = [
    { pubkey: source, isSigner: false, isWritable: true },
    { pubkey: destination, isSigner: false, isWritable: true },
    { pubkey: owner, isSigner: true, isWritable: false }
  ];
  const data = Buffer.alloc(SplTransferInstructionData.span);
  SplTransferInstructionData.encode(
    {
      instruction: 3,
      amount: getSafeU64Blob(amount)
    },
    data
  );
  return new TransactionInstruction({ keys, programId, data });
}
var solMint = new PublicKey3(
  "So11111111111111111111111111111111111111112"
);
async function wrapSol(owner, amount, signTransaction, connection) {
  const solanaConnection = connection ?? new Connection("https://rpc.ankr.com/solana");
  const toAccount = getAssociatedTokenAddress(solMint, owner, false);
  const { blockhash, lastValidBlockHeight } = await solanaConnection.getLatestBlockhash();
  const trx = new Transaction({
    feePayer: owner,
    blockhash,
    lastValidBlockHeight
  });
  const toAccountData = await solanaConnection.getAccountInfo(
    toAccount,
    "finalized"
  );
  if (!toAccountData || toAccountData.data.length === 0) {
    trx.add(
      createAssociatedTokenAccountInstruction(owner, toAccount, owner, solMint)
    );
  }
  trx.add(
    SystemProgram3.transfer({
      fromPubkey: owner,
      toPubkey: toAccount,
      lamports: getAmountOfFractionalAmount(amount, 9)
    })
  );
  trx.add(createSyncNativeInstruction(toAccount));
  const signedTrx = await signTransaction(trx);
  return await submitTransactionWithRetry({
    trx: signedTrx.serialize(),
    connection: solanaConnection,
    errorChance: 1,
    extraRpcs: []
  });
}
async function unwrapSol(owner, amount, signTransaction, connection) {
  const solanaConnection = connection ?? new Connection("https://rpc.ankr.com/solana");
  const fromAccount = getAssociatedTokenAddress(solMint, owner, false);
  const delegate = Keypair.generate();
  const { blockhash, lastValidBlockHeight } = await solanaConnection.getLatestBlockhash();
  const trx = new Transaction({
    feePayer: owner,
    blockhash,
    lastValidBlockHeight
  });
  const toAccount = getAssociatedTokenAddress(
    solMint,
    delegate.publicKey,
    false
  );
  trx.add(
    createAssociatedTokenAccountInstruction(
      owner,
      toAccount,
      delegate.publicKey,
      solMint
    )
  );
  trx.add(
    createSplTransferInstruction(
      fromAccount,
      toAccount,
      owner,
      getAmountOfFractionalAmount(amount, 9)
    )
  );
  trx.add(createCloseAccountInstruction(toAccount, owner, delegate.publicKey));
  trx.partialSign(delegate);
  const signedTrx = await signTransaction(trx);
  return await submitTransactionWithRetry({
    trx: signedTrx.serialize(),
    connection: solanaConnection,
    errorChance: 1,
    extraRpcs: []
  });
}
function deserializeInstructionInfo(instruction) {
  return new TransactionInstruction({
    programId: new PublicKey3(instruction.programId),
    keys: instruction.accounts.map((key) => ({
      pubkey: new PublicKey3(key.pubkey),
      isSigner: key.isSigner,
      isWritable: key.isWritable
    })),
    data: Buffer.from(instruction.data, "base64")
  });
}
async function getAddressLookupTableAccounts(keys, connection) {
  const addressLookupTableAccountInfos = await connection.getMultipleAccountsInfo(
    keys.map((key) => new PublicKey3(key))
  );
  return addressLookupTableAccountInfos.reduce((acc, accountInfo, index) => {
    const addressLookupTableAddress = keys[index];
    if (accountInfo) {
      const addressLookupTableAccount = new AddressLookupTableAccount({
        key: new PublicKey3(addressLookupTableAddress),
        state: AddressLookupTableAccount.deserialize(accountInfo.data)
      });
      acc.push(addressLookupTableAccount);
    }
    return acc;
  }, new Array());
}
function decentralizeClientSwapInstructions(params, connection) {
  const swapInstruction = deserializeInstructionInfo(params.swapInstruction);
  const cleanupInstruction = params.cleanupInstruction ? deserializeInstructionInfo(params.cleanupInstruction) : null;
  const computeBudgetInstructions = params.computeBudgetInstructions ? params.computeBudgetInstructions.map(deserializeInstructionInfo) : [];
  const setupInstructions = params.setupInstructions ? params.setupInstructions.map(deserializeInstructionInfo) : [];
  return {
    swapInstruction,
    cleanupInstruction,
    computeBudgetInstructions,
    setupInstructions,
    addressLookupTableAddresses: params.addressLookupTableAddresses
  };
}
function getAnchorInstructionData(name) {
  let preimage = `global:${name}`;
  return Buffer.from(sha256(toUtf8Bytes(preimage))).subarray(0, 8);
}
async function decideRelayer() {
  let relayer;
  try {
    const suggestedRelayer = await getSuggestedRelayer();
    relayer = new PublicKey3(suggestedRelayer);
  } catch (err) {
    console.log("Relayer not found, using system program");
    relayer = SystemProgram3.programId;
  }
  return relayer;
}
function getJitoTipTransfer(swapper, blockhash, lastValidBlockHeight, options) {
  const jitoAccount = options.jitoAccount || "Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY";
  return new Transaction({
    feePayer: new PublicKey3(swapper),
    blockhash,
    lastValidBlockHeight
  }).add(
    SystemProgram3.transfer({
      fromPubkey: new PublicKey3(swapper),
      toPubkey: new PublicKey3(jitoAccount),
      lamports: options.tipLamports
    })
  );
}
async function sendJitoBundle(singedTrxs, options, forceToBeSubmitted = false) {
  try {
    let signedTrxs = [];
    for (let trx of singedTrxs) {
      signedTrxs.push(trx.serialize());
    }
    const bundle = {
      jsonrpc: "2.0",
      id: 1,
      method: "sendBundle",
      params: [signedTrxs.map((trx) => encodeBase58(trx))]
    };
    const res = await fetch(
      options.jitoSendUrl || "https://mainnet.block-engine.jito.wtf/api/v1/bundles",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bundle)
      }
    );
    if (res.status !== 200 && res.status !== 201) {
      throw new Error("Send Jito bundle failed");
    } else {
      const result = await res.json();
      return result.result;
    }
  } catch (err) {
    console.error("Send Jito bundle failed", err);
    if (forceToBeSubmitted) {
      throw err;
    }
  }
}
async function getJitoBundleStatuses(bundleIds, jitoApiUrl) {
  const maxRetries = 5;
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const response = await fetch(jitoApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBundleStatuses",
          params: [bundleIds]
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(
          `Error getting bundle statuses: ${JSON.stringify(
            data.error,
            null,
            2
          )}`
        );
      }
      return data.result;
    } catch (error) {
      attempt++;
      await wait(400);
      if (attempt >= maxRetries) {
        throw new Error(
          `Failed to fetch bundle statuses after ${maxRetries} attempts: ${error.message}`
        );
      }
    }
  }
}
async function confirmJitoBundleId(bundleId, options, lastValidBlockHeight, mayanTxSignature, connection) {
  const timeout = 30 * 3e3;
  const startTime = Date.now();
  while (Date.now() - startTime < timeout && await connection.getBlockHeight() <= lastValidBlockHeight) {
    await wait(350);
    const bundleStatuses = await getJitoBundleStatuses(
      [bundleId],
      options.jitoSendUrl || "https://mainnet.block-engine.jito.wtf/api/v1/bundles"
    );
    if (bundleStatuses && bundleStatuses.value && bundleStatuses.value.length > 0 && bundleStatuses.value[0]) {
      console.log("===>", bundleStatuses.value[0]);
      const status = bundleStatuses.value[0].confirmation_status;
      if (status === "confirmed" || status === "finalized") {
        const tx = await connection.getSignatureStatus(mayanTxSignature);
        if (!tx || !tx.value) {
          continue;
        }
        if (tx.value?.err) {
          throw new Error(`Bundle failed with error: ${tx.value.err}`);
        }
        return;
      }
    }
  }
  throw new Error("Bundle not confirmed, timeout");
}
async function broadcastJitoBundleId(bundleId) {
  try {
    await fetch("https://explorer-api.mayan.finance/v3/submit/jito-bundle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ bundleId })
    });
  } catch {
  }
}
function validateJupCleanupInstruction(instruction) {
  if (!instruction) {
    return;
  }
  if (!instruction.programId.equals(new PublicKey3(addresses_default.TOKEN_PROGRAM_ID)) && !instruction.programId.equals(
    new PublicKey3(addresses_default.TOKEN_2022_PROGRAM_ID)
  )) {
    throw new Error("Invalid cleanup instruction:: programId");
  }
  if (Uint8Array.from(instruction.data).length !== 1) {
    throw new Error("Invalid cleanup instruction:: data");
  }
  if (Uint8Array.from(instruction.data)[0] !== 9) {
    throw new Error("Invalid cleanup instruction:: data");
  }
}
function validateJupSetupInstructions(instructions, owner) {
  if (instructions.length < 1) {
    return;
  }
  if (instructions.length > 6) {
    throw new Error("Invalid setup instruction:: too many instructions");
  }
  instructions.forEach((instruction) => {
    if (!instruction.programId.equals(
      new PublicKey3(addresses_default.ASSOCIATED_TOKEN_PROGRAM_ID)
    ) && !instruction.programId.equals(SystemProgram3.programId) && !instruction.programId.equals(
      new PublicKey3(addresses_default.TOKEN_PROGRAM_ID)
    ) && !instruction.programId.equals(
      new PublicKey3(addresses_default.TOKEN_2022_PROGRAM_ID)
    )) {
      throw new Error("Invalid setup instruction:: programId");
    }
    if (instruction.programId.equals(
      new PublicKey3(addresses_default.ASSOCIATED_TOKEN_PROGRAM_ID)
    )) {
      if (Uint8Array.from(instruction.data).length === 1) {
        if (Uint8Array.from(instruction.data)[0] !== 1) {
          throw new Error("Invalid setup instruction:: data");
        }
      } else if (Uint8Array.from(instruction.data).length !== 0) {
        throw new Error("Invalid setup instruction:: data");
      }
    } else if (instruction.programId.equals(SystemProgram3.programId)) {
      if (!owner) {
        throw new Error("Invalid setup instruction:: unknown transfer");
      }
      const wSolAccount = getAssociatedTokenAddress(solMint, owner, true);
      if (instruction.data.readUint32LE() !== 2) {
        throw new Error(
          "Invalid setup instruction:: invalid system program instruction"
        );
      }
      if (!instruction.keys[1].pubkey.equals(wSolAccount)) {
        throw new Error(
          "Invalid setup instruction:: invalid wrap transfer dest"
        );
      }
    } else {
      if (instruction.data.toString("base64") !== "EQ==") {
        throw new Error(
          "Invalid setup instruction:: invalid token program instruction"
        );
      }
    }
  });
}
function validateJupSwapInstruction(instruction, validDestAccount) {
  if (!instruction.programId.equals(
    new PublicKey3("JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4")
  )) {
    throw new Error("Invalid swap instruction:: programId");
  }
  if (instruction.data.subarray(0, 8).toString("hex") === getAnchorInstructionData("shared_accounts_route").toString("hex")) {
    if (!instruction.keys[6].pubkey.equals(validDestAccount)) {
      throw new Error(
        `Invalid swap instruction shared_accounts_route:: dest account`
      );
    }
  } else if (instruction.data.subarray(0, 8).toString("hex") === getAnchorInstructionData("route").toString("hex")) {
    if (!instruction.keys[4].pubkey.equals(validDestAccount)) {
      throw new Error("Invalid swap instruction route:: dest account");
    }
  } else {
    throw new Error("Invalid swap instruction:: ix id");
  }
}
function validateJupComputeBudgetInstructions(instructions) {
  instructions.forEach((instruction) => {
    if (!instruction.programId.equals(ComputeBudgetProgram.programId)) {
      throw new Error("Invalid compute budget instruction:: programId");
    }
    if (Uint8Array.from(instruction.data)[0] === 3 && instruction.data.readBigUInt64LE(1) > 100000000n) {
      throw new Error("Invalid compute budget instruction:: to high tx fee");
    }
  });
}
function validateJupSwap(swap, validDestAccount, validWrapOwner) {
  validateJupComputeBudgetInstructions(swap.computeBudgetInstructions);
  validateJupSetupInstructions(swap.setupInstructions, validWrapOwner);
  validateJupSwapInstruction(swap.swapInstruction, validDestAccount);
  validateJupCleanupInstruction(swap.cleanupInstruction);
}
function createTransferAllAndCloseInstruction(owner, mint, tokenAccount, transferDestination, closeDestination, tokenProgramId = new PublicKey3("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")) {
  return new TransactionInstruction({
    keys: [
      { pubkey: owner, isSigner: true, isWritable: false },
      { pubkey: tokenAccount, isSigner: false, isWritable: true },
      { pubkey: transferDestination, isSigner: false, isWritable: true },
      { pubkey: mint, isSigner: false, isWritable: false },
      { pubkey: closeDestination, isSigner: false, isWritable: true },
      { pubkey: tokenProgramId, isSigner: false, isWritable: false }
    ],
    programId: new PublicKey3("B96dV3Luxzo6SokJx3xt8i5y8Mb7HRR6Eec8hCjJDT69"),
    data: getAnchorInstructionData("transfer_all_and_close")
  });
}

// src/solana/solanaSwap.ts
import {
  Connection as Connection4,
  PublicKey as PublicKey7,
  Keypair as Keypair4,
  SystemProgram as SystemProgram6,
  SYSVAR_CLOCK_PUBKEY as SYSVAR_CLOCK_PUBKEY2,
  SYSVAR_RENT_PUBKEY as SYSVAR_RENT_PUBKEY3,
  Transaction as Transaction2,
  TransactionInstruction as TransactionInstruction4,
  ComputeBudgetProgram as ComputeBudgetProgram4,
  MessageV0,
  VersionedTransaction as VersionedTransaction2
} from "@solana/web3.js";
import { blob as blob4, struct as struct4, u16 as u163, u8 as u84 } from "@solana/buffer-layout";
import { encodeBase58 as encodeBase582, ZeroAddress as ZeroAddress3 } from "ethers";

// src/solana/solanaMctp.ts
import {
  PublicKey as PublicKey5,
  Keypair as Keypair2,
  SystemProgram as SystemProgram4,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY as SYSVAR_RENT_PUBKEY2,
  TransactionInstruction as TransactionInstruction2,
  ComputeBudgetProgram as ComputeBudgetProgram2
} from "@solana/web3.js";
import { blob as blob2, struct as struct2, u16, u8 as u82 } from "@solana/buffer-layout";

// src/wormhole.ts
import { PublicKey as PublicKey4 } from "@solana/web3.js";
function getWormholePDAs(supplierProgram) {
  const wormholeProgramId = new PublicKey4(addresses_default.WORMHOLE_PROGRAM_ID);
  const programId = new PublicKey4(supplierProgram);
  const [bridgeConfig] = PublicKey4.findProgramAddressSync(
    [Buffer.from("Bridge")],
    wormholeProgramId
  );
  const [emitter] = PublicKey4.findProgramAddressSync(
    [Buffer.from("emitter")],
    programId
  );
  const [sequenceKey] = PublicKey4.findProgramAddressSync(
    [Buffer.from("Sequence"), emitter.toBuffer()],
    wormholeProgramId
  );
  const [feeCollector] = PublicKey4.findProgramAddressSync(
    [Buffer.from("fee_collector")],
    wormholeProgramId
  );
  return {
    bridgeConfig,
    sequenceKey,
    feeCollector,
    emitter
  };
}

// src/solana/solanaMctp.ts
var MCTPBridgeWithFeeLayout = struct2([blob2(8, "instruction")]);
function createMctpBridgeWithFeeInstruction(ledger, toChain, mintAddress, relayerAddress, feeSolana) {
  const wormholeProgramId = new PublicKey5(addresses_default.WORMHOLE_PROGRAM_ID);
  const TOKEN_PROGRAM_ID = new PublicKey5(addresses_default.TOKEN_PROGRAM_ID);
  const cctpCoreProgramId = new PublicKey5(addresses_default.CCTP_CORE_PROGRAM_ID);
  const cctpTokenProgramId = new PublicKey5(addresses_default.CCTP_TOKEN_PROGRAM_ID);
  const mctpProgram = new PublicKey5(addresses_default.MCTP_PROGRAM_ID);
  const relayer = new PublicKey5(relayerAddress);
  const mint = new PublicKey5(mintAddress);
  const ledgerAccount = getAssociatedTokenAddress(mint, ledger, true);
  let relayerAccount;
  if (feeSolana && feeSolana > BigInt(0)) {
    relayerAccount = getAssociatedTokenAddress(mint, relayer, false);
  } else {
    relayerAccount = new PublicKey5(addresses_default.MCTP_PROGRAM_ID);
  }
  const cctpBridgePdas = getCCTPBridgePDAs(mint, toChain);
  const wormholePDAs = getWormholePDAs(addresses_default.MCTP_PROGRAM_ID);
  const cctpMessage = Keypair2.generate();
  const wormholeMessage = Keypair2.generate();
  const accounts = [
    { pubkey: ledger, isWritable: true, isSigner: false },
    { pubkey: ledgerAccount, isWritable: true, isSigner: false },
    { pubkey: relayer, isWritable: true, isSigner: true },
    { pubkey: relayerAccount, isWritable: true, isSigner: false },
    { pubkey: mint, isWritable: true, isSigner: false },
    {
      pubkey: cctpBridgePdas.senderAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: cctpBridgePdas.tokenMessenger,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: cctpBridgePdas.remoteTokenMessengerKey,
      isWritable: false,
      isSigner: false
    },
    { pubkey: cctpBridgePdas.tokenMinter, isWritable: false, isSigner: false },
    { pubkey: cctpBridgePdas.localToken, isWritable: true, isSigner: false },
    {
      pubkey: cctpBridgePdas.eventAuthToken,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: cctpBridgePdas.messageTransmitter,
      isWritable: true,
      isSigner: false
    },
    { pubkey: cctpMessage.publicKey, isWritable: true, isSigner: true },
    { pubkey: cctpTokenProgramId, isWritable: false, isSigner: false },
    { pubkey: cctpCoreProgramId, isWritable: false, isSigner: false },
    { pubkey: wormholePDAs.emitter, isWritable: false, isSigner: false },
    { pubkey: wormholePDAs.bridgeConfig, isWritable: true, isSigner: false },
    { pubkey: wormholePDAs.sequenceKey, isWritable: true, isSigner: false },
    { pubkey: wormholePDAs.feeCollector, isWritable: true, isSigner: false },
    { pubkey: wormholeMessage.publicKey, isWritable: true, isSigner: true },
    { pubkey: wormholeProgramId, isWritable: false, isSigner: false },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isWritable: false, isSigner: false },
    { pubkey: SYSVAR_RENT_PUBKEY2, isWritable: false, isSigner: false },
    { pubkey: TOKEN_PROGRAM_ID, isWritable: false, isSigner: false },
    { pubkey: SystemProgram4.programId, isWritable: false, isSigner: false }
  ];
  const data = Buffer.alloc(MCTPBridgeWithFeeLayout.span);
  MCTPBridgeWithFeeLayout.encode(
    {
      instruction: getAnchorInstructionData("bridge_with_fee")
    },
    data
  );
  const bridgeIns = new TransactionInstruction2({
    keys: accounts,
    data,
    programId: mctpProgram
  });
  return { instruction: bridgeIns, signers: [cctpMessage, wormholeMessage] };
}
var MctpBridgeLockFeeLayout = struct2([blob2(8, "instruction")]);
function createMctpBridgeLockFeeInstruction(ledger, toChain, mintAddress, relayerAddress, feeSolana) {
  const instructions = [];
  const TOKEN_PROGRAM_ID = new PublicKey5(addresses_default.TOKEN_PROGRAM_ID);
  const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey5(
    addresses_default.ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const cctpCoreProgramId = new PublicKey5(addresses_default.CCTP_CORE_PROGRAM_ID);
  const cctpTokenProgramId = new PublicKey5(addresses_default.CCTP_TOKEN_PROGRAM_ID);
  const mctpProgram = new PublicKey5(addresses_default.MCTP_PROGRAM_ID);
  const relayer = new PublicKey5(relayerAddress);
  const mint = new PublicKey5(mintAddress);
  const ledgerAccount = getAssociatedTokenAddress(mint, ledger, true);
  const cctpBridgePdas = getCCTPBridgePDAs(mint, toChain);
  const cctpMessage = Keypair2.generate();
  const [feeState] = PublicKey5.findProgramAddressSync(
    [
      Buffer.from("LOCKED_FEE"),
      mint.toBuffer(),
      cctpMessage.publicKey.toBytes()
    ],
    mctpProgram
  );
  let relayerAccount;
  if (feeSolana && feeSolana > BigInt(0)) {
    relayerAccount = getAssociatedTokenAddress(mint, relayer, false);
  } else {
    relayerAccount = new PublicKey5(addresses_default.MCTP_PROGRAM_ID);
  }
  const feeStateAccount = getAssociatedTokenAddress(mint, feeState, true);
  instructions.push(
    createAssociatedTokenAccountInstruction(
      relayer,
      feeStateAccount,
      feeState,
      mint
    )
  );
  const accounts = [
    { pubkey: ledger, isWritable: true, isSigner: false },
    { pubkey: ledgerAccount, isWritable: true, isSigner: false },
    { pubkey: relayer, isWritable: true, isSigner: true },
    { pubkey: relayerAccount, isWritable: true, isSigner: false },
    { pubkey: feeState, isWritable: true, isSigner: false },
    { pubkey: feeStateAccount, isWritable: true, isSigner: false },
    { pubkey: mint, isWritable: true, isSigner: false },
    {
      pubkey: cctpBridgePdas.senderAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: cctpBridgePdas.tokenMessenger,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: cctpBridgePdas.remoteTokenMessengerKey,
      isWritable: false,
      isSigner: false
    },
    { pubkey: cctpBridgePdas.tokenMinter, isWritable: false, isSigner: false },
    { pubkey: cctpBridgePdas.localToken, isWritable: true, isSigner: false },
    {
      pubkey: cctpBridgePdas.eventAuthToken,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: cctpBridgePdas.messageTransmitter,
      isWritable: true,
      isSigner: false
    },
    { pubkey: cctpMessage.publicKey, isWritable: true, isSigner: true },
    { pubkey: cctpTokenProgramId, isWritable: false, isSigner: false },
    { pubkey: cctpCoreProgramId, isWritable: false, isSigner: false },
    { pubkey: TOKEN_PROGRAM_ID, isWritable: false, isSigner: false },
    { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isWritable: false, isSigner: false },
    { pubkey: SystemProgram4.programId, isWritable: false, isSigner: false }
  ];
  const data = Buffer.alloc(MctpBridgeLockFeeLayout.span);
  MctpBridgeLockFeeLayout.encode(
    {
      instruction: getAnchorInstructionData("bridge_locked_fee")
    },
    data
  );
  const bridgeIns = new TransactionInstruction2({
    keys: accounts,
    data,
    programId: mctpProgram
  });
  instructions.push(bridgeIns);
  return { instructions, signer: cctpMessage };
}
var MctpInitSwapLayout = struct2([blob2(8, "instruction")]);
function createMctpInitSwapInstruction(ledger, toChain, mintAddress, relayerAddress, feeSolana) {
  const TOKEN_PROGRAM_ID = new PublicKey5(addresses_default.TOKEN_PROGRAM_ID);
  const cctpCoreProgramId = new PublicKey5(addresses_default.CCTP_CORE_PROGRAM_ID);
  const cctpTokenProgramId = new PublicKey5(addresses_default.CCTP_TOKEN_PROGRAM_ID);
  const mctpProgram = new PublicKey5(addresses_default.MCTP_PROGRAM_ID);
  const relayer = new PublicKey5(relayerAddress);
  const mint = new PublicKey5(mintAddress);
  const ledgerAccount = getAssociatedTokenAddress(mint, ledger, true);
  const cctpBridgePdas = getCCTPBridgePDAs(mint, toChain);
  const cctpMessage = Keypair2.generate();
  const [swapState] = PublicKey5.findProgramAddressSync(
    [Buffer.from("ORDER_SOLANA_SOURCE"), ledger.toBuffer()],
    mctpProgram
  );
  let relayerAccount;
  if (feeSolana && feeSolana > BigInt(0)) {
    relayerAccount = getAssociatedTokenAddress(mint, relayer, false);
  } else {
    relayerAccount = new PublicKey5(addresses_default.MCTP_PROGRAM_ID);
  }
  const accounts = [
    { pubkey: ledger, isWritable: false, isSigner: false },
    { pubkey: ledgerAccount, isWritable: true, isSigner: false },
    { pubkey: relayer, isWritable: true, isSigner: true },
    { pubkey: relayerAccount, isWritable: true, isSigner: false },
    { pubkey: mint, isWritable: true, isSigner: false },
    { pubkey: swapState, isWritable: true, isSigner: false },
    {
      pubkey: cctpBridgePdas.senderAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: cctpBridgePdas.tokenMessenger,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: cctpBridgePdas.remoteTokenMessengerKey,
      isWritable: false,
      isSigner: false
    },
    { pubkey: cctpBridgePdas.tokenMinter, isWritable: false, isSigner: false },
    { pubkey: cctpBridgePdas.localToken, isWritable: true, isSigner: false },
    {
      pubkey: cctpBridgePdas.eventAuthToken,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: cctpBridgePdas.messageTransmitter,
      isWritable: true,
      isSigner: false
    },
    { pubkey: cctpMessage.publicKey, isWritable: true, isSigner: true },
    { pubkey: cctpTokenProgramId, isWritable: false, isSigner: false },
    { pubkey: cctpCoreProgramId, isWritable: false, isSigner: false },
    {
      pubkey: new PublicKey5(addresses_default.FEE_MANAGER_PROGRAM_ID),
      isWritable: false,
      isSigner: false
    },
    { pubkey: TOKEN_PROGRAM_ID, isWritable: false, isSigner: false },
    { pubkey: SystemProgram4.programId, isWritable: false, isSigner: false }
  ];
  const data = Buffer.alloc(MctpInitSwapLayout.span);
  MctpInitSwapLayout.encode(
    {
      instruction: getAnchorInstructionData("create_order")
    },
    data
  );
  const initSwapIns = new TransactionInstruction2({
    keys: accounts,
    data,
    programId: mctpProgram
  });
  return { instruction: initSwapIns, signer: cctpMessage };
}
var MctpBridgeLedgerLayout = struct2([
  blob2(8, "instruction"),
  blob2(32, "destAddress"),
  blob2(8, "amountInMin"),
  blob2(8, "gasDrop"),
  blob2(8, "feeRedeem"),
  blob2(8, "feeSolana"),
  u16("destinationChain"),
  blob2(32, "keyRnd"),
  u82("mode")
]);
function createMctpBridgeLedgerInstruction(params) {
  if (params.mode !== "WITH_FEE" && params.mode !== "LOCK_FEE") {
    throw new Error("Invalid mode: " + params.mode);
  }
  const user = new PublicKey5(params.swapperAddress);
  const mint = new PublicKey5(params.mintAddress);
  const ledgerAccount = getAssociatedTokenAddress(mint, params.ledger, true);
  const destinationChainId = getWormholeChainIdByName(params.toChain);
  const destAddress = Buffer.from(
    hexToUint8Array(
      nativeAddressToHexString(params.destinationAddress, destinationChainId)
    )
  );
  const amountInMin = getSafeU64Blob(params.amountInMin64);
  const gasDrop = getSafeU64Blob(
    getAmountOfFractionalAmount(
      params.gasDrop,
      Math.min(getGasDecimal(params.toChain), 8)
    )
  );
  const feeRedeem = getSafeU64Blob(
    getAmountOfFractionalAmount(params.feeRedeem, CCTP_TOKEN_DECIMALS)
  );
  const feeSolana = getSafeU64Blob(params.feeSolana);
  const refAddress = params.referrerAddress ? Buffer.from(
    hexToUint8Array(
      nativeAddressToHexString(params.referrerAddress, destinationChainId)
    )
  ) : SystemProgram4.programId.toBuffer();
  const accounts = [
    { pubkey: user, isWritable: true, isSigner: true },
    { pubkey: params.ledger, isWritable: true, isSigner: false },
    { pubkey: ledgerAccount, isWritable: false, isSigner: false },
    {
      pubkey: params.customPayload || new PublicKey5(addresses_default.MCTP_PROGRAM_ID),
      isWritable: false,
      isSigner: false
    },
    { pubkey: mint, isWritable: false, isSigner: false },
    { pubkey: SystemProgram4.programId, isWritable: false, isSigner: false },
    { pubkey: new PublicKey5(refAddress), isWritable: false, isSigner: false }
  ];
  const data = Buffer.alloc(MctpBridgeLedgerLayout.span);
  MctpBridgeLedgerLayout.encode(
    {
      instruction: getAnchorInstructionData("init_bridge_ledger"),
      destAddress,
      amountInMin,
      gasDrop,
      feeRedeem,
      feeSolana,
      destinationChain: destinationChainId,
      keyRnd: params.randomKey.toBuffer(),
      mode: params.mode === "WITH_FEE" ? 1 : 2
    },
    data
  );
  return new TransactionInstruction2({
    keys: accounts,
    data,
    programId: new PublicKey5(addresses_default.MCTP_PROGRAM_ID)
  });
}
var MctpSwapLedgerLayout = struct2([
  blob2(8, "instruction"),
  blob2(32, "destAddress"),
  blob2(8, "amountInMin"),
  blob2(8, "gasDrop"),
  blob2(8, "feeRedeem"),
  blob2(8, "feeSolana"),
  u16("destinationChain"),
  blob2(32, "keyRnd"),
  u82("mode"),
  blob2(32, "tokenOut"),
  blob2(8, "amountOutMin"),
  blob2(8, "deadline"),
  blob2(32, "refAddress"),
  u82("feeRateRef")
]);
function createMctpSwapLedgerInstruction(params) {
  const user = new PublicKey5(params.swapperAddress);
  const mint = new PublicKey5(params.mintAddress);
  const ledgerAccount = getAssociatedTokenAddress(mint, params.ledger, true);
  const destinationChainId = getWormholeChainIdByName(params.toChain);
  const destAddress = Buffer.from(
    hexToUint8Array(
      nativeAddressToHexString(params.destinationAddress, destinationChainId)
    )
  );
  const amountInMin = getSafeU64Blob(params.amountInMin64);
  const gasDrop = getSafeU64Blob(
    getAmountOfFractionalAmount(
      params.gasDrop,
      Math.min(getGasDecimal(params.toChain), 8)
    )
  );
  const feeRedeem = getSafeU64Blob(
    getAmountOfFractionalAmount(params.feeRedeem, CCTP_TOKEN_DECIMALS)
  );
  const feeSolana = getSafeU64Blob(params.feeSolana);
  const tokenOut = Buffer.from(
    hexToUint8Array(
      nativeAddressToHexString(params.tokenOut, destinationChainId)
    )
  );
  const refAddress = params.referrerAddress ? Buffer.from(
    hexToUint8Array(
      nativeAddressToHexString(params.referrerAddress, destinationChainId)
    )
  ) : SystemProgram4.programId.toBuffer();
  const amountOutMin = getSafeU64Blob(
    getAmountOfFractionalAmount(
      params.amountOutMin,
      Math.min(8, params.tokenOutDecimals)
    )
  );
  const deadline = getSafeU64Blob(params.deadline);
  const accounts = [
    { pubkey: user, isWritable: true, isSigner: true },
    { pubkey: params.ledger, isWritable: true, isSigner: false },
    { pubkey: ledgerAccount, isWritable: false, isSigner: false },
    { pubkey: mint, isWritable: false, isSigner: false },
    { pubkey: SystemProgram4.programId, isWritable: false, isSigner: false }
  ];
  const data = Buffer.alloc(MctpSwapLedgerLayout.span);
  MctpSwapLedgerLayout.encode(
    {
      instruction: getAnchorInstructionData("init_order_ledger"),
      destAddress,
      amountInMin,
      gasDrop,
      feeRedeem,
      feeSolana,
      destinationChain: destinationChainId,
      keyRnd: params.randomKey.toBuffer(),
      mode: 3,
      tokenOut,
      refAddress,
      amountOutMin,
      deadline,
      feeRateRef: params.feeRateRef
    },
    data
  );
  return new TransactionInstruction2({
    keys: accounts,
    data,
    programId: new PublicKey5(addresses_default.MCTP_PROGRAM_ID)
  });
}
async function createMctpFromSolanaInstructions(quote, swapperAddress, destinationAddress, referrerAddress, connection, options = {}) {
  const forceSkipCctpInstructions = options?.forceSkipCctpInstructions || false;
  const allowSwapperOffCurve = options?.allowSwapperOffCurve || false;
  if (quote.toChain === "solana") {
    throw new Error("Unsupported destination chain: " + quote.toChain);
  }
  let _lookupTablesAddress = [];
  let instructions = [];
  let signers = [];
  let lookupTables = [];
  let _swapAddressLookupTables = [];
  let swapInstructions = [];
  let createSwapTpmTokenAccountInstructions = [];
  const tmpSwapTokenAccount = Keypair2.generate();
  let swapMessageV0Params = null;
  _lookupTablesAddress.push(addresses_default.LOOKUP_TABLE);
  const mctpProgram = new PublicKey5(addresses_default.MCTP_PROGRAM_ID);
  const user = new PublicKey5(swapperAddress);
  const randomKey = Keypair2.generate();
  const deadline = quote.deadline64 ? BigInt(quote.deadline64) : BigInt(0);
  if (quote.hasAuction && !Number(quote.deadline64)) {
    throw new Error("Swap mode requires a timeout");
  }
  const ledgerSeedPrefix = quote.hasAuction ? "LEDGER_ORDER" : "LEDGER_BRIDGE";
  const [ledger] = PublicKey5.findProgramAddressSync(
    [
      Buffer.from(ledgerSeedPrefix),
      user.toBytes(),
      randomKey.publicKey.toBytes()
    ],
    mctpProgram
  );
  const ledgerAccount = getAssociatedTokenAddress(
    new PublicKey5(quote.mctpInputContract),
    ledger,
    true
  );
  const mode = quote.cheaperChain === "solana" ? "LOCK_FEE" : "WITH_FEE";
  const tokenOut = quote.toChain === "sui" ? quote.toToken.verifiedAddress : quote.toToken.contract;
  if (quote.fromToken.contract === quote.mctpInputContract) {
    const feeSolana = forceSkipCctpInstructions ? BigInt(quote.solanaRelayerFee64) : BigInt(0);
    if (quote.suggestedPriorityFee > 0) {
      instructions.push(
        ComputeBudgetProgram2.setComputeUnitPrice({
          microLamports: quote.suggestedPriorityFee
        })
      );
    }
    instructions.push(
      createAssociatedTokenAccountInstruction(
        user,
        ledgerAccount,
        ledger,
        new PublicKey5(quote.mctpInputContract)
      )
    );
    instructions.push(
      createSplTransferInstruction(
        getAssociatedTokenAddress(
          new PublicKey5(quote.mctpInputContract),
          user,
          allowSwapperOffCurve
        ),
        ledgerAccount,
        user,
        BigInt(quote.effectiveAmountIn64)
      )
    );
    if (quote.hasAuction) {
      instructions.push(
        createMctpSwapLedgerInstruction({
          ledger,
          swapperAddress,
          mintAddress: quote.mctpInputContract,
          randomKey: randomKey.publicKey,
          toChain: quote.toChain,
          destinationAddress,
          feeSolana,
          feeRedeem: quote.redeemRelayerFee,
          gasDrop: quote.gasDrop,
          amountInMin64: BigInt(quote.effectiveAmountIn64),
          tokenOut,
          tokenOutDecimals: quote.toToken.decimals,
          referrerAddress,
          amountOutMin: quote.minAmountOut,
          deadline,
          feeRateRef: quote.referrerBps
        })
      );
      if (!forceSkipCctpInstructions) {
        const { instruction: _instruction, signer: _signer } = createMctpInitSwapInstruction(
          ledger,
          quote.toChain,
          quote.mctpInputContract,
          swapperAddress,
          feeSolana
        );
        instructions.push(_instruction);
        signers.push(_signer);
      }
    } else {
      instructions.push(
        createMctpBridgeLedgerInstruction({
          ledger,
          swapperAddress,
          mintAddress: quote.mctpInputContract,
          randomKey: randomKey.publicKey,
          toChain: quote.toChain,
          destinationAddress,
          feeSolana,
          feeRedeem: quote.redeemRelayerFee,
          gasDrop: quote.gasDrop,
          amountInMin64: BigInt(quote.effectiveAmountIn64),
          mode,
          referrerAddress
        })
      );
      if (!forceSkipCctpInstructions) {
        if (mode === "WITH_FEE") {
          const { instruction: _instruction, signers: _signers } = createMctpBridgeWithFeeInstruction(
            ledger,
            quote.toChain,
            quote.mctpInputContract,
            swapperAddress,
            feeSolana
          );
          instructions.push(_instruction);
          signers.push(..._signers);
        } else {
          const { instructions: _instructions, signer: _signer } = createMctpBridgeLockFeeInstruction(
            ledger,
            quote.toChain,
            quote.mctpInputContract,
            swapperAddress,
            feeSolana
          );
          instructions.push(..._instructions);
          signers.push(_signer);
        }
      }
    }
  } else {
    const clientSwapRaw = await getSwapSolana({
      minMiddleAmount: quote.minMiddleAmount,
      middleToken: quote.mctpInputContract,
      userWallet: swapperAddress,
      userLedger: ledger.toString(),
      slippageBps: quote.slippageBps,
      fromToken: quote.fromToken.contract,
      amountIn64: quote.effectiveAmountIn64,
      depositMode: quote.hasAuction ? "SWAP" : mode,
      fillMaxAccounts: options?.separateSwapTx || false,
      tpmTokenAccount: options?.separateSwapTx ? tmpSwapTokenAccount.publicKey.toString() : null
    });
    const clientSwap = decentralizeClientSwapInstructions(
      clientSwapRaw,
      connection
    );
    if (options?.separateSwapTx && clientSwapRaw.maxAccountsFilled) {
      validateJupSwap(clientSwap, tmpSwapTokenAccount.publicKey, user);
      createSwapTpmTokenAccountInstructions = await createInitializeRandomTokenAccountInstructions(
        connection,
        user,
        new PublicKey5(quote.mctpInputContract),
        user,
        tmpSwapTokenAccount
      );
      swapInstructions.push(...clientSwap.computeBudgetInstructions);
      if (clientSwap.setupInstructions) {
        swapInstructions.push(...clientSwap.setupInstructions);
      }
      swapInstructions.push(clientSwap.swapInstruction);
      if (clientSwap.cleanupInstruction) {
        swapInstructions.push(clientSwap.cleanupInstruction);
      }
      _swapAddressLookupTables.push(...clientSwap.addressLookupTableAddresses);
      instructions.push(
        createAssociatedTokenAccountInstruction(
          user,
          ledgerAccount,
          ledger,
          new PublicKey5(quote.mctpInputContract)
        )
      );
      instructions.push(
        createTransferAllAndCloseInstruction(
          user,
          new PublicKey5(quote.mctpInputContract),
          tmpSwapTokenAccount.publicKey,
          ledgerAccount,
          user
        )
      );
    } else {
      validateJupSwap(clientSwap, ledgerAccount, user);
      instructions.push(...clientSwap.computeBudgetInstructions);
      if (clientSwap.setupInstructions) {
        instructions.push(...clientSwap.setupInstructions);
      }
      instructions.push(clientSwap.swapInstruction);
      if (clientSwap.cleanupInstruction) {
        instructions.push(clientSwap.cleanupInstruction);
      }
      _lookupTablesAddress.push(...clientSwap.addressLookupTableAddresses);
    }
    const feeSolana = swapInstructions.length > 0 ? BigInt(0) : BigInt(quote.solanaRelayerFee64);
    if (quote.hasAuction) {
      instructions.push(
        createMctpSwapLedgerInstruction({
          ledger,
          swapperAddress,
          mintAddress: quote.mctpInputContract,
          randomKey: randomKey.publicKey,
          toChain: quote.toChain,
          destinationAddress,
          feeSolana,
          feeRedeem: quote.redeemRelayerFee,
          gasDrop: quote.gasDrop,
          amountInMin64: getAmountOfFractionalAmount(
            quote.minMiddleAmount,
            CCTP_TOKEN_DECIMALS
          ),
          tokenOut,
          tokenOutDecimals: quote.toToken.decimals,
          referrerAddress,
          amountOutMin: quote.minAmountOut,
          deadline,
          feeRateRef: quote.referrerBps
        })
      );
      if (swapInstructions.length > 0) {
        const { instruction: _instruction, signer: _signer } = createMctpInitSwapInstruction(
          ledger,
          quote.toChain,
          quote.mctpInputContract,
          swapperAddress,
          feeSolana
        );
        instructions.push(_instruction);
        signers.push(_signer);
      }
    } else {
      instructions.push(
        createMctpBridgeLedgerInstruction({
          ledger,
          swapperAddress,
          mintAddress: quote.mctpInputContract,
          randomKey: randomKey.publicKey,
          toChain: quote.toChain,
          destinationAddress,
          feeSolana,
          feeRedeem: quote.redeemRelayerFee,
          gasDrop: quote.gasDrop,
          amountInMin64: getAmountOfFractionalAmount(
            quote.minMiddleAmount,
            CCTP_TOKEN_DECIMALS
          ),
          mode,
          referrerAddress
        })
      );
      if (swapInstructions.length > 0) {
        if (mode === "WITH_FEE") {
          const { instruction: _instruction, signers: _signers } = createMctpBridgeWithFeeInstruction(
            ledger,
            quote.toChain,
            quote.mctpInputContract,
            swapperAddress,
            feeSolana
          );
          instructions.push(_instruction);
          signers.push(..._signers);
        } else {
          const { instructions: _instructions, signer: _signer } = createMctpBridgeLockFeeInstruction(
            ledger,
            quote.toChain,
            quote.mctpInputContract,
            swapperAddress,
            feeSolana
          );
          instructions.push(..._instructions);
          signers.push(_signer);
        }
      }
    }
  }
  const totalLookupTables = await getAddressLookupTableAccounts(
    _lookupTablesAddress.concat(_swapAddressLookupTables),
    connection
  );
  lookupTables = totalLookupTables.slice(0, _lookupTablesAddress.length);
  if (swapInstructions.length > 0) {
    const swapLookupTables = totalLookupTables.slice(
      _lookupTablesAddress.length
    );
    swapMessageV0Params = {
      messageV0: {
        payerKey: user,
        instructions: swapInstructions,
        addressLookupTableAccounts: swapLookupTables
      },
      createTmpTokenAccountIxs: createSwapTpmTokenAccountInstructions,
      tmpTokenAccount: tmpSwapTokenAccount
    };
  }
  return { instructions, signers, lookupTables, swapMessageV0Params };
}

// src/solana/solanaSwift.ts
import {
  PublicKey as PublicKey6,
  Keypair as Keypair3,
  SystemProgram as SystemProgram5,
  TransactionInstruction as TransactionInstruction3,
  ComputeBudgetProgram as ComputeBudgetProgram3
} from "@solana/web3.js";
import { blob as blob3, struct as struct3, u16 as u162, u8 as u83 } from "@solana/buffer-layout";
import { ethers as ethers2, ZeroAddress as ZeroAddress2 } from "ethers";
function createSwiftOrderHash(quote, swapperAddress, destinationAddress, referrerAddress, randomKeyHex) {
  const orderDataSize = 239;
  const data = Buffer.alloc(orderDataSize);
  let offset = 0;
  const sourceChainId = getWormholeChainIdByName(quote.fromChain);
  const trader = Buffer.from(
    hexToUint8Array(nativeAddressToHexString(swapperAddress, sourceChainId))
  );
  data.set(trader, 0);
  offset += 32;
  data.writeUInt16BE(sourceChainId, offset);
  offset += 2;
  const _tokenIn = quote.swiftInputContract === ZeroAddress2 ? nativeAddressToHexString(
    SystemProgram5.programId.toString(),
    getWormholeChainIdByName("solana")
  ) : nativeAddressToHexString(quote.swiftInputContract, sourceChainId);
  const tokenIn = Buffer.from(hexToUint8Array(_tokenIn));
  data.set(tokenIn, offset);
  offset += 32;
  const destinationChainId = getWormholeChainIdByName(quote.toChain);
  const destAddress = Buffer.from(
    hexToUint8Array(
      nativeAddressToHexString(destinationAddress, destinationChainId)
    )
  );
  data.set(destAddress, offset);
  offset += 32;
  data.writeUInt16BE(destinationChainId, offset);
  offset += 2;
  const _tokenOut = quote.toToken.contract === ZeroAddress2 ? nativeAddressToHexString(
    SystemProgram5.programId.toString(),
    getWormholeChainIdByName("solana")
  ) : nativeAddressToHexString(quote.toToken.contract, destinationChainId);
  const tokenOut = Buffer.from(hexToUint8Array(_tokenOut));
  data.set(tokenOut, offset);
  offset += 32;
  data.writeBigUInt64BE(
    getAmountOfFractionalAmount(
      quote.minAmountOut,
      Math.min(quote.toToken.decimals, 8)
    ),
    offset
  );
  offset += 8;
  data.writeBigUInt64BE(
    getAmountOfFractionalAmount(
      quote.gasDrop,
      Math.min(getGasDecimal(quote.toChain), 8)
    ),
    offset
  );
  offset += 8;
  data.writeBigUInt64BE(BigInt(quote.cancelRelayerFee64), offset);
  offset += 8;
  data.writeBigUInt64BE(BigInt(quote.refundRelayerFee64), offset);
  offset += 8;
  data.writeBigUInt64BE(BigInt(quote.deadline64), offset);
  offset += 8;
  const refAddress = referrerAddress ? Buffer.from(
    hexToUint8Array(
      nativeAddressToHexString(referrerAddress, destinationChainId)
    )
  ) : SystemProgram5.programId.toBuffer();
  data.set(refAddress, offset);
  offset += 32;
  data.writeUInt8(quote.referrerBps, offset);
  offset += 1;
  const feeRateMayan = quote.protocolBps;
  data.writeUInt8(feeRateMayan, offset);
  offset += 1;
  data.writeUInt8(quote.swiftAuctionMode, offset);
  offset += 1;
  const _randomKey = Buffer.from(hexToUint8Array(randomKeyHex));
  data.set(_randomKey, offset);
  offset += 32;
  if (offset !== orderDataSize) {
    throw new Error(`Invalid order data size: ${offset}`);
  }
  const hash = ethers2.keccak256(data);
  return Buffer.from(hexToUint8Array(hash));
}
var InitSwiftLayout = struct3([
  blob3(8, "instruction"),
  blob3(8, "amountInMin"),
  u83("nativeInput"),
  blob3(8, "feeSubmit"),
  blob3(32, "destAddress"),
  u162("destinationChain"),
  blob3(32, "tokenOut"),
  blob3(8, "amountOutMin"),
  blob3(8, "gasDrop"),
  blob3(8, "feeCancel"),
  blob3(8, "feeRefund"),
  blob3(8, "deadline"),
  blob3(32, "refAddress"),
  u83("feeRateRef"),
  u83("feeRateMayan"),
  u83("auctionMode"),
  blob3(32, "randomKey")
]);
function createSwiftInitInstruction(params) {
  const { quote } = params;
  const mint = quote.swiftInputContract === ZeroAddress2 ? solMint : new PublicKey6(quote.swiftInputContract);
  const destinationChainId = getWormholeChainIdByName(quote.toChain);
  if (destinationChainId !== quote.toToken.wChainId) {
    throw new Error(
      `Destination chain ID mismatch: ${destinationChainId} != ${quote.toToken.wChainId}`
    );
  }
  const accounts = [
    { pubkey: params.trader, isWritable: false, isSigner: true },
    { pubkey: params.relayer, isWritable: true, isSigner: true },
    { pubkey: params.state, isWritable: true, isSigner: false },
    { pubkey: params.stateAccount, isWritable: true, isSigner: false },
    { pubkey: params.relayerAccount, isWritable: true, isSigner: false },
    { pubkey: mint, isWritable: false, isSigner: false },
    {
      pubkey: new PublicKey6(addresses_default.FEE_MANAGER_PROGRAM_ID),
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: new PublicKey6(addresses_default.TOKEN_PROGRAM_ID),
      isWritable: false,
      isSigner: false
    },
    { pubkey: SystemProgram5.programId, isWritable: false, isSigner: false }
  ];
  const data = Buffer.alloc(InitSwiftLayout.span);
  const refAddress = params.referrerAddress ? Buffer.from(
    hexToUint8Array(
      nativeAddressToHexString(params.referrerAddress, destinationChainId)
    )
  ) : SystemProgram5.programId.toBuffer();
  const minMiddleAmount = quote.fromToken.contract === quote.swiftInputContract ? BigInt(quote.effectiveAmountIn64) : getAmountOfFractionalAmount(
    quote.minMiddleAmount,
    quote.swiftInputDecimals
  );
  InitSwiftLayout.encode(
    {
      instruction: getAnchorInstructionData("init_order"),
      amountInMin: getSafeU64Blob(minMiddleAmount),
      nativeInput: quote.swiftInputContract === ZeroAddress2 ? 1 : 0,
      feeSubmit: getSafeU64Blob(BigInt(quote.submitRelayerFee64)),
      destAddress: Buffer.from(
        hexToUint8Array(
          nativeAddressToHexString(
            params.destinationAddress,
            destinationChainId
          )
        )
      ),
      destinationChain: destinationChainId,
      tokenOut: Buffer.from(
        hexToUint8Array(
          nativeAddressToHexString(quote.toToken.contract, destinationChainId)
        )
      ),
      amountOutMin: getSafeU64Blob(
        getAmountOfFractionalAmount(
          quote.minAmountOut,
          Math.min(quote.toToken.decimals, 8)
        )
      ),
      gasDrop: getSafeU64Blob(
        getAmountOfFractionalAmount(
          quote.gasDrop,
          Math.min(getGasDecimal(quote.toChain), 8)
        )
      ),
      feeCancel: getSafeU64Blob(BigInt(quote.cancelRelayerFee64)),
      feeRefund: getSafeU64Blob(BigInt(quote.refundRelayerFee64)),
      deadline: getSafeU64Blob(params.deadline),
      refAddress,
      feeRateRef: quote.referrerBps,
      feeRateMayan: quote.protocolBps,
      auctionMode: quote.swiftAuctionMode,
      randomKey: params.randomKey.toBuffer()
    },
    data
  );
  return new TransactionInstruction3({
    keys: accounts,
    data,
    programId: new PublicKey6(addresses_default.SWIFT_PROGRAM_ID)
  });
}
async function createSwiftFromSolanaInstructions(quote, swapperAddress, destinationAddress, referrerAddress, connection, options = {}) {
  if (quote.type !== "SWIFT") {
    throw new Error("Unsupported quote type for Swift: " + quote.type);
  }
  if (quote.toChain === "solana") {
    throw new Error("Unsupported destination chain: " + quote.toChain);
  }
  const allowSwapperOffCurve = options.allowSwapperOffCurve || false;
  let instructions = [];
  let lookupTables = [];
  let _lookupTablesAddress = [];
  _lookupTablesAddress.push(addresses_default.LOOKUP_TABLE);
  let _swapAddressLookupTables = [];
  let swapInstructions = [];
  let createSwapTpmTokenAccountInstructions = [];
  const tmpSwapTokenAccount = Keypair3.generate();
  let swapMessageV0Params = null;
  const swiftProgram = new PublicKey6(addresses_default.SWIFT_PROGRAM_ID);
  const trader = new PublicKey6(swapperAddress);
  const randomKey = Keypair3.generate();
  if (!Number(quote.deadline64)) {
    throw new Error("Swift mode requires a timeout");
  }
  const deadline = BigInt(quote.deadline64);
  const hash = createSwiftOrderHash(
    quote,
    swapperAddress,
    destinationAddress,
    referrerAddress,
    randomKey.publicKey.toBuffer().toString("hex")
  );
  const [state] = PublicKey6.findProgramAddressSync(
    [Buffer.from("STATE_SOURCE"), hash],
    swiftProgram
  );
  const swiftInputMint = quote.swiftInputContract === ZeroAddress2 ? solMint : new PublicKey6(quote.swiftInputContract);
  const stateAccount = getAssociatedTokenAddress(swiftInputMint, state, true);
  const relayer = quote.gasless ? new PublicKey6(quote.relayer) : trader;
  const relayerAccount = getAssociatedTokenAddress(
    swiftInputMint,
    relayer,
    false
  );
  if (quote.fromToken.contract === quote.swiftInputContract) {
    if (quote.suggestedPriorityFee > 0) {
      instructions.push(
        ComputeBudgetProgram3.setComputeUnitPrice({
          microLamports: quote.suggestedPriorityFee
        })
      );
    }
    instructions.push(
      createAssociatedTokenAccountInstruction(
        relayer,
        stateAccount,
        state,
        swiftInputMint
      )
    );
    if (quote.swiftInputContract === ZeroAddress2) {
      instructions.push(
        SystemProgram5.transfer({
          fromPubkey: trader,
          toPubkey: stateAccount,
          lamports: BigInt(quote.effectiveAmountIn64)
        }),
        createSyncNativeInstruction(stateAccount)
      );
    } else {
      instructions.push(
        createSplTransferInstruction(
          getAssociatedTokenAddress(
            swiftInputMint,
            trader,
            allowSwapperOffCurve
          ),
          stateAccount,
          trader,
          BigInt(quote.effectiveAmountIn64)
        )
      );
    }
  } else {
    const clientSwapRaw = await getSwapSolana({
      minMiddleAmount: quote.minMiddleAmount,
      middleToken: quote.swiftInputContract,
      userWallet: swapperAddress,
      slippageBps: quote.slippageBps,
      fromToken: quote.fromToken.contract,
      amountIn64: quote.effectiveAmountIn64,
      depositMode: quote.gasless ? "SWIFT_GASLESS" : "SWIFT",
      orderHash: `0x${hash.toString("hex")}`,
      fillMaxAccounts: options?.separateSwapTx || false,
      tpmTokenAccount: options?.separateSwapTx ? tmpSwapTokenAccount.publicKey.toString() : null
    });
    const clientSwap = decentralizeClientSwapInstructions(
      clientSwapRaw,
      connection
    );
    if (options?.separateSwapTx && clientSwapRaw.maxAccountsFilled) {
      validateJupSwap(clientSwap, tmpSwapTokenAccount.publicKey, trader);
      createSwapTpmTokenAccountInstructions = await createInitializeRandomTokenAccountInstructions(
        connection,
        relayer,
        swiftInputMint,
        trader,
        tmpSwapTokenAccount
      );
      swapInstructions.push(...clientSwap.computeBudgetInstructions);
      if (clientSwap.setupInstructions) {
        swapInstructions.push(...clientSwap.setupInstructions);
      }
      swapInstructions.push(clientSwap.swapInstruction);
      if (clientSwap.cleanupInstruction) {
        swapInstructions.push(clientSwap.cleanupInstruction);
      }
      _swapAddressLookupTables.push(...clientSwap.addressLookupTableAddresses);
      instructions.push(
        createAssociatedTokenAccountInstruction(
          relayer,
          stateAccount,
          state,
          swiftInputMint
        )
      );
      instructions.push(
        createTransferAllAndCloseInstruction(
          trader,
          swiftInputMint,
          tmpSwapTokenAccount.publicKey,
          stateAccount,
          relayer
        )
      );
    } else {
      instructions.push(...clientSwap.computeBudgetInstructions);
      if (clientSwap.setupInstructions) {
        instructions.push(...clientSwap.setupInstructions);
      }
      instructions.push(clientSwap.swapInstruction);
      if (clientSwap.cleanupInstruction) {
        instructions.push(clientSwap.cleanupInstruction);
      }
      _lookupTablesAddress.push(...clientSwap.addressLookupTableAddresses);
    }
  }
  instructions.push(
    createSwiftInitInstruction({
      quote,
      state,
      trader,
      stateAccount,
      randomKey: randomKey.publicKey,
      relayerAccount,
      relayer,
      destinationAddress,
      deadline,
      referrerAddress
    })
  );
  const totalLookupTables = await getAddressLookupTableAccounts(
    _lookupTablesAddress.concat(_swapAddressLookupTables),
    connection
  );
  lookupTables = totalLookupTables.slice(0, _lookupTablesAddress.length);
  if (swapInstructions.length > 0) {
    const swapLookupTables = totalLookupTables.slice(
      _lookupTablesAddress.length
    );
    swapMessageV0Params = {
      messageV0: {
        payerKey: relayer,
        instructions: swapInstructions,
        addressLookupTableAccounts: swapLookupTables
      },
      createTmpTokenAccountIxs: createSwapTpmTokenAccountInstructions,
      tmpTokenAccount: tmpSwapTokenAccount
    };
  }
  return { instructions, signers: [], lookupTables, swapMessageV0Params };
}

// src/solana/solanaSwap.ts
var STATE_SIZE = 420;
var SwapLayout = struct4([
  u84("instruction"),
  u84("stateNonce"),
  blob4(8, "amount"),
  blob4(8, "minAmountOut"),
  blob4(8, "deadline"),
  blob4(8, "feeSwap"),
  blob4(8, "feeReturn"),
  blob4(8, "feeCancel"),
  blob4(8, "gasDrop"),
  u163("destinationChain"),
  blob4(32, "destinationAddress"),
  u84("unwrapRedeem"),
  u84("unwrapRefund"),
  u84("mayanFeeNonce"),
  u84("referrerFeeNonce")
]);
async function createSwapFromSolanaInstructions(quote, swapperWalletAddress, destinationAddress, referrerAddresses, connection, options = {}) {
  const referrerAddress = getQuoteSuitableReferrerAddress(
    quote,
    referrerAddresses
  );
  if (quote.type === "MCTP") {
    return createMctpFromSolanaInstructions(
      quote,
      swapperWalletAddress,
      destinationAddress,
      referrerAddress,
      connection,
      options
    );
  }
  if (quote.type === "SWIFT") {
    return createSwiftFromSolanaInstructions(
      quote,
      swapperWalletAddress,
      destinationAddress,
      referrerAddress,
      connection,
      options
    );
  }
  let instructions = [];
  const solanaConnection = connection ?? new Connection4("https://rpc.ankr.com/solana");
  const mayanProgram = new PublicKey7(addresses_default.MAYAN_PROGRAM_ID);
  const tokenProgram = new PublicKey7(addresses_default.TOKEN_PROGRAM_ID);
  const swapper = new PublicKey7(swapperWalletAddress);
  const auctionAddr = new PublicKey7(addresses_default.AUCTION_PROGRAM_ID);
  if (quote.suggestedPriorityFee > 0) {
    instructions.push(
      ComputeBudgetProgram4.setComputeUnitPrice({
        microLamports: quote.suggestedPriorityFee
      })
    );
  }
  let referrerAddr;
  if (referrerAddress) {
    referrerAddr = new PublicKey7(referrerAddress);
  } else {
    referrerAddr = SystemProgram6.programId;
  }
  const [mayanFee, mayanFeeNonce] = PublicKey7.findProgramAddressSync(
    [Buffer.from("MAYANFEE")],
    mayanProgram
  );
  const [referrerFee, referrerFeeNonce] = PublicKey7.findProgramAddressSync(
    [Buffer.from("REFERRERFEE"), referrerAddr.toBuffer()],
    mayanProgram
  );
  const msg1 = Keypair4.generate();
  const msg2 = Keypair4.generate();
  const [state, stateNonce] = PublicKey7.findProgramAddressSync(
    [
      Buffer.from("V2STATE"),
      Buffer.from(msg1.publicKey.toBytes()),
      Buffer.from(msg2.publicKey.toBytes())
    ],
    mayanProgram
  );
  const fromMint = new PublicKey7(quote.fromToken.mint);
  const toMint = new PublicKey7(quote.toToken.mint);
  const fromAccount = getAssociatedTokenAddress(fromMint, swapper);
  const toAccount = getAssociatedTokenAddress(fromMint, state, true);
  const [[fromAccountData, toAccountData], stateRent, relayer] = await Promise.all([
    solanaConnection.getMultipleAccountsInfo(
      [fromAccount, toAccount],
      "finalized"
    ),
    solanaConnection.getMinimumBalanceForRentExemption(STATE_SIZE),
    decideRelayer()
  ]);
  if (!fromAccountData || fromAccountData.data.length === 0) {
    instructions.push(
      createAssociatedTokenAccountInstruction(
        swapper,
        fromAccount,
        swapper,
        fromMint
      )
    );
  }
  if (!toAccountData || toAccountData.data.length === 0) {
    instructions.push(
      createAssociatedTokenAccountInstruction(
        swapper,
        toAccount,
        state,
        fromMint
      )
    );
  }
  if (quote.fromToken.contract === ZeroAddress3) {
    instructions.push(
      SystemProgram6.transfer({
        fromPubkey: swapper,
        toPubkey: fromAccount,
        lamports: BigInt(quote.effectiveAmountIn64)
      })
    );
    instructions.push(createSyncNativeInstruction(fromAccount));
  }
  const amount = BigInt(quote.effectiveAmountIn64);
  const delegate = Keypair4.generate();
  instructions.push(
    createApproveInstruction(fromAccount, delegate.publicKey, swapper, amount)
  );
  instructions.push(
    SystemProgram6.transfer({
      fromPubkey: swapper,
      toPubkey: delegate.publicKey,
      lamports: stateRent
    })
  );
  const swapKeys = [
    { pubkey: delegate.publicKey, isWritable: false, isSigner: true },
    { pubkey: msg1.publicKey, isWritable: false, isSigner: true },
    { pubkey: msg2.publicKey, isWritable: false, isSigner: true },
    { pubkey: state, isWritable: true, isSigner: false },
    { pubkey: fromAccount, isWritable: true, isSigner: false },
    { pubkey: swapper, isWritable: false, isSigner: false },
    { pubkey: toAccount, isWritable: true, isSigner: false },
    { pubkey: fromMint, isWritable: false, isSigner: false },
    { pubkey: toMint, isWritable: false, isSigner: false },
    { pubkey: auctionAddr, isWritable: false, isSigner: false },
    { pubkey: referrerAddr, isWritable: false, isSigner: false },
    { pubkey: mayanFee, isWritable: false, isSigner: false },
    { pubkey: referrerFee, isWritable: false, isSigner: false },
    { pubkey: delegate.publicKey, isWritable: true, isSigner: true },
    { pubkey: relayer, isWritable: false, isSigner: false },
    { pubkey: SYSVAR_CLOCK_PUBKEY2, isWritable: false, isSigner: false },
    { pubkey: SYSVAR_RENT_PUBKEY3, isWritable: false, isSigner: false },
    { pubkey: tokenProgram, isWritable: false, isSigner: false },
    { pubkey: SystemProgram6.programId, isWritable: false, isSigner: false }
  ];
  const destinationChainId = getWormholeChainIdByName(quote.toChain);
  if (destinationChainId === 1) {
    const destinationAccount = await solanaConnection.getAccountInfo(
      new PublicKey7(destinationAddress)
    );
    if (destinationAccount && destinationAccount.owner && destinationAccount.owner.equals(tokenProgram)) {
      throw new Error(
        "Destination address is not about token account. It should be a owner address"
      );
    }
  }
  const destAddress = Buffer.from(
    hexToUint8Array(
      nativeAddressToHexString(destinationAddress, destinationChainId)
    )
  );
  const minAmountOut = getAmountOfFractionalAmount(
    quote.minAmountOut,
    quote.mintDecimals.to
  );
  const feeSwap = getAmountOfFractionalAmount(
    quote.swapRelayerFee,
    quote.mintDecimals.from
  );
  const feeReturn = getAmountOfFractionalAmount(
    quote.redeemRelayerFee,
    quote.mintDecimals.to
  );
  const feeCancel = getAmountOfFractionalAmount(
    quote.refundRelayerFee,
    quote.mintDecimals.from
  );
  const gasDrop = getAmountOfFractionalAmount(
    quote.gasDrop,
    getGasDecimalsInSolana(quote.toChain)
  );
  const unwrapRedeem = quote.toToken.contract === ZeroAddress3;
  const unwrapRefund = quote.fromToken.contract === ZeroAddress3;
  if (!Number(quote.deadline64)) {
    throw new Error("Deadline is not valid");
  }
  const deadline = BigInt(quote.deadline64);
  const swapData = Buffer.alloc(SwapLayout.span);
  const swapFields = {
    instruction: 101,
    stateNonce,
    amount: getSafeU64Blob(amount),
    minAmountOut: getSafeU64Blob(minAmountOut),
    deadline: getSafeU64Blob(deadline),
    feeSwap: getSafeU64Blob(feeSwap),
    feeReturn: getSafeU64Blob(feeReturn),
    feeCancel: getSafeU64Blob(feeCancel),
    gasDrop: getSafeU64Blob(gasDrop),
    destinationChain: destinationChainId,
    destinationAddress: destAddress,
    unwrapRedeem: unwrapRedeem ? 1 : 0,
    unwrapRefund: unwrapRefund ? 1 : 0,
    mayanFeeNonce,
    referrerFeeNonce
  };
  SwapLayout.encode(swapFields, swapData);
  const swapInstruction = new TransactionInstruction4({
    keys: swapKeys,
    data: swapData,
    programId: mayanProgram
  });
  instructions.push(swapInstruction);
  return {
    instructions,
    signers: [delegate, msg1, msg2],
    lookupTables: [],
    swapMessageV0Params: null
  };
}
async function swapFromSolana(quote, swapperWalletAddress, destinationAddress, referrerAddresses, signTransaction, connection, extraRpcs, sendOptions, jitoOptions, instructionOptions) {
  const solanaConnection = connection ?? new Connection4("https://rpc.ankr.com/solana");
  const jitoEnabled = !!(!quote.gasless && jitoOptions && jitoOptions.tipLamports > 0 && jitoOptions.signAllTransactions);
  const { instructions, signers, lookupTables, swapMessageV0Params } = await createSwapFromSolanaInstructions(
    quote,
    swapperWalletAddress,
    destinationAddress,
    referrerAddresses,
    connection,
    {
      allowSwapperOffCurve: instructionOptions?.allowSwapperOffCurve,
      forceSkipCctpInstructions: instructionOptions?.forceSkipCctpInstructions,
      separateSwapTx: jitoEnabled && jitoOptions?.separateSwapTx
    }
  );
  const swapper = new PublicKey7(swapperWalletAddress);
  const feePayer = quote.gasless ? new PublicKey7(quote.relayer) : swapper;
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  const message = MessageV0.compile({
    instructions,
    payerKey: feePayer,
    recentBlockhash: blockhash,
    addressLookupTableAccounts: lookupTables
  });
  const transaction = new VersionedTransaction2(message);
  transaction.sign(signers);
  let signedTrx;
  if (jitoEnabled) {
    const allTransactions = [];
    if (swapMessageV0Params) {
      const createTmpTokenAccount = new Transaction2({
        feePayer: swapper,
        blockhash,
        lastValidBlockHeight
      }).add(...swapMessageV0Params.createTmpTokenAccountIxs);
      createTmpTokenAccount.partialSign(swapMessageV0Params.tmpTokenAccount);
      allTransactions.push(createTmpTokenAccount);
      const swapMessage = MessageV0.compile({
        ...swapMessageV0Params.messageV0,
        recentBlockhash: blockhash
      });
      allTransactions.push(new VersionedTransaction2(swapMessage));
    }
    const jitoTipTransfer = getJitoTipTransfer(
      swapperWalletAddress,
      blockhash,
      lastValidBlockHeight,
      jitoOptions
    );
    allTransactions.push(transaction);
    allTransactions.push(jitoTipTransfer);
    const signedTrxs = await jitoOptions.signAllTransactions(allTransactions);
    signedTrx = signedTrxs[signedTrxs.length - 2];
    let mayanTxHash = null;
    if (signedTrx instanceof Transaction2 && signedTrx?.signatures[0]?.publicKey) {
      mayanTxHash = encodeBase582(
        Uint8Array.from(signedTrx.signatures[0].signature)
      );
    } else if (signedTrx instanceof VersionedTransaction2 && signedTrx?.signatures[0]) {
      mayanTxHash = encodeBase582(Uint8Array.from(signedTrx.signatures[0]));
    }
    if (mayanTxHash === null) {
      throw new Error("Failed to get mayan tx hash");
    }
    if (swapMessageV0Params) {
      const jitoBundleId = await sendJitoBundle(signedTrxs, jitoOptions, true);
      await confirmJitoBundleId(
        jitoBundleId,
        jitoOptions,
        lastValidBlockHeight,
        mayanTxHash,
        connection
      );
      broadcastJitoBundleId(jitoBundleId);
      return {
        signature: mayanTxHash,
        serializedTrx: null
      };
    } else {
      sendJitoBundle(signedTrxs, jitoOptions).then(() => {
        console.log("Jito bundle sent");
      }).catch(() => {
      });
    }
  } else {
    signedTrx = await signTransaction(transaction);
  }
  if (quote.gasless) {
    const serializedTrx = Buffer.from(signedTrx.serialize()).toString("base64");
    const { orderHash } = await submitSwiftSolanaSwap(serializedTrx);
    return { signature: orderHash, serializedTrx: null };
  }
  return await submitTransactionWithRetry({
    trx: signedTrx.serialize(),
    connection: solanaConnection,
    extraRpcs: extraRpcs ?? [],
    errorChance: 2,
    options: sendOptions
  });
}

// src/evm/evmSwift.ts
function getEvmSwiftParams(quote, swapperAddress, destinationAddress, referrerAddress, signerChainId) {
  const signerWormholeChainId = getWormholeChainIdById(Number(signerChainId));
  const sourceChainId = getWormholeChainIdByName(quote.fromChain);
  const destChainId = getWormholeChainIdByName(quote.toChain);
  if (sourceChainId !== signerWormholeChainId) {
    throw new Error(`Signer chain id(${Number(signerChainId)}) and quote from chain are not same! ${sourceChainId} !== ${signerWormholeChainId}`);
  }
  if (!quote.swiftMayanContract) {
    throw new Error("SWIFT contract address is missing");
  }
  if (quote.toToken.wChainId !== destChainId) {
    throw new Error(`Destination chain ID mismatch: ${destChainId} != ${quote.toToken.wChainId}`);
  }
  const contractAddress = quote.swiftMayanContract;
  if (!Number(quote.deadline64)) {
    throw new Error("Swift order requires timeout");
  }
  const deadline = BigInt(quote.deadline64);
  const tokenIn = quote.swiftInputContract;
  const amountIn = BigInt(quote.effectiveAmountIn64);
  let referrerHex;
  if (referrerAddress) {
    referrerHex = nativeAddressToHexString(
      referrerAddress,
      destChainId
    );
  } else {
    referrerHex = nativeAddressToHexString(
      SystemProgram7.programId.toString(),
      1
    );
  }
  const random = nativeAddressToHexString(Keypair5.generate().publicKey.toString(), 1);
  const tokenOut = quote.toToken.contract === ZeroAddress4 ? nativeAddressToHexString(SystemProgram7.programId.toString(), 1) : nativeAddressToHexString(quote.toToken.contract, destChainId);
  const minAmountOut = getAmountOfFractionalAmount(
    quote.minAmountOut,
    Math.min(8, quote.toToken.decimals)
  );
  const gasDrop = getAmountOfFractionalAmount(
    quote.gasDrop,
    Math.min(8, getGasDecimal(quote.toChain))
  );
  const destinationAddressHex = nativeAddressToHexString(destinationAddress, destChainId);
  const orderParams = {
    trader: nativeAddressToHexString(swapperAddress, sourceChainId),
    tokenOut,
    minAmountOut,
    gasDrop,
    cancelFee: BigInt(quote.cancelRelayerFee64),
    refundFee: BigInt(quote.refundRelayerFee64),
    deadline,
    destAddr: destinationAddressHex,
    destChainId,
    referrerAddr: referrerHex,
    referrerBps: quote.referrerBps || 0,
    auctionMode: quote.swiftAuctionMode,
    random
  };
  return {
    contractAddress,
    tokenIn,
    amountIn,
    order: orderParams
  };
}
function getSwiftFromEvmTxPayload(quote, swapperAddress, destinationAddress, referrerAddress, signerChainId, permit) {
  if (quote.type !== "SWIFT") {
    throw new Error("Quote type is not SWIFT");
  }
  if (!Number.isFinite(Number(signerChainId))) {
    throw new Error("Invalid signer chain id");
  }
  if (!Number(quote.deadline64)) {
    throw new Error("Swift order requires timeout");
  }
  signerChainId = Number(signerChainId);
  const _permit = permit || ZeroPermit;
  const forwarder = new Contract2(addresses_default.MAYAN_FORWARDER_CONTRACT, MayanForwarderArtifact_default.abi);
  const {
    tokenIn: swiftTokenIn,
    amountIn,
    order,
    contractAddress: swiftContractAddress
  } = getEvmSwiftParams(quote, swapperAddress, destinationAddress, referrerAddress, signerChainId);
  let swiftCallData;
  const swiftContract = new Contract2(swiftContractAddress, MayanSwiftArtifact_default.abi);
  if (quote.swiftInputContract === ZeroAddress4) {
    swiftCallData = swiftContract.interface.encodeFunctionData(
      "createOrderWithEth",
      [order]
    );
  } else {
    swiftCallData = swiftContract.interface.encodeFunctionData(
      "createOrderWithToken",
      [swiftTokenIn, amountIn, order]
    );
  }
  let forwarderMethod;
  let forwarderParams;
  let value;
  if (quote.fromToken.contract === quote.swiftInputContract) {
    if (quote.fromToken.contract === ZeroAddress4) {
      forwarderMethod = "forwardEth";
      forwarderParams = [swiftContractAddress, swiftCallData];
      value = toBeHex2(amountIn);
    } else {
      forwarderMethod = "forwardERC20";
      forwarderParams = [swiftTokenIn, amountIn, _permit, swiftContractAddress, swiftCallData];
      value = toBeHex2(0);
    }
  } else {
    const { evmSwapRouterAddress, evmSwapRouterCalldata } = quote;
    if (!quote.minMiddleAmount || !evmSwapRouterAddress || !evmSwapRouterCalldata) {
      throw new Error("Swift swap requires middle amount, router address and calldata");
    }
    const tokenIn = quote.fromToken.contract;
    const minMiddleAmount = getAmountOfFractionalAmount(quote.minMiddleAmount, quote.swiftInputDecimals);
    if (quote.fromToken.contract === ZeroAddress4) {
      forwarderMethod = "swapAndForwardEth";
      forwarderParams = [
        amountIn,
        evmSwapRouterAddress,
        evmSwapRouterCalldata,
        quote.swiftInputContract,
        minMiddleAmount,
        swiftContractAddress,
        swiftCallData
      ];
      value = toBeHex2(amountIn);
    } else {
      forwarderMethod = "swapAndForwardERC20";
      forwarderParams = [
        tokenIn,
        amountIn,
        _permit,
        evmSwapRouterAddress,
        evmSwapRouterCalldata,
        quote.swiftInputContract,
        minMiddleAmount,
        swiftContractAddress,
        swiftCallData
      ];
      value = toBeHex2(0);
    }
  }
  const data = forwarder.interface.encodeFunctionData(forwarderMethod, forwarderParams);
  return {
    data,
    to: addresses_default.MAYAN_FORWARDER_CONTRACT,
    value,
    chainId: signerChainId,
    _forwarder: {
      method: forwarderMethod,
      params: forwarderParams
    }
  };
}
function getSwiftOrderTypeData(quote, orderHash, signerChainId) {
  if (!Number.isFinite(Number(signerChainId))) {
    throw new Error("Invalid signer chain id");
  }
  const totalAmountIn = BigInt(quote.effectiveAmountIn64);
  const submitFee = BigInt(quote.submitRelayerFee64);
  return {
    domain: {
      name: "Mayan Swift",
      chainId: Number(signerChainId),
      verifyingContract: quote.swiftMayanContract
    },
    types: {
      CreateOrder: [
        { name: "OrderId", type: "bytes32" },
        { name: "InputAmount", type: "uint256" },
        { name: "SubmissionFee", type: "uint256" }
      ]
    },
    value: {
      OrderId: orderHash,
      InputAmount: totalAmountIn - submitFee,
      SubmissionFee: submitFee
    }
  };
}
function getSwiftFromEvmGasLessParams(quote, swapperAddress, destinationAddress, referrerAddress, signerChainId, permit) {
  if (quote.type !== "SWIFT") {
    throw new Error("Quote type is not SWIFT");
  }
  if (!quote.gasless) {
    throw new Error("Quote does not support gasless");
  }
  if (!Number.isFinite(Number(signerChainId))) {
    throw new Error("Invalid signer chain id");
  }
  if (!Number(quote.deadline64)) {
    throw new Error("Swift order requires timeout");
  }
  if (quote.fromToken.contract !== quote.swiftInputContract) {
    throw new Error("Swift gasless order creation does not support source swap");
  }
  const {
    tokenIn,
    amountIn,
    order
  } = getEvmSwiftParams(
    quote,
    swapperAddress,
    destinationAddress,
    referrerAddress,
    Number(signerChainId)
  );
  const sourceChainId = getWormholeChainIdByName(quote.fromChain);
  const orderHashBuf = createSwiftOrderHash(quote, swapperAddress, destinationAddress, referrerAddress, order.random);
  const orderHash = `0x${orderHashBuf.toString("hex")}`;
  const orderTypedData = getSwiftOrderTypeData(quote, orderHash, signerChainId);
  return {
    permitParams: permit,
    orderParams: {
      ...order,
      sourceChainId,
      amountIn,
      tokenIn,
      submissionFee: BigInt(quote.submitRelayerFee64)
    },
    orderHash,
    orderTypedData
  };
}

// src/evm/evmShuttle.ts
import { Contract as Contract3, toBeHex as toBeHex3, ZeroAddress as ZeroAddress5 } from "ethers";

// src/evm/ShuttleArtifact.ts
var ShuttleArtifact_default = {
  abi: [
    {
      type: "function",
      name: "batchMaxApprove",
      inputs: [{ name: "approvals", type: "bytes", internalType: "bytes" }],
      outputs: [],
      stateMutability: "nonpayable"
    },
    {
      type: "function",
      name: "initiate",
      inputs: [
        { name: "recipient", type: "bytes32", internalType: "bytes32" },
        {
          name: "overrideAmountIn",
          type: "uint256",
          internalType: "uint256"
        },
        { name: "targetChain", type: "uint16", internalType: "uint16" },
        {
          name: "params",
          type: "bytes",
          internalType: "bytes"
        }
      ],
      outputs: [{ name: "", type: "bytes", internalType: "bytes" }],
      stateMutability: "payable"
    },
    {
      type: "error",
      name: "ChainNotSupported",
      inputs: [{ name: "chain", type: "uint16", internalType: "uint16" }]
    },
    {
      type: "error",
      name: "DeadlineExpired",
      inputs: [
        { name: "blocktime", type: "uint256", internalType: "uint256" },
        {
          name: "deadline",
          type: "uint256",
          internalType: "uint256"
        }
      ]
    },
    { type: "error", name: "EthTransferFailed", inputs: [] },
    {
      type: "error",
      name: "ExceedsMaxGasDropoff",
      inputs: [
        { name: "requested", type: "uint256", internalType: "uint256" },
        {
          name: "maximum",
          type: "uint256",
          internalType: "uint256"
        }
      ]
    },
    {
      type: "error",
      name: "ExceedsMaxRelayingFee",
      inputs: [
        { name: "fee", type: "uint256", internalType: "uint256" },
        {
          name: "maximum",
          type: "uint256",
          internalType: "uint256"
        }
      ]
    },
    {
      type: "error",
      name: "InsufficientInputAmount",
      inputs: [
        { name: "input", type: "uint256", internalType: "uint256" },
        {
          name: "minimum",
          type: "uint256",
          internalType: "uint256"
        }
      ]
    },
    {
      type: "error",
      name: "InvalidAddress",
      inputs: [{ name: "addr", type: "bytes32", internalType: "bytes32" }]
    },
    {
      type: "error",
      name: "InvalidBoolVal",
      inputs: [{ name: "val", type: "uint8", internalType: "uint8" }]
    },
    {
      type: "error",
      name: "InvalidOverrideAmount",
      inputs: [
        { name: "received", type: "uint256", internalType: "uint256" },
        {
          name: "maximum",
          type: "uint256",
          internalType: "uint256"
        }
      ]
    },
    {
      type: "error",
      name: "InvalidSwapType",
      inputs: [{ name: "swapType", type: "uint256", internalType: "uint256" }]
    },
    {
      type: "error",
      name: "InvalidSwapTypeForChain",
      inputs: [
        { name: "chain", type: "uint16", internalType: "uint16" },
        {
          name: "swapType",
          type: "uint256",
          internalType: "uint256"
        }
      ]
    },
    {
      type: "error",
      name: "LengthMismatch",
      inputs: [
        { name: "encodedLength", type: "uint256", internalType: "uint256" },
        {
          name: "expectedLength",
          type: "uint256",
          internalType: "uint256"
        }
      ]
    },
    { type: "error", name: "RelayingDisabledForChain", inputs: [] }
  ]
};

// src/evm/evmShuttle.ts
var shuttleConstants = {
  FAST_MODE_FLAG: 1,
  RELAY_REDEEM_MODE: 2,
  EXACT_IN_FLAG: 1,
  USDC_INPUT_TOKEN_TYPE: 0,
  PRE_APPROVED_ACQUIRE_MODE: 0,
  OUTPUT_USDC_MODE: 0,
  OUTPUT_NATIVE_MODE: 1,
  OUTPUT_OTHER_MODE: 2
};
function writeBigIntTo16BytesBuffer(value) {
  const maxUint128 = (1n << 128n) - 1n;
  if (value < 0n || value > maxUint128) {
    throw new RangeError(
      "Value must fit in an unsigned 128-bit integer (0 <= value < 2^128)"
    );
  }
  const buffer = Buffer.alloc(16);
  for (let i = 15; i >= 0; i--) {
    buffer[i] = Number(value & 0xffn);
    value >>= 8n;
  }
  return buffer;
}
function getShuttleParams(quote, destinationAddress, signerChainId) {
  const { shuttleParams } = quote;
  if (!shuttleParams) {
    throw new Error("Swap layer params are missing in quote response");
  }
  const signerWormholeChainId = getWormholeChainIdById(Number(signerChainId));
  const sourceChainId = getWormholeChainIdByName(quote.fromChain);
  const destChainId = getWormholeChainIdByName(quote.toChain);
  if (sourceChainId !== signerWormholeChainId) {
    throw new Error(
      `Signer chain id(${Number(
        signerChainId
      )}) and quote from chain are not same! ${sourceChainId} !== ${signerWormholeChainId}`
    );
  }
  let bytes = [];
  bytes.push(shuttleConstants.FAST_MODE_FLAG);
  const maxLLFeeBuffer8Bytes = Buffer.alloc(8);
  maxLLFeeBuffer8Bytes.writeBigUInt64BE(BigInt(shuttleParams.maxLLFee));
  const maxLLFeeBytes = maxLLFeeBuffer8Bytes.subarray(2);
  bytes.push(...maxLLFeeBytes);
  const deadLineBuffer = Buffer.alloc(4);
  deadLineBuffer.writeUInt32BE(shuttleParams.fastTransferDeadline);
  bytes.push(...deadLineBuffer);
  bytes.push(shuttleConstants.RELAY_REDEEM_MODE);
  const gasDrop = getAmountOfFractionalAmount(
    quote.gasDrop,
    Math.min(6, getGasDecimal(quote.toChain))
  );
  const gasDropBuffer8Bytes = Buffer.alloc(8);
  gasDropBuffer8Bytes.writeBigUInt64BE(gasDrop);
  const gasDropBytes = gasDropBuffer8Bytes.subarray(4);
  bytes.push(...gasDropBytes);
  const maxRelayerFeeBuffer8Bytes = Buffer.alloc(8);
  maxRelayerFeeBuffer8Bytes.writeBigUInt64BE(
    BigInt(shuttleParams.maxRelayingFee)
  );
  const maxRelayerFeeBytes = maxRelayerFeeBuffer8Bytes.subarray(2);
  bytes.push(...maxRelayerFeeBytes);
  bytes.push(shuttleConstants.EXACT_IN_FLAG);
  bytes.push(shuttleConstants.USDC_INPUT_TOKEN_TYPE);
  const amountIn = BigInt(quote.effectiveAmountIn64);
  if (quote.fromToken.contract === quote.shuttleInputContract) {
    bytes.push(...Array(8).fill(0));
    const amountInBuffer = Buffer.alloc(8);
    amountInBuffer.writeBigUInt64BE(amountIn);
    bytes.push(...amountInBuffer);
  } else {
    bytes.push(...Array(16).fill(0));
  }
  bytes.push(shuttleConstants.PRE_APPROVED_ACQUIRE_MODE);
  if (shuttleParams.hasDestSwap) {
    if (quote.toToken.contract === ZeroAddress5) {
      bytes.push(shuttleConstants.OUTPUT_NATIVE_MODE);
    } else {
      bytes.push(shuttleConstants.OUTPUT_OTHER_MODE);
      const tokenOut = Buffer.from(
        nativeAddressToHexString(quote.toToken.contract, destChainId).slice(2),
        "hex"
      );
      bytes.push(...tokenOut);
    }
    const swapDeadlineBuffer = Buffer.alloc(4);
    swapDeadlineBuffer.writeUInt32BE(Number(BigInt(quote.deadline64)));
    bytes.push(...swapDeadlineBuffer);
    const minAmountOut = getAmountOfFractionalAmount(
      quote.minAmountOut,
      quote.toToken.decimals
    );
    if (quote.toChain === "solana") {
      bytes.push(...Array(8).fill(0));
      const minAmountOutBuffer = Buffer.alloc(8);
      minAmountOutBuffer.writeBigUInt64BE(minAmountOut);
      bytes.push(...minAmountOutBuffer);
    } else {
      const minAmountOutBuffer = writeBigIntTo16BytesBuffer(minAmountOut);
      bytes.push(...minAmountOutBuffer);
    }
    const swapPath = Buffer.from(shuttleParams.path.slice(2), "hex");
    bytes.push(...swapPath);
  } else {
    bytes.push(shuttleConstants.OUTPUT_USDC_MODE);
  }
  const destinationAddressHex = nativeAddressToHexString(
    destinationAddress,
    destChainId
  );
  return {
    destAddr: destinationAddressHex,
    destChainId,
    serializedParams: `0x${Buffer.from(bytes).toString("hex")}`,
    contractAddress: quote.shuttleContract,
    amountIn,
    bridgeFee: getAmountOfFractionalAmount(
      quote.bridgeFee,
      getGasDecimal(quote.fromChain)
    )
  };
}
function getShuttleFromEvmTxPayload(quote, destinationAddress, signerChainId, permit) {
  if (quote.type !== "SHUTTLE") {
    throw new Error("Quote type is not SHUTTLE");
  }
  if (!Number.isFinite(Number(signerChainId))) {
    throw new Error("Invalid signer chain id");
  }
  signerChainId = Number(signerChainId);
  const _permit = permit || ZeroPermit;
  const forwarder = new Contract3(
    addresses_default.MAYAN_FORWARDER_CONTRACT,
    MayanForwarderArtifact_default.abi
  );
  const {
    destAddr,
    destChainId,
    serializedParams,
    contractAddress: shuttleContractAddress,
    amountIn,
    bridgeFee
  } = getShuttleParams(quote, destinationAddress, signerChainId);
  let shuttleCallData;
  const shuttleContract = new Contract3(
    shuttleContractAddress,
    ShuttleArtifact_default.abi
  );
  shuttleCallData = shuttleContract.interface.encodeFunctionData("initiate", [
    destAddr,
    amountIn,
    destChainId,
    serializedParams
  ]);
  let forwarderMethod;
  let forwarderParams;
  let value;
  if (quote.fromToken.contract === quote.shuttleInputContract) {
    forwarderMethod = "forwardERC20";
    forwarderParams = [
      quote.shuttleInputContract,
      amountIn,
      _permit,
      shuttleContractAddress,
      shuttleCallData
    ];
    value = toBeHex3(bridgeFee);
  } else {
    const { evmSwapRouterAddress, evmSwapRouterCalldata } = quote;
    if (!quote.minMiddleAmount || !evmSwapRouterAddress || !evmSwapRouterCalldata) {
      throw new Error(
        "Shuttle source chain swap requires middle amount, router address and calldata"
      );
    }
    const tokenIn = quote.fromToken.contract;
    const minMiddleAmount = getAmountOfFractionalAmount(
      quote.minMiddleAmount,
      quote.shuttleInputDecimals
    );
    if (quote.fromToken.contract === ZeroAddress5) {
      forwarderMethod = "swapAndForwardEth";
      forwarderParams = [
        amountIn,
        evmSwapRouterAddress,
        evmSwapRouterCalldata,
        quote.shuttleInputContract,
        minMiddleAmount,
        shuttleContractAddress,
        shuttleCallData
      ];
      value = toBeHex3(amountIn);
    } else {
      forwarderMethod = "swapAndForwardERC20";
      forwarderParams = [
        tokenIn,
        amountIn,
        _permit,
        evmSwapRouterAddress,
        evmSwapRouterCalldata,
        quote.shuttleInputContract,
        minMiddleAmount,
        shuttleContractAddress,
        shuttleCallData
      ];
      value = toBeHex3(bridgeFee);
    }
  }
  const data = forwarder.interface.encodeFunctionData(
    forwarderMethod,
    forwarderParams
  );
  return {
    data,
    to: addresses_default.MAYAN_FORWARDER_CONTRACT,
    value,
    chainId: signerChainId,
    _forwarder: {
      method: forwarderMethod,
      params: forwarderParams
    }
  };
}

// src/evm/evmFastMctp.ts
import { Contract as Contract4, toBeHex as toBeHex4, ZeroAddress as ZeroAddress6 } from "ethers";
import { SystemProgram as SystemProgram8 } from "@solana/web3.js";

// src/evm/MayanFastMctpArtifact.ts
var MayanFastMctpArtifact_default = {
  "abi": [
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "_cctpTokenMessengerV2",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_feeManager",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "receive",
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "bridge",
      "inputs": [
        {
          "name": "tokenIn",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "amountIn",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "redeemFee",
          "type": "uint64",
          "internalType": "uint64"
        },
        {
          "name": "circleMaxFee",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "gasDrop",
          "type": "uint64",
          "internalType": "uint64"
        },
        {
          "name": "destAddr",
          "type": "bytes32",
          "internalType": "bytes32"
        },
        {
          "name": "destDomain",
          "type": "uint32",
          "internalType": "uint32"
        },
        {
          "name": "referrerAddress",
          "type": "bytes32",
          "internalType": "bytes32"
        },
        {
          "name": "referrerBps",
          "type": "uint8",
          "internalType": "uint8"
        },
        {
          "name": "payloadType",
          "type": "uint8",
          "internalType": "uint8"
        },
        {
          "name": "minFinalityThreshold",
          "type": "uint32",
          "internalType": "uint32"
        },
        {
          "name": "customPayload",
          "type": "bytes",
          "internalType": "bytes"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "cctpTokenMessengerV2",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract ITokenMessengerV2"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "changeGuardian",
      "inputs": [
        {
          "name": "newGuardian",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "claimGuardian",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "createOrder",
      "inputs": [
        {
          "name": "tokenIn",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "amountIn",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "circleMaxFee",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "destDomain",
          "type": "uint32",
          "internalType": "uint32"
        },
        {
          "name": "minFinalityThreshold",
          "type": "uint32",
          "internalType": "uint32"
        },
        {
          "name": "orderPayload",
          "type": "tuple",
          "internalType": "struct FastMCTP.OrderPayload",
          "components": [
            {
              "name": "payloadType",
              "type": "uint8",
              "internalType": "uint8"
            },
            {
              "name": "destAddr",
              "type": "bytes32",
              "internalType": "bytes32"
            },
            {
              "name": "tokenOut",
              "type": "bytes32",
              "internalType": "bytes32"
            },
            {
              "name": "amountOutMin",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "gasDrop",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "redeemFee",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "refundFee",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "deadline",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "referrerAddr",
              "type": "bytes32",
              "internalType": "bytes32"
            },
            {
              "name": "referrerBps",
              "type": "uint8",
              "internalType": "uint8"
            }
          ]
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "domainToCaller",
      "inputs": [
        {
          "name": "",
          "type": "uint32",
          "internalType": "uint32"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bytes32",
          "internalType": "bytes32"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "feeManager",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "fulfillOrder",
      "inputs": [
        {
          "name": "cctpMsg",
          "type": "bytes",
          "internalType": "bytes"
        },
        {
          "name": "cctpSigs",
          "type": "bytes",
          "internalType": "bytes"
        },
        {
          "name": "swapProtocol",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "swapData",
          "type": "bytes",
          "internalType": "bytes"
        }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "guardian",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "keyToMintRecipient",
      "inputs": [
        {
          "name": "",
          "type": "bytes32",
          "internalType": "bytes32"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bytes32",
          "internalType": "bytes32"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "nextGuardian",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "paused",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "redeem",
      "inputs": [
        {
          "name": "cctpMsg",
          "type": "bytes",
          "internalType": "bytes"
        },
        {
          "name": "cctpSigs",
          "type": "bytes",
          "internalType": "bytes"
        }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "refund",
      "inputs": [
        {
          "name": "cctpMsg",
          "type": "bytes",
          "internalType": "bytes"
        },
        {
          "name": "cctpSigs",
          "type": "bytes",
          "internalType": "bytes"
        }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "rescueEth",
      "inputs": [
        {
          "name": "amount",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "to",
          "type": "address",
          "internalType": "address payable"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "rescueRedeem",
      "inputs": [
        {
          "name": "cctpMsg",
          "type": "bytes",
          "internalType": "bytes"
        },
        {
          "name": "cctpSigs",
          "type": "bytes",
          "internalType": "bytes"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "rescueToken",
      "inputs": [
        {
          "name": "token",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "to",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setDomainCallers",
      "inputs": [
        {
          "name": "domain",
          "type": "uint32",
          "internalType": "uint32"
        },
        {
          "name": "caller",
          "type": "bytes32",
          "internalType": "bytes32"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setFeeManager",
      "inputs": [
        {
          "name": "_feeManager",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setMintRecipient",
      "inputs": [
        {
          "name": "destDomain",
          "type": "uint32",
          "internalType": "uint32"
        },
        {
          "name": "tokenIn",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "mintRecipient",
          "type": "bytes32",
          "internalType": "bytes32"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setPause",
      "inputs": [
        {
          "name": "_pause",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setWhitelistedMsgSenders",
      "inputs": [
        {
          "name": "sender",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "isWhitelisted",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setWhitelistedSwapProtocols",
      "inputs": [
        {
          "name": "protocol",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "isWhitelisted",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "whitelistedMsgSenders",
      "inputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "whitelistedSwapProtocols",
      "inputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "event",
      "name": "OrderFulfilled",
      "inputs": [
        {
          "name": "sourceDomain",
          "type": "uint32",
          "indexed": false,
          "internalType": "uint32"
        },
        {
          "name": "sourceNonce",
          "type": "bytes32",
          "indexed": false,
          "internalType": "bytes32"
        },
        {
          "name": "amount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "OrderRefunded",
      "inputs": [
        {
          "name": "sourceDomain",
          "type": "uint32",
          "indexed": false,
          "internalType": "uint32"
        },
        {
          "name": "sourceNonce",
          "type": "bytes32",
          "indexed": false,
          "internalType": "bytes32"
        },
        {
          "name": "amount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "AlreadySet",
      "inputs": []
    },
    {
      "type": "error",
      "name": "CallerNotSet",
      "inputs": []
    },
    {
      "type": "error",
      "name": "CctpReceiveFailed",
      "inputs": []
    },
    {
      "type": "error",
      "name": "DeadlineViolation",
      "inputs": []
    },
    {
      "type": "error",
      "name": "EthTransferFailed",
      "inputs": []
    },
    {
      "type": "error",
      "name": "InvalidAddress",
      "inputs": []
    },
    {
      "type": "error",
      "name": "InvalidAmountOut",
      "inputs": []
    },
    {
      "type": "error",
      "name": "InvalidGasDrop",
      "inputs": []
    },
    {
      "type": "error",
      "name": "InvalidMintRecipient",
      "inputs": []
    },
    {
      "type": "error",
      "name": "InvalidPayload",
      "inputs": []
    },
    {
      "type": "error",
      "name": "InvalidPayloadType",
      "inputs": []
    },
    {
      "type": "error",
      "name": "InvalidRedeemFee",
      "inputs": []
    },
    {
      "type": "error",
      "name": "InvalidRefundFee",
      "inputs": []
    },
    {
      "type": "error",
      "name": "MintRecipientNotSet",
      "inputs": []
    },
    {
      "type": "error",
      "name": "Paused",
      "inputs": []
    },
    {
      "type": "error",
      "name": "Unauthorized",
      "inputs": []
    },
    {
      "type": "error",
      "name": "UnauthorizedMsgSender",
      "inputs": []
    },
    {
      "type": "error",
      "name": "UnauthorizedSwapProtocol",
      "inputs": []
    }
  ]
};

// src/evm/evmFastMctp.ts
function getEvmFastMctpBridgeParams(quote, destinationAddress, referrerAddress, signerChainId, customPayload) {
  const signerWormholeChainId = getWormholeChainIdById(Number(signerChainId));
  const sourceChainId = getWormholeChainIdByName(quote.fromChain);
  const destChainId = getWormholeChainIdByName(quote.toChain);
  if (sourceChainId !== signerWormholeChainId) {
    throw new Error(
      `Signer chain id(${Number(
        signerChainId
      )}) and quote from chain are not same! ${sourceChainId} !== ${signerWormholeChainId}`
    );
  }
  const destinationAddressHex = nativeAddressToHexString(
    destinationAddress,
    destChainId
  );
  const redeemFee = getAmountOfFractionalAmount(
    quote.redeemRelayerFee,
    CCTP_TOKEN_DECIMALS
  );
  const gasDrop = getAmountOfFractionalAmount(
    quote.gasDrop,
    Math.min(getGasDecimal(quote.toChain), 8)
  );
  const circleMaxFee = BigInt(quote.circleMaxFee64);
  const amountIn = BigInt(quote.effectiveAmountIn64);
  const destDomain = getCCTPDomain(quote.toChain);
  let referrerHex;
  if (referrerAddress) {
    referrerHex = nativeAddressToHexString(referrerAddress, destChainId);
  } else {
    referrerHex = nativeAddressToHexString(
      SystemProgram8.programId.toString(),
      getWormholeChainIdByName("solana")
    );
  }
  if (!quote.fastMctpMayanContract) {
    throw new Error("FastMctp contract address is missing");
  }
  const contractAddress = quote.fastMctpMayanContract;
  return {
    tokenIn: quote.fastMctpInputContract,
    amountIn,
    redeemFee,
    gasDrop,
    destAddr: destinationAddressHex,
    destDomain,
    referrerAddr: referrerHex,
    referrerBps: quote.referrerBps,
    payloadType: customPayload ? FAST_MCTP_PAYLOAD_TYPE_CUSTOM_PAYLOAD : FAST_MCTP_PAYLOAD_TYPE_DEFAULT,
    customPayload: customPayload ? `0x${Buffer.from(customPayload).toString("hex")}` : "0x",
    minFinalityThreshold: Number(quote.fastMctpMinFinality),
    circleMaxFee,
    contractAddress
  };
}
function getEvmFastMctpBridgeTxPayload(quote, destinationAddress, referrerAddress, signerChainId, payload) {
  const params = getEvmFastMctpBridgeParams(
    quote,
    destinationAddress,
    referrerAddress,
    signerChainId,
    payload
  );
  const {
    contractAddress,
    tokenIn,
    amountIn,
    destAddr,
    redeemFee,
    gasDrop,
    circleMaxFee,
    referrerAddr,
    referrerBps,
    destDomain,
    customPayload,
    minFinalityThreshold,
    payloadType
  } = params;
  const fastMctpContract = new Contract4(
    contractAddress,
    MayanFastMctpArtifact_default.abi
  );
  let data;
  let value;
  data = fastMctpContract.interface.encodeFunctionData("bridge", [
    tokenIn,
    amountIn,
    redeemFee,
    circleMaxFee,
    gasDrop,
    destAddr,
    destDomain,
    referrerAddr,
    referrerBps,
    payloadType,
    minFinalityThreshold,
    customPayload
  ]);
  value = toBeHex4(0);
  return {
    to: contractAddress,
    data,
    value,
    _params: params
  };
}
function getEvmFastMctpCreateOrderParams(quote, destinationAddress, referrerAddress, signerChainId) {
  const signerWormholeChainId = getWormholeChainIdById(Number(signerChainId));
  const sourceChainId = getWormholeChainIdByName(quote.fromChain);
  const destChainId = getWormholeChainIdByName(quote.toChain);
  if (sourceChainId !== signerWormholeChainId) {
    throw new Error(
      `Signer chain id(${Number(
        signerChainId
      )}) and quote from chain are not same! ${sourceChainId} !== ${signerWormholeChainId}`
    );
  }
  if (!quote.fastMctpMayanContract) {
    throw new Error("MCTP contract address is missing");
  }
  const contractAddress = quote.fastMctpMayanContract;
  const destinationAddressHex = nativeAddressToHexString(
    destinationAddress,
    destChainId
  );
  let referrerHex;
  if (referrerAddress) {
    referrerHex = nativeAddressToHexString(referrerAddress, destChainId);
  } else {
    referrerHex = nativeAddressToHexString(
      SystemProgram8.programId.toString(),
      getWormholeChainIdByName("solana")
    );
  }
  const redeemFee = getAmountOfFractionalAmount(
    quote.redeemRelayerFee,
    CCTP_TOKEN_DECIMALS
  );
  const refundFee = BigInt(quote.refundRelayerFee64);
  const circleMaxFee = BigInt(quote.circleMaxFee64);
  const gasDrop = getAmountOfFractionalAmount(
    quote.gasDrop,
    Math.min(getGasDecimal(quote.toChain), 8)
  );
  const destDomain = getCCTPDomain(quote.toChain);
  const amountIn = BigInt(quote.effectiveAmountIn64);
  const amountOutMin = getAmountOfFractionalAmount(
    quote.minAmountOut,
    Math.min(8, quote.toToken.decimals)
  );
  const deadline = BigInt(quote.deadline64);
  const tokenOut = quote.toToken.contract === ZeroAddress6 ? nativeAddressToHexString(
    SystemProgram8.programId.toString(),
    getWormholeChainIdByName("solana")
  ) : nativeAddressToHexString(
    quote.toChain === "sui" ? quote.toToken.verifiedAddress : quote.toToken.contract,
    quote.toToken.wChainId
  );
  return {
    tokenIn: quote.fastMctpInputContract,
    amountIn,
    circleMaxFee,
    destDomain,
    minFinalityThreshold: Number(quote.fastMctpMinFinality),
    orderPayload: {
      payloadType: FAST_MCTP_PAYLOAD_TYPE_ORDER,
      destAddr: destinationAddressHex,
      tokenOut,
      amountOutMin,
      gasDrop,
      redeemFee,
      refundFee,
      deadline,
      referrerAddr: referrerHex,
      referrerBps: quote.referrerBps || 0
    },
    contractAddress
  };
}
function getEvmFastMctpCreateOrderTxPayload(quote, destinationAddress, referrerAddress, signerChainId) {
  const orderParams = getEvmFastMctpCreateOrderParams(
    quote,
    destinationAddress,
    referrerAddress,
    signerChainId
  );
  const {
    contractAddress,
    orderPayload,
    tokenIn,
    amountIn,
    circleMaxFee,
    destDomain,
    minFinalityThreshold
  } = orderParams;
  const fastMctpContract = new Contract4(
    contractAddress,
    MayanFastMctpArtifact_default.abi
  );
  const data = fastMctpContract.interface.encodeFunctionData("createOrder", [
    tokenIn,
    amountIn,
    circleMaxFee,
    destDomain,
    minFinalityThreshold,
    orderPayload
  ]);
  const value = toBeHex4(0);
  return {
    to: contractAddress,
    data,
    value,
    _params: orderParams
  };
}
function getFastMctpFromEvmTxPayload(quote, destinationAddress, referrerAddress, signerChainId, permit, payload) {
  if (quote.type !== "FAST_MCTP") {
    throw new Error("Quote type is not FAST_MCTP");
  }
  if (!Number.isFinite(Number(signerChainId))) {
    throw new Error("Invalid signer chain id");
  }
  signerChainId = Number(signerChainId);
  const _permit = permit || ZeroPermit;
  const forwarder = new Contract4(
    addresses_default.MAYAN_FORWARDER_CONTRACT,
    MayanForwarderArtifact_default.abi
  );
  if (quote.fromToken.contract === quote.fastMctpInputContract) {
    if (quote.hasAuction) {
      if (!Number(quote.deadline64)) {
        throw new Error("Fast Mctp order requires timeout");
      }
      const fastMctpPayloadIx = getEvmFastMctpCreateOrderTxPayload(
        quote,
        destinationAddress,
        referrerAddress,
        signerChainId
      );
      const forwarderMethod = "forwardERC20";
      const forwarderParams = [
        quote.fromToken.contract,
        fastMctpPayloadIx._params.amountIn,
        _permit,
        fastMctpPayloadIx._params.contractAddress,
        fastMctpPayloadIx.data
      ];
      const data = forwarder.interface.encodeFunctionData(
        forwarderMethod,
        forwarderParams
      );
      return {
        data,
        to: addresses_default.MAYAN_FORWARDER_CONTRACT,
        value: toBeHex4(0),
        chainId: signerChainId,
        _forwarder: {
          method: forwarderMethod,
          params: forwarderParams
        }
      };
    } else {
      const fastMctpPayloadIx = getEvmFastMctpBridgeTxPayload(
        quote,
        destinationAddress,
        referrerAddress,
        signerChainId,
        payload
      );
      const forwarderMethod = "forwardERC20";
      const forwarderParams = [
        quote.fromToken.contract,
        fastMctpPayloadIx._params.amountIn,
        _permit,
        fastMctpPayloadIx._params.contractAddress,
        fastMctpPayloadIx.data
      ];
      const data = forwarder.interface.encodeFunctionData(
        forwarderMethod,
        forwarderParams
      );
      return {
        data,
        to: addresses_default.MAYAN_FORWARDER_CONTRACT,
        value: toBeHex4(0),
        chainId: signerChainId,
        _forwarder: {
          method: forwarderMethod,
          params: forwarderParams
        }
      };
    }
  } else {
    const { minMiddleAmount, evmSwapRouterAddress, evmSwapRouterCalldata } = quote;
    if (!minMiddleAmount || !evmSwapRouterAddress || !evmSwapRouterCalldata) {
      throw new Error(
        "Fast Mctp swap requires middle amount, router address and calldata"
      );
    }
    if (quote.hasAuction) {
      if (!Number(quote.deadline64)) {
        throw new Error("Fast Mctp order requires timeout");
      }
      const fastMctpPayloadIx = getEvmFastMctpCreateOrderTxPayload(
        quote,
        destinationAddress,
        referrerAddress,
        signerChainId
      );
      const minMiddleAmount2 = getAmountOfFractionalAmount(
        quote.minMiddleAmount,
        CCTP_TOKEN_DECIMALS
      );
      if (quote.fromToken.contract === ZeroAddress6) {
        const forwarderMethod = "swapAndForwardEth";
        const forwarderParams = [
          fastMctpPayloadIx._params.amountIn,
          evmSwapRouterAddress,
          evmSwapRouterCalldata,
          quote.fastMctpInputContract,
          minMiddleAmount2,
          fastMctpPayloadIx._params.contractAddress,
          fastMctpPayloadIx.data
        ];
        const data = forwarder.interface.encodeFunctionData(
          forwarderMethod,
          forwarderParams
        );
        return {
          data,
          to: addresses_default.MAYAN_FORWARDER_CONTRACT,
          value: toBeHex4(fastMctpPayloadIx._params.amountIn),
          chainId: signerChainId,
          _forwarder: {
            method: forwarderMethod,
            params: forwarderParams
          }
        };
      } else {
        const forwarderMethod = "swapAndForwardERC20";
        const forwarderParams = [
          quote.fromToken.contract,
          fastMctpPayloadIx._params.amountIn,
          _permit,
          evmSwapRouterAddress,
          evmSwapRouterCalldata,
          quote.fastMctpInputContract,
          minMiddleAmount2,
          fastMctpPayloadIx._params.contractAddress,
          fastMctpPayloadIx.data
        ];
        const data = forwarder.interface.encodeFunctionData(
          forwarderMethod,
          forwarderParams
        );
        return {
          data,
          to: addresses_default.MAYAN_FORWARDER_CONTRACT,
          value: toBeHex4(0),
          chainId: signerChainId,
          _forwarder: {
            method: forwarderMethod,
            params: forwarderParams
          }
        };
      }
    } else {
      const fastMctpPayloadIx = getEvmFastMctpBridgeTxPayload(
        quote,
        destinationAddress,
        referrerAddress,
        signerChainId,
        payload
      );
      const minMiddleAmount2 = getAmountOfFractionalAmount(
        quote.minMiddleAmount,
        CCTP_TOKEN_DECIMALS
      );
      if (quote.fromToken.contract === ZeroAddress6) {
        const forwarderMethod = "swapAndForwardEth";
        const forwarderParams = [
          fastMctpPayloadIx._params.amountIn,
          evmSwapRouterAddress,
          evmSwapRouterCalldata,
          quote.fastMctpInputContract,
          minMiddleAmount2,
          fastMctpPayloadIx._params.contractAddress,
          fastMctpPayloadIx.data
        ];
        const data = forwarder.interface.encodeFunctionData(
          forwarderMethod,
          forwarderParams
        );
        return {
          data,
          to: addresses_default.MAYAN_FORWARDER_CONTRACT,
          value: toBeHex4(fastMctpPayloadIx._params.amountIn),
          chainId: signerChainId,
          _forwarder: {
            method: forwarderMethod,
            params: forwarderParams
          }
        };
      } else {
        const forwarderMethod = "swapAndForwardERC20";
        const forwarderParams = [
          quote.fromToken.contract,
          fastMctpPayloadIx._params.amountIn,
          _permit,
          evmSwapRouterAddress,
          evmSwapRouterCalldata,
          quote.fastMctpInputContract,
          minMiddleAmount2,
          fastMctpPayloadIx._params.contractAddress,
          fastMctpPayloadIx.data
        ];
        const data = forwarder.interface.encodeFunctionData(
          forwarderMethod,
          forwarderParams
        );
        return {
          data,
          to: addresses_default.MAYAN_FORWARDER_CONTRACT,
          value: toBeHex4(0),
          chainId: signerChainId,
          _forwarder: {
            method: forwarderMethod,
            params: forwarderParams
          }
        };
      }
    }
  }
}

// src/evm/evmSwap.ts
function getEvmSwapParams(quote, destinationAddress, referrerAddress, signerAddress, signerChainId, payload) {
  const mayanProgram = new PublicKey8(addresses_default.MAYAN_PROGRAM_ID);
  const [mayanMainAccount] = PublicKey8.findProgramAddressSync(
    [Buffer.from("MAIN")],
    mayanProgram
  );
  const recipient = getAssociatedTokenAddress(
    new PublicKey8(quote.fromToken.mint),
    mayanMainAccount,
    true
  );
  const amountIn = BigInt(quote.effectiveAmountIn64);
  const recipientHex = nativeAddressToHexString(recipient.toString(), 1);
  const auctionHex = nativeAddressToHexString(addresses_default.AUCTION_PROGRAM_ID, 1);
  let referrerHex;
  if (referrerAddress) {
    referrerHex = nativeAddressToHexString(referrerAddress, 1);
  } else {
    referrerHex = nativeAddressToHexString(
      SystemProgram9.programId.toString(),
      1
    );
  }
  const signerWormholeChainId = getWormholeChainIdById(Number(signerChainId));
  const fromChainId = getWormholeChainIdByName(quote.fromChain);
  const destinationChainId = getWormholeChainIdByName(quote.toChain);
  if (fromChainId !== signerWormholeChainId) {
    throw new Error(
      `Signer chain id(${Number(
        signerChainId
      )}) and quote from chain are not same! ${fromChainId} !== ${signerWormholeChainId}`
    );
  }
  const contractAddress = quote.whMayanContract;
  const recipientStruct = {
    mayanAddr: recipientHex,
    mayanChainId: 1,
    destAddr: nativeAddressToHexString(destinationAddress, destinationChainId),
    destChainId: destinationChainId,
    auctionAddr: auctionHex,
    referrer: referrerHex,
    refundAddr: nativeAddressToHexString(signerAddress, signerWormholeChainId)
  };
  const unwrapRedeem = quote.toToken.contract === ZeroAddress7;
  const criteria = {
    transferDeadline: BigInt(quote.deadline64),
    swapDeadline: BigInt(quote.deadline64),
    amountOutMin: getAmountOfFractionalAmount(
      quote.minAmountOut,
      Math.min(8, quote.toToken.decimals)
    ),
    gasDrop: getAmountOfFractionalAmount(
      quote.gasDrop,
      Math.min(8, getGasDecimal(quote.toChain))
    ),
    unwrap: unwrapRedeem,
    customPayload: payload ? `0x${Buffer.from(payload).toString("hex")}` : "0x"
  };
  const contractRelayerFees = {
    swapFee: getAmountOfFractionalAmount(
      quote.swapRelayerFee,
      Math.min(8, quote.fromToken.decimals)
    ),
    redeemFee: getAmountOfFractionalAmount(
      quote.redeemRelayerFee,
      Math.min(8, quote.toToken.decimals)
    ),
    refundFee: getAmountOfFractionalAmount(
      quote.refundRelayerFee,
      Math.min(8, quote.fromToken.decimals)
    )
  };
  const tokenOut = nativeAddressToHexString(
    quote.toToken.realOriginContractAddress,
    quote.toToken.realOriginChainId
  );
  const bridgeFee = getAmountOfFractionalAmount(quote.bridgeFee, 18);
  return {
    amountIn,
    tokenIn: quote.fromToken.contract,
    tokenOut,
    tokenOutWChainId: quote.toToken.realOriginChainId,
    criteria,
    recipient: recipientStruct,
    relayerFees: contractRelayerFees,
    contractAddress,
    bridgeFee
  };
}
function getSwapFromEvmTxPayload(quote, swapperAddress, destinationAddress, referrerAddresses, signerAddress, signerChainId, payload, permit) {
  const signerWormholeChainId = getWormholeChainIdById(Number(signerChainId));
  const fromChainId = getWormholeChainIdByName(quote.fromChain);
  if (fromChainId !== signerWormholeChainId) {
    throw new Error(
      `Signer chain id(${Number(
        signerChainId
      )}) and quote from chain are not same! ${fromChainId} !== ${signerWormholeChainId}`
    );
  }
  const referrerAddress = getQuoteSuitableReferrerAddress(
    quote,
    referrerAddresses
  );
  if (quote.type === "MCTP") {
    return getMctpFromEvmTxPayload(
      quote,
      destinationAddress,
      referrerAddress,
      signerChainId,
      permit,
      payload
    );
  }
  if (quote.type === "SWIFT") {
    return getSwiftFromEvmTxPayload(
      quote,
      swapperAddress,
      destinationAddress,
      referrerAddress,
      signerChainId,
      permit
    );
  }
  if (quote.type === "SHUTTLE") {
    return getShuttleFromEvmTxPayload(
      quote,
      destinationAddress,
      signerChainId,
      permit
    );
  }
  if (quote.type === "FAST_MCTP") {
    return getFastMctpFromEvmTxPayload(
      quote,
      destinationAddress,
      referrerAddress,
      signerChainId,
      permit,
      payload
    );
  }
  if (quote.type != "WH") {
    throw new Error("Unsupported quote type");
  }
  if (!Number(quote.deadline64)) {
    throw new Error("WH mode requires a timeout");
  }
  const {
    relayerFees,
    recipient,
    tokenOut,
    tokenOutWChainId,
    criteria,
    tokenIn,
    amountIn,
    contractAddress,
    bridgeFee
  } = getEvmSwapParams(
    quote,
    destinationAddress,
    referrerAddress,
    signerAddress,
    signerChainId,
    payload
  );
  const forwarderContract = new Contract5(
    addresses_default.MAYAN_FORWARDER_CONTRACT,
    MayanForwarderArtifact_default.abi
  );
  const mayanSwap = new Contract5(contractAddress, MayanSwapArtifact_default.abi);
  let forwarderMethod;
  let forwarderParams;
  let value;
  const _permit = permit || ZeroPermit;
  if (tokenIn === ZeroAddress7) {
    const mayanCallData = mayanSwap.interface.encodeFunctionData(
      "wrapAndSwapETH",
      [relayerFees, recipient, tokenOut, tokenOutWChainId, criteria]
    );
    forwarderMethod = "forwardEth";
    forwarderParams = [contractAddress, mayanCallData];
    value = toBeHex5(amountIn);
  } else {
    const mayanCallData = mayanSwap.interface.encodeFunctionData("swap", [
      relayerFees,
      recipient,
      tokenOut,
      tokenOutWChainId,
      criteria,
      tokenIn,
      amountIn
    ]);
    forwarderMethod = "forwardERC20";
    forwarderParams = [
      tokenIn,
      amountIn,
      _permit,
      contractAddress,
      mayanCallData
    ];
    value = toBeHex5(bridgeFee);
  }
  const data = forwarderContract.interface.encodeFunctionData(
    forwarderMethod,
    forwarderParams
  );
  return {
    to: addresses_default.MAYAN_FORWARDER_CONTRACT,
    data,
    value,
    chainId: signerChainId,
    _forwarder: {
      method: forwarderMethod,
      params: forwarderParams
    }
  };
}
async function swapFromEvm(quote, swapperAddress, destinationAddress, referrerAddresses, signer, permit, overrides, payload) {
  if (!signer.provider) {
    throw new Error("No provider found for signer");
  }
  const signerAddress = await signer.getAddress();
  if (signerAddress.toLowerCase() !== swapperAddress.toLowerCase()) {
    throw new Error("Signer address does not match swapper address");
  }
  const signerChainId = Number((await signer.provider.getNetwork()).chainId);
  if (quote.type === "SWIFT" && quote.gasless) {
    const referrerAddress = getQuoteSuitableReferrerAddress(
      quote,
      referrerAddresses
    );
    const gasLessParams = getSwiftFromEvmGasLessParams(
      quote,
      swapperAddress,
      destinationAddress,
      referrerAddress,
      signerChainId,
      permit
    );
    const signedOrderHash = await signer.signTypedData(
      gasLessParams.orderTypedData.domain,
      gasLessParams.orderTypedData.types,
      gasLessParams.orderTypedData.value
    );
    await submitSwiftEvmSwap(gasLessParams, signedOrderHash);
    return gasLessParams.orderHash;
  }
  const transactionRequest = getSwapFromEvmTxPayload(
    quote,
    swapperAddress,
    destinationAddress,
    referrerAddresses,
    signerAddress,
    signerChainId,
    payload,
    permit
  );
  delete transactionRequest._forwarder;
  if (overrides?.gasPrice) {
    transactionRequest.gasPrice = overrides.gasPrice;
  }
  if (overrides?.maxFeePerGas) {
    transactionRequest.maxFeePerGas = overrides.maxFeePerGas;
  }
  if (overrides?.maxPriorityFeePerGas) {
    transactionRequest.maxPriorityFeePerGas = overrides.maxPriorityFeePerGas;
  }
  if (overrides?.gasLimit) {
    transactionRequest.gasLimit = overrides.gasLimit;
  } else {
    const estimatedGas = await signer.estimateGas(transactionRequest);
    transactionRequest.gasLimit = String(
      BigInt(String(estimatedGas)) * BigInt(110) / BigInt(100)
    );
  }
  transactionRequest.chainId = getEvmChainIdByName(quote.fromChain);
  return signer.sendTransaction(transactionRequest);
}
async function estimateQuoteRequiredGas(quote, swapperAddress, signer, permit, payload) {
  const signerAddress = await signer.getAddress();
  const sampleDestinationAddress = quote.toChain === "solana" ? "ENsytooJVSZyNHbxvueUeX8Am8gcNqPivVVE8USCBiy5" : "0x1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a";
  const signerChainId = Number((await signer.provider.getNetwork()).chainId);
  if (quote.type === "SWIFT" && quote.gasless) {
    return BigInt(0);
  }
  const transactionRequest = getSwapFromEvmTxPayload(
    quote,
    swapperAddress,
    sampleDestinationAddress,
    null,
    signerAddress,
    signerChainId,
    payload,
    permit
  );
  delete transactionRequest._forwarder;
  let baseGas = await signer.estimateGas(transactionRequest);
  baseGas = BigInt(String(baseGas));
  if (quote.type === "MCTP" || quote.type === "SWIFT") {
    return baseGas * BigInt(110) / BigInt(100);
  }
  return baseGas;
}
async function estimateQuoteRequiredGasAprox(quote, provider, permit, payload) {
  const signerAddress = "0x1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a";
  const sampleDestinationAddress = quote.toChain === "solana" ? "ENsytooJVSZyNHbxvueUeX8Am8gcNqPivVVE8USCBiy5" : "0x1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a";
  const signerChainId = quote?.fromToken?.chainId;
  if (quote.type === "SWIFT" && quote.gasless) {
    return BigInt(0);
  }
  const transactionRequest = getSwapFromEvmTxPayload(
    quote,
    signerAddress,
    sampleDestinationAddress,
    null,
    signerAddress,
    signerChainId,
    payload,
    permit
  );
  delete transactionRequest._forwarder;
  return provider.estimateGas(transactionRequest);
}
export {
  FAST_MCTP_PAYLOAD_TYPE_CUSTOM_PAYLOAD,
  FAST_MCTP_PAYLOAD_TYPE_DEFAULT,
  FAST_MCTP_PAYLOAD_TYPE_ORDER,
  MCTP_INIT_ORDER_PAYLOAD_ID,
  MCTP_PAYLOAD_TYPE_CUSTOM_PAYLOAD,
  MCTP_PAYLOAD_TYPE_DEFAULT,
  ZeroPermit,
  addresses_default as addresses,
  broadcastJitoBundleId,
  checkSdkVersionSupport,
  confirmJitoBundleId,
  createApproveInstruction,
  createAssociatedTokenAccountInstruction,
  createCloseAccountInstruction,
  createInitializeRandomTokenAccountInstructions,
  createMctpFromSolanaInstructions,
  createSplTransferInstruction,
  createSwapFromSolanaInstructions,
  createSwiftFromSolanaInstructions,
  createSwiftOrderHash,
  createSyncNativeInstruction,
  createTransferAllAndCloseInstruction,
  decentralizeClientSwapInstructions,
  decideRelayer,
  deserializeInstructionInfo,
  estimateQuoteRequiredGas,
  estimateQuoteRequiredGasAprox,
  fetchAllTokenList,
  fetchQuote,
  fetchTokenList,
  generateFetchQuoteUrl,
  getAddressLookupTableAccounts,
  getAmountOfFractionalAmount,
  getAnchorInstructionData,
  getAssociatedTokenAddress,
  getCurrentChainTime,
  getDisplayAmount,
  getEvmChainIdByName,
  getGasDecimal,
  getGasDecimalsInSolana,
  getJitoTipTransfer,
  getMctpFromEvmTxPayload,
  getQuoteSuitableReferrerAddress,
  getSafeU64Blob,
  getSdkVersion,
  getSuggestedRelayer,
  getSwapFromEvmTxPayload,
  getSwapSolana,
  getWormholeChainIdById,
  getWormholeChainIdByName,
  hexToUint8Array,
  isValidAptosType,
  nativeAddressToHexString,
  sendJitoBundle,
  solMint,
  submitSwiftEvmSwap,
  submitSwiftSolanaSwap,
  submitTransactionWithRetry,
  swapFromEvm,
  swapFromSolana,
  unwrapSol,
  validateJupSwap,
  wait,
  wrapSol
};
