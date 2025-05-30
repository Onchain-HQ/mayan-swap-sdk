import { Transaction, VersionedTransaction, CompileV0Args, TransactionInstruction, Keypair, Connection, SendOptions, PublicKey, AddressLookupTableAccount } from '@solana/web3.js';
import { TransactionRequest, Signer, Overrides, TransactionResponse, ethers } from 'ethers';

type ChainName = 'solana' | 'ethereum' | 'bsc' | 'polygon' | 'avalanche' | 'arbitrum' | 'optimism' | 'base' | 'aptos' | 'sui' | 'unichain' | 'linea';
type TokenStandard = 'native' | 'erc20' | 'spl' | 'spl2022' | 'suicoin';
type Token = {
    name: string;
    symbol: string;
    mint: string;
    contract: string;
    chainId: number;
    wChainId?: number;
    decimals: number;
    logoURI: string;
    coingeckoId: string;
    realOriginChainId?: number;
    realOriginContractAddress?: string;
    supportsPermit: boolean;
    verified: boolean;
    standard: TokenStandard;
    verifiedAddress: string;
};
type QuoteParams = {
    /**
     * @deprecated to avoid precision issues, use {@link amountIn64} instead
     */
    amount?: number;
    amountIn64?: string;
    fromToken: string;
    fromChain: ChainName;
    toToken: string;
    toChain: ChainName;
    /**
     * @deprecated Use the new property {@link slippageBps} instead
     */
    slippage?: number;
    /**
     * Slippage in basis points.
     * One basis point (bps) = 0.01%.
     *
     * - A value of `50` means a slippage of 0.5%.
     * - A value of `100` means a slippage of 1%.
     * - If set to `'auto'`, the system will automatically determine slippage.
     *
     * @example
     * slippageBps: 50 // 0.5% slippage
     */
    slippageBps: 'auto' | number;
    gasDrop?: number;
    referrer?: string;
    referrerBps?: number;
};
type QuoteError = {
    message: string;
    code: number;
    data: any;
};
type Quote = {
    type: 'WH' | 'SWIFT' | 'MCTP' | 'SHUTTLE' | 'FAST_MCTP';
    /**
     * @deprecated Use the new property `slippageBps` instead
     */
    effectiveAmountIn: number;
    effectiveAmountIn64: string;
    expectedAmountOut: number;
    priceImpact: number;
    minAmountOut: number;
    minReceived: number;
    gasDrop: number;
    price: number;
    swapRelayerFee: number;
    redeemRelayerFee: number;
    refundRelayerFee: number;
    solanaRelayerFee: number;
    refundRelayerFee64: string;
    cancelRelayerFee64: string;
    submitRelayerFee64: string;
    solanaRelayerFee64: string;
    clientRelayerFeeSuccess: number | null;
    clientRelayerFeeRefund: number | null;
    eta: number;
    etaSeconds: number;
    clientEta: string;
    fromToken: Token;
    toToken: Token;
    fromChain: ChainName;
    toChain: ChainName;
    slippageBps: number;
    priceStat: {
        ratio: number;
        status: 'GOOD' | 'NORMAL' | 'BAD';
    };
    mintDecimals: {
        from: number;
        to: number;
    };
    bridgeFee: number;
    suggestedPriorityFee: number;
    meta: {
        icon: string;
        title: string;
        advertisedTitle: string;
        advertisedDescription: string;
        switchText: string;
    };
    onlyBridging: boolean;
    deadline64: string;
    referrerBps?: number;
    protocolBps?: number;
    whMayanContract: string;
    cheaperChain: ChainName;
    mctpInputContract: string;
    mctpOutputContract: string;
    hasAuction: boolean;
    minMiddleAmount?: number;
    evmSwapRouterAddress?: string;
    evmSwapRouterCalldata?: string;
    mctpMayanContract?: string;
    swiftMayanContract?: string;
    shuttleContract?: string;
    swiftAuctionMode?: number;
    swiftInputContract: string;
    swiftInputDecimals: number;
    gasless: boolean;
    relayer: string;
    sendTransactionCost: number;
    maxUserGasDrop: number;
    rentCost?: bigint;
    shuttleParams: {
        maxLLFee: string;
        maxRelayingFee: string;
        fastTransferDeadline: number;
        hasDestSwap: boolean;
        path: string;
    };
    shuttleInputContract: string;
    shuttleInputDecimals: number;
    mctpVerifiedInputAddress: string;
    mctpInputTreasury: string;
    circleMaxFee64: string;
    fastMctpMayanContract: string;
    fastMctpInputContract: string;
    fastMctpMinFinality: number;
};
type QuoteOptions = {
    wormhole?: boolean;
    swift?: boolean;
    mctp?: boolean;
    shuttle?: boolean;
    fastMctp?: boolean;
    gasless?: boolean;
    onlyDirect?: boolean;
};
type SolanaTransactionSigner = {
    (trx: Transaction): Promise<Transaction>;
    (trx: VersionedTransaction): Promise<VersionedTransaction>;
};
type Erc20Permit = {
    value: bigint;
    deadline: number;
    v: number;
    r: string;
    s: string;
};
type BaseGetSolanaSwapParams = {
    amountIn64: string;
    fromToken: string;
    minMiddleAmount: number;
    middleToken: string;
    userWallet: string;
    slippageBps: number;
    referrerAddress?: string;
    fillMaxAccounts?: boolean;
    tpmTokenAccount?: string;
};
type MctpGetSolanaSwapParams = BaseGetSolanaSwapParams & {
    userLedger: string;
    depositMode: 'WITH_FEE' | 'LOCK_FEE' | 'SWAP';
};
type SwiftGetSolanaSwapParams = BaseGetSolanaSwapParams & {
    orderHash: string;
    depositMode: 'SWIFT' | 'SWIFT_GASLESS';
};
type GetSolanaSwapParams = MctpGetSolanaSwapParams | SwiftGetSolanaSwapParams;
type SolanaKeyInfo = {
    pubkey: string;
    isWritable: boolean;
    isSigner: boolean;
};
type InstructionInfo = {
    accounts: SolanaKeyInfo[];
    data: string;
    programId: string;
};
type SolanaClientSwap = {
    computeBudgetInstructions?: InstructionInfo[];
    setupInstructions?: InstructionInfo[];
    swapInstruction: InstructionInfo;
    cleanupInstruction: InstructionInfo;
    addressLookupTableAddresses: string[];
    maxAccountsFilled: boolean;
};
type SuiFunctionNestedResult = {
    $kind: 'NestedResult';
    NestedResult: [number, number];
};
type ReferrerAddresses = {
    solana?: string | null;
    evm?: string | null;
    sui?: string | null;
};
type SwiftEvmOrderTypedData = {
    domain: {
        name: 'Mayan Swift';
        chainId: number;
        verifyingContract: string;
    };
    types: {
        CreateOrder: [
            {
                name: 'OrderId';
                type: 'bytes32';
            },
            {
                name: 'InputAmount';
                type: 'uint256';
            },
            {
                name: 'SubmissionFee';
                type: 'uint256';
            }
        ];
    };
    value: {
        OrderId: string;
        InputAmount: bigint;
        SubmissionFee: bigint;
    };
};
type EvmForwarderParams = {
    method: string;
    params: any[];
};
type JitoBundleOptions = {
    tipLamports: number;
    signAllTransactions: <T extends Transaction | VersionedTransaction>(transactions: T[]) => Promise<T[]>;
    jitoAccount?: string;
    jitoSendUrl?: string;
    separateSwapTx?: boolean;
};
type SwapMessageV0Params = {
    messageV0: Omit<CompileV0Args, 'recentBlockhash'>;
    createTmpTokenAccountIxs: TransactionInstruction[];
    tmpTokenAccount: Keypair;
};

type SwiftEvmGasLessParams = {
    permitParams: Erc20Permit;
    orderHash: string;
    orderParams: {
        trader: string;
        sourceChainId: number;
        tokenIn: string;
        amountIn: bigint;
        destAddr: string;
        destChainId: number;
        tokenOut: string;
        minAmountOut: bigint;
        gasDrop: bigint;
        cancelFee: bigint;
        refundFee: bigint;
        deadline: bigint;
        referrerAddr: string;
        referrerBps: number;
        auctionMode: number;
        random: string;
        submissionFee: bigint;
    };
    orderTypedData: SwiftEvmOrderTypedData;
};

declare function fetchAllTokenList(tokenStandards?: TokenStandard[]): Promise<{
    [index: string]: Token[];
}>;
declare function fetchTokenList(chain: ChainName, nonPortal?: boolean, tokenStandards?: TokenStandard[]): Promise<Token[]>;
declare function generateFetchQuoteUrl(params: QuoteParams, quoteOptions?: QuoteOptions): string;
declare function fetchQuote(params: QuoteParams, quoteOptions?: QuoteOptions): Promise<Quote[]>;
declare function getCurrentChainTime(chain: ChainName): Promise<number>;
declare function getSuggestedRelayer(): Promise<string>;
declare function getSwapSolana(params: GetSolanaSwapParams): Promise<SolanaClientSwap>;
declare function submitSwiftEvmSwap(params: SwiftEvmGasLessParams, signature: string): Promise<void>;
declare function submitSwiftSolanaSwap(signedTx: string): Promise<{
    orderHash: string;
}>;

type ContractRelayerFees = {
    swapFee: bigint;
    redeemFee: bigint;
    refundFee: bigint;
};
type Criteria = {
    transferDeadline: bigint;
    swapDeadline: bigint;
    amountOutMin: bigint;
    gasDrop: bigint;
    unwrap: boolean;
    customPayload: string;
};
type Recipient = {
    mayanAddr: string;
    auctionAddr: string;
    referrer: string;
    destAddr: string;
    mayanChainId: number;
    destChainId: number;
    refundAddr: string;
};
type EvmSwapParams = {
    contractAddress: string;
    relayerFees: ContractRelayerFees;
    recipient: Recipient;
    tokenOut: string;
    tokenOutWChainId: number;
    criteria: Criteria;
    tokenIn: string;
    amountIn: bigint;
    bridgeFee: bigint;
};
declare function getSwapFromEvmTxPayload(quote: Quote, swapperAddress: string, destinationAddress: string, referrerAddresses: ReferrerAddresses | null | undefined, signerAddress: string, signerChainId: number | string, payload: Uint8Array | Buffer | null | undefined, permit: Erc20Permit | null | undefined): TransactionRequest & {
    _forwarder: EvmForwarderParams;
};
declare function swapFromEvm(quote: Quote, swapperAddress: string, destinationAddress: string, referrerAddresses: ReferrerAddresses | null | undefined, signer: Signer, permit: Erc20Permit | null | undefined, overrides: Overrides | null | undefined, payload: Uint8Array | Buffer | null | undefined): Promise<TransactionResponse | string>;
declare function estimateQuoteRequiredGas(quote: Quote, swapperAddress: string, signer: Signer, permit: Erc20Permit | null | undefined, payload: Uint8Array | Buffer | null | undefined): Promise<bigint>;
declare function estimateQuoteRequiredGasAprox(quote: Quote, provider: ethers.JsonRpcProvider, permit: Erc20Permit | null | undefined, payload: Uint8Array | Buffer | null | undefined): Promise<bigint>;

declare function getMctpFromEvmTxPayload(quote: Quote, destinationAddress: string, referrerAddress: string | null | undefined, signerChainId: number | string, permit: Erc20Permit | null, payload: Uint8Array | Buffer | null | undefined): TransactionRequest & {
    _forwarder: EvmForwarderParams;
};

declare function submitTransactionWithRetry({ trx, connection, errorChance, extraRpcs, options, rate, }: {
    trx: Uint8Array;
    connection: Connection;
    errorChance: number;
    extraRpcs: string[];
    options?: SendOptions;
    rate?: number;
}): Promise<{
    signature: string;
    serializedTrx: Uint8Array;
}>;
declare function createAssociatedTokenAccountInstruction(payer: PublicKey, associatedToken: PublicKey, owner: PublicKey, mint: PublicKey, programId?: PublicKey, associatedTokenProgramId?: PublicKey): TransactionInstruction;
declare function createInitializeRandomTokenAccountInstructions(connection: Connection, payer: PublicKey, mint: PublicKey, owner: PublicKey, keyPair: Keypair, programId?: PublicKey): Promise<TransactionInstruction[]>;
declare function createApproveInstruction(account: PublicKey, delegate: PublicKey, owner: PublicKey, amount: bigint, programId?: PublicKey): TransactionInstruction;
declare function createSyncNativeInstruction(account: PublicKey): TransactionInstruction;
declare function createCloseAccountInstruction(account: PublicKey, destination: PublicKey, owner: PublicKey, programId?: PublicKey): TransactionInstruction;
declare function createSplTransferInstruction(source: PublicKey, destination: PublicKey, owner: PublicKey, amount: bigint, programId?: PublicKey): TransactionInstruction;
declare const solMint: PublicKey;
declare function wrapSol(owner: PublicKey, amount: number, signTransaction: SolanaTransactionSigner, connection?: Connection): Promise<{
    signature: string;
    serializedTrx: Uint8Array;
}>;
declare function unwrapSol(owner: PublicKey, amount: number, signTransaction: SolanaTransactionSigner, connection?: Connection): Promise<{
    signature: string;
    serializedTrx: Uint8Array;
}>;
declare function deserializeInstructionInfo(instruction: InstructionInfo): TransactionInstruction;
declare function getAddressLookupTableAccounts(keys: string[], connection: Connection): Promise<AddressLookupTableAccount[]>;
type SolanaClientSwapInstructions = {
    swapInstruction: TransactionInstruction;
    cleanupInstruction: TransactionInstruction;
    computeBudgetInstructions: TransactionInstruction[];
    setupInstructions: TransactionInstruction[];
    addressLookupTableAddresses: string[];
};
declare function decentralizeClientSwapInstructions(params: SolanaClientSwap, connection: Connection): SolanaClientSwapInstructions;
declare function getAnchorInstructionData(name: string): Buffer;
declare function decideRelayer(): Promise<PublicKey>;
declare function getJitoTipTransfer(swapper: string, blockhash: string, lastValidBlockHeight: number, options: JitoBundleOptions): Transaction;
declare function sendJitoBundle(singedTrxs: Array<Transaction | VersionedTransaction>, options: JitoBundleOptions, forceToBeSubmitted?: boolean): Promise<any>;
declare function confirmJitoBundleId(bundleId: string, options: JitoBundleOptions, lastValidBlockHeight: number, mayanTxSignature: string, connection: Connection): Promise<void>;
declare function broadcastJitoBundleId(bundleId: string): Promise<void>;
declare function validateJupSwap(swap: SolanaClientSwapInstructions, validDestAccount: PublicKey, validWrapOwner?: PublicKey): void;
declare function createTransferAllAndCloseInstruction(owner: PublicKey, mint: PublicKey, tokenAccount: PublicKey, transferDestination: PublicKey, closeDestination: PublicKey, tokenProgramId?: PublicKey): TransactionInstruction;

declare function createSwapFromSolanaInstructions(quote: Quote, swapperWalletAddress: string, destinationAddress: string, referrerAddresses: ReferrerAddresses | null | undefined, connection?: Connection, options?: {
    allowSwapperOffCurve?: boolean;
    forceSkipCctpInstructions?: boolean;
    separateSwapTx?: boolean;
}): Promise<{
    instructions: Array<TransactionInstruction>;
    signers: Array<Keypair>;
    lookupTables: Array<AddressLookupTableAccount>;
    swapMessageV0Params: SwapMessageV0Params | null;
}>;
declare function swapFromSolana(quote: Quote, swapperWalletAddress: string, destinationAddress: string, referrerAddresses: ReferrerAddresses | null | undefined, signTransaction: SolanaTransactionSigner, connection?: Connection, extraRpcs?: string[], sendOptions?: SendOptions, jitoOptions?: JitoBundleOptions, instructionOptions?: {
    allowSwapperOffCurve?: boolean;
    forceSkipCctpInstructions?: boolean;
}): Promise<{
    signature: string;
    serializedTrx: Uint8Array | null;
}>;

declare function createMctpFromSolanaInstructions(quote: Quote, swapperAddress: string, destinationAddress: string, referrerAddress: string | null | undefined, connection: Connection, options?: {
    allowSwapperOffCurve?: boolean;
    forceSkipCctpInstructions?: boolean;
    separateSwapTx?: boolean;
}): Promise<{
    instructions: TransactionInstruction[];
    signers: Keypair[];
    lookupTables: AddressLookupTableAccount[];
    swapMessageV0Params: SwapMessageV0Params | null;
}>;

declare function createSwiftOrderHash(quote: Quote, swapperAddress: string, destinationAddress: string, referrerAddress: string | null | undefined, randomKeyHex: string): Buffer;
declare function createSwiftFromSolanaInstructions(quote: Quote, swapperAddress: string, destinationAddress: string, referrerAddress: string | null | undefined, connection: Connection, options?: {
    allowSwapperOffCurve?: boolean;
    separateSwapTx?: boolean;
}): Promise<{
    instructions: TransactionInstruction[];
    signers: Keypair[];
    lookupTables: AddressLookupTableAccount[];
    swapMessageV0Params: SwapMessageV0Params | null;
}>;

declare const isValidAptosType: (str: string) => boolean;
declare function nativeAddressToHexString(address: string, wChainId: number): string;
declare function hexToUint8Array(input: string): Uint8Array;
declare function getAssociatedTokenAddress(mint: PublicKey, owner: PublicKey, allowOwnerOffCurve?: boolean, programId?: PublicKey, associatedTokenProgramId?: PublicKey): PublicKey;
declare function getAmountOfFractionalAmount(amount: string | number, decimals: string | number): bigint;
declare function getDisplayAmount(inputAmount: ethers.BigNumberish, decimals: string | ethers.BigNumberish): number;
declare function getWormholeChainIdByName(chain: string): number | null;
declare function getEvmChainIdByName(chain: ChainName): number;
declare function getWormholeChainIdById(chainId: number): number | null;
declare function getSdkVersion(): string;
declare function checkSdkVersionSupport(minimumVersion: [number, number, number]): boolean;
declare function getGasDecimal(chain: ChainName): number;
declare function getGasDecimalsInSolana(chain: ChainName): number;
declare function getSafeU64Blob(value: bigint): Buffer;
declare const ZeroPermit: Erc20Permit;
declare function wait(time: number): Promise<void>;
declare function getQuoteSuitableReferrerAddress(quote: Quote, referrerAddresses?: ReferrerAddresses): string | null;
declare const MCTP_PAYLOAD_TYPE_DEFAULT = 1;
declare const MCTP_PAYLOAD_TYPE_CUSTOM_PAYLOAD = 2;
declare const MCTP_INIT_ORDER_PAYLOAD_ID = 1;
declare const FAST_MCTP_PAYLOAD_TYPE_DEFAULT = 1;
declare const FAST_MCTP_PAYLOAD_TYPE_CUSTOM_PAYLOAD = 2;
declare const FAST_MCTP_PAYLOAD_TYPE_ORDER = 3;

declare const _default: {
    MAYAN_FORWARDER_CONTRACT: string;
    MAYAN_PROGRAM_ID: string;
    AUCTION_PROGRAM_ID: string;
    MCTP_PROGRAM_ID: string;
    SWIFT_PROGRAM_ID: string;
    FEE_MANAGER_PROGRAM_ID: string;
    WORMHOLE_PROGRAM_ID: string;
    CCTP_CORE_PROGRAM_ID: string;
    CCTP_TOKEN_PROGRAM_ID: string;
    TOKEN_PROGRAM_ID: string;
    TOKEN_2022_PROGRAM_ID: string;
    ASSOCIATED_TOKEN_PROGRAM_ID: string;
    SPL_UTILS_PROGRAM_ID: string;
    LOOKUP_TABLE: string;
    SUI_MCTP_STATE: string;
    SUI_MCTP_FEE_MANAGER_STATE: string;
    SUI_CCTP_CORE_PACKAGE_ID: string;
    SUI_CCTP_CORE_STATE: string;
    SUI_CCTP_TOKEN_PACKAGE_ID: string;
    SUI_CCTP_TOKEN_STATE: string;
    SUI_WORMHOLE_PACKAGE_ID: string;
    SUI_WORMHOLE_STATE: string;
    SUI_LOGGER_PACKAGE_ID: string;
    EXPLORER_URL: string;
    PRICE_URL: string;
    RELAYER_URL: string;
};

export { ChainName, ContractRelayerFees, Criteria, Erc20Permit, EvmForwarderParams, EvmSwapParams, FAST_MCTP_PAYLOAD_TYPE_CUSTOM_PAYLOAD, FAST_MCTP_PAYLOAD_TYPE_DEFAULT, FAST_MCTP_PAYLOAD_TYPE_ORDER, GetSolanaSwapParams, InstructionInfo, JitoBundleOptions, MCTP_INIT_ORDER_PAYLOAD_ID, MCTP_PAYLOAD_TYPE_CUSTOM_PAYLOAD, MCTP_PAYLOAD_TYPE_DEFAULT, Quote, QuoteError, QuoteOptions, QuoteParams, Recipient, ReferrerAddresses, SolanaClientSwap, SolanaKeyInfo, SolanaTransactionSigner, SuiFunctionNestedResult, SwapMessageV0Params, SwiftEvmOrderTypedData, Token, TokenStandard, ZeroPermit, _default as addresses, broadcastJitoBundleId, checkSdkVersionSupport, confirmJitoBundleId, createApproveInstruction, createAssociatedTokenAccountInstruction, createCloseAccountInstruction, createInitializeRandomTokenAccountInstructions, createMctpFromSolanaInstructions, createSplTransferInstruction, createSwapFromSolanaInstructions, createSwiftFromSolanaInstructions, createSwiftOrderHash, createSyncNativeInstruction, createTransferAllAndCloseInstruction, decentralizeClientSwapInstructions, decideRelayer, deserializeInstructionInfo, estimateQuoteRequiredGas, estimateQuoteRequiredGasAprox, fetchAllTokenList, fetchQuote, fetchTokenList, generateFetchQuoteUrl, getAddressLookupTableAccounts, getAmountOfFractionalAmount, getAnchorInstructionData, getAssociatedTokenAddress, getCurrentChainTime, getDisplayAmount, getEvmChainIdByName, getGasDecimal, getGasDecimalsInSolana, getJitoTipTransfer, getMctpFromEvmTxPayload, getQuoteSuitableReferrerAddress, getSafeU64Blob, getSdkVersion, getSuggestedRelayer, getSwapFromEvmTxPayload, getSwapSolana, getWormholeChainIdById, getWormholeChainIdByName, hexToUint8Array, isValidAptosType, nativeAddressToHexString, sendJitoBundle, solMint, submitSwiftEvmSwap, submitSwiftSolanaSwap, submitTransactionWithRetry, swapFromEvm, swapFromSolana, unwrapSol, validateJupSwap, wait, wrapSol };
