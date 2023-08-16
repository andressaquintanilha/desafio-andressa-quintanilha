class CaixaDaLanchonete {

    constructor() {
        this.cardapio = [
            { codigo: 'cafe', descricao: 'Café ', principal: null, preco: 3.00 },
            { codigo: 'chantily', descricao: 'Chantily', principal: 'cafe', preco: 1.50 },
            { codigo: 'suco', descricao: 'Suco Natural', principal: null, preco: 6.20 },
            { codigo: 'sanduiche', descricao: 'Sanduíche', principal: null, preco: 6.50 },
            { codigo: 'queijo', descricao: 'Queijo', principal: 'sanduiche', preco: 2.00 },
            { codigo: 'salgado', descricao: 'Salgado', principal: null, preco: 7.25 },
            { codigo: 'combo1', descricao: '1 Suco e 1 Sanduíche', principal: null, preco: 9.50 },
            { codigo: 'combo2', descricao: '1 Café e 1 Sanduíche', principal: null, preco: 7.50 },
        ];
        this.metodosPagamento = [
            { codigo: 'dinheiro', tipo: 'desconto', percentual: 0.05 },
            { codigo: 'debito', tipo: null, percentual: 0 },
            { codigo: 'credito', tipo: 'acrescimo', percentual: 0.03 },
        ];
    }

    calcularValorDaCompra(metodoDePagamento, itens) {

        try {
            const itensCarrinho = this.validarItensCarrinho(itens);
            const objMetodoDePagamento = this.validarMetodoPagamento(metodoDePagamento);

            let valorCompra = itensCarrinho.reduce((acc, item) => acc + (item.preco * item.qtde), 0);


            switch (objMetodoDePagamento.tipo) {
                case 'desconto':
                    valorCompra -= valorCompra * objMetodoDePagamento.percentual;
                    break;

                case 'acrescimo':
                    valorCompra += valorCompra * objMetodoDePagamento.percentual;
                    break;
            }

            return Number(valorCompra.toFixed(2)).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
        } catch (err) {
            return err.message
        }
    }

    validarItensCarrinho(itens) {
        const itensComprados = itens.map(value => {
            const [codigo, qtde] = value.split(',')
            return { codigo, qtde: Number(qtde) }
        });

        // validação da quantidade de itens
        if (!itensComprados.length) {
            throw new Error('Não há itens no carrinho de compra!');
        }

        const itensPrincipais = []
        const itensExtra = []

        itensComprados.forEach(itemComprado => {

            const itemCompradoCardapio = this.cardapio.find(itemCardapio => itemCardapio.codigo === itemComprado.codigo)

            // validação de item comprado
            if (!itemCompradoCardapio) {
                throw new Error('Item inválido!');
            }

            // validação de quantidade de itens comprados
            if (itemComprado.qtde < 1) {
                throw new Error('Quantidade inválida!')
            }

            // caso ele tenha um item principal referenciado, ele é um item extra, caso contrário, é um item principal 
            if (itemCompradoCardapio.principal) {
                itensExtra.push({...itemCompradoCardapio, qtde: itemComprado.qtde })
            } else {
                itensPrincipais.push({...itemCompradoCardapio, qtde: itemComprado.qtde })
            }
        })

        // valida se todos os itens extra foram comprados junto com itens principais
        itensExtra.forEach(itemExtra => {
            const confereItemPrincipal = itensPrincipais.find(itemPrincipal => itemPrincipal.codigo === itemExtra.principal)

            if (!confereItemPrincipal) {
                throw new Error('Item extra não pode ser pedido sem o principal');
            }
        })

        return itensPrincipais.concat(itensExtra);
    }

    validarMetodoPagamento(metodoPagamento) {
        const objMetodoPagamento = this.metodosPagamento.find(metodo => metodo.codigo === metodoPagamento)

        if (objMetodoPagamento) return objMetodoPagamento

        throw new Error('Forma de pagamento inválida!')
    }
}

export { CaixaDaLanchonete };