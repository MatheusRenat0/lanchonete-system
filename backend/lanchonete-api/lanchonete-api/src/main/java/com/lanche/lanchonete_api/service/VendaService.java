package com.lanche.lanchonete_api.service;

import com.lanche.lanchonete_api.dto.VendaDTO;
import com.lanche.lanchonete_api.model.ItemVenda;
import com.lanche.lanchonete_api.model.Produto;
import com.lanche.lanchonete_api.model.Venda;
import com.lanche.lanchonete_api.repository.ProdutoRepository;
import com.lanche.lanchonete_api.repository.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class VendaService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Transactional
    public Venda registrarVenda(VendaDTO.Request request) {
        Venda venda = new Venda();
        venda.setObservacao(request.getObservacao());
        venda.setStatus(Venda.StatusVenda.CONCLUIDA);

        for (VendaDTO.ItemRequest itemDTO : request.getItens()) {
            
            Long produtoId = Objects.requireNonNull(itemDTO.getProdutoId(), "O ID do produto não pode ser nulo");
            
            Produto produto = produtoRepository.findById(produtoId)
                    .orElseThrow(() -> new RuntimeException("Produto ID " + produtoId + " não encontrado."));

            produto.diminuirEstoque(itemDTO.getQuantidade());
            produtoRepository.save(produto);

            ItemVenda item = new ItemVenda();
            item.setProduto(produto);
            item.setQuantidade(itemDTO.getQuantidade());
            item.setPrecoUnitario(produto.getPreco());
            item.calcularSubtotal();

            venda.adicionarItem(item);
        }

        venda.calcularTotal();
        return vendaRepository.save(venda);
    }

    public List<Venda> listarVendas() {
        return vendaRepository.findAll();
    }
}