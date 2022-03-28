import * as data from "../../testData/data";
import {GenerateContractForBuiltInFunctions} from "../GenerateContractForBuiltInFunctions";

const compiler = require('../../../src');

describe('getBinary',  () => {

    const defaultGetBinary = `getBinary(callerTestData, "Ȣ瞱蛉㦎᠖꭛믳癚曉续")`;
    const invalidGetBinaryV3 = `getBinary(callerTestData)`;
    const invalidGetBinaryGreaterV3 = `getBinary(callerTestData)`;

    const precondition = new GenerateContractForBuiltInFunctions
    (defaultGetBinary, 'getBinary("LJKaSADfHH127gd")', 'ByteVector');

    test.each([
        [data.STDLIB_VERSION_3, data.RideV3Result, data.getRandomAddress()],
        [data.STDLIB_VERSION_4, data.GreaterV3ResultBinaryEntry, data.getRandomAddress()],
        [data.STDLIB_VERSION_5, data.GreaterV3ResultBinaryEntry, data.getRandomAddress()],
    ])('positive: get byte array by address', (version, scriptResult, address) => {
        let contract = precondition.generateContractFromMatchingAndCase(version, scriptResult, address);
        const compiled = compiler.compile(contract);
        expect(compiled.error).toBeUndefined();
    });

    test.each([
        [data.STDLIB_VERSION_3, data.RideV3Result, data.getRandomAlias()],
        [data.STDLIB_VERSION_4, data.GreaterV3ResultBinaryEntry, data.getRandomAlias()],
        [data.STDLIB_VERSION_5, data.GreaterV3ResultBinaryEntry, data.getRandomAlias()],
    ])('positive: get byte array by alias', (version, scriptResult, alias) => {
        let contract = precondition.generateContractFromMatchingAndCase(version, scriptResult, alias);
        const compiled = compiler.compile(contract);
        expect(compiled.error).toBeUndefined();
    });

    test.each([
        [data.STDLIB_VERSION_5, data.GreaterV3ResultBinaryEntry],
    ])('positive: getting a binary from your own data', (version, scriptResult) => {
        let contract = precondition.generateContractOwnData(version, scriptResult);
        const compiled = compiler.compile(contract);
        expect(compiled.error).toBeUndefined();
    });

    test.each([
        [data.STDLIB_VERSION_3, data.RideV3Result, ''],
        [data.STDLIB_VERSION_4, data.GreaterV3ResultBinaryEntry, ''],
        [data.STDLIB_VERSION_5, data.GreaterV3ResultBinaryEntry, ''],
    ])("negative: invalid address or alias", (version, scriptResult, addressOrAlias) => {
        let contract = precondition.generateContractFromMatchingAndCase(version, scriptResult, addressOrAlias);
        const compiled = compiler.compile(contract);
        expect(compiled.error).toContain(`Parsed.Failure`);
    });

    test.each([
        [data.STDLIB_VERSION_3, invalidGetBinaryV3, data.getRandomAddress(), `'getBinary'(Address)`],
        [data.STDLIB_VERSION_3, invalidGetBinaryV3, data.getRandomAlias(), `'getBinary'(Alias)`],
        [data.STDLIB_VERSION_4, invalidGetBinaryGreaterV3, data.getRandomAddress(), `'getBinary'(Address)`],
        [data.STDLIB_VERSION_5, invalidGetBinaryGreaterV3, data.getRandomAlias(), `'getBinary'(Alias)`],
    ])("negative: Can't find a function overload 'getBinary'(Address) or 'getBinary'(Alias)",
        (version, scriptResult, addressOrAlias, funcError) => {
        let contract = precondition.generateContractFromMatchingAndCase(version, scriptResult, addressOrAlias);
        const compiled = compiler.compile(contract);
        expect(compiled.error)
            .toContain(`Compilation failed: [Can't find a function overload ${funcError}`);
    });

    test.each([
        [data.STDLIB_VERSION_3, data.RideV3Result, data.getRandomAddress()],
        [data.STDLIB_VERSION_4, data.GreaterV3ResultBinaryEntry, data.getRandomAddress()],
    ])("negative: Can't find a function overload 'getBinary'(String)", (version, scriptResult) => {
        let contract = precondition.generateContractOwnData(version, scriptResult);
        const compiled = compiler.compile(contract);
        expect(compiled.error)
            .toContain(`Compilation failed: [Can't find a function overload 'getBinary'(String)`);
    });

});
