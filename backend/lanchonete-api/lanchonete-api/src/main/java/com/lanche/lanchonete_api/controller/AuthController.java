package com.lanche.lanchonete_api.controller;

import com.lanche.lanchonete_api.dto.AuthDTO;
import com.lanche.lanchonete_api.model.Usuario;
import com.lanche.lanchonete_api.repository.UsuarioRepository;
import com.lanche.lanchonete_api.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<AuthDTO.LoginResponse> login(@RequestBody AuthDTO.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSenha())
        );

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtService.generateToken(usuario);

        AuthDTO.LoginResponse response = new AuthDTO.LoginResponse();
        response.setToken(token);
        response.setNome(usuario.getNome());
        response.setRole(usuario.getRole().name());

        return ResponseEntity.ok(response);
    }
}