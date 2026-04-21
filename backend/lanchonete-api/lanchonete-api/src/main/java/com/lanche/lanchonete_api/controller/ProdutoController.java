package com.lanche.lanchonete_api.controller;

import com.lanche.lanchonete_api.dto.ProdutoDTO;
import com.lanche.lanchonete_api.model.Produto;
import com.lanche.lanchonete_api.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @PostMapping
    public ResponseEntity<Produto> criar(@RequestBody @Valid ProdutoDTO.Request request) {
        // Converte o DTO (Entrada) para o Model (Banco)
        Produto produto = new Produto();
        produto.setNome(request.getNome());
        produto.setPreco(request.getPreco());
        produto.setDataValidade(request.getDataValidade());
        produto.setQuantidade(request.getQuantidade());
        produto.setEstoqueMinimo(request.getEstoqueMinimo() != null ? request.getEstoqueMinimo() : 5);
        produto.setCategoria(request.getCategoria());

        return ResponseEntity.ok(produtoService.salvar(produto));
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listarTodos() {
        return ResponseEntity.ok(produtoService.listarTodos());
    }

    @GetMapping("/disponiveis")
    public ResponseEntity<List<Produto>> listarDisponiveis() {
        return ResponseEntity.ok(produtoService.listarDisponiveis());
    }

    @GetMapping("/vencidos")
    public ResponseEntity<List<Produto>> listarVencidos() {
        return ResponseEntity.ok(produtoService.listarVencidos());
    }

    @GetMapping("/estoque-baixo")
    public ResponseEntity<List<Produto>> listarEstoqueBaixo() {
        return ResponseEntity.ok(produtoService.listarEstoqueBaixo());
    }
}