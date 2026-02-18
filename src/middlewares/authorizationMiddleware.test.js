//Mock to avoid reading actual files
jest.mock('fs', () => ({
    readFileSync: jest.fn(() => 'fake_key')
}));

const { authorize } = require('./authorizationMiddleware');
const authorizationService = require('../services/authorizationService');

// Mock the authorization service
jest.mock('../services/authorizationService');

describe('Authorization Middleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = { headers: {} };
        mockRes = {
            sendStatus: jest.fn()
        };
        mockNext = jest.fn();
    });

    test('check if authorization header is missing', () => {
        authorize(mockReq, mockRes, mockNext);
        expect(mockRes.sendStatus).toHaveBeenCalledWith(401);
        expect(mockNext).not.toHaveBeenCalled();
    });

    test('don\'t proceed if token is not provided in Bearer format', () => {
        mockReq.headers['authorization'] = 'Bearer '; // Empty token
        authorize(mockReq, mockRes, mockNext);
        expect(mockRes.sendStatus).toHaveBeenCalledWith(401);
    });

    test('don\'t authorize if the token is invalid', () => {
        mockReq.headers['authorization'] = 'Bearer invalid_token';
        authorizationService.validateToken.mockImplementation(() => {
            throw new Error('Invalid token');
        });

        authorize(mockReq, mockRes, mockNext);
        expect(mockRes.sendStatus).toHaveBeenCalledWith(403);
        expect(mockNext).not.toHaveBeenCalled();
    });

    test('populate req.userInfo and call next() if token is valid', () => {
        const mockUserInfo = { id: '123', name: 'TestUser', isAdmin: false };
        mockReq.headers['authorization'] = 'Bearer valid_token';
        authorizationService.validateToken.mockReturnValue(mockUserInfo);

        authorize(mockReq, mockRes, mockNext);
        
        expect(mockReq.userInfo).toEqual(mockUserInfo);
        expect(mockNext).toHaveBeenCalledTimes(1);
    });
});