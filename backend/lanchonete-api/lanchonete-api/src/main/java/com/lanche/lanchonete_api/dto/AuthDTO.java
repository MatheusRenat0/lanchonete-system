package com.lanche.lanchonete_api.dto;

import com.lanche.lanchonete_api.model.Usuario;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDTO {

    @Data
    public static class LoginRequest {
        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email inválido")
        private String email;

        @NotBlank(message = "Senha é obrigatória")
        private String senha;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginResponse {
        private String token;
        private String nome;
        private String role;
        private Long id;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        @NotBlank(message = "Nome é obrigatório")
        private String nome;

        @Email(message = "Email inválido")
        @NotBlank(message = "Email é obrigatório")
        private String email;

        @NotBlank(message = "Senha é obrigatória")
        @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
        private String senha;

        private Usuario.Role role;
    }
}