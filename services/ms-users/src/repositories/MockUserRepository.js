const UserRepository = require('./UserRepository');

class MockUserRepository extends UserRepository {
    constructor() {
        super();
        this.users = [
            { id: '1', name: 'Usuario Prueba', email: 'test@mail.com', password: 'password123' }
        ];
    }

    async login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            return { 
                success: true, 
                user: { id: user.id, name: user.name, email: user.email },
                token: "fake-jwt-token-for-testing" 
            };
        }
        
        throw new Error("Credenciales inválidas");
    }

    async getAll() {
        return this.users;
    }

    async findById(id) {
        return this.users.find(u => u.id === id);
    }
}

module.exports = MockUserRepository;