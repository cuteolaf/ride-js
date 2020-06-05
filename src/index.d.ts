export interface ICompilationResult {
    result: {
        ast: object
        base64: string
        bytes: Uint8Array
        size: number
        complexity: number
        verifierComplexity?: number
        callableComplexity?: Record<string, number>
        userFunctionsComplexity?: Record<string, number>
    }
}

export interface ICompilationError {
    error: string
}

export interface IDecompilationResult {
    result: string
}

export interface IDecompilationError {
    error: any
}

export type TType = TList | TStruct | TUnion | TPrimitive

export type TPrimitive = string;

export type TStructField = { name: string, type: TType };

export type TStruct = {
    typeName: string
    fields: TStructField[]
};

export type TList = {
    "listOf": TType
};

export type TUnionItem = TStruct | TPrimitive | TList
export type TUnion = TUnionItem[]

export type TFunction = {
    name: string
    doc: string
    resultType: TType
    args: TFunctionArgument[]
};

export type TFunctionArgument = {
    name: string
    type: TType
    doc: string
};

export interface IVarDoc {
    name: string
    type: any
    doc: string
}

export interface IScriptInfo {
    stdLibVersion: number,
    contentType: number,
    scriptType: number
    imports: string[]
}

export interface IFlattenedCompilationResult {
    ast?: object
    base64?: string
    bytes?: Uint8Array
    size?: number
    complexity?: number
    verifierComplexity?: number
    callableComplexities?: Record<string, number>
    userFunctionComplexities?: Record<string, number>
    error?: string
}

export function compile(code: string, estimatorVersion?: number): ICompilationResult | ICompilationError;

export function flattenCompilationResult(compiled: ICompilationResult | ICompilationError): IFlattenedCompilationResult

export function scriptInfo(code: string): IScriptInfo | ICompilationError;

export function getTypes(stdlibVersion?: number, isTokenContext?: boolean): TStructField[];

export function getVarsDoc(stdlibVersion?: number, isTokenContext?: boolean): IVarDoc[];

export function getFunctionsDoc(stdlibVersion?: number, isTokenContext?: boolean): TFunction[];

export function decompile(compiledCode: string): IDecompilationResult | IDecompilationError;

export interface IReplOptions {
    nodeUrl: string
    chainId: string
    address: string
}

export function repl(opts?: IReplOptions): {
    reconfigure: (opts: IReplOptions) => ReturnType<typeof repl>
    evaluate: (expr: string) => Promise<IDecompilationResult | IDecompilationError>,
    clear: () => void,
    test: (str: string) => Promise<string>,
    info: (s: string) => string,
    totalInfo: () => string,
};

export const version: string;
export const contractLimits: {
    MaxComplexityByVersion: (v: number) => number,
    MaxExprSizeInBytes: number,
    MaxContractSizeInBytes: number,
    MaxContractInvocationArgs: number,
    MaxAccountVerifierComplexityByVersion: number
    MaxContractInvocationSizeInBytes: number,
    MaxWriteSetSizeInBytes: number,
    MaxPaymentAmount: number
};

