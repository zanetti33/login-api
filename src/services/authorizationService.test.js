// we need to mock fs.readFileSync, it complains about missing .pem files
jest.mock('fs', () => ({
    readFileSync: jest.fn((filePath) => {
        if (filePath === './private.pem') {
            return 'fake_private_key';
        }
        if (filePath === './public.pem') {
            return 'fake_public_key';
        }
        return 'generic_file';
    })
}));

const { hashPassword, validatePassword } = require('./authorizationService');

describe('Authorization Service - Passwords', () => {
    
    it('hash a password and successfully validate the correct one', async () => {
        const plainPassword = "MyStrongPassword123!";
        const hashedPassword = await hashPassword(plainPassword);
        const mockUser = { password: hashedPassword };

        const isMatch = await validatePassword(mockUser, plainPassword);
        expect(isMatch).toBe(true);
    });

    it('return false when validating an incorrect password', async () => {
        const plainPassword = "MyStrongPassword123!";
        const wrongPassword = "WrongPassword!";
        
        const hashedPassword = await hashPassword(plainPassword);
        const mockUser = { password: hashedPassword };

        const isMatch = await validatePassword(mockUser, wrongPassword);
        expect(isMatch).toBe(false);
    });
});