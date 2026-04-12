const UserRepository = require('./UserRepository');

class MockUserRepository extends UserRepository {
    constructor() {
        super();
        this.users = [
            { id: '1', name: 'Usuario Prueba', email: 'test@mail.com' },
            { id: '2', name: 'Admin', email: 'admin@mail.com' }
        ];
    }

    async getAll() {
        return this.users;
    }

    async findById(id) {
        return this.users.find(u => u.id === id);
    }
}

module.exports = MockUserRepository;