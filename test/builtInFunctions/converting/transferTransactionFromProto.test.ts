import * as data from "../../testData/data";
import * as random from "../../testData/random";

import {GenerateContractForBuiltInFunctions} from "../GenerateContractForBuiltInFunctions";
import {checkCompileResult} from "../testResult";

describe('transferTransactionFromProto',  () => {

    const transferTransactionFromProto = `transferTransactionFromProto(callerTestData)`;
    const incorrectFunction = `transferTransactionFromProto()`

    const precondition =
        new GenerateContractForBuiltInFunctions
        (transferTransactionFromProto, incorrectFunction, 'TransferTransaction');

    test.each([
        /* TODO    https://jira.wavesplatform.com/browse/NODE-2484      */
        [data.STDLIB_VERSION_4, transferTransactionFromProto, random.getRandomByteVector(), data.POSITIVE_TEST],
        [data.STDLIB_VERSION_5, transferTransactionFromProto, random.getRandomByteVector(), data.POSITIVE_TEST],
        [data.STDLIB_VERSION_6, transferTransactionFromProto, random.getRandomByteVector(), data.POSITIVE_TEST],
        // invalid arg by transferTransactionFromProto
        [data.STDLIB_VERSION_4, transferTransactionFromProto, random.getRandomAlias(), data.NEGATIVE_TEST],
        [data.STDLIB_VERSION_5, transferTransactionFromProto, random.getRandomInt(), data.NEGATIVE_TEST],
        [data.STDLIB_VERSION_6, transferTransactionFromProto, random.getRandomUnion(), data.NEGATIVE_TEST],
        // invalid function
        [data.STDLIB_VERSION_4, incorrectFunction, random.getRandomByteVector(), data.NEGATIVE_TEST],
        [data.STDLIB_VERSION_5, incorrectFunction, random.getRandomByteVector(), data.NEGATIVE_TEST],
        [data.STDLIB_VERSION_6, incorrectFunction, random.getRandomByteVector(), data.NEGATIVE_TEST],
        // Can't find a function for v3
        [data.STDLIB_VERSION_3, transferTransactionFromProto, random.getRandomByteVector(), data.NEGATIVE_TEST],
    ])('check ride v%i function %s compiles or failed', (version, testFunction, byteVector, testType) => {
        const contract = precondition.generateOnlyMatcherContract(version, byteVector, testFunction);
        checkCompileResult(contract, testType);
    });
})
