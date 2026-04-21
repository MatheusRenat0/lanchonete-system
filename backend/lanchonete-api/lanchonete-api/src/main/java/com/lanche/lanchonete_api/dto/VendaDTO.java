package com.lanche.lanchonete_api.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class VendaDTO {

    @Data
    public static class Request {
        @NotEmpty(message = "A venda deve conter pelo menos um item")
        private List<ItemRequest> itens;
        private String observacao;
    }

    @Data
    public static class ItemRequest {
        @NotNull(message = "ID do produto é obrigatório")
        private Long produtoId;

        @NotNull(message = "Quantidade é obrigatória")
        @Min(value = 1, message = "A quantidade deve ser pelo menos 1")
        private Integer quantidade;
    }

    @Data
    public static class Response {
        private Long id;
        private String usuarioNome;
        private List<ItemResponse> itens;
        private BigDecimal total;
        private String status;
        private String observacao;
        private LocalDateTime criadoEm;
    }

    @Data
    public static class ItemResponse {
        private Long id;
        private String produtoNome;
        private Integer quantidade;
        private BigDecimal precoUnitario;
        private BigDecimal subtotal;
    }
}