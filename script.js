document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll('input[type="number"]');
  const totalSpan = document.getElementById("total");
  const pagamentoSelect = document.querySelector("select[name='pagamento']");
  const qrDiv = document.querySelector(".qr");
  const form = document.querySelector("form");

  // Preencher automaticamente os dados do cliente se já estiverem salvos
  const campos = ["nome", "telefone", "endereco"];
  campos.forEach((campo) => {
    const valor = localStorage.getItem(campo);
    if (valor) {
      form.elements[campo].value = valor;
    }
  });

  // Mostrar/esconder o QR Code do Pix
  pagamentoSelect.addEventListener("change", function () {
    if (this.value === "pix") {
      qrDiv.style.display = "block";
    } else {
      qrDiv.style.display = "none";
    }
  });

  // Inicialmente ocultar o QR Code se não for Pix
  if (pagamentoSelect.value !== "pix") {
    qrDiv.style.display = "none";
  }

  // Calcular total
  function calcularTotal() {
    let total = 0;
    inputs.forEach((input) => {
      const preco = parseFloat(input.dataset.preco);
      const qtd = parseInt(input.value) || 0;
      total += preco * qtd;
    });
    totalSpan.textContent = total.toFixed(2);
  }

  // Atualizar total sempre que um valor for digitado
  inputs.forEach((input) => input.addEventListener("input", calcularTotal));

  // Calcular total ao abrir a página (segunda compra, recarregar, etc.)
  calcularTotal();

  // Enviar pedido e salvar dados
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = form.elements["nome"].value.trim();
    const telefone = form.elements["telefone"].value.trim();
    const endereco = form.elements["endereco"].value.trim();
    const pagamento = form.elements["pagamento"].value;
    const entrega = form.querySelector('input[name="entrega"]:checked')?.value;

    if (!entrega) {
      alert("Por favor, selecione a forma de entrega.");
      return;
    }

    // Salvar dados no localStorage
    localStorage.setItem("nome", nome);
    localStorage.setItem("telefone", telefone);
    localStorage.setItem("endereco", endereco);

    // Gerar resumo do pedido
    let mensagem = `📦 *Pedido Armazém do Sítio*%0A`;
    mensagem += `👤 *Cliente:* ${nome}%0A📱 *Telefone:* ${telefone}%0A🏡 *Endereço:* ${endereco}%0A`;
    mensagem += `💳 *Pagamento:* ${pagamento}%0A🚚 *Entrega:* ${entrega}%0A`;
    mensagem += `%0A*Itens:*%0A`;

    let algumItem = false;
    inputs.forEach((input) => {
      const qtd = parseInt(input.value);
      if (qtd > 0) {
        algumItem = true;
        const nomeProduto = input.dataset.nome;
        mensagem += `• ${nomeProduto} x${qtd}%0A`;
      }
    });

    if (!algumItem) {
      alert("Selecione pelo menos um produto antes de enviar o pedido.");
      return;
    }

    mensagem += `%0A💰 *Total:* R$ ${totalSpan.textContent}`;

    // Abrir WhatsApp com a mensagem
    const url = `https://wa.me/5542999034663?text=${mensagem}`;
    window.open(url, "_blank");
  });
});

