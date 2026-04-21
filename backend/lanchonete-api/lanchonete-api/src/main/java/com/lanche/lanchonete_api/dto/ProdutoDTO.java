package com.lanche.lanchonete_api.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ProdutoDTO {

    @Data
    public static class Request {
        @NotBlank(message = "Nome é obrigatório")
        private String nome;

        @NotNull(message = "Preço é obrigatório")
        @DecimalMin(value = "0.01", message = "Preço deve ser maior que zero")
        private BigDecimal preco;

        private LocalDate dataValidade;

        @NotNull(message = "Quantidade é obrigatória")
        @Min(value = 0, message = "Quantidade não pode ser negativa")
        private Integer quantidade;

        private Integer estoqueMinimo;
        private String categoria;
    }

    @Data
    public static class Response {
        private Long id;
        private String nome;
        private BigDecimal preco;
        private LocalDate dataValidade;
        private Integer quantidade;
        private Integer estoqueMinimo;
        private String categoria;
        private Boolean ativo;
        private Boolean vencido;
        private Boolean estoqueBaixo;
        private LocalDateTime criadoEm;
    }
}