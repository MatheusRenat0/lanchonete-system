package com.lanche.lanchonete_api.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

public class DashboardDTO {

    @Data
    public static class Response {
        private BigDecimal receitaHoje;
        private BigDecimal receitaSemana;
        private Long totalVendasHoje;
        private Integer produtosEstoqueBaixo;
        private Integer produtosVencidos;
        private List<ProdutoMaisVendido> produtosMaisVendidos;
    }

    @Data
    public static class ProdutoMaisVendido {
        private String nome;
        private Long totalVendido;
    }
}