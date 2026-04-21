package com.lanche.lanchonete_api.config;

import com.lanche.lanchonete_api.model.Usuario;
import com.lanche.lanchonete_api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.count() == 0) {
            Usuario admin = new Usuario();
            admin.setNome("Administrador Chefe");
            admin.setEmail("admin@lanchonete.com");
            admin.setSenha("admin123");
            admin.setRole(Usuario.Role.ADMIN);
            
            usuarioRepository.save(admin);
            System.out.println("✅ Usuário ADMIN padrão criado com sucesso!");
            System.out.println("👉 Email: admin@lanchonete.com | Senha: admin123");
        }
    }
}