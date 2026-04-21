package com.lanche.lanchonete_api.service;

import com.lanche.lanchonete_api.model.Usuario;
import com.lanche.lanchonete_api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public Usuario salvar(Usuario usuario) {
        if (usuario.getId() == null && usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("Este e-mail já está cadastrado no sistema.");
        }
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        
        return usuarioRepository.save(usuario);
    }

    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }
}