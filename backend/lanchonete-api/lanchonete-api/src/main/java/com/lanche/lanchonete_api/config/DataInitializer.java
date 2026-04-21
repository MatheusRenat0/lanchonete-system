package com.lanche.lanchonete_api.config;

import com.lanche.lanchonete_api.model.Usuario;
import com.lanche.lanchonete_api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.count() == 0) {
            Usuario admin = Usuario.builder()
                    .nome("Administrador Chefe")
                    .email("admin@lanchonete.com")
                    .senha(passwordEncoder.encode("admin123"))
                    .role(Usuario.Role.ADMIN)
                    .ativo(true)
                    .build();
            
            usuarioRepository.save(Objects.requireNonNull(admin));
            
            System.out.println("✅ Usuário ADMIN padrão criado com sucesso!");
        }
    }
}