package com.lanche.lanchonete_api.controller;

import com.lanche.lanchonete_api.dto.AuthDTO;
import com.lanche.lanchonete_api.model.Usuario;
import com.lanche.lanchonete_api.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<Usuario> criar(@RequestBody @Valid AuthDTO.RegisterRequest request) {
        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setSenha(request.getSenha()); // A criptografia virá no módulo de Security
        usuario.setRole(request.getRole() != null ? request.getRole() : Usuario.Role.CAIXA);

        return ResponseEntity.ok(usuarioService.salvar(usuario));
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }
}