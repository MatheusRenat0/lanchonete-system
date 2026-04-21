package com.lanche.lanchonete_api.service;

import com.lanche.lanchonete_api.model.Produto;
import com.lanche.lanchonete_api.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public Produto salvar(@NonNull Produto produto) {
        return produtoRepository.save(produto);
    }

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public Produto buscarPorId(@NonNull Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado no sistema."));
    }

    public void deletar(@NonNull Long id) {
        produtoRepository.deleteById(id);
    }

    public List<Produto> listarDisponiveis() {
        return produtoRepository.findProdutosDisponiveis();
    }

    public List<Produto> listarVencidos() {
        return produtoRepository.findProdutosVencidos(LocalDate.now());
    }

    public List<Produto> listarEstoqueBaixo() {
        return produtoRepository.findProdutosEstoqueBaixo();
    }
}