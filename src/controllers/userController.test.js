const userController = require('./userController');
const { userModel } = require('../models/userModel');

// Mock dependencies
jest.mock('../models/userModel');

jest.mock('../services/authorizationService', () => ({
    hashPassword: jest.fn().mockResolvedValue('Hashed_Password_123!') 
}));

describe('User Controller - Create User', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        mockReq = {
            body: {
                name: 'User',
                email: 'user@test.com',
                password: ''
            }
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn()
        };
    });

    it('reject a user with a weak password (no uppercase)', async () => {
        mockReq.body.password = 'weakpassword1!'; // Missing uppercase
        
        await userController.createUser(mockReq, mockRes);
        
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith(expect.stringContaining('Missing parameters'));
    });

    it('reject a user with a weak password (no digits)', async () => {
        mockReq.body.password = 'WeakPassword!'; // Missing digit
        
        await userController.createUser(mockReq, mockRes);
        
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith(expect.stringContaining('Missing parameters'));
    });

    it('reject a user with a weak password (no special chars)', async () => {
        mockReq.body.password = 'WeakPassword123'; // Missing special char
        
        await userController.createUser(mockReq, mockRes);
        
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith(expect.stringContaining('Missing parameters'));
    });

    it('pass a user with a strong password', async () => {
        mockReq.body.password = 'StrongPass_123!';
        
        // Mock userModel.save()
        const mockSave = jest.fn().mockResolvedValue(mockReq.body);
        userModel.mockImplementation(() => ({
            save: mockSave,
            ...mockReq.body
        }));

        await userController.createUser(mockReq, mockRes);

        expect(mockSave).toHaveBeenCalledTimes(1);
        await new Promise(process.nextTick); 
        expect(mockRes.json).toHaveBeenCalled();
    });
});