const { createClient } = require('@supabase/supabase-js');
const UserRepository = require('./UserRepository');

class SupabaseUserRepository extends UserRepository {
    constructor() {
        super();
        // Estas credenciales deben estar en tu archivo .env
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error("Faltan las credenciales de Supabase en el .env");
        }

        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    async login(email, password) {
        // Supabase se encarga de validar el hash de la contraseña
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw new Error(error.message);
        }

        // Estructura idéntica a tu Mock para no romper el frontend
        return {
            success: true,
            user: {
                id: data.user.id,
                email: data.user.email,
                // Si tienes el nombre en la tabla 'profiles' o metadata:
                name: data.user.user_metadata?.full_name || 'Usuario Supabase'
            },
            token: data.session.access_token // Este es el JWT real generado por Supabase
        };
    }

    async findById(id) {
        // Buscamos en la tabla 'profiles' que actúa como espejo de Auth
        const { data, error } = await this.supabase
            .from('profiles') 
            .select('id, status, full_name') // Traemos solo lo necesario para optimizar
            .eq('id', id)
            .single();

        if (error) return null;
        return data;
    }

    async getAll() {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('*');

        if (error) throw new Error(error.message);
        return data;
    }
}

module.exports = SupabaseUserRepository;