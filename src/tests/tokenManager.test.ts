import { check, property, string, dictionary, anything } from 'fast-check';
import { TokenManager } from '../tokenManager';

describe('The token manager', () => {
	const tokenManager = new TokenManager('mySuperSecretKey');

	test('a generated token contains the original payload when verified', () => {
		check(
			property(dictionary(string(), anything()), (payload) => {
				const token = tokenManager.generateToken(payload);
				const decodedPayload = tokenManager.decodeToken(token);
				expect(decodedPayload).toEqual(payload);
			})
		);
	});

	test('a token verified with an incorrect key results in an error', () => {
		const tokenManagerIncorrectKey = new TokenManager('incorrectKey');
		check(
			property(dictionary(string(), anything()), (payload) => {
				const token = tokenManager.generateToken(payload);
				expect(() => tokenManagerIncorrectKey.decodeToken(token)).toThrowError();
			})
		);
	});

	test('a manipulated token results in an error when verified', () => {
		check(
			property(dictionary(string(), anything()), string(), (payload, extraData) => {
				const token = tokenManager.generateToken(payload);
				const manipulatedToken = token + extraData;
				expect(() => tokenManager.decodeToken(manipulatedToken)).toThrowError();
			})
		);
	});
});
